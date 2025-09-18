import type { Express, RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { storage } from "./storage";

if (!process.env.SUPABASE_JWT_SECRET) {
  throw new Error("Environment variable SUPABASE_JWT_SECRET not provided");
}

if (!process.env.SUPABASE_URL) {
  throw new Error("Environment variable SUPABASE_URL not provided");
}

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  exp: number;
  iat: number;
}

export function setupSupabaseAuth(app: Express) {
  // Simple trust proxy setup for secure cookies
  app.set("trust proxy", 1);
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!, {
      algorithms: ["HS256"],
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
      audience: "authenticated",
      clockTolerance: 5
    }) as SupabaseJwtPayload;
    
    // Upsert user in our database
    await storage.upsertUser({
      id: decoded.sub,
      email: decoded.email || null,
      firstName: null,
      lastName: null,
      profileImageUrl: null,
    });
    
    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
import { clerkMiddleware, getAuth, clerkClient } from '@clerk/express';
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("Environment variable CLERK_SECRET_KEY not provided");
}

// Custom middleware to sync Clerk user with our database
export const syncUser: RequestHandler = async (req: any, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (userId) {
      // Get user data from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      
      // Sync user data with our database
      await storage.upsertUser({
        id: userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        profileImageUrl: clerkUser.imageUrl || '',
      });
    }
    next();
  } catch (error) {
    console.error("Error syncing user:", error);
    next();
  }
};

export async function setupAuth(app: Express) {
  // Apply Clerk middleware to all routes
  app.use(clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
  }));
}

// Combined middleware for authenticated routes
export const isAuthenticated: RequestHandler = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  syncUser(req, res, next);
};
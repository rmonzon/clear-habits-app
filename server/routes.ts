import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertGoalSchema, insertGoalCompletionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Goals API
  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(userId, goalData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goal data", errors: error.errors });
      }
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.put('/api/goals/:goalId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { goalId } = req.params;
      const goalData = insertGoalSchema.partial().parse(req.body);
      
      const updatedGoal = await storage.updateGoal(goalId, userId, goalData);
      if (!updatedGoal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.json(updatedGoal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goal data", errors: error.errors });
      }
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete('/api/goals/:goalId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { goalId } = req.params;
      
      const success = await storage.deleteGoal(goalId, userId);
      if (!success) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Goal completions API
  app.post('/api/goals/:goalId/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { goalId } = req.params;
      const completedDate = req.body.completedDate || new Date().toISOString().split('T')[0];
      const value = req.body.value; // Optional: actual value for progress tracking
      
      // Verify goal belongs to user
      const goal = await storage.getGoal(goalId, userId);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      const completion = await storage.completeGoal(goalId, userId, completedDate, value);
      res.status(201).json(completion);
    } catch (error) {
      console.error("Error completing goal:", error);
      res.status(500).json({ message: "Failed to complete goal" });
    }
  });

  app.get('/api/goals/:goalId/completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { goalId } = req.params;
      
      // Verify goal belongs to user
      const goal = await storage.getGoal(goalId, userId);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      const completions = await storage.getGoalCompletions(goalId);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching completions:", error);
      res.status(500).json({ message: "Failed to fetch completions" });
    }
  });

  // User stats API
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Analytics API - streak calculation
  app.get('/api/goals/:goalId/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { goalId } = req.params;
      
      // Verify goal belongs to user
      const goal = await storage.getGoal(goalId, userId);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      const completions = await storage.getGoalCompletions(goalId);
      
      // Calculate current streak
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      if (completions.length === 0) {
        return res.json({ currentStreak: 0, longestStreak: 0 });
      }
      
      // Sort completions by date (most recent first)
      const sortedCompletions = completions.sort((a, b) => 
        new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
      );
      
      // Check if today or yesterday was completed (for current streak)
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      let streakStartDate = today;
      if (sortedCompletions[0]?.completedDate === today) {
        currentStreak = 1;
        streakStartDate = today;
      } else if (sortedCompletions[0]?.completedDate === yesterday) {
        currentStreak = 1;
        streakStartDate = yesterday;
      }
      
      // Calculate current streak by going backwards from start date
      if (currentStreak > 0) {
        for (let i = 1; i < sortedCompletions.length; i++) {
          const currentDate = new Date(streakStartDate);
          currentDate.setDate(currentDate.getDate() - i);
          const expectedDate = currentDate.toISOString().split('T')[0];
          
          if (sortedCompletions[i]?.completedDate === expectedDate) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      
      // Calculate longest streak
      const uniqueDates = Array.from(new Set(completions.map(c => c.completedDate))).sort();
      
      for (let i = 0; i < uniqueDates.length; i++) {
        tempStreak = 1;
        
        for (let j = i + 1; j < uniqueDates.length; j++) {
          const prevDate = new Date(uniqueDates[j - 1]);
          const currDate = new Date(uniqueDates[j]);
          const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            tempStreak++;
          } else {
            break;
          }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      
      res.json({ currentStreak, longestStreak });
    } catch (error) {
      console.error("Error calculating streak:", error);
      res.status(500).json({ message: "Failed to calculate streak" });
    }
  });

  // Progress tracking API
  app.get('/api/goals/:goalId/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { goalId } = req.params;
      
      // Verify goal belongs to user
      const goal = await storage.getGoal(goalId, userId);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      const completions = await storage.getGoalCompletions(goalId);
      const completionCount = completions.length;
      
      let progress = 0;
      let currentValue = goal.startingValue;
      
      // For value-based goals (with unit, startingValue, and targetValue)
      if (goal.unit && goal.startingValue !== null && goal.targetValue !== null) {
        // Find the most recent completion with a value
        const valueCompletions = completions.filter(c => c.value !== null);
        
        if (valueCompletions.length > 0) {
          // Get the most recent value
          const latestCompletion = valueCompletions.sort((a, b) => 
            new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
          )[0];
          
          currentValue = latestCompletion.value!;
          
          // Calculate progress based on whether it's reverse (weight loss) or forward (weight gain)
          const isReverse = goal.startingValue > goal.targetValue;
          
          if (isReverse) {
            // Weight loss: progress = (starting - current) / (starting - target)
            const totalChange = goal.startingValue - goal.targetValue;
            const currentChange = goal.startingValue - currentValue;
            progress = Math.max(0, Math.min(100, (currentChange / totalChange) * 100));
          } else {
            // Weight gain: progress = (current - starting) / (target - starting)
            const totalChange = goal.targetValue - goal.startingValue;
            const currentChange = currentValue - goal.startingValue;
            progress = Math.max(0, Math.min(100, (currentChange / totalChange) * 100));
          }
        }
      } else {
        // For completion-based goals without values, use simple completion count
        // Assume target of 1 completion for basic goals
        progress = completionCount > 0 ? 100 : 0;
      }
      
      res.json({
        completionCount,
        progress: Math.round(progress),
        currentValue,
        startingValue: goal.startingValue,
        targetValue: goal.targetValue,
        unit: goal.unit,
      });
    } catch (error) {
      console.error("Error calculating progress:", error);
      res.status(500).json({ message: "Failed to calculate progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
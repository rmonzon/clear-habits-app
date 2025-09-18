import {
  users,
  goals,
  goalCompletions,
  type User,
  type UpsertUser,
  type Goal,
  type InsertGoal,
  type GoalCompletion,
  type InsertGoalCompletion,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Goal operations
  getUserGoals(userId: string): Promise<Goal[]>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;
  updateGoal(goalId: string, userId: string, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(goalId: string, userId: string): Promise<boolean>;
  getGoal(goalId: string, userId: string): Promise<Goal | undefined>;
  
  // Goal completion operations
  completeGoal(goalId: string, userId: string, completedDate: string, value?: number): Promise<GoalCompletion>;
  getGoalCompletions(goalId: string): Promise<GoalCompletion[]>;
  getUserCompletions(userId: string, startDate?: Date, endDate?: Date): Promise<GoalCompletion[]>;
  getUserStats(userId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    totalCompletions: number;
    completionsThisMonth: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Goal operations
  async getUserGoals(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(and(eq(goals.userId, userId), eq(goals.isActive, true)))
      .orderBy(desc(goals.createdAt));
  }

  async createGoal(userId: string, goalData: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values({ ...goalData, userId })
      .returning();
    return goal;
  }

  async updateGoal(goalId: string, userId: string, goalData: Partial<InsertGoal>): Promise<Goal | undefined> {
    const [goal] = await db
      .update(goals)
      .set({ ...goalData, updatedAt: new Date() })
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
      .returning();
    return goal;
  }

  async deleteGoal(goalId: string, userId: string): Promise<boolean> {
    const result = await db
      .update(goals)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async getGoal(goalId: string, userId: string): Promise<Goal | undefined> {
    const [goal] = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
    return goal;
  }

  // Goal completion operations
  async completeGoal(goalId: string, userId: string, completedDate: string, value?: number): Promise<GoalCompletion> {
    const [completion] = await db
      .insert(goalCompletions)
      .values({
        goalId,
        userId,
        completedDate,
        value,
      })
      .returning();
    return completion;
  }

  async getGoalCompletions(goalId: string): Promise<GoalCompletion[]> {
    return await db
      .select()
      .from(goalCompletions)
      .where(eq(goalCompletions.goalId, goalId))
      .orderBy(desc(goalCompletions.completedAt));
  }

  async getUserCompletions(userId: string, startDate?: Date, endDate?: Date): Promise<GoalCompletion[]> {
    let query = db
      .select()
      .from(goalCompletions)
      .where(eq(goalCompletions.userId, userId));

    if (startDate && endDate) {
      const baseQuery = db
        .select()
        .from(goalCompletions)
        .where(
          and(
            eq(goalCompletions.userId, userId),
            sql`${goalCompletions.completedDate} >= ${startDate.toISOString().split('T')[0]}`,
            sql`${goalCompletions.completedDate} <= ${endDate.toISOString().split('T')[0]}`
          )
        );
      return await baseQuery.orderBy(desc(goalCompletions.completedAt));
    }

    return await query.orderBy(desc(goalCompletions.completedAt));
  }

  async getUserStats(userId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    totalCompletions: number;
    completionsThisMonth: number;
  }> {
    const [totalGoalsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(goals)
      .where(eq(goals.userId, userId));

    const [activeGoalsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(goals)
      .where(and(eq(goals.userId, userId), eq(goals.isActive, true)));

    const [totalCompletionsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(goalCompletions)
      .where(eq(goalCompletions.userId, userId));

    const currentMonth = new Date();
    currentMonth.setDate(1);
    const [completionsThisMonthResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(goalCompletions)
      .where(
        and(
          eq(goalCompletions.userId, userId),
          sql`${goalCompletions.completedDate} >= ${currentMonth.toISOString().split('T')[0]}`
        )
      );

    return {
      totalGoals: totalGoalsResult.count,
      activeGoals: activeGoalsResult.count,
      totalCompletions: totalCompletionsResult.count,
      completionsThisMonth: completionsThisMonthResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
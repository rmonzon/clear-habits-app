import { useState, useEffect } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
import { StatsCard } from "@/components/StatsCard";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { MotivationalMessage } from "@/components/MotivationalMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SignInButton } from '@clerk/clerk-react';
import {
  Target,
  TrendingUp,
  Flame,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import type { Goal, InsertGoal, User } from "@shared/schema";

interface GoalWithProgress extends Goal {
  streak: number;
  progress: number;
  completionCount: number;
}

interface UserStats {
  totalGoals: number;
  activeGoals: number;
  totalCompletions: number;
  completionsThisMonth: number;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Authentication check
  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // Fetch user data from backend
  const { data: userData, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    enabled: isAuthenticated,
  });

  // Fetch user goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
    enabled: !!userData,
  });

  // Fetch user stats
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
    enabled: !!userData,
  });

  // Fetch progress and streak data for each goal
  const { data: goalProgress = new Map() } = useQuery({
    queryKey: ["/api/goals/progress"],
    enabled: goals.length > 0,
    queryFn: async () => {
      const progressMap = new Map();
      await Promise.all(
        goals.map(async (goal) => {
          try {
            const [progressRes, streakRes] = await Promise.all([
              fetch(`/api/goals/${goal.id}/progress`).then((res) => res.json()),
              fetch(`/api/goals/${goal.id}/streak`).then((res) => res.json()),
            ]);
            progressMap.set(goal.id, {
              ...progressRes,
              ...streakRes,
            });
          } catch (error) {
            console.error(`Error fetching data for goal ${goal.id}:`, error);
            progressMap.set(goal.id, {
              progress: 0,
              completionCount: 0,
              currentStreak: 0,
              longestStreak: 0,
            });
          }
        }),
      );
      return progressMap;
    },
  });

  // Add goal mutation
  const addGoalMutation = useMutation({
    mutationFn: async (goalData: InsertGoal) => {
      return await apiRequest("POST", "/api/goals", goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Goal Created",
        description: "Your new goal has been added successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  // Complete goal mutation
  const completeGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      return await apiRequest("POST", `/api/goals/${goalId}/complete`, {
        completedDate: new Date().toISOString().split("T")[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals/progress"] });
      toast({
        title: "Goal Completed!",
        description: "Great job! Keep up the momentum!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete goal",
        variant: "destructive",
      });
    },
  });

  // Log progress mutation
  const logProgressMutation = useMutation({
    mutationFn: async ({
      goalId,
      value,
    }: {
      goalId: string;
      value: number;
    }) => {
      return await apiRequest("POST", `/api/goals/${goalId}/complete`, {
        value,
        completedDate: new Date().toISOString().split("T")[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals/progress"] });
      toast({
        title: "Progress Logged!",
        description: "Your progress has been recorded successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log progress",
        variant: "destructive",
      });
    },
  });

  // Edit goal mutation
  const editGoalMutation = useMutation({
    mutationFn: async ({
      goalId,
      goalData,
    }: {
      goalId: string;
      goalData: Partial<InsertGoal>;
    }) => {
      return await apiRequest("PUT", `/api/goals/${goalId}`, goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals/progress"] });
      toast({
        title: "Goal Updated",
        description: "Your goal has been updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      return await apiRequest("DELETE", `/api/goals/${goalId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Goal Deleted",
        description: "Goal has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    },
  });

  // Define all handlers first to avoid temporal dead zone issues
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleAddGoal = (goalData: InsertGoal) => {
    addGoalMutation.mutate(goalData);
  };

  const handleCompleteGoal = (goalId: string) => {
    completeGoalMutation.mutate(goalId);
  };

  const handleLogProgress = (goalId: string, value: number) => {
    logProgressMutation.mutate({ goalId, value });
  };

  const handleEditGoal = (goalId: string, goalData: Partial<InsertGoal>) => {
    editGoalMutation.mutate({ goalId, goalData });
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate(goalId);
  };

  if (authLoading || userLoading) {
    return (
      <div
        className="min-h-screen bg-background"
        data-testid="dashboard-loading"
      >
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-background"
        data-testid="dashboard-unauthenticated"
      >
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  Welcome to ClearHabits
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Please sign in to start tracking your habits and building
                  lasting progress.
                </p>
              </div>
              <SignInButton mode="modal">
                <Button data-testid="button-login-prompt">
                  Sign In to Continue
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (goalsLoading) {
    return (
      <div
        className="min-h-screen bg-background"
        data-testid="dashboard-loading-goals"
      >
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading your goals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch = goal.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || goal.category === categoryFilter;
    return matchesSearch && matchesCategory && goal.isActive;
  });

  // Calculate current streak for motivational message
  const currentStreaks = Array.from(goalProgress.values()).map(
    (progress: any) => progress.currentStreak || 0,
  );
  const maxStreak = Math.max(0, ...currentStreaks);

  // Calculate today's completions for motivational message
  const todayCompletions = Array.from(goalProgress.values()).filter(
    (progress: any) => progress.progress === 100,
  ).length;

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard-page">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" data-testid="dashboard-welcome">
            Welcome back{userData?.firstName ? `, ${userData.firstName}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Track your progress and build lasting habits.
          </p>
        </div>

        {/* Motivational Message */}
        <MotivationalMessage
          streak={maxStreak}
          completionsToday={todayCompletions}
          userName={userData?.firstName || "Champion"}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Goals"
            value={stats?.activeGoals || goals.filter((g) => g.isActive).length}
            description="Currently tracking"
            icon={Target}
          />
          <StatsCard
            title="Total Goals"
            value={stats?.totalGoals || goals.length}
            description="All time"
            icon={TrendingUp}
          />
          <StatsCard
            title="Best Streak"
            value={maxStreak}
            description="days in a row"
            icon={Flame}
          />
          <StatsCard
            title="Completions"
            value={stats?.totalCompletions || 0}
            description="All time"
            icon={Calendar}
          />
        </div>

        {/* Goals Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2
              className="text-2xl font-bold"
              data-testid="goals-section-title"
            >
              Your Goals
            </h2>
            <AddGoalDialog onAdd={handleAddGoal} />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-goals"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                className="w-full sm:w-48"
                data-testid="select-category-filter"
              >
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goals Grid */}
          {filteredGoals.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-testid="goals-grid"
            >
              {filteredGoals.map((goal) => {
                const progressData = goalProgress.get(goal.id) || {
                  progress: 0,
                  completionCount: 0,
                  currentStreak: 0,
                  currentValue: null,
                };

                return (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    streak={progressData.currentStreak}
                    progress={progressData.progress}
                    completionCount={progressData.completionCount}
                    currentValue={progressData.currentValue}
                    onComplete={handleCompleteGoal}
                    onLogProgress={handleLogProgress}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                  />
                );
              })}
            </div>
          ) : (
            <div
              className="text-center py-16 space-y-4"
              data-testid="no-goals-message"
            >
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No goals found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start building better habits by creating your first goal."}
                </p>
              </div>
              {!searchTerm && categoryFilter === "all" && (
                <AddGoalDialog onAdd={handleAddGoal} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

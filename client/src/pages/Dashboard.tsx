import { useState } from "react";
import { NavigationHeader } from "@/components/NavigationHeader";
import { StatsCard } from "@/components/StatsCard";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { MotivationalMessage } from "@/components/MotivationalMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { Target, TrendingUp, Flame, Calendar, Search, Filter } from "lucide-react";
import type { Goal, InsertGoal, User } from "@shared/schema";

// TODO: Remove mock data when implementing real backend
const mockGoals: Goal[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Daily Exercise',
    description: 'Complete 30 minutes of physical activity',
    category: 'fitness',
    frequency: 'daily',
    target: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Read for 20 minutes',
    description: 'Read books, articles, or educational content',
    category: 'learning',
    frequency: 'daily',
    target: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Meditate',
    description: 'Practice mindfulness meditation',
    category: 'health',
    frequency: 'daily',
    target: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // TODO: Replace with real data from backend
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="dashboard-loading">
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

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || goal.category === categoryFilter;
    return matchesSearch && matchesCategory && goal.isActive;
  });

  const handleAddGoal = (goalData: InsertGoal) => {
    // TODO: Replace with actual API call
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'user1',
      ...goalData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setGoals(prev => [...prev, newGoal]);
    console.log('Add goal:', goalData);
  };

  const handleCompleteGoal = (goalId: string) => {
    // TODO: Replace with actual API call
    console.log('Complete goal:', goalId);
  };

  const handleEditGoal = (goal: Goal) => {
    // TODO: Implement edit functionality
    console.log('Edit goal:', goal);
  };

  const handleDeleteGoal = (goalId: string) => {
    // TODO: Replace with actual API call
    setGoals(prev => prev.filter(g => g.id !== goalId));
    console.log('Delete goal:', goalId);
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard-page">
      <NavigationHeader user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" data-testid="dashboard-welcome">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Track your progress and build lasting habits.
          </p>
        </div>

        {/* Motivational Message */}
        <MotivationalMessage 
          streak={7} // TODO: Replace with real streak data
          completionsToday={2} // TODO: Replace with real completion data
          userName={user?.firstName || 'Champion'}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Active Goals"
            value={goals.filter(g => g.isActive).length}
            description="Currently tracking"
            icon={Target}
          />
          <StatsCard 
            title="Completion Rate"
            value="85%" // TODO: Replace with real data
            description="This month"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard 
            title="Current Streak"
            value={7} // TODO: Replace with real data
            description="days in a row"
            icon={Flame}
          />
          <StatsCard 
            title="Total Completions"
            value={156} // TODO: Replace with real data
            description="All time"
            icon={Calendar}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Goals Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold" data-testid="goals-section-title">Your Goals</h2>
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
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category-filter">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="goals-grid">
              {filteredGoals.map((goal) => (
                <GoalCard 
                  key={goal.id}
                  goal={goal}
                  streak={Math.floor(Math.random() * 15) + 1} // TODO: Replace with real streak data
                  progress={Math.floor(Math.random() * 100)} // TODO: Replace with real progress data
                  completionCount={Math.floor(Math.random() * goal.target)} // TODO: Replace with real completion data
                  onComplete={handleCompleteGoal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4" data-testid="no-goals-message">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No goals found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || categoryFilter !== "all" 
                    ? "Try adjusting your search or filter criteria." 
                    : "Start building better habits by creating your first goal."
                  }
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Flame, Calendar } from "lucide-react";
import type { Goal } from "@shared/schema";

interface GoalCardProps {
  goal: Goal;
  streak: number;
  progress: number;
  completionCount: number;
  onComplete?: (goalId: string) => void;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
}

export function GoalCard({ 
  goal, 
  streak, 
  progress, 
  completionCount,
  onComplete,
  onEdit,
  onDelete 
}: GoalCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      'not_started': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return colors[status as keyof typeof colors] || colors.not_started;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Low';
      case 'medium': return 'Medium';
      case 'high': return 'High';
      default: return priority;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      finance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      learning: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      personal: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getDaysLeft = (targetDate: string | null) => {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const now = new Date();
    // Normalize to midnight for accurate day comparison
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCurrentValueText = () => {
    if (!goal.unit || goal.startingValue === null || goal.startingValue === undefined) return null;
    return `Current ${goal.unit === 'lbs' ? 'weight' : goal.unit}: ${goal.startingValue} ${goal.unit}`;
  };

  const getCategoryDotColor = (category: string) => {
    const colors = {
      health: 'bg-green-500',
      finance: 'bg-blue-500',
      learning: 'bg-purple-500',
      personal: 'bg-pink-500',
      general: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const daysLeft = getDaysLeft(goal.targetDate);

  return (
    <Card className="hover-elevate" data-testid={`goal-card-${goal.id}`}>
      <CardContent className="p-4 space-y-4">
        {/* Top row: Category badge with dot and streak with flame */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getCategoryDotColor(goal.category)}`}></div>
            <Badge className={getCategoryColor(goal.category)} data-testid={`goal-category-${goal.id}`}>
              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-500" />
            <span data-testid={`goal-streak-${goal.id}`}>{streak}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-foreground" data-testid={`goal-title-${goal.id}`}>
            {goal.title}
          </h3>
          {getCurrentValueText() && (
            <p className="text-sm text-muted-foreground mt-1">
              {getCurrentValueText()}
            </p>
          )}
        </div>

        {/* Progress section */}
        {goal.unit && goal.targetValue && (
          <div className="space-y-2">
            <div className="text-sm font-medium" data-testid={`goal-progress-text-${goal.id}`}>
              {goal.startingValue || 0} / {goal.targetValue} {goal.unit}
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
              data-testid={`goal-progress-${goal.id}`}
            />
          </div>
        )}

        {/* Bottom row: Days left and action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span data-testid={`goal-days-left-${goal.id}`}>
              {daysLeft !== null 
                ? daysLeft > 0 
                  ? `${daysLeft} days left`
                  : daysLeft === 0 
                    ? 'Due today'
                    : `${Math.abs(daysLeft)} days overdue`
                : 'No deadline'
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(goal)}
              data-testid={`button-edit-${goal.id}`}
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              onClick={() => onComplete?.(goal.id)}
              disabled={goal.status === 'completed'}
              data-testid={`button-complete-${goal.id}`}
            >
              {goal.status === 'completed' ? 'Completed' : 'Log Progress'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
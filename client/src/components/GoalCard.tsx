import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Edit, Clock, Target, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
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

  return (
    <Card className="hover-elevate" data-testid={`goal-card-${goal.id}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-base font-semibold" data-testid={`goal-title-${goal.id}`}>
            {goal.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(goal.targetDate)}</span>
            {goal.unit && goal.targetValue && (
              <>
                <Target className="w-3 h-3 ml-2" />
                <span>{goal.startingValue || 0}/{goal.targetValue} {goal.unit}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit?.(goal)}
            data-testid={`button-edit-${goal.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete?.(goal.id)}
            data-testid={`button-delete-${goal.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={getCategoryColor(goal.category)} data-testid={`goal-category-${goal.id}`}>
            {goal.category}
          </Badge>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Clock className="w-4 h-4 text-orange-500" />
            <span data-testid={`goal-streak-${goal.id}`}>{streak}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(goal.status)} data-testid={`goal-status-${goal.id}`}>
            {getStatusText(goal.status)}
          </Badge>
          <Badge className={getPriorityColor(goal.priorityLevel)} data-testid={`goal-priority-${goal.id}`}>
            {getPriorityText(goal.priorityLevel)}
          </Badge>
        </div>

        {goal.unit && goal.targetValue && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span data-testid={`goal-progress-text-${goal.id}`}>
                {goal.startingValue || 0}/{goal.targetValue} {goal.unit}
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
              data-testid={`goal-progress-${goal.id}`}
            />
          </div>
        )}

        <Button 
          onClick={() => onComplete?.(goal.id)}
          className="w-full"
          disabled={goal.status === 'completed'}
          data-testid={`button-complete-${goal.id}`}
        >
          {goal.status === 'completed' ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" />Completed!</>
          ) : (
            <><CheckCircle className="w-4 h-4 mr-2" />Mark Complete</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
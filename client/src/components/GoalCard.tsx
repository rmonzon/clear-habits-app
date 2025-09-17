import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Edit, Flame, Target, Trash2 } from "lucide-react";
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
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'yearly': return 'Yearly';
      default: return frequency;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      fitness: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      learning: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      work: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
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
            <span>{getFrequencyText(goal.frequency)}</span>
            <Target className="w-3 h-3 ml-2" />
            <span>{goal.target}x</span>
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
        {goal.description && (
          <p className="text-sm text-muted-foreground" data-testid={`goal-description-${goal.id}`}>
            {goal.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Badge className={getCategoryColor(goal.category)} data-testid={`goal-category-${goal.id}`}>
            {goal.category}
          </Badge>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Flame className="w-4 h-4 text-orange-500" />
            <span data-testid={`goal-streak-${goal.id}`}>{streak}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span data-testid={`goal-progress-text-${goal.id}`}>
              {completionCount}/{goal.target}
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2" 
            data-testid={`goal-progress-${goal.id}`}
          />
        </div>

        <Button 
          onClick={() => onComplete?.(goal.id)}
          className="w-full"
          disabled={progress >= 100}
          data-testid={`button-complete-${goal.id}`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {progress >= 100 ? 'Completed!' : 'Mark Complete'}
        </Button>
      </CardContent>
    </Card>
  );
}
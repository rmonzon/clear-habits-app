import { GoalCard } from '../GoalCard';
import type { Goal } from '@shared/schema';

const mockGoal: Goal = {
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
};

export default function GoalCardExample() {
  return (
    <div className="max-w-sm">
      <GoalCard 
        goal={mockGoal}
        streak={7}
        progress={100}
        completionCount={1}
        onComplete={(goalId) => console.log('Complete goal:', goalId)}
        onEdit={(goal) => console.log('Edit goal:', goal)}
        onDelete={(goalId) => console.log('Delete goal:', goalId)}
      />
    </div>
  );
}
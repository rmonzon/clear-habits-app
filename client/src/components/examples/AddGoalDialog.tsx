import { AddGoalDialog } from '../AddGoalDialog';
import type { InsertGoal } from '@shared/schema';

export default function AddGoalDialogExample() {
  return (
    <AddGoalDialog 
      onAdd={(goal: InsertGoal) => console.log('Add goal:', goal)}
    />
  );
}
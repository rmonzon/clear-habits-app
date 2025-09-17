import { MotivationalMessage } from '../MotivationalMessage';

export default function MotivationalMessageExample() {
  return (
    <div className="space-y-4 max-w-md">
      <MotivationalMessage 
        streak={7}
        completionsToday={2}
        userName="Alex"
      />
      <MotivationalMessage 
        streak={0}
        completionsToday={0}
        userName="Jordan"
      />
      <MotivationalMessage 
        streak={15}
        completionsToday={4}
        userName="Sam"
      />
    </div>
  );
}
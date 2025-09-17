import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Trophy, Target, Zap } from "lucide-react";
import { useMemo } from "react";

interface MotivationalMessageProps {
  streak?: number;
  completionsToday?: number;
  userName?: string;
}

export function MotivationalMessage({ streak = 0, completionsToday = 0, userName = "Champion" }: MotivationalMessageProps) {
  const message = useMemo(() => {
    const messages = {
      streak: [
        { condition: streak >= 30, text: `Incredible! ${streak} days strong! You're unstoppable!`, icon: Trophy },
        { condition: streak >= 14, text: `Amazing ${streak}-day streak! Keep the momentum going!`, icon: Sparkles },
        { condition: streak >= 7, text: `One week strong! You're building something great!`, icon: Target },
        { condition: streak >= 3, text: `${streak} days in a row! You're on fire!`, icon: Zap },
        { condition: streak >= 1, text: `Great start! Day ${streak} of your journey!`, icon: Target },
      ],
      completions: [
        { condition: completionsToday >= 5, text: "Wow! 5 goals completed today! You're crushing it!", icon: Trophy },
        { condition: completionsToday >= 3, text: "Three goals down! You're having an amazing day!", icon: Sparkles },
        { condition: completionsToday >= 1, text: "Great job completing a goal today!", icon: Target },
        { condition: completionsToday === 0, text: `Ready to make today count, ${userName}?`, icon: Zap },
      ],
      general: [
        { condition: true, text: "Every small step counts towards your bigger goals!", icon: Target },
        { condition: true, text: "Progress, not perfection. You've got this!", icon: Sparkles },
        { condition: true, text: "Building habits is building your future self!", icon: Zap },
        { condition: true, text: "Consistency is the mother of mastery!", icon: Trophy },
      ]
    };

    // Prioritize streak messages, then completions, then general
    for (const category of [messages.streak, messages.completions, messages.general]) {
      const match = category.find(m => m.condition);
      if (match) return match;
    }
    
    return messages.general[0];
  }, [streak, completionsToday, userName]);

  if (!message) return null;

  const IconComponent = message.icon;

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20" data-testid="motivational-message">
      <CardContent className="flex items-center space-x-3 py-4">
        <div className="flex-shrink-0">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <p className="font-medium text-foreground" data-testid="motivational-text">
          {message.text}
        </p>
      </CardContent>
    </Card>
  );
}
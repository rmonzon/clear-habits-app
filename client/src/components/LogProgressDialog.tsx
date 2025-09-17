import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import type { Goal } from "@shared/schema";

const logProgressSchema = z.object({
  value: z.string().min(1, "Value is required").transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      throw new Error("Must be a valid number");
    }
    return num;
  }),
});

type LogProgressForm = {
  value: string;
};

interface LogProgressDialogProps {
  goal: Goal;
  onLogProgress: (goalId: string, value: number) => void;
  trigger?: React.ReactNode;
}

export function LogProgressDialog({ goal, onLogProgress, trigger }: LogProgressDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<LogProgressForm>({
    resolver: zodResolver(logProgressSchema),
    defaultValues: {
      value: "",
    },
  });

  const onSubmit = (values: LogProgressForm) => {
    const numericValue = parseFloat(values.value);
    onLogProgress(goal.id, numericValue);
    form.reset();
    setOpen(false);
  };

  const getValueLabel = () => {
    if (goal.unit) {
      return `Enter your current ${goal.unit === 'lbs' ? 'weight' : goal.unit}`;
    }
    return "Enter progress value";
  };

  const getValuePlaceholder = () => {
    if (goal.unit === 'lbs') {
      return "e.g., 195";
    } else if (goal.unit === 'miles') {
      return "e.g., 3.5";
    } else if (goal.unit) {
      return `Enter ${goal.unit}`;
    }
    return "Enter value";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" data-testid={`button-log-progress-${goal.id}`}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Log Progress
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" data-testid={`dialog-log-progress-${goal.id}`}>
        <DialogHeader>
          <DialogTitle>Log Progress for {goal.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getValueLabel()}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      placeholder={getValuePlaceholder()}
                      {...field} 
                      data-testid={`input-progress-value-${goal.id}`}
                    />
                  </FormControl>
                  <FormMessage />
                  {goal.unit && goal.targetValue && (
                    <p className="text-sm text-muted-foreground">
                      Target: {goal.targetValue} {goal.unit}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid={`button-cancel-progress-${goal.id}`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid={`button-submit-progress-${goal.id}`}
              >
                Log Progress
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
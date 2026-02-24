import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign } from 'lucide-react';

interface BudgetTrackerProps {
  spent: number;
  budget: number;
}

export default function BudgetTracker({ spent, budget }: BudgetTrackerProps) {
  const remaining = budget - spent;
  const percentage = (spent / budget) * 100;
  const isOverBudget = spent > budget;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Budget Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className={`font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
              ${spent.toFixed(2)}
            </span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className={`font-bold ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
              ${remaining.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="pt-2 border-t">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Budget</span>
            <span className="font-bold">${budget.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

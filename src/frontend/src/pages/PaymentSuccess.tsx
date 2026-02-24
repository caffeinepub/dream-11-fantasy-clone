import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDepositFunds } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Wallet } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const depositFunds = useDepositFunds();

  useEffect(() => {
    // In a real implementation, you would:
    // 1. Get session ID from URL params
    // 2. Verify payment with backend
    // 3. Credit the wallet
    // For now, we'll just show success message
  }, []);

  return (
    <div className="container py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-muted-foreground">
              Your funds have been added to your wallet successfully.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate({ to: '/wallet' })} className="gap-2">
              <Wallet className="w-4 h-4" />
              View Wallet
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/contests' })}>
              Browse Contests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

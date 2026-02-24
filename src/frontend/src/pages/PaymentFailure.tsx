import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="container py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Payment Failed</h2>
            <p className="text-muted-foreground">
              Your payment could not be processed. Please try again or contact support if the issue persists.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate({ to: '/wallet' })} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useGetBalance, useGetCallerUserProfile } from '../hooks/useQueries';
import { useCreateCheckoutSession } from '../hooks/useCreateCheckoutSession';
import WalletBalance from '../components/WalletBalance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoppingItem } from '../backend';

export default function Wallet() {
  const { data: balance = BigInt(0), isLoading: balanceLoading } = useGetBalance();
  const { data: profile } = useGetCallerUserProfile();
  const createCheckoutSession = useCreateCheckoutSession();
  const [amount, setAmount] = useState('10');

  const balanceInDollars = Number(balance) / 100;

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const items: ShoppingItem[] = [
        {
          productName: 'Wallet Deposit',
          productDescription: 'Add funds to your FantasyLeague wallet',
          priceInCents: BigInt(Math.round(depositAmount * 100)),
          quantity: BigInt(1),
          currency: 'USD',
        },
      ];

      const session = await createCheckoutSession.mutateAsync(items);
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment');
    }
  };

  if (balanceLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your balance and transactions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <WalletBalance balance={balanceInDollars} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  placeholder="10.00"
                />
              </div>
            </div>
            <Button
              onClick={handleDeposit}
              disabled={createCheckoutSession.isPending}
              className="w-full"
            >
              {createCheckoutSession.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No transactions yet
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

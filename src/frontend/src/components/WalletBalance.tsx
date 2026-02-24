import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
}

export default function WalletBalance({ balance }: WalletBalanceProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="w-5 h-5" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ${balance.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}

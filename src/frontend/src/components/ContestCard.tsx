import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Users, DollarSign } from 'lucide-react';
import type { Contest } from '../backend';

interface ContestCardProps {
  contest: Contest;
  onJoin: () => void;
  isJoining: boolean;
  isParticipating: boolean;
}

export default function ContestCard({ contest, onJoin, isJoining, isParticipating }: ContestCardProps) {
  const entryFee = Number(contest.entryFee) / 100;
  const prizePool = Number(contest.prizePool) / 100;
  const participants = contest.participants.length;

  return (
    <Card className="transition-all hover:shadow-card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <img
                src="/assets/generated/trophy-icon.dim_128x128.png"
                alt="Trophy"
                className="w-6 h-6"
              />
            </div>
            <div>
              <CardTitle className="text-lg">{contest.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {participants} joined
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Entry Fee</p>
            <p className="text-lg font-bold text-primary">${entryFee.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Prize Pool</p>
            <p className="text-lg font-bold text-success">${prizePool.toFixed(2)}</p>
          </div>
        </div>
        <Button
          onClick={onJoin}
          disabled={isJoining || isParticipating}
          className="w-full"
          variant={isParticipating ? 'outline' : 'default'}
        >
          {isParticipating ? 'Already Joined' : isJoining ? 'Joining...' : 'Join Contest'}
        </Button>
      </CardContent>
    </Card>
  );
}

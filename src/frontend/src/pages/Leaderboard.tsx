import { useGetAllContests } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';

export default function Leaderboard() {
  const { data: contests = [], isLoading } = useGetAllContests();
  const { identity } = useInternetIdentity();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank against other players
        </p>
      </div>

      {contests.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Contests Yet</h3>
            <p className="text-muted-foreground">
              Join a contest to see leaderboard rankings
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {contests.map((contest, index) => (
            <Card key={Number(contest.id)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  {contest.name}
                  <Badge variant="outline" className="ml-auto">
                    {contest.participants.length} participants
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contest.participants.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No participants yet
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contest.participants.map((participant, idx) => {
                        const rank = idx + 1;
                        const isCurrentUser = identity?.getPrincipal().toString() === participant.toString();
                        return (
                          <TableRow
                            key={participant.toString()}
                            className={isCurrentUser ? 'bg-primary/5' : ''}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {getRankIcon(rank)}
                                <span>{rank}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="truncate max-w-[200px]">
                                  {participant.toString().slice(0, 8)}...
                                </span>
                                {isCurrentUser && (
                                  <Badge variant="secondary" className="text-xs">
                                    You
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {Math.floor(Math.random() * 100)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

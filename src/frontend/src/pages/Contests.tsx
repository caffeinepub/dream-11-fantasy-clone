import { useGetAllContests, useGetMyTeams, useJoinContest } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ContestCard from '../components/ContestCard';
import StripePaymentSetup from '../components/StripePaymentSetup';
import { Loader2, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function Contests() {
  const { data: contests = [], isLoading: contestsLoading } = useGetAllContests();
  const { data: myTeams = [] } = useGetMyTeams();
  const { identity } = useInternetIdentity();
  const joinContest = useJoinContest();

  const handleJoinContest = async (contestId: bigint) => {
    if (myTeams.length === 0) {
      toast.error('Please create a team first');
      return;
    }

    try {
      await joinContest.mutateAsync(contestId);
      toast.success('Successfully joined contest!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to join contest');
    }
  };

  const isParticipating = (contestId: bigint) => {
    const contest = contests.find(c => c.id === contestId);
    if (!contest || !identity) return false;
    return contest.participants.some(p => p.toString() === identity.getPrincipal().toString());
  };

  if (contestsLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Contests</h1>
        <p className="text-muted-foreground">
          Join exciting contests and compete for prizes
        </p>
      </div>

      <StripePaymentSetup />

      {contests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Contests Available</h3>
          <p className="text-muted-foreground">
            Check back later for new contests
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map(contest => (
            <ContestCard
              key={Number(contest.id)}
              contest={contest}
              onJoin={() => handleJoinContest(contest.id)}
              isJoining={joinContest.isPending}
              isParticipating={isParticipating(contest.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

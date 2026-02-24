import { useState, useMemo } from 'react';
import { useGetAllPlayers, useCreateTeam } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import PlayerCard from '../components/PlayerCard';
import TeamFormation from '../components/TeamFormation';
import BudgetTracker from '../components/BudgetTracker';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Player } from '../backend';

const BUDGET_LIMIT = 100; // $100
const MAX_PLAYERS = 11;

export default function CreateTeam() {
  const { data: players = [], isLoading } = useGetAllPlayers();
  const createTeam = useCreateTeam();
  const navigate = useNavigate();
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<bigint>>(new Set());

  const selectedPlayers = useMemo(
    () => players.filter(p => selectedPlayerIds.has(p.id)),
    [players, selectedPlayerIds]
  );

  const totalSpent = useMemo(
    () => selectedPlayers.reduce((sum, p) => sum + Number(p.price) / 100, 0),
    [selectedPlayers]
  );

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const playersByPosition = useMemo(() => {
    return positions.reduce((acc, pos) => {
      acc[pos] = players.filter(p => p.position === pos);
      return acc;
    }, {} as Record<string, Player[]>);
  }, [players]);

  const togglePlayer = (player: Player) => {
    const newSet = new Set(selectedPlayerIds);
    if (newSet.has(player.id)) {
      newSet.delete(player.id);
    } else {
      if (newSet.size >= MAX_PLAYERS) {
        toast.error(`Maximum ${MAX_PLAYERS} players allowed`);
        return;
      }
      const newSpent = totalSpent + Number(player.price) / 100;
      if (newSpent > BUDGET_LIMIT) {
        toast.error('Budget limit exceeded');
        return;
      }
      newSet.add(player.id);
    }
    setSelectedPlayerIds(newSet);
  };

  const handleSaveTeam = async () => {
    if (selectedPlayerIds.size === 0) {
      toast.error('Please select at least one player');
      return;
    }

    if (selectedPlayerIds.size > MAX_PLAYERS) {
      toast.error(`Maximum ${MAX_PLAYERS} players allowed`);
      return;
    }

    if (totalSpent > BUDGET_LIMIT) {
      toast.error('Budget limit exceeded');
      return;
    }

    try {
      await createTeam.mutateAsync(Array.from(selectedPlayerIds));
      toast.success('Team created successfully!');
      navigate({ to: '/contests' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team');
    }
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
        <h1 className="text-3xl md:text-4xl font-black mb-2">Create Your Team</h1>
        <p className="text-muted-foreground">
          Select up to {MAX_PLAYERS} players within your ${BUDGET_LIMIT} budget
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="Goalkeeper">
            <TabsList className="grid w-full grid-cols-4">
              {positions.map(pos => (
                <TabsTrigger key={pos} value={pos}>
                  {pos}
                </TabsTrigger>
              ))}
            </TabsList>
            {positions.map(pos => (
              <TabsContent key={pos} value={pos} className="space-y-3 mt-4">
                {playersByPosition[pos]?.length > 0 ? (
                  playersByPosition[pos].map(player => (
                    <PlayerCard
                      key={Number(player.id)}
                      player={player}
                      isSelected={selectedPlayerIds.has(player.id)}
                      onToggle={() => togglePlayer(player)}
                      disabled={
                        !selectedPlayerIds.has(player.id) &&
                        (selectedPlayerIds.size >= MAX_PLAYERS ||
                          totalSpent + Number(player.price) / 100 > BUDGET_LIMIT)
                      }
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No players available in this position
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-6">
          <BudgetTracker spent={totalSpent} budget={BUDGET_LIMIT} />
          <TeamFormation selectedPlayers={selectedPlayers} maxPlayers={MAX_PLAYERS} />
          <Button
            onClick={handleSaveTeam}
            disabled={createTeam.isPending || selectedPlayerIds.size === 0}
            className="w-full gap-2"
            size="lg"
          >
            {createTeam.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Team...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Team
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

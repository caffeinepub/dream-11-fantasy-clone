import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Player } from '../backend';

interface TeamFormationProps {
  selectedPlayers: Player[];
  maxPlayers?: number;
}

export default function TeamFormation({ selectedPlayers, maxPlayers = 11 }: TeamFormationProps) {
  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  
  const playersByPosition = positions.map(position => ({
    position,
    players: selectedPlayers.filter(p => p.position === position),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Team Formation</span>
          <Badge variant={selectedPlayers.length === maxPlayers ? 'default' : 'secondary'}>
            {selectedPlayers.length}/{maxPlayers}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {playersByPosition.map(({ position, players }) => (
          <div key={position} className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">{position}</h4>
            <div className="grid grid-cols-1 gap-2">
              {players.length > 0 ? (
                players.map(player => (
                  <div
                    key={Number(player.id)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center overflow-hidden">
                      <img
                        src="/assets/generated/player-placeholder.dim_200x200.png"
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.team}</p>
                    </div>
                    <span className="text-xs font-semibold">${(Number(player.price) / 100).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-lg border-2 border-dashed border-border text-center text-sm text-muted-foreground">
                  No {position.toLowerCase()} selected
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

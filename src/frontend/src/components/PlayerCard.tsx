import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import type { Player } from '../backend';

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function PlayerCard({ player, isSelected, onToggle, disabled }: PlayerCardProps) {
  const price = Number(player.price) / 100;
  const form = Number(player.form);

  return (
    <Card className={`transition-all hover:shadow-card-hover ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src="/assets/generated/player-placeholder.dim_200x200.png"
              alt={player.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{player.name}</h3>
            <p className="text-xs text-muted-foreground">{player.team}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {player.position}
              </Badge>
              <span className="text-xs text-muted-foreground">Form: {form}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-bold text-sm">${price.toFixed(2)}</span>
            <Button
              size="sm"
              variant={isSelected ? 'destructive' : 'default'}
              onClick={onToggle}
              disabled={disabled}
              className="h-7 w-7 p-0"
            >
              {isSelected ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

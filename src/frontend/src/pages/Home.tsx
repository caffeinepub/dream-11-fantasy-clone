import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Wallet, PlusCircle, TrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: PlusCircle,
      title: 'Create Your Team',
      description: 'Build your dream fantasy team with top players',
      action: () => navigate({ to: '/create-team' }),
    },
    {
      icon: Trophy,
      title: 'Join Contests',
      description: 'Compete in exciting contests and win prizes',
      action: () => navigate({ to: '/contests' }),
    },
    {
      icon: Users,
      title: 'View Leaderboard',
      description: 'Track your ranking and compete with others',
      action: () => navigate({ to: '/leaderboard' }),
    },
    {
      icon: Wallet,
      title: 'Manage Wallet',
      description: 'Add funds and track your winnings',
      action: () => navigate({ to: '/wallet' }),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x400.png)' }}
        />
        <div className="relative container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Build Your{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Dream Team
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Create fantasy teams, join contests, and compete with players worldwide. Win real prizes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/create-team' })}
                className="gap-2 text-lg px-8"
              >
                <PlusCircle className="w-5 h-5" />
                Create Team
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/contests' })}
                className="gap-2 text-lg px-8"
              >
                <Trophy className="w-5 h-5" />
                View Contests
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="transition-all hover:shadow-card-hover cursor-pointer"
              onClick={feature.action}
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <p className="text-4xl font-black">1000+</p>
              </div>
              <p className="text-muted-foreground">Active Players</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 text-secondary" />
                <p className="text-4xl font-black">50+</p>
              </div>
              <p className="text-muted-foreground">Live Contests</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Wallet className="w-8 h-8 text-success" />
                <p className="text-4xl font-black">$10K+</p>
              </div>
              <p className="text-muted-foreground">Prizes Won</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

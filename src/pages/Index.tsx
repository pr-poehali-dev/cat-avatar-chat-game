import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import AvatarGenerator from '@/components/AvatarGenerator';
import StoriesChat from '@/components/StoriesChat';
import CatchBallGame from '@/components/CatchBallGame';
import Leaderboard from '@/components/Leaderboard';
import UserProfile from '@/components/UserProfile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('avatar');
  const [userAvatar, setUserAvatar] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [totalStories, setTotalStories] = useState(0);

  const handleAvatarCreate = (avatar: any, name: string) => {
    setUserAvatar(avatar);
    setUserName(name);
    setActiveTab('stories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary/10">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-primary/20 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="text-5xl animate-bounce-gentle">🐱</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              КотоМир
            </h1>
          </div>
          
          {userName && (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Avatar className="h-8 w-8 border-2 border-primary">
                  <AvatarFallback style={{ backgroundColor: userAvatar?.color || '#FF8C42' }}>
                    <span className="text-2xl">{userAvatar?.accessories || '😺'}</span>
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{userName}</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showProfile ? (
          <div className="animate-scale-in">
            <Button
              variant="ghost"
              onClick={() => setShowProfile(false)}
              className="mb-4 flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              Назад
            </Button>
            <UserProfile
              userName={userName}
              userAvatar={userAvatar}
              gameScore={gameScore}
              totalStories={totalStories}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white/90 backdrop-blur-sm shadow-lg">
              <TabsTrigger
                value="avatar"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Icon name="Palette" size={18} />
                <span className="hidden sm:inline">Аватарка</span>
              </TabsTrigger>
              <TabsTrigger
                value="stories"
                disabled={!userName}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Icon name="MessageCircle" size={18} />
                <span className="hidden sm:inline">Истории</span>
              </TabsTrigger>
              <TabsTrigger
                value="games"
                disabled={!userName}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Icon name="Gamepad2" size={18} />
                <span className="hidden sm:inline">Игры</span>
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Icon name="Trophy" size={18} />
                <span className="hidden sm:inline">Рейтинг</span>
              </TabsTrigger>
            </TabsList>

            <div className="animate-fade-in">
              <TabsContent value="avatar" className="mt-0">
                <AvatarGenerator onAvatarCreate={handleAvatarCreate} />
              </TabsContent>

              <TabsContent value="stories" className="mt-0">
                <StoriesChat
                  userName={userName}
                  userAvatar={userAvatar}
                  onStoryCountChange={setTotalStories}
                />
              </TabsContent>

              <TabsContent value="games" className="mt-0">
                <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="text-3xl">🎮</span>
                    Мини-игры с котиками
                  </h2>
                  <CatchBallGame
                    userName={userName}
                    onScoreUpdate={(score) => setGameScore(Math.max(gameScore, score))}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-0">
                <Leaderboard currentUser={userName} />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </main>

      <footer className="mt-16 py-8 bg-white/80 backdrop-blur-md border-t border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-2 mb-4 text-4xl">
            <span className="animate-bounce-gentle">🐱</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>🎨</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>📖</span>
            <span className="animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>🎮</span>
          </div>
          <p className="text-muted-foreground">
            Создавай котиков, делись историями, играй и веселись! 🎉
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardProps {
  currentUser: string;
}

const topPlayers = [
  { name: 'Мурзик', score: 45, avatar: { color: '#D2691E', accessories: '😺' } },
  { name: 'Васька', score: 38, avatar: { color: '#A0A0A0', accessories: '😎' } },
  { name: 'Пушок', score: 32, avatar: { color: '#F5F5F5', accessories: '👑' } },
  { name: 'Барсик', score: 28, avatar: { color: '#2C2C2C', accessories: '🎀' } },
  { name: 'Снежок', score: 25, avatar: { color: '#FF8C42', accessories: '🌸' } },
];

const topAuthors = [
  { name: 'Васька', stories: 15, likes: 89, avatar: { color: '#A0A0A0', accessories: '😎' } },
  { name: 'Мурзик', stories: 12, likes: 67, avatar: { color: '#D2691E', accessories: '😺' } },
  { name: 'Пушок', stories: 10, likes: 54, avatar: { color: '#F5F5F5', accessories: '👑' } },
  { name: 'Рыжик', stories: 8, likes: 43, avatar: { color: '#FF8C42', accessories: '🎩' } },
  { name: 'Тишка', stories: 7, likes: 38, avatar: { color: '#8B7355', accessories: '🌸' } },
];

const Leaderboard = ({ currentUser }: LeaderboardProps) => {
  const getMedalEmoji = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return '🏅';
  };

  return (
    <div className="max-w-5xl mx-auto animate-scale-in">
      <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-4xl">🏆</span>
          Рейтинг КотоМира
        </h2>

        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-primary/10 to-secondary/10">
            <TabsTrigger
              value="players"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Icon name="Gamepad2" size={18} className="mr-2" />
              Игроки
            </TabsTrigger>
            <TabsTrigger
              value="authors"
              className="data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              <Icon name="PenLine" size={18} className="mr-2" />
              Авторы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="Trophy" size={24} className="text-primary" />
              <h3 className="text-xl font-bold">Лучшие игроки недели</h3>
            </div>

            {topPlayers.map((player, index) => (
              <Card
                key={player.name}
                className={`p-6 transition-all hover:shadow-lg hover:scale-[1.02] ${
                  player.name === currentUser
                    ? 'border-2 border-primary bg-primary/5'
                    : 'border border-gray-200'
                } ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl min-w-[60px] text-center animate-bounce-gentle">
                    {getMedalEmoji(index)}
                  </div>

                  <Avatar className="h-16 w-16 border-3 border-primary shadow-lg">
                    <AvatarFallback style={{ backgroundColor: player.avatar.color }}>
                      <span className="text-3xl">{player.avatar.accessories}</span>
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-bold">{player.name}</h4>
                      {player.name === currentUser && (
                        <Badge variant="default" className="bg-primary">
                          Ты
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      Лучший счёт: <span className="font-bold text-primary">{player.score}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{index + 1}</div>
                    <div className="text-sm text-muted-foreground">место</div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="authors" className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="BookOpen" size={24} className="text-secondary" />
              <h3 className="text-xl font-bold">Лучшие авторы историй</h3>
            </div>

            {topAuthors.map((author, index) => (
              <Card
                key={author.name}
                className={`p-6 transition-all hover:shadow-lg hover:scale-[1.02] ${
                  author.name === currentUser
                    ? 'border-2 border-secondary bg-secondary/5'
                    : 'border border-gray-200'
                } ${index < 3 ? 'bg-gradient-to-r from-purple-50 to-pink-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl min-w-[60px] text-center animate-bounce-gentle">
                    {getMedalEmoji(index)}
                  </div>

                  <Avatar className="h-16 w-16 border-3 border-secondary shadow-lg">
                    <AvatarFallback style={{ backgroundColor: author.avatar.color }}>
                      <span className="text-3xl">{author.avatar.accessories}</span>
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-bold">{author.name}</h4>
                      {author.name === currentUser && (
                        <Badge variant="default" className="bg-secondary">
                          Ты
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="BookOpen" size={16} />
                        {author.stories} историй
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Heart" size={16} />
                        {author.likes} лайков
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-secondary">{index + 1}</div>
                    <div className="text-sm text-muted-foreground">место</div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h4 className="font-bold text-lg mb-2">Как попасть в рейтинг?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>🎮 Играй в мини-игры и улучшай свой результат</li>
                <li>📖 Пиши интересные истории и получай лайки</li>
                <li>💬 Общайся с другими котиками</li>
                <li>🏆 Рейтинг обновляется каждую неделю</li>
              </ul>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default Leaderboard;

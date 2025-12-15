import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface UserProfileProps {
  userName: string;
  userAvatar: any;
  gameScore: number;
  totalStories: number;
}

const UserProfile = ({ userName, userAvatar, gameScore, totalStories }: UserProfileProps) => {
  const achievements = [
    {
      id: 1,
      name: 'Первый котик',
      description: 'Создал свою первую аватарку',
      icon: '🎨',
      unlocked: true,
    },
    {
      id: 2,
      name: 'Рассказчик',
      description: 'Опубликовал первую историю',
      icon: '📖',
      unlocked: totalStories > 0,
    },
    {
      id: 3,
      name: 'Игрок',
      description: 'Сыграл в первую игру',
      icon: '🎮',
      unlocked: gameScore > 0,
    },
    {
      id: 4,
      name: 'Мастер ловли',
      description: 'Набрал 10 очков в игре',
      icon: '🎯',
      unlocked: gameScore >= 10,
    },
    {
      id: 5,
      name: 'Писатель',
      description: 'Опубликовал 5 историй',
      icon: '✍️',
      unlocked: totalStories >= 5,
    },
    {
      id: 6,
      name: 'Легенда',
      description: 'Набрал 25 очков в игре',
      icon: '👑',
      unlocked: gameScore >= 25,
    },
  ];

  const stats = [
    {
      label: 'Лучший результат',
      value: gameScore,
      icon: 'Trophy',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Историй написано',
      value: totalStories,
      icon: 'BookOpen',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Достижений',
      value: achievements.filter((a) => a.unlocked).length,
      icon: 'Star',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Дней в КотоМире',
      value: 1,
      icon: 'Calendar',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-white to-secondary/10 backdrop-blur-sm shadow-xl border-2 border-primary/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <Avatar className="h-40 w-40 border-8 border-white shadow-2xl animate-bounce-gentle">
              <AvatarFallback
                style={{ backgroundColor: userAvatar?.color || '#FF8C42' }}
                className="text-8xl"
              >
                {userAvatar?.accessories || '😺'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-3 shadow-lg">
              <Icon name="Star" size={24} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {userName}
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              {userAvatar?.colorName} котик · {userAvatar?.patternName} · {userAvatar?.accessoryName}
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Icon name="Sparkles" size={14} className="mr-1" />
                Новичок
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Уровень 1
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`p-6 ${stat.bgColor} border-2 border-primary/20 hover:shadow-lg transition-all hover:scale-105`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`${stat.color} mb-3`}>
                <Icon name={stat.icon as any} size={32} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            Достижения
          </h2>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {unlockedCount} / {totalCount}
          </Badge>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Progress value={progressPercent} className="flex-1 h-3" />
            <span className="text-sm font-semibold">{Math.round(progressPercent)}%</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Разблокируй все достижения, играя и публикуя истории!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-6 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-primary hover:shadow-lg hover:scale-105'
                  : 'bg-gray-50 border border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`text-5xl ${
                    achievement.unlocked ? 'animate-bounce-gentle' : 'grayscale opacity-50'
                  }`}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                    {achievement.name}
                    {achievement.unlocked && (
                      <Icon name="Check" size={18} className="text-green-600" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Разблокировано
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h4 className="font-bold text-lg mb-2">Как получить больше достижений?</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>🎮 Продолжай играть и улучшай свои результаты</li>
              <li>📖 Пиши интересные истории и получай отклики</li>
              <li>💬 Общайся с другими котиками</li>
              <li>⭐ Каждую неделю появляются новые достижения!</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;

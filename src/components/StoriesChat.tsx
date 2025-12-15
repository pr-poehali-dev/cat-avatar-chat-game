import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Story {
  id: string;
  author: string;
  avatar: any;
  content: string;
  timestamp: Date;
  replies: Reply[];
  likes: number;
}

interface Reply {
  id: string;
  author: string;
  avatar: any;
  content: string;
  timestamp: Date;
}

interface StoriesChatProps {
  userName: string;
  userAvatar: any;
  onStoryCountChange: (count: number) => void;
}

const StoriesChat = ({ userName, userAvatar, onStoryCountChange }: StoriesChatProps) => {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      author: 'Мурзик',
      avatar: { color: '#D2691E', accessories: '😺' },
      content: 'Сегодня поймал самую быструю мышку в доме! Она пряталась за холодильником целых 3 часа 🐭',
      timestamp: new Date(Date.now() - 3600000),
      replies: [],
      likes: 5,
    },
    {
      id: '2',
      author: 'Васька',
      avatar: { color: '#A0A0A0', accessories: '😎' },
      content: 'Нашёл идеальное место для сна - на тёплом ноутбуке хозяина. Он почему-то был недоволен 😹',
      timestamp: new Date(Date.now() - 7200000),
      replies: [
        {
          id: 'r1',
          author: 'Мурзик',
          avatar: { color: '#D2691E', accessories: '😺' },
          content: 'Ха-ха! У меня такое же любимое место! 😸',
          timestamp: new Date(Date.now() - 6900000),
        },
      ],
      likes: 8,
    },
  ]);
  
  const [newStory, setNewStory] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    onStoryCountChange(stories.filter((s) => s.author === userName).length);
  }, [stories, userName, onStoryCountChange]);

  const handlePostStory = () => {
    if (!newStory.trim()) return;

    const story: Story = {
      id: Date.now().toString(),
      author: userName,
      avatar: userAvatar,
      content: newStory,
      timestamp: new Date(),
      replies: [],
      likes: 0,
    };

    setStories([story, ...stories]);
    setNewStory('');
  };

  const handleReply = (storyId: string) => {
    if (!replyText.trim()) return;

    const reply: Reply = {
      id: Date.now().toString(),
      author: userName,
      avatar: userAvatar,
      content: replyText,
      timestamp: new Date(),
    };

    setStories(
      stories.map((story) =>
        story.id === storyId
          ? { ...story, replies: [...story.replies, reply] }
          : story
      )
    );

    setReplyText('');
    setReplyingTo(null);
  };

  const handleLike = (storyId: string) => {
    setStories(
      stories.map((story) =>
        story.id === storyId ? { ...story, likes: story.likes + 1 } : story
      )
    );
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <Card className="lg:col-span-2 p-6 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20 animate-scale-in">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="text-3xl">📖</span>
          Истории котиков
        </h2>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {stories.map((story) => (
              <Card key={story.id} className="p-6 border-2 border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarFallback style={{ backgroundColor: story.avatar.color }}>
                      <span className="text-2xl">{story.avatar.accessories}</span>
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg">{story.author}</span>
                      {story.author === userName && (
                        <Badge variant="secondary" className="text-xs">Ты</Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        · {formatTime(story.timestamp)}
                      </span>
                    </div>

                    <p className="text-base mb-4 leading-relaxed">{story.content}</p>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(story.id)}
                        className="flex items-center gap-2 hover:text-red-500 transition-colors"
                      >
                        <Icon name="Heart" size={18} />
                        <span>{story.likes}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(story.id)}
                        className="flex items-center gap-2"
                      >
                        <Icon name="MessageCircle" size={18} />
                        <span>{story.replies.length}</span>
                      </Button>
                    </div>

                    {story.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-secondary/30">
                        {story.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border border-secondary">
                              <AvatarFallback style={{ backgroundColor: reply.avatar.color }}>
                                <span className="text-lg">{reply.avatar.accessories}</span>
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{reply.author}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyingTo === story.id && (
                      <div className="mt-4 flex gap-2 animate-fade-in">
                        <Textarea
                          placeholder="Напиши ответ..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="resize-none border-2 border-secondary/30 focus:border-secondary rounded-xl"
                          rows={2}
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReply(story.id)}
                            className="bg-secondary hover:bg-secondary/90"
                          >
                            <Icon name="Send" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setReplyingTo(null)}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-secondary/5 to-primary/5 backdrop-blur-sm shadow-xl border-2 border-primary/20 h-fit sticky top-24 animate-scale-in">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="PenLine" size={24} />
          Поделись историей
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarFallback style={{ backgroundColor: userAvatar.color }}>
                <span className="text-xl">{userAvatar.accessories}</span>
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">{userName}</span>
          </div>

          <Textarea
            placeholder="Что интересного случилось с тобой сегодня? 🐱"
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
            className="resize-none border-2 border-primary/30 focus:border-primary rounded-xl min-h-[150px]"
          />

          <Button
            onClick={handlePostStory}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
            size="lg"
          >
            <Icon name="Send" size={20} className="mr-2" />
            Опубликовать историю
          </Button>

          <div className="pt-4 border-t border-primary/20">
            <p className="text-sm text-muted-foreground text-center">
              💡 Расскажи о своих приключениях, смешных случаях или находках!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StoriesChat;

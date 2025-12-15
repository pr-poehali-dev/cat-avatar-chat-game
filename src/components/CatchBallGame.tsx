import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface CatchBallGameProps {
  userName: string;
  onScoreUpdate: (score: number) => void;
}

const CatchBallGame = ({ userName, onScoreUpdate }: CatchBallGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [catPosition, setCatPosition] = useState(50);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [ballSpeed, setBallSpeed] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setBallPosition((prev) => {
        const newY = prev.y + ballSpeed;

        if (newY >= 85) {
          const catCenter = catPosition;
          const ballCenter = prev.x;
          const distance = Math.abs(catCenter - ballCenter);

          if (distance < 8) {
            setScore((s) => {
              const newScore = s + 1;
              onScoreUpdate(newScore);
              if (newScore > highScore) {
                setHighScore(newScore);
              }
              return newScore;
            });
            setBallSpeed((speed) => Math.min(speed + 0.3, 8));
            return {
              x: Math.random() * 90 + 5,
              y: 0,
            };
          } else {
            setGameOver(true);
            setIsPlaying(false);
            return prev;
          }
        }

        return { ...prev, y: newY };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, ballSpeed, catPosition, gameOver, highScore, onScoreUpdate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      if (e.key === 'ArrowLeft') {
        setCatPosition((pos) => Math.max(5, pos - 5));
      } else if (e.key === 'ArrowRight') {
        setCatPosition((pos) => Math.min(95, pos + 5));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPlaying || gameOver || !gameAreaRef.current) return;

      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setCatPosition(Math.max(5, Math.min(95, x)));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPlaying || gameOver || !gameAreaRef.current) return;

      const rect = gameAreaRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      setCatPosition(Math.max(5, Math.min(95, x)));
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying, gameOver]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setCatPosition(50);
    setBallPosition({ x: Math.random() * 90 + 5, y: 0 });
    setBallSpeed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Icon name="Target" size={20} className="mr-2" />
            Очки: {score}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Icon name="Trophy" size={20} className="mr-2" />
            Рекорд: {highScore}
          </Badge>
        </div>

        {!isPlaying && (
          <Button
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
          >
            <Icon name="Play" size={20} className="mr-2" />
            {gameOver ? 'Играть снова' : 'Начать игру'}
          </Button>
        )}
      </div>

      <Card
        ref={gameAreaRef}
        className="relative h-[500px] bg-gradient-to-b from-sky-200 to-green-100 border-4 border-primary/30 rounded-3xl overflow-hidden cursor-crosshair"
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="text-8xl mb-6 animate-bounce-gentle">🐱</div>
            <h3 className="text-3xl font-bold mb-4">Поймай шарик!</h3>
            <div className="text-center space-y-2 text-muted-foreground max-w-md px-4">
              <p className="flex items-center gap-2 justify-center">
                <Icon name="Mouse" size={20} />
                Двигай мышкой или пальцем
              </p>
              <p className="flex items-center gap-2 justify-center">
                <Icon name="Keyboard" size={20} />
                Или используй стрелки ← →
              </p>
              <p className="mt-4 font-semibold text-primary">
                Поймай все шарики! Не дай им упасть! 🎯
              </p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 animate-fade-in">
            <div className="text-8xl mb-6 animate-wiggle">😿</div>
            <h3 className="text-4xl font-bold text-white mb-4">Игра окончена!</h3>
            <div className="text-white text-xl mb-6">
              Твой счёт: <span className="text-primary font-bold text-3xl">{score}</span>
            </div>
            {score === highScore && score > 0 && (
              <Badge className="text-xl px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                <Icon name="Star" size={24} className="mr-2" />
                Новый рекорд!
              </Badge>
            )}
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl text-xl px-8 py-6"
            >
              <Icon name="RotateCcw" size={24} className="mr-2" />
              Попробовать снова
            </Button>
          </div>
        )}

        {isPlaying && (
          <>
            <div
              className="absolute w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-2xl transition-all duration-100 animate-pulse"
              style={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="absolute inset-2 bg-white/30 rounded-full"></div>
            </div>

            <div
              className="absolute bottom-4 w-20 transition-all duration-75"
              style={{
                left: `${catPosition}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="text-6xl animate-bounce-gentle filter drop-shadow-xl">
                🐱
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black/20 rounded-full blur-sm"></div>
            </div>

            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-2xl">
              <div className="animate-bounce-gentle">☁️</div>
              <div className="animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>
                ☁️
              </div>
              <div className="animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>
                ☁️
              </div>
            </div>

            <div className="absolute bottom-20 left-0 right-0 text-6xl flex justify-around opacity-30">
              <span>🌸</span>
              <span>🌼</span>
              <span>🌻</span>
              <span>🌺</span>
            </div>
          </>
        )}

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="text-9xl">🐱</div>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h4 className="font-bold text-lg mb-2">Советы для игры:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• С каждым пойманным шариком скорость увеличивается</li>
              <li>• Используй мышку для точного управления</li>
              <li>• Старайся держать котика по центру между бросками</li>
              <li>• Следи за траекторией шарика с самого верха</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CatchBallGame;

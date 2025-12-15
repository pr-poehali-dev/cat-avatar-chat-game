import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FishingGameProps {
  userName: string;
  onScoreUpdate: (score: number) => void;
}

type GameState = 'idle' | 'casting' | 'waiting' | 'skillcheck' | 'caught' | 'failed';

const fishTypes = [
  { name: 'Маленькая рыбка', emoji: '🐟', points: 1, rarity: 0.5 },
  { name: 'Средняя рыба', emoji: '🐠', points: 3, rarity: 0.3 },
  { name: 'Большая рыба', emoji: '🐡', points: 5, rarity: 0.15 },
  { name: 'Золотая рыбка', emoji: '🐠✨', points: 10, rarity: 0.04 },
  { name: 'Легендарная рыба', emoji: '🦈', points: 20, rarity: 0.01 },
];

const FishingGame = ({ userName, onScoreUpdate }: FishingGameProps) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [fishCaught, setFishCaught] = useState(0);
  const [currentFish, setCurrentFish] = useState(fishTypes[0]);
  const [skillcheckPosition, setSkillcheckPosition] = useState(0);
  const [targetZoneStart, setTargetZoneStart] = useState(40);
  const [targetZoneSize, setTargetZoneSize] = useState(20);
  const [skillcheckSpeed, setSkillcheckSpeed] = useState(1);
  const [direction, setDirection] = useState(1);
  const [waitTime, setWaitTime] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [message, setMessage] = useState('');
  const animationRef = useRef<number>();

  const getRandomFish = () => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const fish of fishTypes) {
      cumulative += fish.rarity;
      if (random <= cumulative) {
        return fish;
      }
    }
    return fishTypes[0];
  };

  const startFishing = () => {
    setGameState('casting');
    setMessage('Забрасываю удочку...');
    
    setTimeout(() => {
      setGameState('waiting');
      const wait = Math.random() * 2000 + 1000;
      setWaitTime(wait);
      setMessage('Жди поклёвки...');
      
      setTimeout(() => {
        const fish = getRandomFish();
        setCurrentFish(fish);
        setGameState('skillcheck');
        setSkillcheckPosition(0);
        setDirection(1);
        
        const zoneSize = Math.max(10, 30 - fishCaught * 2);
        const zoneStart = Math.random() * (100 - zoneSize);
        setTargetZoneStart(zoneStart);
        setTargetZoneSize(zoneSize);
        setSkillcheckSpeed(1 + fishCaught * 0.1);
        setMessage('НАЖМИ ПРОБЕЛ!');
      }, wait);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'idle') {
          startFishing();
        } else if (gameState === 'skillcheck') {
          checkSkillcheck();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, skillcheckPosition]);

  useEffect(() => {
    if (gameState !== 'skillcheck') return;

    const animate = () => {
      setSkillcheckPosition((pos) => {
        let newPos = pos + (direction * skillcheckSpeed);
        let newDirection = direction;

        if (newPos >= 100) {
          newPos = 100;
          newDirection = -1;
          setDirection(-1);
        } else if (newPos <= 0) {
          newPos = 0;
          newDirection = 1;
          setDirection(1);
        }

        return newPos;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, direction, skillcheckSpeed]);

  const checkSkillcheck = () => {
    if (gameState !== 'skillcheck') return;

    const isInZone = skillcheckPosition >= targetZoneStart && 
                     skillcheckPosition <= targetZoneStart + targetZoneSize;

    if (isInZone) {
      const isPerfect = Math.abs(skillcheckPosition - (targetZoneStart + targetZoneSize / 2)) < 5;
      
      setGameState('caught');
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > bestCombo) {
        setBestCombo(newCombo);
      }

      const points = isPerfect ? currentFish.points * 2 : currentFish.points;
      const comboBonus = Math.floor(points * (newCombo * 0.1));
      const totalPoints = points + comboBonus;

      setScore((s) => {
        const newScore = s + totalPoints;
        onScoreUpdate(newScore);
        return newScore;
      });
      setFishCaught((f) => f + 1);

      if (isPerfect) {
        setMessage(`🎯 ИДЕАЛЬНО! ${currentFish.emoji} ${currentFish.name} (+${totalPoints})`);
      } else {
        setMessage(`✅ Поймал! ${currentFish.emoji} ${currentFish.name} (+${totalPoints})`);
      }

      setTimeout(() => {
        setGameState('idle');
        setMessage('');
      }, 2000);
    } else {
      setGameState('failed');
      setMessage('❌ Промах! Рыба уплыла...');
      setCombo(0);

      setTimeout(() => {
        setGameState('idle');
        setMessage('');
      }, 2000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setFishCaught(0);
    setCombo(0);
    setGameState('idle');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Icon name="Fish" size={20} className="mr-2" />
            Поймано: {fishCaught}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Icon name="Star" size={20} className="mr-2" />
            Очки: {score}
          </Badge>
          {combo > 0 && (
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse">
              🔥 Комбо x{combo}
            </Badge>
          )}
        </div>

        <Button
          onClick={resetGame}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Icon name="RotateCcw" size={18} />
          Сброс
        </Button>
      </div>

      <Card className="relative h-[500px] bg-gradient-to-b from-sky-300 via-blue-300 to-blue-500 border-4 border-primary/30 rounded-3xl overflow-hidden">
        <div className="absolute top-4 left-4 right-4 flex justify-between text-2xl">
          <span className="animate-bounce-gentle">☁️</span>
          <span className="animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>☁️</span>
          <span className="animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>☁️</span>
        </div>

        <div className="absolute top-16 right-8 text-6xl animate-bounce-gentle">
          🐱
        </div>

        <div className="absolute top-32 right-8 w-1 h-48 bg-gradient-to-b from-amber-700 to-transparent">
          {gameState !== 'idle' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-400 animate-pulse h-full"></div>
          )}
        </div>

        {(gameState === 'casting' || gameState === 'waiting' || gameState === 'skillcheck') && (
          <div className="absolute bottom-32 right-8 text-4xl animate-wiggle">
            🪝
          </div>
        )}

        <div className="absolute bottom-20 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-blue-600/30 to-blue-800/50">
          {gameState === 'waiting' && (
            <div className="absolute inset-0 flex items-center justify-around">
              <span className="text-4xl animate-bounce-gentle">🐟</span>
              <span className="text-4xl animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>🐠</span>
              <span className="text-4xl animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>🐡</span>
            </div>
          )}

          {gameState === 'caught' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl animate-scale-in">
                {currentFish.emoji}
              </div>
            </div>
          )}
        </div>

        {gameState === 'skillcheck' && (
          <div className="absolute bottom-8 left-8 right-8">
            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">Скиллчек!</span>
                  <span className="text-2xl">{currentFish.emoji}</span>
                </div>

                <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-green-400 via-green-500 to-green-400 transition-all"
                    style={{
                      left: `${targetZoneStart}%`,
                      width: `${targetZoneSize}%`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                      ПОПАДИ СЮДА
                    </div>
                  </div>

                  <div
                    className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 to-orange-500 shadow-lg transition-all duration-75"
                    style={{ left: `${skillcheckPosition}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">
                      ⬇️
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Нажми <kbd className="px-2 py-1 bg-gray-800 text-white rounded">ПРОБЕЛ</kbd> когда индикатор в зелёной зоне!
                  </p>
                  <Progress value={(skillcheckSpeed / 3) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Сложность: {Math.round((skillcheckSpeed / 3) * 100)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {message && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <Card className="p-6 bg-white shadow-2xl border-4 border-primary animate-scale-in">
              <p className="text-2xl font-bold text-center whitespace-nowrap">
                {message}
              </p>
            </Card>
          </div>
        )}

        {gameState === 'idle' && !message && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="p-8 bg-white/95 backdrop-blur-sm max-w-md">
              <div className="text-center space-y-4">
                <div className="text-8xl mb-4">🎣</div>
                <h3 className="text-3xl font-bold">Рыбалка котика</h3>
                <p className="text-muted-foreground">
                  Нажми <kbd className="px-3 py-2 bg-gray-800 text-white rounded font-bold">ПРОБЕЛ</kbd> чтобы забросить удочку
                </p>
                <div className="pt-4 space-y-2 text-sm text-left">
                  <p>🐟 Маленькая рыбка - 1 очко</p>
                  <p>🐠 Средняя рыба - 3 очка</p>
                  <p>🐡 Большая рыба - 5 очков</p>
                  <p>✨ Золотая рыбка - 10 очков</p>
                  <p>🦈 Легендарная - 20 очков</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-900 to-transparent"></div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📊</div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-2">Статистика</h4>
              <div className="space-y-1 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Поймано рыб:</span>
                  <span className="font-bold">{fishCaught}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Лучшее комбо:</span>
                  <span className="font-bold text-orange-600">🔥 {bestCombo}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Всего очков:</span>
                  <span className="font-bold text-primary">{score}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h4 className="font-bold text-lg mb-2">Советы</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Попадай точно в центр для удвоения очков</li>
                <li>• Комбо дает бонусные очки</li>
                <li>• С каждой рыбой сложность растёт</li>
                <li>• Редкие рыбы дают больше очков</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FishingGame;

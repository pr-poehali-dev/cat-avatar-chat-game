import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface AvatarGeneratorProps {
  onAvatarCreate: (avatar: any, name: string) => void;
}

const colors = [
  { name: 'Оранжевый', value: '#FF8C42', emoji: '🟠' },
  { name: 'Серый', value: '#A0A0A0', emoji: '⚪' },
  { name: 'Чёрный', value: '#2C2C2C', emoji: '⚫' },
  { name: 'Белый', value: '#F5F5F5', emoji: '⚪' },
  { name: 'Рыжий', value: '#D2691E', emoji: '🟤' },
  { name: 'Полосатый', value: '#8B7355', emoji: '🟫' },
];

const accessories = [
  { name: 'Без аксессуаров', emoji: '😺' },
  { name: 'Очки', emoji: '😎' },
  { name: 'Корона', emoji: '👑' },
  { name: 'Бантик', emoji: '🎀' },
  { name: 'Шляпа', emoji: '🎩' },
  { name: 'Цветок', emoji: '🌸' },
];

const patterns = [
  { name: 'Однотонный', value: 'solid' },
  { name: 'Пятнистый', value: 'spotted' },
  { name: 'Полосатый', value: 'striped' },
];

const AvatarGenerator = ({ onAvatarCreate }: AvatarGeneratorProps) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(accessories[0]);
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Введите имя котика!');
      return;
    }

    const avatar = {
      color: selectedColor.value,
      colorName: selectedColor.name,
      accessories: selectedAccessory.emoji,
      accessoryName: selectedAccessory.name,
      pattern: selectedPattern.value,
      patternName: selectedPattern.name,
    };

    onAvatarCreate(avatar, name);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20 animate-scale-in">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="text-4xl">🎨</span>
          Создай своего котика
        </h2>

        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-lg font-semibold mb-2 block">
              Имя котика
            </Label>
            <Input
              id="name"
              placeholder="Введи имя своего котика..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg border-2 border-primary/30 focus:border-primary rounded-2xl"
            />
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Цвет</Label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    selectedColor.value === color.value
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{color.emoji}</div>
                  <div className="text-sm font-medium">{color.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Аксессуар</Label>
            <div className="grid grid-cols-3 gap-3">
              {accessories.map((accessory) => (
                <button
                  key={accessory.name}
                  onClick={() => setSelectedAccessory(accessory)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    selectedAccessory.name === accessory.name
                      ? 'border-secondary bg-secondary/10 shadow-lg'
                      : 'border-gray-200 hover:border-secondary/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{accessory.emoji}</div>
                  <div className="text-xs font-medium">{accessory.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Узор</Label>
            <div className="grid grid-cols-3 gap-3">
              {patterns.map((pattern) => (
                <button
                  key={pattern.value}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    selectedPattern.value === pattern.value
                      ? 'border-accent bg-accent shadow-lg'
                      : 'border-gray-200 hover:border-accent/50'
                  }`}
                >
                  <div className="text-sm font-medium">{pattern.name}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreate}
            size="lg"
            className="w-full text-lg py-6 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:shadow-xl transition-all hover:scale-105"
          >
            <Icon name="Sparkles" size={24} className="mr-2" />
            Создать котика!
          </Button>
        </div>
      </Card>

      <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm shadow-xl border-2 border-primary/20 flex flex-col items-center justify-center animate-scale-in">
        <h3 className="text-2xl font-bold mb-8 text-center">Твой котик</h3>
        
        <div className="relative">
          <Avatar className="h-64 w-64 border-8 border-white shadow-2xl animate-bounce-gentle">
            <AvatarFallback
              style={{ backgroundColor: selectedColor.value }}
              className="text-8xl"
            >
              {selectedAccessory.emoji}
            </AvatarFallback>
          </Avatar>
          
          {selectedPattern.value === 'spotted' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl opacity-30">⬤⬤⬤</div>
            </div>
          )}
          {selectedPattern.value === 'striped' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-4">
              <div className="w-full h-2 bg-black/20 rounded"></div>
              <div className="w-full h-2 bg-black/20 rounded"></div>
              <div className="w-full h-2 bg-black/20 rounded"></div>
            </div>
          )}
        </div>

        {name && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-3xl font-bold text-primary">{name}</p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p>🎨 {selectedColor.name}</p>
              <p>✨ {selectedAccessory.name}</p>
              <p>📐 {selectedPattern.name}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AvatarGenerator;

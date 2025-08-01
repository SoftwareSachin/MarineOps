import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface DashboardHeaderProps {
  vesselName?: string;
  vesselPosition?: string;
  isOnline?: boolean;
}

export function DashboardHeader({ 
  vesselName = "MV Atlantic Explorer",
  vesselPosition = "37.7749°N, 122.4194°W",
  isOnline = false
}: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toUTCString().split(' ')[4] + ' UTC';
  };

  return (
    <header className="bg-slate-dark border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Ready Captain
          </h2>
          <p className="text-muted-foreground">
            {vesselName} • {vesselPosition}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-navigation-green animate-pulse' : 'bg-muted'
              }`}
            />
            <span className={`text-sm font-medium ${
              isOnline ? 'navigation-green' : 'text-muted-foreground'
            }`}>
              {isOnline ? 'Systems Online' : 'Systems Offline'}
            </span>
          </div>
          <div className="text-muted-foreground text-sm">
            {formatTime(currentTime)}
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}

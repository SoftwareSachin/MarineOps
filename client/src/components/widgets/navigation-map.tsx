import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Minus, Expand } from 'lucide-react';

interface NavigationMapProps {
  vesselPosition?: { latitude: number; longitude: number };
  environmentalData?: {
    windSpeed?: number;
    windDirection?: string;
    temperature?: number;
    seaState?: number;
  };
}

export function NavigationMapWidget({ 
  vesselPosition = { latitude: 37.7749, longitude: -122.4194 },
  environmentalData = {
    windSpeed: 12,
    windDirection: 'NW',
    temperature: 18,
    seaState: 3
  }
}: NavigationMapProps) {
  return (
    <Card className="widget-container">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <MapPin className="mr-2 h-5 w-5 maritime-blue" />
          Navigation & Route Optimization
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">ETA: 14:30 UTC</span>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Expand className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-96 relative">
          {/* Ocean background with shipping route */}
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg relative overflow-hidden">
            {/* Vessel position */}
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-safety-orange rounded-full border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute -top-8 -left-8 text-xs text-white font-medium bg-black bg-opacity-70 px-2 py-1 rounded whitespace-nowrap">
                MV Atlantic Explorer
              </div>
            </div>
            
            {/* Route waypoints */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-navigation-green rounded-full" />
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-navigation-green rounded-full" />
            
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path 
                d="M120 180 Q200 120 320 100 T480 120" 
                stroke="hsl(var(--navigation-green))" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="5,5" 
                opacity="0.8"
              />
            </svg>
            
            {/* Map controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="icon" variant="secondary" className="w-8 h-8 bg-black/50 hover:bg-black/70">
                <Plus className="h-3 w-3 text-white" />
              </Button>
              <Button size="icon" variant="secondary" className="w-8 h-8 bg-black/50 hover:bg-black/70">
                <Minus className="h-3 w-3 text-white" />
              </Button>
            </div>

            {/* Environmental overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 text-xs text-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-blue-400">🌪</span>
                  <span>{environmentalData.windSpeed} kts {environmentalData.windDirection}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">🌡</span>
                  <span>{environmentalData.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500">🌊</span>
                  <span>State {environmentalData.seaState}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

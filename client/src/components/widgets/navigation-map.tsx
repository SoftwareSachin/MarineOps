import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Plus, 
  Minus, 
  Expand, 
  Navigation, 
  Route, 
  Compass, 
  Target,
  Clock,
  Fuel,
  AlertTriangle,
  Anchor,
  Ship
} from 'lucide-react';

interface NavigationMapProps {
  vesselPosition?: { latitude: number; longitude: number };
  environmentalData?: {
    windSpeed?: number;
    windDirection?: string;
    temperature?: number;
    seaState?: number;
  };
}

interface Waypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  eta: string;
  distance: number;
  status: 'completed' | 'current' | 'upcoming';
}

interface RouteSegment {
  from: string;
  to: string;
  distance: number;
  bearing: number;
  estimatedDuration: number;
  fuelConsumption: number;
  weatherRisk: 'low' | 'medium' | 'high';
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
  const [selectedTab, setSelectedTab] = useState('map');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentBearing, setCurrentBearing] = useState(285);

  // Simulate dynamic bearing updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBearing(prev => prev + (Math.random() - 0.5) * 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const waypoints: Waypoint[] = [
    {
      id: '1',
      name: 'San Francisco Bay',
      latitude: 37.7749,
      longitude: -122.4194,
      eta: 'Current Position',
      distance: 0,
      status: 'completed'
    },
    {
      id: '2', 
      name: 'Point Reyes',
      latitude: 38.0597,
      longitude: -122.9442,
      eta: '14:30 UTC',
      distance: 28.5,
      status: 'current'
    },
    {
      id: '3',
      name: 'Monterey Bay',
      latitude: 36.6002,
      longitude: -121.8947,
      eta: '18:45 UTC',
      distance: 87.2,
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'Port of Los Angeles',
      latitude: 33.7365,
      longitude: -118.2637,
      eta: 'Tomorrow 08:15 UTC',
      distance: 312.8,
      status: 'upcoming'
    }
  ];

  const routeSegments: RouteSegment[] = [
    {
      from: 'Current Position',
      to: 'Point Reyes',
      distance: 28.5,
      bearing: 320,
      estimatedDuration: 2.5,
      fuelConsumption: 62,
      weatherRisk: 'low'
    },
    {
      from: 'Point Reyes',
      to: 'Monterey Bay',
      distance: 58.7,
      bearing: 165,
      estimatedDuration: 4.2,
      fuelConsumption: 145,
      weatherRisk: 'medium'
    },
    {
      from: 'Monterey Bay',
      to: 'Los Angeles',
      distance: 225.6,
      bearing: 145,
      estimatedDuration: 16.8,
      fuelConsumption: 560,
      weatherRisk: 'low'
    }
  ];

  const getVesselTransform = () => {
    return `rotate(${currentBearing - 90}deg)`;
  };

  return (
    <Card className="widget-container">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <Navigation className="mr-2 h-5 w-5 maritime-blue" />
          Navigation & Route Optimization
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs navigation-green">
            On Course
          </Badge>
          <Badge variant="outline" className="text-xs">
            {currentBearing.toFixed(0)}° {environmentalData.windDirection}
          </Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Expand className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="map" className="text-xs">Live Map</TabsTrigger>
            <TabsTrigger value="route" className="text-xs">Route Plan</TabsTrigger>
            <TabsTrigger value="optimization" className="text-xs">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="h-80 relative">
              {/* Enhanced Ocean background with depth gradient */}
              <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg relative overflow-hidden">
                
                {/* Depth contours */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute border border-blue-300 rounded-full"
                      style={{
                        width: `${(i + 1) * 80}px`,
                        height: `${(i + 1) * 80}px`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>

                {/* Compass rose */}
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-full bg-black/40 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-white" style={{ transform: `rotate(${currentBearing}deg)` }} />
                  <div className="absolute -top-6 text-[10px] text-white font-bold">N</div>
                </div>

                {/* Vessel with realistic orientation */}
                <div 
                  className="absolute transition-all duration-1000 ease-in-out"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div 
                    className="relative"
                    style={{ transform: getVesselTransform() }}
                  >
                    <Ship className="w-6 h-6 text-safety-orange drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-10 -left-12 text-xs text-white font-medium bg-black/70 px-2 py-1 rounded whitespace-nowrap border border-safety-orange/50">
                    MV Atlantic Explorer
                    <div className="text-[10px] text-safety-orange">
                      {vesselPosition.latitude.toFixed(4)}°N, {Math.abs(vesselPosition.longitude).toFixed(4)}°W
                    </div>
                  </div>
                  
                  {/* Wake trail */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 translate-y-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full animate-pulse" />
                  </div>
                </div>
                
                {/* Enhanced waypoints with animations */}
                {waypoints.map((waypoint, index) => (
                  <div
                    key={waypoint.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                      waypoint.status === 'current' ? 'animate-pulse' : ''
                    }`}
                    style={{
                      top: `${20 + index * 20}%`,
                      left: `${30 + index * 15}%`
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 border-white ${
                      waypoint.status === 'completed' ? 'bg-navigation-green' :
                      waypoint.status === 'current' ? 'bg-safety-orange' :
                      'bg-muted'
                    }`} />
                    <div className="absolute -top-8 -left-6 text-[10px] text-white bg-black/60 px-1 py-0.5 rounded whitespace-nowrap">
                      {waypoint.name}
                    </div>
                  </div>
                ))}
                
                {/* Dynamic route line with current progress */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--navigation-green))" stopOpacity="1" />
                      <stop offset="30%" stopColor="hsl(var(--safety-orange))" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M150 100 Q200 80 250 120 Q350 140 420 160 Q480 180 520 200" 
                    stroke="url(#routeGradient)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeDasharray="8,4" 
                    opacity="0.9"
                    className="animate-pulse"
                  />
                </svg>
                
                {/* Map controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="w-8 h-8 bg-black/60 hover:bg-black/80 border border-maritime-blue/30"
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 3))}
                  >
                    <Plus className="h-3 w-3 text-white" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="w-8 h-8 bg-black/60 hover:bg-black/80 border border-maritime-blue/30"
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
                  >
                    <Minus className="h-3 w-3 text-white" />
                  </Button>
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-black/60 hover:bg-black/80 border border-maritime-blue/30">
                    <Target className="h-3 w-3 text-white" />
                  </Button>
                </div>

                {/* Enhanced environmental overlay */}
                <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 text-xs text-white border border-maritime-blue/30 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span>Wind: {environmentalData.windSpeed} kts {environmentalData.windDirection}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      <span>Air: {environmentalData.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Sea State: {environmentalData.seaState}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-navigation-green rounded-full" />
                      <span>Visibility: Good</span>
                    </div>
                  </div>
                </div>

                {/* Speed and heading indicator */}
                <div className="absolute bottom-4 right-4 bg-black/80 rounded-lg p-3 text-xs text-white border border-maritime-blue/30 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-safety-orange">14.2</div>
                    <div>knots</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Heading: {currentBearing.toFixed(0)}°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="route">
            <div className="space-y-4 h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Route Waypoints</h4>
                <Badge className="bg-maritime-blue">4 Waypoints</Badge>
              </div>
              
              {waypoints.map((waypoint, index) => (
                <div 
                  key={waypoint.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg border transition-all ${
                    waypoint.status === 'current' ? 'bg-safety-orange/10 border-safety-orange/30' :
                    waypoint.status === 'completed' ? 'bg-navigation-green/10 border-navigation-green/30' :
                    'bg-accent border-border'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {waypoint.status === 'completed' ? (
                      <div className="w-6 h-6 bg-navigation-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    ) : waypoint.status === 'current' ? (
                      <div className="w-6 h-6 bg-safety-orange rounded-full flex items-center justify-center animate-pulse">
                        <Anchor className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-muted rounded-full border-2 border-border" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-foreground">{waypoint.name}</h5>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {waypoint.distance > 0 ? `${waypoint.distance} NM` : 'Current'}
                        </div>
                        <div className="text-xs text-muted-foreground">{waypoint.eta}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {waypoint.latitude.toFixed(4)}°N, {Math.abs(waypoint.longitude).toFixed(4)}°W
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="optimization">
            <div className="space-y-4 h-80 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Route Segments Analysis</h4>
                <Button size="sm" className="bg-maritime-blue hover:bg-blue-700 text-xs">
                  Optimize Route
                </Button>
              </div>
              
              {routeSegments.map((segment, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-foreground">{segment.from} → {segment.to}</h5>
                    <Badge variant="outline" className={`text-xs ${
                      segment.weatherRisk === 'high' ? 'border-red-500 text-red-400' :
                      segment.weatherRisk === 'medium' ? 'border-yellow-500 text-yellow-400' :
                      'border-green-500 text-green-400'
                    }`}>
                      {segment.weatherRisk.toUpperCase()} RISK
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Route className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="font-medium">{segment.distance} NM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Bearing:</span>
                      <span className="font-medium">{segment.bearing}°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{segment.estimatedDuration}h</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fuel className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fuel:</span>
                      <span className="font-medium">{segment.fuelConsumption}L</span>
                    </div>
                  </div>
                  
                  {segment.weatherRisk === 'medium' && (
                    <div className="flex items-center space-x-2 text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Moderate headwinds expected. Consider speed adjustment.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

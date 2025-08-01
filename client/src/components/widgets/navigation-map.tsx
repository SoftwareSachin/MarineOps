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

                {/* Enhanced waypoints with non-overlapping positioning */}
                {waypoints.map((waypoint, index) => {
                  const positions = [
                    { top: '75%', left: '30%', labelOffset: 'top' }, // San Francisco Bay
                    { top: '15%', left: '18%', labelOffset: 'bottom' }, // Point Reyes  
                    { top: '85%', left: '60%', labelOffset: 'top' }, // Monterey Bay
                    { top: '95%', left: '85%', labelOffset: 'left' }  // Port of Los Angeles
                  ];
                  const config = positions[index] || positions[0];
                  
                  return (
                    <div
                      key={waypoint.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 ${
                        waypoint.status === 'current' ? 'animate-pulse' : ''
                      }`}
                      style={{
                        top: config.top,
                        left: config.left
                      }}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        waypoint.status === 'completed' ? 'bg-navigation-green' :
                        waypoint.status === 'current' ? 'bg-safety-orange' :
                        'bg-blue-500'
                      }`} />
                      <div 
                        className={`absolute text-[10px] text-white bg-black/90 px-2 py-1 rounded whitespace-nowrap border border-white/30 shadow-lg ${
                          config.labelOffset === 'top' ? '-top-8 left-1/2 transform -translate-x-1/2' :
                          config.labelOffset === 'bottom' ? 'top-6 left-1/2 transform -translate-x-1/2' :
                          config.labelOffset === 'left' ? 'top-1/2 -left-20 transform -translate-y-1/2' :
                          'top-1/2 left-6 transform -translate-y-1/2'
                        }`}
                      >
                        {waypoint.name}
                      </div>
                    </div>
                  );
                })}

                {/* Vessel with realistic orientation - positioned away from waypoints */}
                <div 
                  className="absolute transition-all duration-1000 ease-in-out z-30"
                  style={{
                    top: '50%',
                    left: '45%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div 
                    className="relative"
                    style={{ transform: getVesselTransform() }}
                  >
                    <Ship className="w-8 h-8 text-safety-orange drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(255,165,0,0.6)]" />
                  </div>
                  {/* Vessel label positioned to avoid overlap */}
                  <div className="absolute -top-16 -left-20 text-xs text-white font-medium bg-black/90 px-3 py-2 rounded-lg whitespace-nowrap border border-safety-orange/50 shadow-xl">
                    <div className="text-safety-orange font-bold">MV Atlantic Explorer</div>
                    <div className="text-[10px] text-white/80 mt-1">
                      {vesselPosition.latitude.toFixed(4)}°N, {Math.abs(vesselPosition.longitude).toFixed(4)}°W
                    </div>
                  </div>
                  
                  {/* Wake trail */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 translate-y-4">
                    <div className="w-1 h-12 bg-gradient-to-b from-white/60 to-transparent rounded-full animate-pulse" 
                         style={{ transform: `rotate(${currentBearing - 90}deg)` }} />
                  </div>
                </div>
                
                {/* Dynamic route line connecting waypoints properly */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--navigation-green))" stopOpacity="1" />
                      <stop offset="50%" stopColor="hsl(var(--safety-orange))" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  {/* Route path connecting repositioned waypoints */}
                  <path 
                    d="M 30% 75% Q 20% 50% 18% 15% Q 35% 30% 45% 50% Q 55% 70% 60% 85% Q 75% 90% 85% 95%" 
                    stroke="url(#routeGradient)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeDasharray="8,4" 
                    opacity="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Current position indicator on route */}
                  <circle 
                    cx="45%" 
                    cy="50%" 
                    r="3" 
                    fill="hsl(var(--safety-orange))" 
                    className="animate-pulse"
                    opacity="0.8"
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

                {/* Enhanced environmental overlay - positioned to avoid waypoints */}
                <div className="absolute bottom-4 left-4 bg-black/90 rounded-lg p-3 text-xs text-white border border-maritime-blue/40 backdrop-blur-sm shadow-lg z-40">
                  <div className="grid grid-cols-2 gap-3 min-w-[280px]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse flex-shrink-0" />
                      <span>Wind: {environmentalData.windSpeed?.toFixed(1) || '12.0'} kts {environmentalData.windDirection || 'NW'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                      <span>Air: {environmentalData.temperature?.toFixed(0) || '18'}°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <span>Sea State: {environmentalData.seaState || 3}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-navigation-green rounded-full flex-shrink-0" />
                      <span>Visibility: Good</span>
                    </div>
                  </div>
                </div>

                {/* Speed and heading indicator - improved positioning */}
                <div className="absolute bottom-4 right-4 bg-black/85 rounded-lg p-4 text-white border border-maritime-blue/40 backdrop-blur-sm shadow-lg">
                  <div className="text-center min-w-[80px]">
                    <div className="text-2xl font-bold text-safety-orange mb-1">14.2</div>
                    <div className="text-xs text-white/80 mb-2">knots</div>
                    <div className="text-xs text-muted-foreground border-t border-white/20 pt-2">
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

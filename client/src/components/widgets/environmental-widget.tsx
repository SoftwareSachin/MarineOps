import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Wind, Thermometer, Eye, Waves } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { EnvironmentalData } from '@shared/schema';

interface EnvironmentalWidgetProps {
  vesselId?: string;
}

export function EnvironmentalWidget({ vesselId }: EnvironmentalWidgetProps) {
  const { data: envData } = useQuery({
    queryKey: ['/api/vessels', vesselId, 'environmental', 'latest'],
    queryFn: async () => {
      const response = await fetch(`/api/vessels/${vesselId}/environmental/latest`);
      return response.json() as Promise<EnvironmentalData>;
    },
    enabled: !!vesselId
  });

  const conditions = [
    {
      icon: Wind,
      label: 'Wind',
      value: `${envData?.windSpeed?.toFixed(1) || '12.0'} kts`,
      secondary: envData?.windDirection || 'NW',
      color: 'text-blue-400'
    },
    {
      icon: Waves,
      label: 'Sea State',
      value: envData?.seaState?.toString() || '3',
      secondary: `${envData?.waveHeight?.toFixed(1) || '1.2'}m`,
      color: 'text-blue-500'
    },
    {
      icon: Thermometer,
      label: 'Air Temp',
      value: `${envData?.airTemp?.toFixed(0) || '18'}°C`,
      secondary: `Water: ${envData?.waterTemp?.toFixed(0) || '16'}°C`,
      color: 'text-yellow-400'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${envData?.visibility?.toFixed(1) || '8.5'} km`,
      secondary: 'Good',
      color: 'text-muted-foreground'
    }
  ];

  return (
    <Card className="widget-container">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Cloud className="mr-2 h-5 w-5 maritime-blue" />
          Environmental Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.map((condition, index) => {
          const Icon = condition.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className={`text-xl ${condition.color}`} />
                <div>
                  <div className="text-sm text-muted-foreground">{condition.label}</div>
                  <div className="text-lg font-semibold text-foreground">{condition.value}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {condition.label === 'Wind' ? 'Direction' : 
                   condition.label === 'Sea State' ? 'Wave Height' :
                   condition.label === 'Air Temp' ? 'Water Temp' : 'Status'}
                </div>
                <div className={`text-lg font-semibold ${
                  condition.secondary === 'Good' ? 'navigation-green' : 'text-foreground'
                }`}>
                  {condition.secondary}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

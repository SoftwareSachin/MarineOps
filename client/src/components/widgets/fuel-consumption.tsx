import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PerformanceMetrics } from '@shared/schema';

interface FuelConsumptionWidgetProps {
  vesselId?: string;
}

export function FuelConsumptionWidget({ vesselId }: FuelConsumptionWidgetProps) {
  const { data: metrics = [] } = useQuery({
    queryKey: ['/api/vessels', vesselId, 'performance', 'history'],
    queryFn: async () => {
      const response = await fetch(`/api/vessels/${vesselId}/performance/history?hours=24`);
      return response.json() as Promise<PerformanceMetrics[]>;
    },
    enabled: !!vesselId
  });

  const { data: latest } = useQuery({
    queryKey: ['/api/vessels', vesselId, 'performance', 'latest'],
    queryFn: async () => {
      const response = await fetch(`/api/vessels/${vesselId}/performance/latest`);
      return response.json() as Promise<PerformanceMetrics>;
    },
    enabled: !!vesselId
  });

  // Transform data for chart
  const chartData = metrics.map((metric, index) => ({
    time: `${String(Math.floor(index * 24 / metrics.length)).padStart(2, '0')}:00`,
    fuelRate: metric.fuelRate
  }));

  const currentRate = latest?.fuelRate || 24.5;
  const dailyTotal = metrics.reduce((sum, metric) => sum + (metric.fuelRate || 0), 0);
  const remaining = 3647; // Mock remaining fuel
  const remainingPercent = (remaining / 4647) * 100;

  return (
    <Card className="widget-container">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Fuel className="mr-2 h-5 w-5 maritime-blue" />
          Fuel Consumption
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Rate</span>
            <span className="text-foreground font-medium">{currentRate.toFixed(1)} L/hr</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Total</span>
            <span className="text-foreground font-medium">{dailyTotal.toFixed(0)} L</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="text-navigation-green font-medium">
              {remaining} L ({remainingPercent.toFixed(0)}%)
            </span>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Line 
                type="monotone" 
                dataKey="fuelRate" 
                stroke="hsl(var(--maritime-blue))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

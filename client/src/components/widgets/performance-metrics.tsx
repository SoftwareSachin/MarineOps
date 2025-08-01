import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GaugeChart } from '@/components/charts/gauge-chart';
import { Gauge } from 'lucide-react';
import { PerformanceMetrics } from '@shared/schema';

interface PerformanceMetricsWidgetProps {
  metrics?: PerformanceMetrics;
}

export function PerformanceMetricsWidget({ metrics }: PerformanceMetricsWidgetProps) {
  const speedData = {
    value: metrics?.speed || 14.2,
    max: 25,
    unit: 'kts',
    label: 'Current Speed',
    color: 'hsl(var(--navigation-green))'
  };

  const rpmData = {
    value: metrics?.rpm || 1450,
    max: 2000,
    unit: 'RPM',
    label: 'Engine RPM',
    color: 'hsl(var(--safety-orange))'
  };

  const fuelEfficiency = metrics?.fuelEfficiency ? (metrics.fuelEfficiency * 100) : 78;

  return (
    <Card className="widget-container">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Gauge className="mr-2 h-5 w-5 maritime-blue" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Speed Gauge */}
        <div className="text-center">
          <GaugeChart data={speedData} />
        </div>

        {/* Engine RPM */}
        <div className="text-center">
          <GaugeChart data={rpmData} />
        </div>

        {/* Fuel Efficiency */}
        <div className="bg-accent rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Fuel Efficiency</span>
            <span className="text-sm font-medium navigation-green">+12%</span>
          </div>
          <Progress value={fuelEfficiency} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {fuelEfficiency.toFixed(1)}% of optimal
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

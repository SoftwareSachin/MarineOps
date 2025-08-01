import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gauge, Thermometer, Fuel, Zap } from 'lucide-react';
import { PerformanceMetrics } from '@shared/schema';

interface PerformanceMetricsWidgetProps {
  metrics?: PerformanceMetrics;
}

interface MeterProps {
  value: number;
  max: number;
  min?: number;
  label: string;
  unit: string;
  color: string;
  icon: React.ReactNode;
  dangerZone?: { min: number; max: number };
  warningZone?: { min: number; max: number };
}

function MaritimeMeter({ value, max, min = 0, label, unit, color, icon, dangerZone, warningZone }: MeterProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine status color
  let statusColor = color;
  let statusText = 'NORMAL';
  
  if (dangerZone && value >= dangerZone.min && value <= dangerZone.max) {
    statusColor = '#ef4444';
    statusText = 'DANGER';
  } else if (warningZone && value >= warningZone.min && value <= warningZone.max) {
    statusColor = '#f59e0b';
    statusText = 'CAUTION';
  }

  return (
    <div className="relative flex flex-col items-center p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700 shadow-lg">
      {/* Meter Circle */}
      <div className="relative w-32 h-32 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="8"
          />
          {/* Warning zone arc if exists */}
          {warningZone && (
            <circle
              cx="72"
              cy="72"
              r={radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (((warningZone.max - min) / (max - min)) * 100 / 100) * circumference}
              opacity="0.3"
              strokeLinecap="round"
            />
          )}
          {/* Danger zone arc if exists */}
          {dangerZone && (
            <circle
              cx="72"
              cy="72"
              r={radius}
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (((dangerZone.max - min) / (max - min)) * 100 / 100) * circumference}
              opacity="0.3"
              strokeLinecap="round"
            />
          )}
          {/* Value arc */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${statusColor}40)`
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1" style={{ color: statusColor }}>
            {icon}
          </div>
          <div className="text-2xl font-bold text-white">
            {value.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            {unit}
          </div>
        </div>
      </div>
      
      {/* Label and Status */}
      <div className="text-center">
        <h4 className="text-sm font-medium text-white mb-1">{label}</h4>
        <Badge 
          variant="outline" 
          className={`text-xs border-0 ${
            statusColor === '#ef4444' ? 'bg-red-900/50 text-red-300' :
            statusColor === '#f59e0b' ? 'bg-yellow-900/50 text-yellow-300' :
            'bg-green-900/50 text-green-300'
          }`}
        >
          {statusText}
        </Badge>
      </div>
      
      {/* Scale markers */}
      <div className="flex justify-between w-full text-xs text-slate-500 mt-2 px-2">
        <span>{min}</span>
        <span>{((max - min) / 2 + min).toFixed(0)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function PerformanceMetricsWidget({ metrics }: PerformanceMetricsWidgetProps) {
  const currentSpeed = metrics?.speed || 14.2;
  const currentRPM = metrics?.rpm || 1450;
  const currentTemp = metrics?.engineTemp || 75;
  const currentFuelRate = metrics?.fuelRate || 24.5;

  return (
    <Card className="widget-container bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-white">
          <Gauge className="mr-2 h-5 w-5 text-blue-400" />
          Engine Performance
        </CardTitle>
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <span>Real-time Monitoring</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>All Systems</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Meters Row */}
        <div className="grid grid-cols-2 gap-4">
          <MaritimeMeter
            value={currentSpeed}
            max={25}
            min={0}
            label="Vessel Speed"
            unit="KNOTS"
            color="#10b981"
            icon={<Gauge className="w-5 h-5" />}
            warningZone={{ min: 20, max: 23 }}
            dangerZone={{ min: 23, max: 25 }}
          />
          
          <MaritimeMeter
            value={currentRPM}
            max={2000}
            min={800}
            label="Engine RPM"
            unit="RPM"
            color="#f59e0b"
            icon={<Zap className="w-5 h-5" />}
            warningZone={{ min: 1700, max: 1850 }}
            dangerZone={{ min: 1850, max: 2000 }}
          />
        </div>

        {/* Secondary Meters Row */}
        <div className="grid grid-cols-2 gap-4">
          <MaritimeMeter
            value={currentTemp}
            max={100}
            min={40}
            label="Engine Temp"
            unit="°C"
            color="#06b6d4"
            icon={<Thermometer className="w-5 h-5" />}
            warningZone={{ min: 80, max: 90 }}
            dangerZone={{ min: 90, max: 100 }}
          />
          
          <MaritimeMeter
            value={currentFuelRate}
            max={40}
            min={10}
            label="Fuel Rate"
            unit="L/HR"
            color="#8b5cf6"
            icon={<Fuel className="w-5 h-5" />}
            warningZone={{ min: 30, max: 35 }}
            dangerZone={{ min: 35, max: 40 }}
          />
        </div>

        {/* System Status Summary */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Overall Efficiency</span>
            <span className="text-green-400 font-medium">
              {((metrics?.fuelEfficiency || 0.78) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-300">Engine Load</span>
            <span className="text-blue-400 font-medium">
              {(currentRPM / 2000 * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

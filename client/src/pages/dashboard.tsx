import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { NavigationMapWidget } from '@/components/widgets/navigation-map';
import { PerformanceMetricsWidget } from '@/components/widgets/performance-metrics';
import { AlertsWidget } from '@/components/widgets/alerts-widget';
import { FuelConsumptionWidget } from '@/components/widgets/fuel-consumption';
import { EnvironmentalWidget } from '@/components/widgets/environmental-widget';
import { MaintenanceWidget } from '@/components/widgets/maintenance-widget';
import { useWebSocket } from '@/hooks/use-websocket';
import { Vessel, PerformanceMetrics, EnvironmentalData } from '@shared/schema';

export default function Dashboard() {
  const [vesselId, setVesselId] = useState<string>('');
  const [latestMetrics, setLatestMetrics] = useState<PerformanceMetrics | null>(null);
  const [latestEnvironmental, setLatestEnvironmental] = useState<EnvironmentalData | null>(null);
  
  const { isConnected, lastMessage } = useWebSocket();

  // Fetch vessels
  const { data: vessels = [] } = useQuery({
    queryKey: ['/api/vessels'],
    queryFn: async () => {
      const response = await fetch('/api/vessels');
      return response.json() as Promise<Vessel[]>;
    }
  });

  // Fetch alerts count
  const { data: alerts = [] } = useQuery({
    queryKey: ['/api/alerts', vesselId],
    queryFn: async () => {
      const url = vesselId ? `/api/alerts?vesselId=${vesselId}` : '/api/alerts';
      const response = await fetch(url);
      return response.json();
    }
  });

  // Set the first vessel as default
  useEffect(() => {
    if (vessels.length > 0 && !vesselId) {
      setVesselId(vessels[0].id);
    }
  }, [vessels, vesselId]);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'performance_update':
          setLatestMetrics(lastMessage.data);
          break;
        case 'environmental_update':
          setLatestEnvironmental(lastMessage.data);
          break;
      }
    }
  }, [lastMessage]);

  const currentVessel = vessels.find(v => v.id === vesselId);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar alertCount={alerts.length} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          vesselName={currentVessel?.name}
          vesselPosition={
            currentVessel?.position 
              ? `${currentVessel.position.latitude.toFixed(4)}°N, ${Math.abs(currentVessel.position.longitude).toFixed(4)}°W`
              : undefined
          }
          isOnline={isConnected}
        />

        {/* Dashboard Grid */}
        <main className="flex-1 p-6 bg-background overflow-auto">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Navigation Map - Large widget */}
            <div className="col-span-12 lg:col-span-8">
              <NavigationMapWidget
                vesselPosition={currentVessel?.position}
                environmentalData={latestEnvironmental ? {
                  windSpeed: latestEnvironmental.windSpeed,
                  windDirection: latestEnvironmental.windDirection,
                  temperature: latestEnvironmental.airTemp,
                  seaState: latestEnvironmental.seaState
                } : undefined}
              />
            </div>

            {/* Performance Metrics */}
            <div className="col-span-12 lg:col-span-4">
              <PerformanceMetricsWidget metrics={latestMetrics || undefined} />
            </div>

            {/* Alerts Widget */}
            <div className="col-span-12 lg:col-span-6">
              <AlertsWidget vesselId={vesselId} />
            </div>

            {/* Fuel Consumption Chart */}
            <div className="col-span-12 lg:col-span-6">
              <FuelConsumptionWidget vesselId={vesselId} />
            </div>

            {/* Environmental Conditions */}
            <div className="col-span-12 lg:col-span-4">
              <EnvironmentalWidget vesselId={vesselId} />
            </div>

            {/* Maintenance Schedule */}
            <div className="col-span-12 lg:col-span-8">
              <MaintenanceWidget vesselId={vesselId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

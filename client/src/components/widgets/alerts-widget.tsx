import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Check } from 'lucide-react';
import { Alert } from '@shared/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AlertsWidgetProps {
  vesselId?: string;
}

export function AlertsWidget({ vesselId }: AlertsWidgetProps) {
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['/api/alerts', ...(vesselId ? [vesselId] : [])],
    queryFn: async () => {
      const url = vesselId ? `/api/alerts?vesselId=${vesselId}` : '/api/alerts';
      const response = await fetch(url);
      return response.json() as Promise<Alert[]>;
    }
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest('PATCH', `/api/alerts/${alertId}/acknowledge`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-900/30 border-red-700';
      case 'medium': return 'bg-yellow-900/30 border-yellow-700';
      case 'low': return 'bg-blue-900/30 border-blue-700';
      default: return 'bg-blue-900/30 border-blue-700';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'alert-red';
      case 'medium': return 'caution-yellow';
      case 'low': return 'text-blue-400';
      default: return 'text-blue-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hour ago`;
    return `${Math.floor(diffMins / 1440)} day ago`;
  };

  return (
    <Card className="widget-container">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <AlertTriangle className="mr-2 h-5 w-5 safety-orange" />
          Active Alerts
        </CardTitle>
        <Badge variant="destructive" className="bg-alert-red">
          {alerts.length} Active
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading alerts...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center text-muted-foreground">No active alerts</div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 p-3 border rounded-lg ${getSeverityColor(alert.severity)}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'high' ? 'bg-alert-red animate-pulse' :
                    alert.severity === 'medium' ? 'bg-caution-yellow' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${getSeverityBadgeColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => acknowledgeMutation.mutate(alert.id)}
                    disabled={acknowledgeMutation.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

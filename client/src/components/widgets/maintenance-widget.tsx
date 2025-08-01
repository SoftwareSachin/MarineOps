import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wrench, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MaintenanceSchedule } from '@shared/schema';

interface MaintenanceWidgetProps {
  vesselId?: string;
}

export function MaintenanceWidget({ vesselId }: MaintenanceWidgetProps) {
  const { data: schedule = [], isLoading } = useQuery({
    queryKey: ['/api/vessels', vesselId, 'maintenance'],
    queryFn: async () => {
      const response = await fetch(`/api/vessels/${vesselId}/maintenance`);
      return response.json() as Promise<MaintenanceSchedule[]>;
    },
    enabled: !!vesselId
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-900/20 border-yellow-700';
      case 'in_progress': return 'bg-blue-900/20 border-blue-700';
      case 'completed': return 'bg-green-900/20 border-green-700';
      default: return 'bg-gray-900/20 border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <AlertCircle className="w-3 h-3 text-yellow-400" />;
      case 'in_progress': return <Clock className="w-3 h-3 text-blue-400 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-3 h-3 text-green-400" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const formatTimeUntil = (scheduledDate: Date) => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diffMs = scheduled.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffMs < 0) return 'Overdue';
    if (diffDays > 0) return `Due in ${diffDays} days`;
    if (diffHours > 0) return `Due in ${diffHours} hours`;
    return 'Due soon';
  };

  return (
    <Card className="widget-container">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <Wrench className="mr-2 h-5 w-5 maritime-blue" />
          Maintenance Schedule
        </CardTitle>
        <Button size="sm" className="bg-maritime-blue hover:bg-blue-700">
          Schedule New
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading maintenance schedule...</div>
            ) : schedule.length === 0 ? (
              <div className="text-center text-muted-foreground">No maintenance scheduled</div>
            ) : (
              schedule.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-4 p-3 border rounded-lg ${getStatusColor(task.status)}`}
                >
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {task.status === 'scheduled' ? formatTimeUntil(task.scheduledDate) :
                         task.status === 'in_progress' ? 'In Progress' :
                         'Completed'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {task.estimatedDuration} hours
                      </span>
                      <span className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {task.assignedTo}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    {task.status === 'completed' ? 'View Report' : 
                     task.status === 'in_progress' ? 'Update Status' : 
                     'View Details'}
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

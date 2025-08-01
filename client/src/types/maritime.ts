export interface VesselPosition {
  latitude: number;
  longitude: number;
}

export interface RealtimeData {
  type: 'performance_update' | 'environmental_update' | 'alert_update' | 'connection';
  data?: any;
  message?: string;
}

export interface AlertSeverity {
  HIGH: 'high';
  MEDIUM: 'medium';
  LOW: 'low';
  INFO: 'info';
}

export interface MaintenanceStatus {
  SCHEDULED: 'scheduled';
  IN_PROGRESS: 'in_progress';
  COMPLETED: 'completed';
}

export interface PerformanceGaugeData {
  value: number;
  max: number;
  unit: string;
  label: string;
  color: string;
}

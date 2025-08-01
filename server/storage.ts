import { 
  type User, 
  type InsertUser, 
  type Vessel, 
  type InsertVessel,
  type PerformanceMetrics,
  type InsertPerformanceMetrics,
  type Alert,
  type InsertAlert,
  type MaintenanceSchedule,
  type InsertMaintenanceSchedule,
  type EnvironmentalData,
  type InsertEnvironmentalData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vessel methods
  getVessels(): Promise<Vessel[]>;
  getVessel(id: string): Promise<Vessel | undefined>;
  createVessel(vessel: InsertVessel): Promise<Vessel>;
  updateVessel(id: string, vessel: Partial<Vessel>): Promise<Vessel | undefined>;
  
  // Performance metrics
  getLatestPerformanceMetrics(vesselId: string): Promise<PerformanceMetrics | undefined>;
  getPerformanceMetricsHistory(vesselId: string, hours: number): Promise<PerformanceMetrics[]>;
  createPerformanceMetrics(metrics: InsertPerformanceMetrics): Promise<PerformanceMetrics>;
  
  // Alerts
  getActiveAlerts(vesselId?: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: string): Promise<Alert | undefined>;
  
  // Maintenance
  getMaintenanceSchedule(vesselId: string): Promise<MaintenanceSchedule[]>;
  createMaintenanceTask(task: InsertMaintenanceSchedule): Promise<MaintenanceSchedule>;
  updateMaintenanceTask(id: string, updates: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule | undefined>;
  
  // Environmental data
  getLatestEnvironmentalData(vesselId: string): Promise<EnvironmentalData | undefined>;
  createEnvironmentalData(data: InsertEnvironmentalData): Promise<EnvironmentalData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private vessels: Map<string, Vessel> = new Map();
  private performanceMetrics: Map<string, PerformanceMetrics[]> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private maintenanceSchedule: Map<string, MaintenanceSchedule[]> = new Map();
  private environmentalData: Map<string, EnvironmentalData[]> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample vessel
    const vesselId = randomUUID();
    const vessel: Vessel = {
      id: vesselId,
      name: "MV Atlantic Explorer",
      type: "container",
      position: { latitude: 37.7749, longitude: -122.4194 },
      speed: 14.2,
      heading: 285,
      status: "active",
      createdAt: new Date(),
    };
    this.vessels.set(vesselId, vessel);

    // Initialize performance metrics
    this.performanceMetrics.set(vesselId, []);
    
    // Initialize environmental data
    this.environmentalData.set(vesselId, []);
    
    // Initialize maintenance schedule with realistic tasks
    const maintenanceTasks = [
      {
        id: randomUUID(),
        vesselId: vesselId,
        title: "Engine Oil Change",
        description: "Scheduled engine oil and filter replacement for main engine",
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        estimatedDuration: 4,
        assignedTo: "Chief Engineer Martinez",
        status: "scheduled" as const,
        priority: "high" as const,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        vesselId: vesselId,
        title: "Navigation Equipment Calibration",
        description: "Quarterly calibration of GPS and radar systems",
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        estimatedDuration: 6,
        assignedTo: "Navigation Officer Chen",
        status: "scheduled" as const,
        priority: "medium" as const,
        createdAt: new Date()
      },
      {
        id: randomUUID(),
        vesselId: vesselId,
        title: "Hull Inspection",
        description: "Underwater hull inspection and cleaning",
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday (in progress)
        estimatedDuration: 8,
        assignedTo: "Marine Inspector Thompson",
        status: "in_progress" as const,
        priority: "high" as const,
        createdAt: new Date()
      }
    ];
    this.maintenanceSchedule.set(vesselId, maintenanceTasks);

    // Add some initial alerts
    const alerts = [
      {
        id: randomUUID(),
        vesselId: vesselId,
        severity: "medium" as const,
        title: "Fuel Consumption Above Normal",
        description: "Current fuel consumption is 8% higher than optimal for current conditions",
        category: "engine" as const,
        acknowledged: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        id: randomUUID(),
        vesselId: vesselId,
        severity: "low" as const,
        title: "Weather Advisory",
        description: "Moderate headwinds expected in next 4 hours. Consider speed adjustment",
        category: "navigation" as const,
        acknowledged: false,
        createdAt: new Date(Date.now() - 20 * 60 * 1000) // 20 minutes ago
      }
    ];
    
    alerts.forEach(alert => this.alerts.set(alert.id, alert));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      role: insertUser.role || "viewer"
    };
    this.users.set(id, user);
    return user;
  }

  // Vessel methods
  async getVessels(): Promise<Vessel[]> {
    return Array.from(this.vessels.values());
  }

  async getVessel(id: string): Promise<Vessel | undefined> {
    return this.vessels.get(id);
  }

  async createVessel(insertVessel: InsertVessel): Promise<Vessel> {
    const id = randomUUID();
    const vessel: Vessel = { 
      ...insertVessel, 
      id, 
      createdAt: new Date(),
      speed: insertVessel.speed || 0,
      heading: insertVessel.heading || 0,
      status: insertVessel.status || "active"
    };
    this.vessels.set(id, vessel);
    return vessel;
  }

  async updateVessel(id: string, updates: Partial<Vessel>): Promise<Vessel | undefined> {
    const vessel = this.vessels.get(id);
    if (!vessel) return undefined;
    
    const updatedVessel = { ...vessel, ...updates };
    this.vessels.set(id, updatedVessel);
    return updatedVessel;
  }

  // Performance metrics
  async getLatestPerformanceMetrics(vesselId: string): Promise<PerformanceMetrics | undefined> {
    const metrics = this.performanceMetrics.get(vesselId) || [];
    return metrics[metrics.length - 1];
  }

  async getPerformanceMetricsHistory(vesselId: string, hours: number): Promise<PerformanceMetrics[]> {
    const metrics = this.performanceMetrics.get(vesselId) || [];
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return metrics.filter(m => m.timestamp && m.timestamp > cutoff);
  }

  async createPerformanceMetrics(insertMetrics: InsertPerformanceMetrics): Promise<PerformanceMetrics> {
    const id = randomUUID();
    const metrics: PerformanceMetrics = { 
      ...insertMetrics, 
      id, 
      timestamp: new Date() 
    };
    
    const vesselMetrics = this.performanceMetrics.get(insertMetrics.vesselId) || [];
    vesselMetrics.push(metrics);
    this.performanceMetrics.set(insertMetrics.vesselId, vesselMetrics);
    
    return metrics;
  }

  // Alerts
  async getActiveAlerts(vesselId?: string): Promise<Alert[]> {
    const allAlerts = Array.from(this.alerts.values());
    return allAlerts.filter(alert => 
      !alert.acknowledged && 
      (vesselId ? alert.vesselId === vesselId : true)
    );
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id, 
      createdAt: new Date(),
      acknowledged: insertAlert.acknowledged || false
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async acknowledgeAlert(id: string): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, acknowledged: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  // Maintenance
  async getMaintenanceSchedule(vesselId: string): Promise<MaintenanceSchedule[]> {
    return this.maintenanceSchedule.get(vesselId) || [];
  }

  async createMaintenanceTask(insertTask: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    const id = randomUUID();
    const task: MaintenanceSchedule = { 
      ...insertTask, 
      id, 
      createdAt: new Date(),
      status: insertTask.status || "scheduled",
      priority: insertTask.priority || "medium"
    };
    
    const vesselTasks = this.maintenanceSchedule.get(insertTask.vesselId) || [];
    vesselTasks.push(task);
    this.maintenanceSchedule.set(insertTask.vesselId, vesselTasks);
    
    return task;
  }

  async updateMaintenanceTask(id: string, updates: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule | undefined> {
    for (const [vesselId, tasks] of Array.from(this.maintenanceSchedule.entries())) {
      const taskIndex = tasks.findIndex((task: MaintenanceSchedule) => task.id === id);
      if (taskIndex !== -1) {
        const updatedTask = { ...tasks[taskIndex], ...updates };
        tasks[taskIndex] = updatedTask;
        this.maintenanceSchedule.set(vesselId, tasks);
        return updatedTask;
      }
    }
    return undefined;
  }

  // Environmental data
  async getLatestEnvironmentalData(vesselId: string): Promise<EnvironmentalData | undefined> {
    const data = this.environmentalData.get(vesselId) || [];
    return data[data.length - 1];
  }

  async createEnvironmentalData(insertData: InsertEnvironmentalData): Promise<EnvironmentalData> {
    const id = randomUUID();
    const data: EnvironmentalData = { ...insertData, id, timestamp: new Date() };
    
    const vesselData = this.environmentalData.get(insertData.vesselId) || [];
    vesselData.push(data);
    this.environmentalData.set(insertData.vesselId, vesselData);
    
    return data;
  }
}

export const storage = new MemStorage();

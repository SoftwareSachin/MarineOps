import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertAlertSchema, insertMaintenanceScheduleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Vessel routes
  app.get("/api/vessels", async (req, res) => {
    try {
      const vessels = await storage.getVessels();
      res.json(vessels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vessels" });
    }
  });

  app.get("/api/vessels/:id", async (req, res) => {
    try {
      const vessel = await storage.getVessel(req.params.id);
      if (!vessel) {
        return res.status(404).json({ error: "Vessel not found" });
      }
      res.json(vessel);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vessel" });
    }
  });

  // Performance metrics routes
  app.get("/api/vessels/:id/performance/latest", async (req, res) => {
    try {
      const metrics = await storage.getLatestPerformanceMetrics(req.params.id);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance metrics" });
    }
  });

  app.get("/api/vessels/:id/performance/history", async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const metrics = await storage.getPerformanceMetricsHistory(req.params.id, hours);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance history" });
    }
  });

  // Alerts routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const vesselId = req.query.vesselId as string;
      const alerts = await storage.getActiveAlerts(vesselId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/acknowledge", async (req, res) => {
    try {
      const alert = await storage.acknowledgeAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to acknowledge alert" });
    }
  });

  // Maintenance routes
  app.get("/api/vessels/:id/maintenance", async (req, res) => {
    try {
      const schedule = await storage.getMaintenanceSchedule(req.params.id);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance schedule" });
    }
  });

  app.post("/api/vessels/:id/maintenance", async (req, res) => {
    try {
      const taskData = insertMaintenanceScheduleSchema.parse({
        ...req.body,
        vesselId: req.params.id
      });
      const task = await storage.createMaintenanceTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid maintenance task data" });
    }
  });

  app.patch("/api/maintenance/:id", async (req, res) => {
    try {
      const task = await storage.updateMaintenanceTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Maintenance task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update maintenance task" });
    }
  });

  // Environmental data routes
  app.get("/api/vessels/:id/environmental/latest", async (req, res) => {
    try {
      const data = await storage.getLatestEnvironmentalData(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environmental data" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    // Send initial data
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to marine vessel operations' }));
    
    // Simulate real-time data updates
    const interval = setInterval(async () => {
      try {
        const vessels = await storage.getVessels();
        if (vessels.length > 0) {
          const vessel = vessels[0]; // Use first vessel for demo
          
          // Generate realistic performance metrics
          const performanceMetrics = await storage.createPerformanceMetrics({
            vesselId: vessel.id,
            speed: 13.5 + Math.random() * 2,
            rpm: 1400 + Math.random() * 100,
            fuelRate: 24 + Math.random() * 2,
            engineTemp: 70 + Math.random() * 10,
            fuelEfficiency: 0.75 + Math.random() * 0.15
          });

          // Generate environmental data
          const environmentalData = await storage.createEnvironmentalData({
            vesselId: vessel.id,
            windSpeed: 10 + Math.random() * 5,
            windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            seaState: Math.floor(Math.random() * 5) + 1,
            waveHeight: 0.5 + Math.random() * 2,
            airTemp: 15 + Math.random() * 10,
            waterTemp: 12 + Math.random() * 8,
            visibility: 5 + Math.random() * 10
          });

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'performance_update',
              data: performanceMetrics
            }));
            
            ws.send(JSON.stringify({
              type: 'environmental_update',
              data: environmentalData
            }));
          }
        }
      } catch (error) {
        console.error('Error generating real-time data:', error);
      }
    }, 5000); // Update every 5 seconds

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clearInterval(interval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(interval);
    });
  });

  return httpServer;
}

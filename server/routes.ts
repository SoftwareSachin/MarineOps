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
          
          // Generate realistic performance metrics with some variability
          const baseSpeed = 14.2;
          const speedVariation = (Math.random() - 0.5) * 1.5;
          const currentSpeed = Math.max(baseSpeed + speedVariation, 10);
          
          const performanceMetrics = await storage.createPerformanceMetrics({
            vesselId: vessel.id,
            speed: currentSpeed,
            rpm: 1400 + (currentSpeed - baseSpeed) * 50 + Math.random() * 50,
            fuelRate: 24 + (currentSpeed - baseSpeed) * 0.8 + Math.random() * 1.5,
            engineTemp: 75 + Math.random() * 8,
            fuelEfficiency: Math.max(0.65 + Math.random() * 0.2, 0.5)
          });

          // Generate environmental data with seasonal patterns
          const environmentalData = await storage.createEnvironmentalData({
            vesselId: vessel.id,
            windSpeed: 12 + Math.sin(Date.now() / 100000) * 3 + Math.random() * 2,
            windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            seaState: Math.floor(Math.random() * 4) + 2,
            waveHeight: 1.0 + Math.random() * 1.5,
            airTemp: 18 + Math.random() * 6,
            waterTemp: 16 + Math.random() * 4,
            visibility: 8 + Math.random() * 7
          });

          // Occasionally generate alerts based on conditions
          if (Math.random() < 0.1) { // 10% chance every 5 seconds
            const alertTypes = [
              {
                severity: 'low' as const,
                title: 'Course Deviation Minor',
                description: 'Slight deviation from planned route due to traffic',
                category: 'navigation' as const
              },
              {
                severity: 'medium' as const,
                title: 'Engine Temperature Rising',
                description: `Engine temperature at ${performanceMetrics.engineTemp.toFixed(1)}°C, monitoring closely`,
                category: 'engine' as const
              },
              {
                severity: 'low' as const,
                title: 'Weather Update',
                description: `Wind speed increased to ${environmentalData.windSpeed.toFixed(1)} knots`,
                category: 'safety' as const
              }
            ];
            
            const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            const newAlert = await storage.createAlert({
              vesselId: vessel.id,
              ...randomAlert
            });

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'alert_update',
                data: newAlert
              }));
            }
          }

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'performance_update',
              data: performanceMetrics
            }));
            
            ws.send(JSON.stringify({
              type: 'environmental_update',
              data: environmentalData
            }));

            // Update vessel position slightly
            const currentPos = vessel.position as { latitude: number; longitude: number };
            const newPosition = {
              latitude: currentPos.latitude + (Math.random() - 0.5) * 0.001,
              longitude: currentPos.longitude + (Math.random() - 0.5) * 0.001
            };
            
            await storage.updateVessel(vessel.id, { position: newPosition });
            
            ws.send(JSON.stringify({
              type: 'vessel_update',
              data: { ...vessel, position: newPosition }
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

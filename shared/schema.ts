import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"), // viewer, operator, admin
  createdAt: timestamp("created_at").defaultNow(),
});

export const vessels = pgTable("vessels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // container, tanker, ferry, etc.
  position: jsonb("position").notNull(), // {latitude, longitude}
  speed: real("speed").notNull().default(0),
  heading: real("heading").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const performanceMetrics = pgTable("performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vesselId: varchar("vessel_id").notNull().references(() => vessels.id),
  timestamp: timestamp("timestamp").defaultNow(),
  speed: real("speed").notNull(),
  rpm: integer("rpm").notNull(),
  fuelRate: real("fuel_rate").notNull(),
  engineTemp: real("engine_temp").notNull(),
  fuelEfficiency: real("fuel_efficiency").notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vesselId: varchar("vessel_id").notNull().references(() => vessels.id),
  severity: text("severity").notNull(), // high, medium, low, info
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // engine, navigation, maintenance, safety
  acknowledged: boolean("acknowledged").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const maintenanceSchedule = pgTable("maintenance_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vesselId: varchar("vessel_id").notNull().references(() => vessels.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  estimatedDuration: integer("estimated_duration").notNull(), // hours
  assignedTo: text("assigned_to").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed
  priority: text("priority").notNull().default("medium"), // high, medium, low
  createdAt: timestamp("created_at").defaultNow(),
});

export const environmentalData = pgTable("environmental_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vesselId: varchar("vessel_id").notNull().references(() => vessels.id),
  timestamp: timestamp("timestamp").defaultNow(),
  windSpeed: real("wind_speed").notNull(),
  windDirection: text("wind_direction").notNull(),
  seaState: integer("sea_state").notNull(),
  waveHeight: real("wave_height").notNull(),
  airTemp: real("air_temp").notNull(),
  waterTemp: real("water_temp").notNull(),
  visibility: real("visibility").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVesselSchema = createInsertSchema(vessels).omit({
  id: true,
  createdAt: true,
});

export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertMaintenanceScheduleSchema = createInsertSchema(maintenanceSchedule).omit({
  id: true,
  createdAt: true,
});

export const insertEnvironmentalDataSchema = createInsertSchema(environmentalData).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Vessel = typeof vessels.$inferSelect;
export type InsertVessel = z.infer<typeof insertVesselSchema>;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetrics = z.infer<typeof insertPerformanceMetricsSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type MaintenanceSchedule = typeof maintenanceSchedule.$inferSelect;
export type InsertMaintenanceSchedule = z.infer<typeof insertMaintenanceScheduleSchema>;
export type EnvironmentalData = typeof environmentalData.$inferSelect;
export type InsertEnvironmentalData = z.infer<typeof insertEnvironmentalDataSchema>;

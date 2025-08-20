import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the CSV data
  app.get("/api/battery-data", (req, res) => {
    try {
      const csvPath = path.resolve(import.meta.dirname, "..", "attached_assets", "Battery_Voltage_Chart_1755722492250.csv");
      
      if (!fs.existsSync(csvPath)) {
        return res.status(404).json({ error: "CSV file not found" });
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      res.setHeader('Content-Type', 'text/csv');
      res.send(csvContent);
    } catch (error) {
      console.error('Error serving CSV:', error);
      res.status(500).json({ error: "Failed to load battery data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

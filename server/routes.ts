import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const emergencyChatSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  message: z.string().min(1, "Message is required").max(4000, "Message too long"),
});

/*
  SIMPLE OFFLINE EMERGENCY CHECK
  You can later replace this with ML model
*/
function generateOfflineEmergencyResponse(message: string) {
  const lower = message.toLowerCase();

  const redAlertKeywords = [
    "chest pain",
    "difficulty breathing",
    "shortness of breath",
    "stroke",
    "severe bleeding",
    "unconscious",
    "allergic reaction",
    "overdose",
    "suicide",
    "severe abdominal pain"
  ];

  const isRedAlert = redAlertKeywords.some(keyword =>
    lower.includes(keyword)
  );

  if (isRedAlert) {
    return {
      response:
        "[RED ALERT] Your symptoms may indicate a serious medical emergency. Please contact emergency services or visit the nearest hospital immediately.",
      isRedAlert: true
    };
  }

  return {
    response:
      "I understand your concern. Please consider consulting a healthcare professional for proper diagnosis. If symptoms worsen, seek emergency medical care.",
    isRedAlert: false
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Doctors API
  app.get("/api/doctors", async (req: Request, res: Response) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch doctors" });
    }
  });

  app.get("/api/doctors/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const doctor = await storage.getDoctorById(id);
      if (!doctor) return res.status(404).json({ error: "Doctor not found" });
      res.json(doctor);
    } catch {
      res.status(500).json({ error: "Failed to fetch doctor" });
    }
  });

  // Hospitals API
  app.get("/api/hospitals", async (req, res) => {
    try {
      res.json(await storage.getAllHospitals());
    } catch {
      res.status(500).json({ error: "Failed to fetch hospitals" });
    }
  });

  app.get("/api/hospitals/:id", async (req, res) => {
    try {
      const hospital = await storage.getHospitalById(parseInt(req.params.id));
      if (!hospital) return res.status(404).json({ error: "Hospital not found" });
      res.json(hospital);
    } catch {
      res.status(500).json({ error: "Failed to fetch hospital" });
    }
  });

  app.get("/api/hospitals/emergency", async (req, res) => {
    try {
      res.json(await storage.getEmergencyHospitals());
    } catch {
      res.status(500).json({ error: "Failed to fetch emergency hospitals" });
    }
  });

  // Blood Banks
  app.get("/api/blood-banks", async (req, res) => {
    try {
      res.json(await storage.getAllBloodBanks());
    } catch {
      res.status(500).json({ error: "Failed to fetch blood banks" });
    }
  });

  // Medicines
  app.get("/api/medicines", async (req, res) => {
    try {
      res.json(await storage.getAllMedicines());
    } catch {
      res.status(500).json({ error: "Failed to fetch medicines" });
    }
  });

  // =========================
  // OFFLINE EMERGENCY CHAT
  // =========================

  app.post("/api/emergency/chat", async (req: Request, res: Response) => {
    try {
      const validation = emergencyChatSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(validation.error);
      }

      const { sessionId, message } = validation.data;

      await storage.addChatMessage({
        sessionId,
        role: "user",
        content: message,
        isRedAlert: 0,
        suggestedHospital: null
      });

      const aiResult = generateOfflineEmergencyResponse(message);

      let suggestedHospital = null;

      if (aiResult.isRedAlert) {
        const hospitals = await storage.getEmergencyHospitals();
        if (hospitals.length > 0) {
          suggestedHospital = hospitals[0].name;
        }
      }

      await storage.addChatMessage({
        sessionId,
        role: "assistant",
        content: aiResult.response,
        isRedAlert: aiResult.isRedAlert ? 1 : 0,
        suggestedHospital
      });

      res.json({
        message: aiResult.response,
        isRedAlert: aiResult.isRedAlert,
        suggestedHospital
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Chat failed" });
    }
  });

  // Chat History
  app.get("/api/emergency/chat/:sessionId", async (req, res) => {
    try {
      res.json(await storage.getChatHistory(req.params.sessionId));
    } catch {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  return httpServer;
}

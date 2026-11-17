import { pgTable, text, varchar, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Doctors table
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  qualification: text("qualification").notNull(),
  experience: integer("experience").notNull(),
  hospital: text("hospital").notNull(),
  location: text("location").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }).notNull(),
  availability: text("availability").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  imageUrl: text("image_url"),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;

// Hospitals table
export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  phone: text("phone").notNull(),
  emergencyPhone: text("emergency_phone"),
  email: text("email"),
  specialties: text("specialties").array().notNull(),
  beds: integer("beds"),
  hasEmergency: integer("has_emergency").default(1),
  hasAmbulance: integer("has_ambulance").default(1),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  imageUrl: text("image_url"),
});

export const insertHospitalSchema = createInsertSchema(hospitals).omit({ id: true });
export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitals.$inferSelect;

// Blood Banks table
export const bloodBanks = pgTable("blood_banks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  bloodTypes: text("blood_types").array().notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  availability24x7: integer("availability_24x7").default(1),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
});

export const insertBloodBankSchema = createInsertSchema(bloodBanks).omit({ id: true });
export type InsertBloodBank = z.infer<typeof insertBloodBankSchema>;
export type BloodBank = typeof bloodBanks.$inferSelect;

// Sperm Banks table
export const spermBanks = pgTable("sperm_banks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  pricePerVial: decimal("price_per_vial", { precision: 10, scale: 2 }).notNull(),
  services: text("services").array().notNull(),
  accreditation: text("accreditation"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
});

export const insertSpermBankSchema = createInsertSchema(spermBanks).omit({ id: true });
export type InsertSpermBank = z.infer<typeof insertSpermBankSchema>;
export type SpermBank = typeof spermBanks.$inferSelect;

// Platelet Banks table
export const plateletBanks = pgTable("platelet_banks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  plateletTypes: text("platelet_types").array().notNull(),
  availability24x7: integer("availability_24x7").default(1),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
});

export const insertPlateletBankSchema = createInsertSchema(plateletBanks).omit({ id: true });
export type InsertPlateletBank = z.infer<typeof insertPlateletBankSchema>;
export type PlateletBank = typeof plateletBanks.$inferSelect;

// Medicines table
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genericName: text("generic_name").notNull(),
  category: text("category").notNull(),
  manufacturer: text("manufacturer").notNull(),
  dosageForm: text("dosage_form").notNull(),
  strength: text("strength").notNull(),
  uses: text("uses").notNull(),
  sideEffects: text("side_effects").notNull(),
  precautions: text("precautions").notNull(),
  contraindications: text("contraindications"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  prescriptionRequired: integer("prescription_required").default(1),
  imageUrl: text("image_url"),
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({ id: true });
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicines.$inferSelect;

// Emergency Chat Messages
export const emergencyChats = pgTable("emergency_chats", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  isRedAlert: integer("is_red_alert").default(0),
  suggestedHospital: text("suggested_hospital"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertEmergencyChatSchema = createInsertSchema(emergencyChats).omit({ id: true, createdAt: true });
export type InsertEmergencyChat = z.infer<typeof insertEmergencyChatSchema>;
export type EmergencyChat = typeof emergencyChats.$inferSelect;

// Re-export chat models
export * from "./models/chat";

// Specialty types for filtering
export const SPECIALTIES = [
  "Cardiology",
  "Orthopedics", 
  "Gynecology",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
  "General Medicine",
  "General Surgery",
  "Oncology",
  "Urology",
  "Nephrology",
  "Pulmonology",
  "Gastroenterology",
  "Endocrinology",
  "Rheumatology",
] as const;

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const MEDICINE_CATEGORIES = [
  "Antibiotics",
  "Painkillers",
  "Antihistamines",
  "Antacids",
  "Antidepressants",
  "Antidiabetics",
  "Antihypertensives",
  "Cardiovascular",
  "Vitamins & Supplements",
  "Skin Care",
  "Eye Care",
  "Respiratory",
  "Digestive",
  "Hormones",
  "Immunosuppressants",
] as const;

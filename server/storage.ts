import { randomUUID } from "crypto";
import type {
  User,
  InsertUser,
  Doctor,
  InsertDoctor,
  Hospital,
  InsertHospital,
  BloodBank,
  InsertBloodBank,
  SpermBank,
  InsertSpermBank,
  PlateletBank,
  InsertPlateletBank,
  Medicine,
  InsertMedicine,
  EmergencyChat,
  InsertEmergencyChat,
  SPECIALTIES,
  BLOOD_TYPES,
  MEDICINE_CATEGORIES
} from "../shared/schema";

// Import database files
import { doctorData } from "../client/database/doctors";
import { hospitalData } from "../client/database/hospitals";
import { bloodBankData } from "../client/database/bloodBanks";
import { spermBankData } from "../client/database/spermBanks";
import { plateletBankData } from "../client/database/plateletBanks";
import { medicineData } from "../client/database/medicines";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Doctors
  getAllDoctors(): Promise<Doctor[]>;
  getDoctorById(id: number): Promise<Doctor | undefined>;
  getDoctorsBySpecialty(specialty: string): Promise<Doctor[]>;

  // Hospitals
  getAllHospitals(): Promise<Hospital[]>;
  getHospitalById(id: number): Promise<Hospital | undefined>;
  getEmergencyHospitals(): Promise<Hospital[]>;

  // Blood Banks
  getAllBloodBanks(): Promise<BloodBank[]>;
  getBloodBankById(id: number): Promise<BloodBank | undefined>;

  // Sperm Banks
  getAllSpermBanks(): Promise<SpermBank[]>;
  getSpermBankById(id: number): Promise<SpermBank | undefined>;

  // Platelet Banks
  getAllPlateletBanks(): Promise<PlateletBank[]>;
  getPlateletBankById(id: number): Promise<PlateletBank | undefined>;

  // Medicines
  getAllMedicines(): Promise<Medicine[]>;
  getMedicineById(id: number): Promise<Medicine | undefined>;
  getMedicinesByCategory(category: string): Promise<Medicine[]>;

  // Emergency Chat
  getChatHistory(sessionId: string): Promise<EmergencyChat[]>;
  addChatMessage(chat: InsertEmergencyChat): Promise<EmergencyChat>;
}

export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private doctors = new Map<number, Doctor>();
  private hospitals = new Map<number, Hospital>();
  private bloodBanks = new Map<number, BloodBank>();
  private spermBanks = new Map<number, SpermBank>();
  private plateletBanks = new Map<number, PlateletBank>();
  private medicines = new Map<number, Medicine>();
  private emergencyChats = new Map<number, EmergencyChat>();

  private nextId = {
    doctors: 1,
    hospitals: 1,
    bloodBanks: 1,
    spermBanks: 1,
    plateletBanks: 1,
    medicines: 1,
    chats: 1
  };

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed Doctors
    doctorData.forEach((doc) => {
      const id = this.nextId.doctors++;
      this.doctors.set(id, { ...doc, id });
    });

    // Seed Hospitals
    hospitalData.forEach((hosp) => {
      const id = this.nextId.hospitals++;
      this.hospitals.set(id, { ...hosp, id });
    });

    // Seed Blood Banks
    bloodBankData.forEach((bank) => {
      const id = this.nextId.bloodBanks++;
      this.bloodBanks.set(id, { ...bank, id });
    });

    // Seed Sperm Banks
    spermBankData.forEach((bank) => {
      const id = this.nextId.spermBanks++;
      this.spermBanks.set(id, { ...bank, id });
    });

    // Seed Platelet Banks
    plateletBankData.forEach((bank) => {
      const id = this.nextId.plateletBanks++;
      this.plateletBanks.set(id, { ...bank, id });
    });

    // Seed Medicines
    medicineData.forEach((med) => {
      const id = this.nextId.medicines++;
      this.medicines.set(id, { ...med, id });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Doctors
  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(d => d.specialty === specialty);
  }

  // Hospitals
  async getAllHospitals(): Promise<Hospital[]> {
    return Array.from(this.hospitals.values());
  }

  async getHospitalById(id: number): Promise<Hospital | undefined> {
    return this.hospitals.get(id);
  }

  async getEmergencyHospitals(): Promise<Hospital[]> {
    return Array.from(this.hospitals.values()).filter(h => h.hasEmergency === 1);
  }

  // Blood Banks
  async getAllBloodBanks(): Promise<BloodBank[]> {
    return Array.from(this.bloodBanks.values());
  }

  async getBloodBankById(id: number): Promise<BloodBank | undefined> {
    return this.bloodBanks.get(id);
  }

  // Sperm Banks
  async getAllSpermBanks(): Promise<SpermBank[]> {
    return Array.from(this.spermBanks.values());
  }

  async getSpermBankById(id: number): Promise<SpermBank | undefined> {
    return this.spermBanks.get(id);
  }

  // Platelet Banks
  async getAllPlateletBanks(): Promise<PlateletBank[]> {
    return Array.from(this.plateletBanks.values());
  }

  async getPlateletBankById(id: number): Promise<PlateletBank | undefined> {
    return this.plateletBanks.get(id);
  }

  // Medicines
  async getAllMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async getMedicineById(id: number): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async getMedicinesByCategory(category: string): Promise<Medicine[]> {
    return Array.from(this.medicines.values()).filter(m => m.category === category);
  }

  // Emergency Chat
  async getChatHistory(sessionId: string): Promise<EmergencyChat[]> {
    return Array.from(this.emergencyChats.values())
      .filter(chat => chat.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async addChatMessage(chat: InsertEmergencyChat): Promise<EmergencyChat> {
    const id = this.nextId.chats++;
    const newChat: EmergencyChat = {
      ...chat,
      id,
      createdAt: new Date(),
      isRedAlert: chat.isRedAlert ?? 0,
      suggestedHospital: chat.suggestedHospital ?? null
    };
    this.emergencyChats.set(id, newChat);
    return newChat;
  }
}

// Export instance
export const storage = new MemStorage();

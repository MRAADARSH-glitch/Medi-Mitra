// /database/spermBanks.ts
import type { SpermBank } from "../../shared/schema";

export const spermBankData: Omit<SpermBank, 'id'>[] = [
  {
    name: "Genetics Cryobank LLP",
    address: "LBS Road, Bhandup West, Mumbai, Maharashtra 400078",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "09035195991",
    email: "",
    pricePerVial: "0.00",
    services: ["Sperm Storage", "Donor Sperm Services", "Cryopreservation"],
    accreditation: "ICMR/ART Services",
    latitude: "19.1450",
    longitude: "72.9487"
  },
  {
    name: "Genetics Cryobank (Dadar)",
    address: "Senapati Bapat Marg, Dadar West, Mumbai, Maharashtra 400028",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "",
    email: "",
    pricePerVial: "0.00",
    services: ["Sperm Storage", "Donor Sperm Facility"],
    accreditation: "ICMR/ART Services",
    latitude: "19.0180",
    longitude: "72.8360"
  },
  {
    name: "Sprouting Seed ART Bank",
    address: "Bandra West, Mumbai, Maharashtra 400050",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "",
    email: "",
    pricePerVial: "0.00",
    services: ["Sperm Donation", "Cryopreservation", "IVF Support"],
    accreditation: "ART/IVF Services",
    latitude: "19.0601",
    longitude: "72.8368"
  },
  {
    name: "Bloom IVF Mumbai (Semen Donation Services)",
    address: "Lilavati Hospital Campus, Bandra West, Mumbai 400050",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "+91-99603-95584",
    email: "drnandita30@gmail.com",
    pricePerVial: "0.00",
    services: ["Semen Donation", "Screening & Storage"],
    accreditation: "IVF Clinic ART Services",
    latitude: "19.0595",
    longitude: "72.8235"
  },
  {
    name: "Jupiter Lifeline Hospital — Sperm Bank Services",
    address: "Sector 1, Radha Swami Nagar, Mankhurd, Mumbai 400088",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "",
    email: "",
    pricePerVial: "0.00",
    services: ["Sperm Storage", "Fertility Support"],
    accreditation: "Clinic‑Based Fertility Services",
    latitude: "19.0700",
    longitude: "72.9200"
  },
  {
    name: "Cama & Albless Hospital – ART / Sperm Bank Facility",
    address: "Mahapalika Marg, CST, Fort, Mumbai 400001",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "022-22611654",
    email: "",
    pricePerVial: "0.00",
    services: ["ART Sperm Bank", "Cryopreservation", "IVF Support"],
    accreditation: "Hospital ART Services",
    latitude: "18.9290",
    longitude: "72.8365"
  }
];

// /database/plateletBanks.ts
import type { PlateletBank } from "../../shared/schema";

export const plateletBankData: Omit<PlateletBank, 'id'>[] = [
  {
    name: "Lilavati Hospital Platelet Bank",
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai 400050",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "+91-22-26751000",
    email: "bloodbank@lilavatihospital.com",
    pricePerUnit: "0.00",
    plateletTypes: ["Random Donor", "Single Donor", "Apheresis"],
    availability24x7: 1,
    latitude: "19.0600",
    longitude: "72.8360"
  },
  {
    name: "Breach Candy Hospital Platelet Centre",
    address: "60, Bhulabhai Desai Rd, Breach Candy, Mumbai 400026",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "+91-22-23633700",
    email: "bloodbank@breachcandyhospital.com",
    pricePerUnit: "0.00",
    plateletTypes: ["Single Donor", "Random Donor"],
    availability24x7: 1,
    latitude: "18.9962",
    longitude: "72.8250"
  },
  {
    name: "S.L. Raheja Hospital Platelet Bank",
    address: "Mahim Causeway, Mahim, Mumbai 400016",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "+91-22-24445528",
    email: "platelet@rahejahospital.com",
    pricePerUnit: "0.00",
    plateletTypes: ["Random Donor", "Single Donor", "Apheresis"],
    availability24x7: 1,
    latitude: "19.0270",
    longitude: "72.8446"
  },
  {
    name: "KEM Hospital Platelet Services",
    address: "Acharya Donde Marg, Parel, Mumbai 400012",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "+91-22-24135189",
    email: "bloodbank@kemhospital.org",
    pricePerUnit: "0.00",
    plateletTypes: ["Random Donor", "Apheresis"],
    availability24x7: 1,
    latitude: "19.0125",
    longitude: "72.8570"
  },
  {
    name: "Jaslok Hospital Platelet Bank",
    address: "15 Dr. G. Deshmukh Marg, Mumbai 400026",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "+91-22-24933333",
    email: "platelet@jaslokhospital.net",
    pricePerUnit: "0.00",
    plateletTypes: ["Single Donor", "Random Donor"],
    availability24x7: 0,
    latitude: "18.9965",
    longitude: "72.8258"
  }
];

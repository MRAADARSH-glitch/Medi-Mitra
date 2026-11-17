// /database/doctors.ts
import type { Doctor } from "../../shared/schema";

export const doctorData: Omit<Doctor, 'id'>[] = [
  {
    name: "Dr. Ramesh D. Joshi",
    specialty: "Cardiology",
    qualification: "MD, DM",
    experience: 20,
    hospital: "Lilavati Hospital & Research Centre",
    location: "Mumbai",
    phone: "+91-22-26751000",
    email: "r.joshi@lilavatihospital.com",
    consultationFee: "1500.00",
    availability: "Mon-Fri 10AM-4PM",
    rating: "4.8",
    imageUrl: null
  },
  {
    name: "Dr. Neha Shah",
    specialty: "Neurology",
    qualification: "MD, DM",
    experience: 15,
    hospital: "Breach Candy Hospital",
    location: "Mumbai",
    phone: "+91-22-23633700",
    email: "n.shah@breachcandyhospital.com",
    consultationFee: "1800.00",
    availability: "Tue-Sat 9AM-3PM",
    rating: "4.7",
    imageUrl: null
  },
  {
    name: "Dr. Suresh K. Patil",
    specialty: "Orthopedics",
    qualification: "MS, MCh",
    experience: 18,
    hospital: "S.L. Raheja Hospital",
    location: "Mumbai",
    phone: "+91-22-24445528",
    email: "s.patil@rahejahospital.com",
    consultationFee: "1600.00",
    availability: "Mon-Thu 11AM-5PM",
    rating: "4.6",
    imageUrl: null
  },
  {
    name: "Dr. Priya Kapoor",
    specialty: "Gynecology",
    qualification: "MD, DNB",
    experience: 12,
    hospital: "Jaslok Hospital & Research Centre",
    location: "Mumbai",
    phone: "+91-22-24933333",
    email: "p.kapoor@jaslokhospital.net",
    consultationFee: "1400.00",
    availability: "Mon-Fri 10AM-4PM",
    rating: "4.7",
    imageUrl: null
  },
  {
    name: "Dr. Anil Mehta",
    specialty: "Pediatrics",
    qualification: "MD, DCH",
    experience: 15,
    hospital: "KEM Hospital",
    location: "Mumbai",
    phone: "+91-22-24135189",
    email: "a.mehta@kemhospital.org",
    consultationFee: "1200.00",
    availability: "Mon-Sat 9AM-2PM",
    rating: "4.9",
    imageUrl: null
  },
  {
    name: "Dr. Ritu Verma",
    specialty: "Dermatology",
    qualification: "MD, DDV",
    experience: 10,
    hospital: "Wockhardt Hospital",
    location: "Mumbai",
    phone: "+91-22-24134000",
    email: "r.verma@wockhardtmumbai.com",
    consultationFee: "1300.00",
    availability: "Tue-Fri 10AM-5PM",
    rating: "4.6",
    imageUrl: null
  }
];

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  doctorSpecialty: string; // ✅ Add this
  patientName: string;
  phone: string;
  date: string;
  time: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  removeAppointment: (id: number) => void;
  clearAppointments: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) setAppointments(JSON.parse(stored));
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  const removeAppointment = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const clearAppointments = () => {
    setAppointments([]);
  };

  return (
    <AppointmentContext.Provider
      value={{ appointments, addAppointment, removeAppointment, clearAppointments }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

// Custom hook to use appointments
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider");
  }
  return context;
};

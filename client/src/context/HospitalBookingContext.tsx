import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type HospitalBooking = {
  id: number;
  hospitalName: string;
  doctorType: string;
  visitorName: string;
  phone: string;
  date: string;
  time: string;
};

type HospitalBookingContextType = {
  bookings: HospitalBooking[];
  addBooking: (booking: HospitalBooking) => void;
  removeBooking: (id: number) => void;
};

/* ---------------- Context ---------------- */

const HospitalBookingContext = createContext<
  HospitalBookingContextType | undefined
>(undefined);

/* ---------------- Provider ---------------- */

export const HospitalBookingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  /* ⭐ Load From localStorage */
  const [bookings, setBookings] = useState<HospitalBooking[]>(() => {
    try {
      const saved = localStorage.getItem("hospitalBookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ⭐ Save To localStorage Whenever Bookings Change */
  useEffect(() => {
    localStorage.setItem("hospitalBookings", JSON.stringify(bookings));
  }, [bookings]);

  /* ---------------- Actions ---------------- */

  const addBooking = (booking: HospitalBooking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const removeBooking = (id: number) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <HospitalBookingContext.Provider
      value={{ bookings, addBooking, removeBooking }}
    >
      {children}
    </HospitalBookingContext.Provider>
  );
};

/* ---------------- Hook ---------------- */

export const useHospitalBooking = (): HospitalBookingContextType => {
  const ctx = useContext(HospitalBookingContext);

  if (!ctx) {
    throw new Error(
      "useHospitalBooking must be used within HospitalBookingProvider"
    );
  }

  return ctx;
};

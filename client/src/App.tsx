import { Switch, Route } from "wouter";
import { useState } from "react";
// import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HospitalBookingProvider } from "@/context/HospitalBookingContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

import { CartProvider } from "@/context/CartContext";
import { AppointmentProvider } from "@/context/AppointmentContext";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Doctors from "@/pages/doctors";
import Hospitals from "@/pages/hospitals";
import Medicines from "@/pages/medicines";
import BloodBanks from "@/pages/blood-banks";
import SpermBanks from "@/pages/sperm-banks";
import PlateletBanks from "@/pages/platelet-banks";
import Emergency from "@/pages/emergency";
import HospitalBookingsPage from "@/pages/HospitalBookingsPage";
import CartPage from "@/pages/cart";
import AppointmentsPage from "@/pages/appointments";

import Auth from "./auth/Auth";
import LogoutButton from "./auth/LogoutButton";

function Router() {
  return (
    <Switch>
      <Route path="/"><Home /></Route>
      <Route path="/doctors"><Doctors /></Route>
      <Route path="/hospitals"><Hospitals /></Route>
      <Route path="/medicines"><Medicines /></Route>
      <Route path="/blood-banks"><BloodBanks /></Route>
      <Route path="/sperm-banks"><SpermBanks /></Route>
      <Route path="/platelet-banks"><PlateletBanks /></Route>
      <Route path="/emergency"><Emergency /></Route>
      <Route path="/hospital-bookings"><HospitalBookingsPage /></Route>
      <Route path="/cart"><CartPage /></Route>
      <Route path="/appointments"><AppointmentsPage /></Route>
      <Route path="*"><NotFound /></Route>
    </Switch>
  );
}


function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser") || "null")
  );

  const handleLogin = (user: any) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  // Show Auth if not logged in
  if (!loggedInUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AppointmentProvider>
          <HospitalBookingProvider>
            <ThemeProvider>
              <TooltipProvider>
                <SidebarProvider style={sidebarStyle as React.CSSProperties}>
                  <div className="flex h-screen w-full">
                    <AppSidebar />
                    <SidebarInset className="flex flex-col flex-1 min-w-0">
                      <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background/95 backdrop-blur">
                        <SidebarTrigger />
                        <div className="flex items-center gap-2">
                          <ThemeToggle />
                          <LogoutButton onLogout={handleLogout} />
                        </div>
                      </header>
                      <main className="flex-1 overflow-auto">
                        <Router />
                      </main>
                    </SidebarInset>
                  </div>
                </SidebarProvider>
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </HospitalBookingProvider>
        </AppointmentProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;


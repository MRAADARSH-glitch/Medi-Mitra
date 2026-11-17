import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Star, MapPin, Building2, Bed, AlertCircle, Ambulance, ShoppingBag
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ChatBot from "@/components/ChatBot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Hospital } from "@shared/schema";
import { useHospitalBooking, HospitalBooking } from "@/context/HospitalBookingContext";

const DOCTOR_TYPES = ["General Physician", "Surgeon", "Pediatrician", "Cardiologist"];

export default function Hospitals() {
  const [, setLocation] = useLocation(); // ✅
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { bookings, addBooking }: { bookings: HospitalBooking[]; addBooking: (b: HospitalBooking) => void } = useHospitalBooking();

  const [selectedHospital, setSelectedHospital] = useState("");
  const [doctorType, setDoctorType] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const { data: hospitals, isLoading, isError } = useQuery<Hospital[]>({
    queryKey: ["/api/hospitals"],
    queryFn: async () => {
      const res = await fetch("/api/hospitals");
      return res.json() as Promise<Hospital[]>;
    },
  });

  const filteredHospitals = (hospitals || []).filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || hospital.city === selectedCity;
    const matchesType = selectedType === "all" || hospital.type === selectedType;
    return matchesSearch && matchesCity && matchesType;
  });

  const cities: string[] = Array.from(new Set((hospitals ?? []).map((h: Hospital) => h.city)));
  const types: string[] = Array.from(new Set((hospitals ?? []).map((h: Hospital) => h.type)));

  const handleBookVisit = () => {
    if (!selectedHospital || !doctorType || !visitorName || !phone || !date || !time) {
      alert("Please fill all fields!");
      return;
    }
    addBooking({
      id: Date.now(),
      hospitalName: selectedHospital,
      doctorType,
      visitorName,
      phone,
      date,
      time,
    });
    alert("Hospital visit booked!");
    setSelectedHospital(""); setDoctorType(""); setVisitorName("");
    setPhone(""); setDate(""); setTime("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with Hospital Bookings icon */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Hospitals</h1>
          <p className="text-muted-foreground">
            Locate hospitals and medical centers near you
          </p>
        </div>

        <button
          className="relative p-2 bg-emerald-500 rounded-full hover:bg-emerald-600 text-white"
          onClick={() => setLocation("/hospital-bookings")}
        >
          <ShoppingBag className="w-6 h-6" />
          {bookings.length > 0 && (
            <span className="absolute top-0 right-0 text-xs bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white">
              {bookings.length}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isError ? (
          <div className="col-span-full text-center py-12 text-destructive">
            Failed to load hospitals. Try refreshing.
          </div>
        ) : isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredHospitals.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No hospitals found
          </div>
        ) : (
          filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover-elevate">
              <CardHeader className="pb-2 flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-500/10">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{hospital.name}</CardTitle>
                    <Badge variant="outline">{hospital.type}</Badge>
                  </div>
                </div>
                {hospital.rating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    {hospital.rating}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{hospital.address}, {hospital.city}, {hospital.state}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hospital.hasEmergency === 1 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="w-3 h-3" /> Emergency
                    </Badge>
                  )}
                  {hospital.hasAmbulance === 1 && (
                    <Badge variant="secondary" className="gap-1">
                      <Ambulance className="w-3 h-3" /> Ambulance
                    </Badge>
                  )}
                  {hospital.beds && (
                    <Badge variant="outline" className="gap-1">
                      <Bed className="w-3 h-3" /> {hospital.beds} Beds
                    </Badge>
                  )}
                </div>

                {/* Book Visit Dialog */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex-1">Book Visit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <Card className="p-4 space-y-3">
                        <CardTitle>Book a Visit</CardTitle>
                        <Input placeholder="Hospital Name" value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} />
                        <Select value={doctorType} onValueChange={setDoctorType}>
                          <SelectTrigger><SelectValue placeholder="Select Doctor Type" /></SelectTrigger>
                          <SelectContent>
                            {DOCTOR_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Input placeholder="Visitor Name" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} />
                        <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                        <Button className="w-full mt-2" onClick={handleBookVisit}>Confirm Booking</Button>
                      </Card>
                    </DialogContent>
                  </Dialog>

                  {hospital.emergencyPhone && (
                    <Button size="sm" variant="destructive">
                      <AlertCircle className="w-4 h-4 mr-1" /> Emergency
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <ChatBot />
    </div>
  );
}

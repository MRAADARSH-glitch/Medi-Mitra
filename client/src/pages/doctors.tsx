import { formatINR } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Star,
  MapPin,
  Phone,
  Clock,
  GraduationCap,
  Briefcase,
  Calendar,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppointments } from "@/context/AppointmentContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SPECIALTIES } from "@shared/schema";
import type { Doctor } from "@shared/schema";
import { useLocation } from "wouter";

export default function Doctors() {
  const [, navigate] = useLocation();
  const { appointments, addAppointment } = useAppointments();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const { data: doctors, isLoading, isError } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  const filteredDoctors = doctors?.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === "all" || doctor.location === selectedLocation;
    return matchesSearch && matchesSpecialty && matchesLocation;
  });



  const locations: string[] = Array.from(
    new Set<Doctor["location"]>((doctors ?? []).map((d) => d.location))
  );


  const handleBookAppointment = () => {
    if (!selectedDoctor || !patientName || !phone || !date || !time) {
      alert("Fill all details!");
      return;
    }

    addAppointment({
      id: Date.now(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      patientName,
      phone,
      date,
      time,
    });

    // Reset form
    setSelectedDoctor(null);
    setPatientName("");
    setPhone("");
    setDate("");
    setTime("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Doctors</h1>
          <p className="text-muted-foreground">
            Browse our network of qualified healthcare professionals
          </p>
        </div>

        {/* Appointments Icon with badge */}
        <Button
          onClick={() => navigate("/appointments")}
          className="flex items-center gap-2 relative"
        >
          <Calendar className="w-5 h-5" />
          Appointments
          {appointments.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {appointments.length}
            </span>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {SPECIALTIES.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {isLoading ? "Loading..." : `Showing ${filteredDoctors?.length || 0} doctors`}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isError && <p>Error loading doctors</p>}
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-60" />
          ))
        }
        {filteredDoctors?.map((doctor) => (
          <Card key={doctor.id} className="hover-elevate">
            <CardHeader className="pb-2 flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  {doctor.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="truncate">{doctor.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">{doctor.specialty}</Badge>
              </div>
              {doctor.rating && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 flex-shrink-0" />
                <span>{doctor.experience} years experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{doctor.hospital}, {doctor.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{doctor.availability}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t mt-3">
                <p className="text-lg font-semibold text-primary">
                  {formatINR(doctor.consultationFee)}
                </p>

                {/* Book Appointment Popup */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <CalendarCheck className="w-4 h-4 mr-1" /> Book
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <p><b>Doctor:</b> {doctor.name}</p>
                      <Input
                        placeholder="Patient Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                      />
                      <Input
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />

                      <Button className="w-full" onClick={handleBookAppointment}>
                        Confirm
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

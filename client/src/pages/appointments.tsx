import { useAppointments } from "@/context/AppointmentContext";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";

export default function AppointmentsPage() {
  const { appointments, removeAppointment } = useAppointments();

  if (!appointments || appointments.length === 0) {
    return (
      <p className="p-6 text-center text-muted-foreground">
        No appointments booked yet.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {appointments.map((a) => (
        <Card key={a.id} className="p-4 hover-elevate">
          <CardContent className="space-y-2">
            <CardTitle className="text-lg font-semibold">
               {a.doctorName} ({a.doctorSpecialty})
            </CardTitle>

            <p>
              <b>Patient:</b> {a.patientName}
            </p>
            <p>
              <b>Phone:</b> {a.phone}
            </p>
            <p>
              <b>Date:</b> {a.date}
            </p>
            <p>
              <b>Time:</b> {a.time}
            </p>

            <Button
              variant="destructive"
              className="mt-2"
              onClick={() => removeAppointment(a.id)}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

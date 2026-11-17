import { useHospitalBooking } from "@/context/HospitalBookingContext";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HospitalBookingsPage() {
  const { bookings, removeBooking } = useHospitalBooking();

  if (bookings.length === 0) {
    return <p className="p-6 text-center">No hospital visits booked yet.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Hospital Visits</h1>
      {bookings.map((b) => (
        <Card key={b.id} className="p-4 flex justify-between items-start">
          <div>
            <CardTitle>{b.hospitalName} ({b.doctorType})</CardTitle>
            <p>Visitor: {b.visitorName}</p>
            <p>Phone: {b.phone}</p>
            <p>Date: {b.date}</p>
            <p>Time: {b.time}</p>
          </div>
          <Button variant="destructive" onClick={() => removeBooking(b.id)}>
            Cancel
          </Button>
        </Card>
      ))}
    </div>
  );
}

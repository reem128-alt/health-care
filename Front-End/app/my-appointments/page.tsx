'use client';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Calendar, Clock, Trash2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { deleteAppointment, getAllAppointments, type Appointment } from "@/services/appointmant"
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export default function AppointmentsPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded, user } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      // First check if user is loaded and signed in
      if (!isLoaded || !isSignedIn || !user) {
        console.log("User not ready:", { isLoaded, isSignedIn, user });
        return [];
      }

      const userEmail = user.emailAddresses[0]?.emailAddress;
      if (!userEmail) {
        console.log("No user email found");
        return [];
      }

      console.log("Fetching appointments for email:", userEmail);
      const appointments = await getAllAppointments();
      console.log("All appointments:", appointments);
      
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.patientEmail === userEmail
      );
      
      console.log("Filtered appointments:", filteredAppointments);
      return filteredAppointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) {
        console.log("User still loading...");
        return;
      }

      if (!isSignedIn) {
        console.log("User not signed in, redirecting to sign-in...");
        router.push("/sign-in");
        return;
      }

      try {
        const res = await fetchAppointments();
        setAppointments(res);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, router, user])

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    try {
      await deleteAppointment(appointmentId)
      setAppointments(appointments.filter(app => app._id !== appointmentId))
    } catch (error) {
      console.error("Error deleting appointment:", error)
      setError(error instanceof Error ? error.message : "Failed to delete appointment")
    }
  }

  // Show loading state while checking authentication
  if (!isLoaded || (isLoaded && !isSignedIn)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Appointments</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading appointments...</h3>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">You haven&apos;t made any appointments yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-300 "
              >
                <div className="p-6">
                  {/* Doctor Info */}
                  <div className="flex items-center mb-4">
                    <div className="relative h-14 w-14 rounded-full border border-teal-600 overflow-hidden mr-4">
                      {appointment.doctor?.imageUrl ? (
                        <Image
                          src={appointment.doctor?.imageUrl?.startsWith('http') ? appointment.doctor.imageUrl : `${API_URL}/${appointment.doctor?.imageUrl?.replace(/^\//, '')}`}
                          alt={appointment.doctor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">
                            {appointment.doctor?.name?.charAt(0) || 'D'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        {appointment.doctor?.name || "Doctor Unavailable"}
                      </h3>
                      <p className="text-sm text-teal-600">
                        {appointment.doctor?.speciality || "Specialty Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Patient: {appointment.patientName}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-teal-600" />
                      <span className="text-sm">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-3 text-teal-600" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-red-500 text-gray-800 border border-gray-200'
                    }`}>
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1) || 'Pending'}
                    </span>

                    <button
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      className="flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

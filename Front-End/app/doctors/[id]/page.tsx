/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  Check,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  createAppointment,
  getAppointmentByDoctorId,
  updateAppointment,
  type Appointment,
  type CreateAppointmentData
} from "@/services/appointmant";
import { getDoctorById } from "@/services/doctor";

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  description: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  experience?: {
    years: number;
    patientsServed: number;
  };
  workingHours?: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

const formatAppointmentDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};

export default function DoctorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { isSignedIn ,user} = useUser();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
 console.log("appointment",appointments)
  console.log("user", isSignedIn);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchDoctorAndAppointments = async () => {
      try {
        setLoading(true);
        // Fetch doctor details
        const doctorRes = await getDoctorById(id);
        if (!doctorRes) {
          throw new Error("Failed to fetch doctor details");
        }

        const appointmentsRes = await getAppointmentByDoctorId(id);
        if (!Array.isArray(appointmentsRes)) {
          throw new Error("Failed to fetch appointments");
        }
        setDoctor(doctorRes);
        setAppointments(appointmentsRes);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndAppointments();
  }, [isLoaded, isSignedIn, id, router]);

  ////////////////////// book appointment /////////////////////////
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !doctor || !user) {
      router.push("/sign-in");
      return;
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    if (!userEmail) {
      setBookingError("User email not found");
      return;
    }

    try {
      setBookingError(null);
      setBookingSuccess(false);

      const response = await createAppointment({
        doctorId: id,
        patientName: user.fullName ?? "Anonymous",
        patientEmail: userEmail,
        date: bookingDate,
        time: bookingTime,
        status: "pending"
      } as CreateAppointmentData);

      if (!response) {
        throw new Error("Failed to book appointment");
      }

      // Refresh appointments list
      const updatedAppointments = await getAppointmentByDoctorId(id);
      if (Array.isArray(updatedAppointments)) {
        setAppointments(updatedAppointments);
      }

      setBookingSuccess(true);
      setBookingDate("");
      setBookingTime("");

    } catch (err) {
      console.error("Error booking appointment:", err);
      setBookingError(
        err instanceof Error ? err.message : "Failed to book appointment"
      );
    }
  };

  ////////////////////// handle status appointment change /////////////////////
  const handleStatusChange = async (
    appointmentId: string,
    newStatus: "confirmed" | "cancelled" | "pending"
  ) => {
    try {
      setLoading(true);

      // Update appointment using the appointment service
      await updateAppointment(appointmentId, { status: newStatus });

      // Refresh appointments list
      const updatedAppointments = await getAppointmentByDoctorId(id);
      if (Array.isArray(updatedAppointments)) {
        setAppointments(updatedAppointments);
      }

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        newStatus === "confirmed"
          ? "bg-green-500"
          : newStatus === "cancelled"
          ? "bg-red-500"
          : "bg-blue-500"
      } text-white`;
      successMessage.textContent = `Appointment status updated to ${newStatus}`;
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      const errorMessage = document.createElement("div");
      errorMessage.className =
        "fixed top-4 right-4 p-4 rounded-lg shadow-lg bg-red-500 text-white";
      errorMessage.textContent =
        error instanceof Error
          ? error.message
          : "Failed to update appointment status";
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }


  if (!isSignedIn) {
    return null; // Let the useEffect handle redirect
  }

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-red-500 text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  if (!doctor)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
          <p className="text-gray-600">
            The requested doctor profile could not be found.
          </p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Doctor Profile Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="grid md:grid-cols-12 gap-8 p-6">
          {/* Left side - Image and basic info */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start ">
            <div className="relative w-48 h-48 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-6">
              {doctor.imageUrl ? (
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Stethoscope className="text-white w-20 h-20 opacity-50" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">
              {doctor.name}
            </h1>
            <p className="text-teal-600 text-xl mb-6">{doctor.speciality}</p>

            {/* Contact Information */}
            <div className="space-y-4 w-full">
              {doctor.email && (
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Mail className="w-5 h-5 mr-3 text-teal-600" />
                  <span>{doctor.email}</span>
                </div>
              )}
              {doctor.phone && (
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Phone className="w-5 h-5 mr-3 text-teal-600" />
                  <span>{doctor.phone}</span>
                </div>
              )}
              {doctor.address && (
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 mr-3 text-teal-600" />
                  <span>{doctor.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Description and other details */}
          <div className="md:col-span-8">
            <div className="space-y-6">
              {/* About Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-teal-50 rounded-lg mr-4">
                    <Stethoscope className="w-6 h-6 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    About Dr. {doctor.name}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-500 mt-2"></div>
                    <p className="text-gray-600 leading-relaxed">
                      {doctor.description}
                    </p>
                  </div>

                  {/* Professional Summary */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Professional Experience
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">
                          Years of Experience
                        </div>
                        <div className="font-medium text-gray-900">
                          {doctor.experience?.years ?? 0}+ Years
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="text-sm text-gray-500 mb-1">
                          Patients Served
                        </div>
                        <div className="font-medium text-gray-900">
                          {doctor.experience?.patientsServed ?? 0}+
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialization Details */}
                  <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                    <h3 className="text-lg font-medium text-teal-800 mb-3">
                      Specialization
                    </h3>
                    <div className="flex items-center text-teal-600">
                      <div className="p-2 bg-white rounded-lg mr-3">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <span>{doctor.speciality}</span>
                    </div>
                  </div>

                  {/* Working Hours Section */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 text-teal-600 mr-2" />
                      Working Hours
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {doctor.workingHours?.map((hours) => (
                        <div
                          key={hours.day}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            hours.isAvailable
                              ? "bg-teal-50 text-teal-900"
                              : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          <div className="font-medium">{hours.day}</div>
                          <div className="flex items-center">
                            {hours.isAvailable ? (
                              <>
                                <span>
                                  {hours.startTime} - {hours.endTime}
                                </span>
                                <div className="ml-3 p-1 bg-teal-100 rounded">
                                  <Check className="w-4 h-4 text-teal-600" />
                                </div>
                              </>
                            ) : (
                              <>
                                <span>Closed</span>
                                <div className="ml-3 p-1 bg-gray-200 rounded">
                                  <X className="w-4 h-4 text-gray-500" />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Book an Appointment
        </h2>

        {!isSignedIn ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Please sign in to book an appointment
            </p>
            <button
              onClick={() => router.push("/sign-in")}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookAppointment} className="space-y-4">
            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {bookingError}
              </div>
            )}

            {bookingSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Appointment booked successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time
                </label>
                <select
                  id="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Book Appointment
            </button>
          </form>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Appointments Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
              <tr>
                <th className="table-header">Patient</th>
                <th className="table-header">Date</th>
                <th className="table-header">Time</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">
                        No appointments found
                      </p>
                      <p className="text-sm text-gray-400">
                        New appointments will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((appointment, index) => (
                  <tr
                    key={appointment._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {appointment.patientName?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patientName || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patientEmail || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatAppointmentDate(appointment.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-4 py-2 inline-flex items-center justify-center rounded-full text-sm font-semibold ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            appointment.status === "confirmed"
                              ? "bg-green-400"
                              : appointment.status === "pending"
                              ? "bg-yellow-400"
                              : appointment.status === "cancelled"
                              ? "bg-red-400"
                              : "bg-gray-400"
                          }`}
                        />
                        {appointment.status
                          ? appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)
                          : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(appointment._id, "confirmed")
                              }
                              className="flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-150"
                              title="Confirm Appointment"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(appointment._id, "cancelled")
                              }
                              className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-150"
                              title="Cancel Appointment"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

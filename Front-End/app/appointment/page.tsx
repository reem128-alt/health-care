"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { ChevronDown, Stethoscope, Calendar, Clock } from "lucide-react"
import { getAllDoctors } from "@/services/doctor"
import { createAppointment } from "@/services/appointmant"
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';


interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  imageUrl?: string;
}

export const dynamic = 'force-dynamic'

function AppointmentForm() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctor, setDoctor] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await getAllDoctors();
        setDoctors(doctorsData);
        
        // If doctor ID is provided in URL, set it as selected
        const doctorId = searchParams.get('doctor')
        if (doctorId) {
          setDoctor(doctorId)
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchDoctors();
  }, [searchParams])

  const selectedDoctor = doctors.find(d => d._id === doctor)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      console.error("No user found");
      router.push("/sign-in");
      return;
    }

    if (!doctor || !date || !time) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const response = await createAppointment({
        doctorId: doctor,
        patientName: user?.fullName ?? "Anonymous",
        patientEmail: user?.emailAddresses[0]?.emailAddress || "",
        date,
        time,
        status: "pending"
      });

      if (response) {
        router.push("/my-appointments");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Failed to create appointment. Please try again.");
    }
  }


  if (!isSignedIn) {
    router.push("/sign-in")
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-teal-500 to-teal-600">
            <h2 className="text-3xl font-extrabold text-white text-center">
              Book an Appointment
            </h2>
            <p className="mt-2 text-center text-teal-100">
              Schedule your visit with our healthcare professionals
            </p>
          </div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Selection */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Select Doctor
                </label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="shadow-sm appearance-none border border-gray-200 rounded-xl w-full p-3 text-gray-700 hover:border-teal-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 flex justify-between items-center">
                    <span>
                      {selectedDoctor
                        ? selectedDoctor.name
                        : "Choose a doctor"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {doctors.map((d) => (
                        <div
                          key={d._id}
                          className="p-3 hover:bg-teal-50 cursor-pointer flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setDoctor(d._id)
                            setIsDropdownOpen(false)
                          }}
                        >
                          <div className="flex-shrink-0 w-10 h-10 relative">
                            {d.imageUrl ? (
                              <Image
                                src={d.imageUrl.startsWith('http') ? d.imageUrl : `${API_URL}/${d.imageUrl.replace(/^\//, '')}`}
                                alt={d.name}
                                fill
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-teal-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{d.name}</div>
                            <div className="text-sm text-gray-500">{d.speciality}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="date">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>Appointment Date</span>
                    </div>
                  </label>
                  <input
                    className="shadow-sm appearance-none border border-gray-200 rounded-xl w-full p-3 text-gray-700 hover:border-teal-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Time Selection */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-bold mb-3" htmlFor="time">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-teal-600" />
                      <span>Preferred Time</span>
                    </div>
                  </label>
                  <input
                    className="shadow-sm appearance-none border border-gray-200 rounded-xl w-full p-3 text-gray-700 hover:border-teal-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                  disabled={!doctor || !date || !time}
                >
                  Book Appointment
                </button>
              </div>
              {error && (
                <div className="text-red-500">{error}</div>
              )}
            </form>
          </div>
        </div>

        {/* Additional Information */}
        {selectedDoctor && (
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Doctor Information</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-16 relative">
                {selectedDoctor.imageUrl ? (
                  <Image
                    src={selectedDoctor.imageUrl.startsWith('http') ? selectedDoctor.imageUrl : `${API_URL}/${selectedDoctor.imageUrl.replace(/^\//, '')}`}
                    alt={selectedDoctor.name}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-teal-600" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-900">{selectedDoctor.name}</h4>
                <p className="text-teal-600">{selectedDoctor.speciality}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentForm />
    </Suspense>
  )
}

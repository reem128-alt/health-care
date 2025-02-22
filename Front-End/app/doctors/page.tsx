"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { getAllDoctors } from "@/services/doctor";

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data.map(doctor => ({
          ...doctor,
          createdAt: doctor.createdAt ?? '' // Ensure createdAt is never undefined
        })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, doctors]);

  const filterDoctors = () => {
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 md:mb-0">
            Find Your Doctor
          </h1>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent pl-12"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              {...doctor}
              showAppointmentButton={true}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No doctors found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

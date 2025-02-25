"use client"

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, UserRound, Pencil, Trash2 } from 'lucide-react';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

interface DoctorCardProps {
  _id: string;
  name: string;
  speciality: string;
  imageUrl?: string;
  showAppointmentButton?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  experience?: {
    years: number;
    patientsServed: number;
    specializations: string[];
  };
  workingHours?: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

const DoctorCard: FC<DoctorCardProps> = ({
  _id,
  name,
  speciality,
  imageUrl,
  showAppointmentButton = false,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallbackIcon = target.parentElement?.querySelector('.fallback-icon');
    if (fallbackIcon) {
      fallbackIcon.classList.remove('hidden');
    }
  };

  return (
    <div className="group relative sm:w-[400px]">
      {/* Decorative border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
      
      {/* Main card content */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-64 bg-gradient-to-br from-teal-400/20 via-blue-300/20 to-purple-400/20 flex items-center justify-center p-4">
          <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-white/50 shadow-lg">
            {imageUrl ? (
              <>
                <div className="fallback-icon hidden">
                  <UserRound className="w-24 h-24 text-teal-500/70" />
                </div>
                <Image
                  src={`${API_URL}${imageUrl}`}
                     
                  alt={name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100">
                <UserRound className="w-24 h-24 text-teal-500/70" />
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. {name}</h3>
          <p className="text-teal-600 mb-4">{speciality}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Available</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex space-x-2">
              {showActions && (
                <>
                  <button
                    onClick={() => onEdit?.(_id)}
                    className="p-2 text-teal-600 hover:text-teal-800 transition-colors"
                    title="Edit doctor"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete?.(_id)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete doctor"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              )}
              {showAppointmentButton && (
                <>
                  <Link
                    href={`/doctors/${_id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                  >
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href={`/doctors/${_id}`}
                    className="inline-flex items-center px-4 py-2 ml-2 text-sm font-medium text-teal-600 bg-white border border-teal-600 rounded-lg hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                  >
                    View Profile
                    <UserRound className="ml-2 h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  description: string;
  imageUrl?: string;
  experience?: {
    years: number;
    patientsServed: number;
    specializations: string[];
  };
  createdAt?: string;
  createdBy?: string;
}

export interface DoctorFormData {
  name: string;
  speciality: string;
  description: string;
  imageUrl?: string | File;
  experience?: {
    years: number;
    patientsServed: number;
    specializations: string[];
  };
}

// Get all doctors
export const getAllDoctors = async (limit?: number): Promise<Doctor[]> => {
  try {
    const url = limit
      ? `${API_URL}/doctors?limit=${limit}`
      : `${API_URL}/doctors`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching doctors:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error message:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error message:", error.message);
    } else {
      console.error("Unknown error fetching doctors");
    }
    throw error;
  }
};

// Get a single doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor> => {
  try {
    const response = await axios.get(`${API_URL}/doctors/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`Error fetching doctor with id ${id}:`, error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error message:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error message:", error.message);
    } else {
      console.error("Unknown error fetching doctor");
    }
    throw error;
  }
};

// Helper functions to process form data
const parseJsonField = (value: FormDataEntryValue, fieldName: string) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`Error parsing ${fieldName}:`, e);
      return null;
    }
  }
  return null;
};

const processExperience = (value: FormDataEntryValue, data: Partial<DoctorFormData>) => {
  const parsedExperience = parseJsonField(value, 'experience');
  if (parsedExperience) {
    data.experience = parsedExperience;
  }
};

const processSpecializations = (value: FormDataEntryValue, data: Partial<DoctorFormData>) => {
  const parsedSpecializations = parseJsonField(value, 'specializations');
  if (parsedSpecializations) {
    if (!data.experience) {
      data.experience = {
        years: 0,
        patientsServed: 0,
        specializations: []
      };
    }
    data.experience.specializations = parsedSpecializations;
  }
};

type StringFields = 'name' | 'speciality' | 'description';

const processStringField = (
  value: FormDataEntryValue, 
  key: StringFields, 
  data: Partial<DoctorFormData>
) => {
  if (typeof value === 'string') {
    data[key] = value;
  }
};

const processImageField = (value: FormDataEntryValue, data: Partial<DoctorFormData>) => {
  if (value instanceof File || typeof value === 'string') {
    data.imageUrl = value;
  }
};

// Create a new doctor
export const createDoctor = async (formData: FormData): Promise<Doctor> => {
  try {
    const data: Partial<DoctorFormData> = {};
    
    // Process form fields
    formData.forEach((value, key) => {
      switch(key) {
        case 'experience':
          processExperience(value, data);
          break;
        case 'specializations':
          processSpecializations(value, data);
          break;
        case 'name':
        case 'speciality':
        case 'description':
          processStringField(value, key as StringFields, data);
          break;
        case 'imageUrl':
          processImageField(value, data);
          break;
      }
    });

    const response = await axios.post(`${API_URL}/doctors`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating doctor:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error creating doctor:', error.message);
    } else {
      console.error('Unknown error creating doctor');
    }
    throw error; // Rethrow the error or handle it as needed
  }

};

// Update a doctor
export const updateDoctor = async (
  id: string,
  formData: FormData
): Promise<Doctor> => {
  try {
    const response = await axios.put(`${API_URL}/doctors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating doctor:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error updating doctor:', error.message);
    } else {
      console.error('Unknown error updating doctor');
    }
    throw error;
  }
};

// Delete a doctor
export const deleteDoctor = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/doctors/${id}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error deleting doctor with id ${id}:`, error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(`Error deleting doctor with id ${id}:`, error.message);
    } else {
      console.error(`Unknown error deleting doctor with id ${id}`);
    }
    throw error;
  }
};

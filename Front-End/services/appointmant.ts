import axios from "axios";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Appointment {
  patientEmail:string ;
  patientName: string;
  _id: string;
  doctor: {
    _id: string;
    name: string;
    imageUrl?: string;
    speciality: string;
  };
 
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt?: string;
}

export interface CreateAppointmentData {
  doctorId: string;
  patientEmail: string;
  patientName: string;
  date: string;
  time: string;
  status?: string;
}

// Get all appointments
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  try {
    const response = await axios.get(`${API_URL}/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with id ${id}:`, error);
    throw error;
  }
};
export const getAppointmentByDoctorId = async (id: string): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${API_URL}/appointments/doctor/${id}`);
    console.log("Appointments response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with doctor ${id}:`, error);
    throw error;
  }
};

// Create new appointment
export const createAppointment = async (
  appointmentData: CreateAppointmentData
): Promise<Appointment> => {
  console.log(appointmentData)
  try {
    const response = await axios.post(
      `${API_URL}/appointments`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update appointment
export const updateAppointment = async (
  id: string,
  appointmentData: Partial<CreateAppointmentData>
): Promise<Appointment> => {
  try {
    const response = await axios.put(
      `${API_URL}/appointments/${id}`,
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment with id ${id}:`, error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/appointments/${id}`);
  } catch (error) {
    console.error(`Error deleting appointment with id ${id}:`, error);
    throw error;
  }
};

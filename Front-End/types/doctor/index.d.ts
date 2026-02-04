 interface Doctor {
  _id: string
  name: string
  speciality: string
  description: string
  imageUrl?: string
  email?: string
  phone?: string
  address?: string
  experience?: {
    years: number
    patientsServed: number
    specializations: string[]
  }
  workingHours?: {
    day: string
    startTime: string
    endTime: string
    isAvailable: boolean
  }[]
}

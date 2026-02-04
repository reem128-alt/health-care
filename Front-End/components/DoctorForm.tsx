import React from "react"
import { UseFormReturn } from "react-hook-form"

export interface DoctorFormValues {
  name: string
  speciality: string
  description: string
  email: string
  phone: string
  address: string
  experienceYears: number
  experiencePatientsServed: number
}

export interface WorkingHour {
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface DoctorFormProps {
  form: UseFormReturn<DoctorFormValues>
  workingHours: WorkingHour[]
  setWorkingHours: React.Dispatch<React.SetStateAction<WorkingHour[]>>
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSubmitting: boolean
  editingDoctor: { _id: string } | null
  onSubmit: (values: DoctorFormValues) => void | Promise<void>
}

export const DoctorForm: React.FC<DoctorFormProps> = ({
  form,
  workingHours,
  setWorkingHours,
  handleImageChange,
  isSubmitting,
  editingDoctor,
  onSubmit
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Speciality</label>
            <input
              type="text"
              {...register("speciality", { required: "Speciality is required" })}
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
            {errors.speciality && <p className="mt-1 text-xs text-red-500">{errors.speciality.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              rows={3}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900">Experience</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="number"
                  {...register("experienceYears", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  min="0"
                />
                {errors.experienceYears && (
                  <p className="mt-1 text-xs text-red-500">{errors.experienceYears.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Patients Served</label>
                <input
                  type="number"
                  {...register("experiencePatientsServed", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Value cannot be negative" },
                  })}
                  className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  min="0"
                />
                {errors.experiencePatientsServed && (
                  <p className="mt-1 text-xs text-red-500">{errors.experiencePatientsServed.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Working Hours</h3>
                <p className="text-sm text-gray-500">Toggle availability to enable time pickers.</p>
              </div>
            </div>
            <div className="space-y-4">
              {workingHours.map((hours, index) => (
                <div key={hours.day} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700">{hours.day}</label>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="time"
                      value={hours.startTime}
                      onChange={(e) => {
                        const newHours = [...workingHours]
                        newHours[index] = { ...hours, startTime: e.target.value }
                        setWorkingHours(newHours)
                      }}
                      className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      disabled={!hours.isAvailable}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="time"
                      value={hours.endTime}
                      onChange={(e) => {
                        const newHours = [...workingHours]
                        newHours[index] = { ...hours, endTime: e.target.value }
                        setWorkingHours(newHours)
                      }}
                      className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      disabled={!hours.isAvailable}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.isAvailable}
                        onChange={(e) => {
                          const newHours = [...workingHours]
                          newHours[index] = { ...hours, isAvailable: e.target.checked }
                          setWorkingHours(newHours)
                        }}
                        className="rounded  p-2 border-gray-300 text-teal-600 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Available</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="doctor@example.com"
            />
          </div>

  <div>
            <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
            <input
              type="tel"
              {...register("phone")}
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
            <input
              type="text"
              {...register("address")}
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="123 Main St"
            />
          </div>
        </div>

      <div className="mt-6 py-3 bg-gray-50 border-t flex justify-end">
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : editingDoctor ? "Save Changes" : "Add Doctor"}
        </button>
      </div>
    </form>
  )
}

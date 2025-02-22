"use client"

import { useState, useEffect } from "react"
import {  Plus, Users, BookOpen} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Modal } from "@/components/Modal"
import DoctorCard from "@/components/DoctorCard"
import BlogCard from "@/components/BlogCard"
import { getAllDoctors, createDoctor, deleteDoctor,updateDoctor } from "@/services/doctor"
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "@/services/blog"

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

interface Blog {
  _id: string;
  title: string;
  content: string;
  shortDescription: string;
  author: string;
  imageUrl?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("doctors")
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Doctor states
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [name, setName] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [experience, setExperience] = useState<{ years: number; patientsServed: number }>({ years: 0, patientsServed: 0 });

  const [workingHours, setWorkingHours] = useState([
    { day: "Monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
    { day: "Tuesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
    { day: "Wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
    { day: "Thursday", startTime: "09:00", endTime: "17:00", isAvailable: true },
    { day: "Friday", startTime: "09:00", endTime: "17:00", isAvailable: true },
    { day: "Saturday", startTime: "10:00", endTime: "14:00", isAvailable: true },
    { day: "Sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
  ])

  // Blog states
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [, setBlogImageUrl] = useState("")
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchData = async () => {
        const res = await getAllDoctors();
        setDoctors(res);
        const data = await getAllBlogs();
        setBlogs(data);
    };

    fetchData(); // Call the async function
}, []);

  useEffect(() => {
    return () => {
      // Cleanup any blob URLs when component unmounts
      if (imageUrl?.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(imageUrl);
        } catch (error) {
          console.error('Error cleaning up blob URL:', error);
        }
      }
    };
  }, [imageUrl]);
//////////////// add doctor //////////////////////////
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a structured object first
      const doctorData = {
        name: name.trim(),
        speciality: speciality.trim(),
        description: description.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        experience: {
          years: parseInt(String(experience?.years)) || 0,
          patientsServed: parseInt(String(experience?.patientsServed)) || 0,
          specializations: []
        },
        workingHours: workingHours.map(hour => ({
          day: hour.day,
          startTime: hour.startTime,
          endTime: hour.endTime,
          isAvailable: hour.isAvailable
        }))
      };

      // Convert to FormData
      const formData = new FormData();
      Object.entries(doctorData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      // Append the image file if it exists
      if (imageFile) {
        formData.append('imageUrl', imageFile);
      }
      
      const response = await createDoctor(formData);
      if (!response) {
        throw new Error("Failed to add doctor")
      }
     
      setDoctors([...doctors, response])
      setShowDoctorModal(false)
      resetForm()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Clean up previous blob URL if it exists
      if (imageUrl?.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(imageUrl);
        } catch (error) {
          console.error('Error revoking URL:', error);
        }
      }
      // Create a new blob URL for preview
      try {
        const objectUrl = URL.createObjectURL(file);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error('Error creating object URL:', error);
        // Set a placeholder or handle the error appropriately
        setImageUrl('');
      }
    }
  };

  const handleEditClick = (doctor: Doctor) => {
    console.log('Editing doctor:', doctor);
    
    // Normalize the doctor data
    const normalizedDoctor = {
      ...doctor,
      experience: {
        years: doctor.experience?.years ?? 0,
        patientsServed: doctor.experience?.patientsServed ?? 0,
        specializations: doctor.experience?.specializations ??[]
      },
      workingHours: doctor.workingHours?.map(hour => ({
        day: hour.day || '',
        startTime: hour.startTime || '09:00',
        endTime: hour.endTime || '17:00',
        isAvailable: typeof hour.isAvailable === 'boolean' ? hour.isAvailable : true
      })) || []
    };
    
    // Set form values
    setEditingDoctor(normalizedDoctor);
    setName(normalizedDoctor.name);
    setSpeciality(normalizedDoctor.speciality);
    setDescription(normalizedDoctor.description);
    
    // Handle image URL - store just the filename
    const imageUrl = normalizedDoctor.imageUrl;
    if (imageUrl) {
      // Extract just the filename if it's a full URL
      const filename = imageUrl.includes('/') ? 
        imageUrl.split('/').pop() : 
        imageUrl;
      setImageUrl(filename || '');
    } else {
      setImageUrl('');
    }
    
    setImageFile(null); // Reset image file when editing
    setEmail(normalizedDoctor.email ?? '');
    setPhone(normalizedDoctor.phone ?? '');
    setAddress(normalizedDoctor.address ?? '');
    setExperience({
      years: normalizedDoctor.experience?.years || 0,
      patientsServed: normalizedDoctor.experience?.patientsServed || 0,
    });
    setWorkingHours(normalizedDoctor.workingHours);
    
    // Open modal
    setShowDoctorModal(true);
  };

  const handleEditDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor?._id) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Create a structured object first
      const doctorData = {
        name: name.trim(),
        speciality: speciality.trim(),
        description: description.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        experience: {
          years: parseInt(String(experience?.years)) || 0,
          patientsServed: parseInt(String(experience?.patientsServed)) || 0,
          
        },
        workingHours: workingHours.map(hour => ({
          day: hour.day,
          startTime: hour.startTime,
          endTime: hour.endTime,
          isAvailable: hour.isAvailable
        }))
      };

      // Convert to FormData
      const formData = new FormData();
      Object.entries(doctorData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      // Only append the image if a new one is selected
      if (imageFile) {
        formData.append('imageUrl', imageFile);
      }

      const response = await updateDoctor(editingDoctor._id, formData);

      if (!response) {
        throw new Error("Failed to update doctor");
      }

      // Update the local state
      const updatedDoctors = doctors.map(doc => 
        doc._id === editingDoctor._id ? { ...doc, ...response } : doc
      );
      setDoctors(updatedDoctors);
      
      // Close modal and reset
      setShowDoctorModal(false);
      setEditingDoctor(null);
      resetForm();
      setSuccess("Doctor updated successfully");
    } catch (error) {
      console.error("Error updating doctor:", error);
      setError(error instanceof Error ? error.message : "Failed to update doctor");
    } finally {
      setIsSubmitting(false);
    }
  };


   ////////////// add blog //////////////
   const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Log the state variables
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Short Description:", shortDescription);
    console.log("Image File:", blogImageFile);
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('shortDescription', shortDescription);
    formData.append('author', user?.fullName ?? "Anonymous");
    if (blogImageFile) {
      formData.append('imageUrl', blogImageFile);
    }
  
    // Log FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    const response = await createBlog(formData);
    if (!response) {
      throw new Error("Failed to add blog");
    }
    
    // Reset form and close modal
    setTitle("");
    setContent("");
    setShortDescription("");
    setBlogImageUrl("");
    setBlogImageFile(null);
    setShowBlogModal(false);
    setIsSubmitting(false);
  };

  const handleEditBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBlog?._id) {
      setError("Blog ID is missing")
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Updating blog with ID:', editingBlog._id)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('shortDescription', shortDescription);
      formData.append('author', user?.fullName ?? "Anonymous");
      if (blogImageFile) {
        formData.append('imageUrl', blogImageFile);
      }

      const response = await updateBlog(editingBlog._id, formData);

      if (!response) {
        throw new Error("Failed to update blog")
      }

      // Only reset and close if update was successful
      await getAllBlogs() // Refresh the blogs list first
      resetForm()
      setShowBlogModal(false)
      setEditingBlog(null)
    } catch (error) {
      console.error("Error updating blog:", error)
      setError(error instanceof Error ? error.message : "Failed to update blog")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditBlog = (blog: Blog) => {
    console.log('Opening edit for blog:', blog)
    setEditingBlog(blog)
    setTitle(blog.title)
    setContent(blog.content)
    setShortDescription(blog.shortDescription || "")
    setBlogImageUrl(blog.imageUrl ?? "")
    setShowBlogModal(true)
  }

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(doctorId)
        const updatedDoctors = await getAllDoctors()
        setDoctors(updatedDoctors)
        setSuccess("Doctor deleted successfully")
        // Reset editing state if the deleted doctor was being edited
        if (editingDoctor?._id === doctorId) {
          setEditingDoctor(null)
          setShowDoctorModal(false)
        }
      } catch (error) {
        console.error("Error deleting doctor:", error)
        setError("Failed to delete doctor")
      }
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    try {
      await deleteBlog(id)
      const updatedBlogs = await getAllBlogs()
      setBlogs(updatedBlogs)
      setSuccess("Blog post deleted successfully")
      // Reset editing state if the deleted blog was being edited
      if (editingBlog?._id === id) {
        setEditingBlog(null)
        setShowBlogModal(false)
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      setError("Failed to delete blog post")
    }
  }

    
  

  // Reset form function
  const resetForm = () => {
    setName("")
    setSpeciality("")
    setDescription("")
    setImageUrl("")
    setImageFile(null)
    setEmail("")
    setPhone("")
    setAddress("")
    setExperience({
      years: 0,
      patientsServed: 0,
      
    })
    setWorkingHours([
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '09:00', endTime: '17:00', isAvailable: false },
      { day: 'Sunday', startTime: '09:00', endTime: '17:00', isAvailable: false }
    ])
    setTitle("")
    setContent("")
    setShortDescription("")
    setBlogImageUrl("")
    setBlogImageFile(null)
    setEditingBlog(null)
    setError("")
    setSuccess("")
  }

  const closeModal = () => {
    setShowBlogModal(false)
    setEditingBlog(null)
    resetForm()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="mb-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "doctors"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Doctors
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === "blogs"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Blogs
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {activeTab === "doctors" && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowDoctorModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Doctor
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  {...doctor}
                  showActions={true}
                  onDelete={handleDeleteDoctor}
                  onEdit={() => handleEditClick(doctor)}
                />
              ))}
            </div>

            <Modal
              isOpen={showDoctorModal}
              onClose={() => {
                setShowDoctorModal(false)
                setEditingDoctor(null)
                resetForm()
              }}
              title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            >
              <form onSubmit={editingDoctor ? handleEditDoctor : handleAddDoctor} className="flex flex-col h-[80vh]">
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Speciality</label>
                      <input
                        type="text"
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        rows={3}
                        required
                      />
                    </div>

                    {/* Experience Section */}
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900">Experience</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                          <input
                            type="number"
                            value={experience.years || ""}
                            onChange={(e) => setExperience({ ...experience, years: parseInt(e.target.value) || 0 })}
                            className="..."
                            min="0"
 />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Patients Served</label>
                          <input
                            type="number"
                            value={experience.patientsServed}
                            onChange={(e) => setExperience({...experience, patientsServed: parseInt(e.target.value)})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Working Hours Section */}
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900">Working Hours</h3>
                      <div className="space-y-4">
                        {workingHours.map((hours, index) => (
                          <div key={hours.day} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg">
                            <div className="col-span-3">
                              <label className="block text-sm font-medium text-gray-700">{hours.day}</label>
                            </div>
                            <div className="col-span-3">
                              <input
                                type="time"
                                value={hours.startTime}
                                onChange={(e) => {
                                  const newHours = [...workingHours];
                                  newHours[index] = {...hours, startTime: e.target.value};
                                  setWorkingHours(newHours);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                disabled={!hours.isAvailable}
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="time"
                                value={hours.endTime}
                                onChange={(e) => {
                                  const newHours = [...workingHours];
                                  newHours[index] = {...hours, endTime: e.target.value};
                                  setWorkingHours(newHours);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                disabled={!hours.isAvailable}
                              />
                            </div>
                            <div className="col-span-3">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={hours.isAvailable}
                                  onChange={(e) => {
                                    const newHours = [...workingHours];
                                    newHours[index] = {...hours, isAvailable: e.target.checked};
                                    setWorkingHours(newHours);
                                  }}
                                  className="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        placeholder="doctor@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        placeholder="+1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        placeholder="123 Main St"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 px-6 py-3 bg-gray-50 border-t flex justify-end">
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : editingDoctor ? 'Save Changes' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </Modal>
          </>
        )}

        {activeTab === "blogs" && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowBlogModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Blog Post
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {blogs.map((blog) => (
                <div key={blog._id} className="relative group">
                  <BlogCard 
                    blog={blog} 
                    showDeleteButton
                    onDelete={handleDeleteBlog}
                    showEditButton
                    onEdit={openEditBlog}
                  />
                </div>
              ))}
            </div>

            <Modal
              isOpen={showBlogModal}
              onClose={closeModal}
              title={editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
            >
              <form onSubmit={editingBlog ? handleEditBlog : handleAddBlog} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Short Description</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        setBlogImageUrl(file.name);
                        setBlogImageFile(file);
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : (editingBlog ? "Save Changes" : "Add Blog Post")}
                  </button>
                </div>
              </form>
            </Modal>
          </>
        )}
      </div>
    </main>
  )
}

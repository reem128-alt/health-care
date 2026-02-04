"use client"

import { useState, useEffect } from "react"
import {  Plus, Users, BookOpen} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { Modal } from "@/components/Modal"
import DoctorCard from "@/components/DoctorCard"
import BlogCard from "@/components/BlogCard"
import { DoctorForm, DoctorFormValues, WorkingHour } from "@/components/DoctorForm"
import { BlogForm, BlogFormValues } from "@/components/BlogForm"
import { getAllDoctors, createDoctor, deleteDoctor,updateDoctor } from "@/services/doctor"
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "@/services/blog"
import toast, { Toaster } from "react-hot-toast"


export default function Dashboard() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("doctors")
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Doctor states
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([
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
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null)

  // React Hook Form for Doctor
  const doctorForm = useForm<DoctorFormValues>({
    defaultValues: {
      name: "",
      speciality: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      experienceYears: 0,
      experiencePatientsServed: 0
    }
  })

  // React Hook Form for Blog
  const blogForm = useForm<BlogFormValues>({
    defaultValues: {
      title: "",
      shortDescription: "",
      content: ""
    }
  })

  useEffect(() => {
    const fetchData = async () => {
        const res = await getAllDoctors();
        setDoctors(res);
        const data = await getAllBlogs();
        setBlogs(data);
    };

    fetchData(); // Call the async function
}, []);

  // Handle doctor form submission
  const handleAddDoctor = async (values: DoctorFormValues) => {
    setIsSubmitting(true);

    try {
      const doctorData = {
        name: values.name.trim(),
        speciality: values.speciality.trim(),
        description: values.description.trim(),
        email: values.email?.trim() || '',
        phone: values.phone?.trim() || '',
        address: values.address?.trim() || '',
        experience: {
          years: values.experienceYears || 0,
          patientsServed: values.experiencePatientsServed || 0,
          specializations: []
        },
        workingHours: workingHours.map(hour => ({
          day: hour.day,
          startTime: hour.startTime,
          endTime: hour.endTime,
          isAvailable: hour.isAvailable
        }))
      };

      const formData = new FormData();
      Object.entries(doctorData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });

      if (imageFile) {
        formData.append('imageUrl', imageFile);
      }
      
      const response = await createDoctor(formData);
      if (!response) {
        throw new Error("Failed to add doctor")
      }
     
      setDoctors(prevDoctors => [...prevDoctors, response])
      setShowDoctorModal(false)
      resetDoctorForm()
      toast.success("Doctor added successfully!")
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Failed to add doctor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDoctorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogImageFile(file);
    }
  };

  const handleEditClick = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    
    // Reset form with doctor data
    doctorForm.reset({
      name: doctor.name,
      speciality: doctor.speciality,
      description: doctor.description,
      email: doctor.email || '',
      phone: doctor.phone || '',
      address: doctor.address || '',
      experienceYears: doctor.experience?.years || 0,
      experiencePatientsServed: doctor.experience?.patientsServed || 0
    });
    
    setWorkingHours(doctor.workingHours?.map(hour => ({
      day: hour.day || '',
      startTime: hour.startTime || '09:00',
      endTime: hour.endTime || '17:00',
      isAvailable: typeof hour.isAvailable === 'boolean' ? hour.isAvailable : true
    })) || [
      { day: "Monday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Thursday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Friday", startTime: "09:00", endTime: "17:00", isAvailable: true },
      { day: "Saturday", startTime: "10:00", endTime: "14:00", isAvailable: true },
      { day: "Sunday", startTime: "00:00", endTime: "00:00", isAvailable: false }
    ]);
    
    setImageFile(null);
    setShowDoctorModal(true);
  };

  const handleEditDoctor = async (values: DoctorFormValues) => {
    if (!editingDoctor?._id) return;

    setIsSubmitting(true);

    try {
      const doctorData = {
        name: values.name.trim(),
        speciality: values.speciality.trim(),
        description: values.description.trim(),
        email: values.email?.trim() || '',
        phone: values.phone?.trim() || '',
        address: values.address?.trim() || '',
        experience: {
          years: values.experienceYears || 0,
          patientsServed: values.experiencePatientsServed || 0,
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
      resetDoctorForm();
      toast.success("Doctor updated successfully");
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update doctor");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleAddBlog = async (values: BlogFormValues) => {
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('shortDescription', values.shortDescription);
      formData.append('author', user?.fullName ?? "Anonymous");
      if (blogImageFile) {
        formData.append('imageUrl', blogImageFile);
      }
    
      const response = await createBlog(formData);
      if (!response) {
        throw new Error("Failed to add blog");
      }
      
      setBlogs(prevBlogs => [response, ...prevBlogs]);
      resetBlogForm();
      setShowBlogModal(false);
      toast.success("Blog added successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to add blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBlog = async (values: BlogFormValues) => {
    if (!editingBlog?._id) {
      toast.error("Blog ID is missing")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('shortDescription', values.shortDescription);
      formData.append('author', user?.fullName ?? "Anonymous");
      if (blogImageFile) {
        formData.append('imageUrl', blogImageFile);
      }

      const response = await updateBlog(editingBlog._id, formData);

      if (!response) {
        throw new Error("Failed to update blog")
      }

      const updatedBlog = blogs.map(doc => 
        doc._id === editingBlog._id ? { ...doc, ...response } : doc
      );
      setBlogs(updatedBlog);
      resetBlogForm()
      setShowBlogModal(false)
      setEditingBlog(null)
      toast.success("Blog updated successfully")
    } catch (error) {
      console.error("Error updating blog:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update blog")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditBlog = (blog: Blog) => {
    setEditingBlog(blog)
    blogForm.reset({
      title: blog.title,
      content: blog.content,
      shortDescription: blog.shortDescription || ""
    });
    setBlogImageFile(null);
    setShowBlogModal(true)
  }

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(doctorId)
        const updatedDoctors = await getAllDoctors()
        setDoctors(updatedDoctors)
        toast.success("Doctor deleted successfully")
        // Reset editing state if the deleted doctor was being edited
        if (editingDoctor?._id === doctorId) {
          setEditingDoctor(null)
          setShowDoctorModal(false)
        }
      } catch (error) {
        console.error("Error deleting doctor:", error)
        toast.error("Failed to delete doctor")
      }
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    try {
      await deleteBlog(id)
      const updatedBlogs = await getAllBlogs()
      setBlogs(updatedBlogs)
      toast.success("Blog post deleted successfully")
      // Reset editing state if the deleted blog was being edited
      if (editingBlog?._id === id) {
        setEditingBlog(null)
        setShowBlogModal(false)
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error("Failed to delete blog post")
    }
  }

    
  

  const resetDoctorForm = () => {
    doctorForm.reset({
      name: "",
      speciality: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      experienceYears: 0,
      experiencePatientsServed: 0
    });
    setImageFile(null);
    setWorkingHours([
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: true },
      { day: 'Sunday', startTime: '00:00', endTime: '00:00', isAvailable: false }
    ]);
  }

  const resetBlogForm = () => {
    blogForm.reset({
      title: "",
      shortDescription: "",
      content: ""
    });
    setBlogImageFile(null);
  }

  const closeDoctorModal = () => {
    setShowDoctorModal(false)
    setEditingDoctor(null)
    resetDoctorForm()
  }

  const closeBlogModal = () => {
    setShowBlogModal(false)
    setEditingBlog(null)
    resetBlogForm()
  }

  return (
    <>
      <Toaster position="top-center" />
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
                ? "bg-blue-600 text-white"
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

        {activeTab === "doctors" && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowDoctorModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Doctor
              </button>
            </div>

            <div className="flex flex-wrap gap-3 ">
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
              onClose={closeDoctorModal}
              title={editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            >
              <DoctorForm
                form={doctorForm}
                workingHours={workingHours}
                setWorkingHours={setWorkingHours}
                handleImageChange={handleDoctorImageChange}
                isSubmitting={isSubmitting}
                editingDoctor={editingDoctor}
                onSubmit={editingDoctor ? handleEditDoctor : handleAddDoctor}
              />
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
              onClose={closeBlogModal}
              title={editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
            >
              <BlogForm
                form={blogForm}
                isSubmitting={isSubmitting}
                editingBlog={editingBlog}
                onSubmit={editingBlog ? handleEditBlog : handleAddBlog}
                onImageChange={handleBlogImageChange}
              />
            </Modal>
          </>
        )}
      </div>
    </main>
    </>
  )
}

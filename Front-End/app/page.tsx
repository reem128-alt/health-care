"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Users, Clock, Award, CheckCircle, ArrowRight, Brain, Stethoscope } from "lucide-react"
import DoctorCard from "@/components/DoctorCard"
import BlogCard from "@/components/BlogCard"
import { getAllDoctors, Doctor } from "@/services/doctor"
import { getAllBlogs, Blog } from "@/services/blog"

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [doctorData, blogData] = await Promise.all([
          getAllDoctors(3),
          getAllBlogs(),
        ])

        if (!isMounted) return
        setDoctors(doctorData)
        setLatestBlogs(blogData.slice(0, 3))
        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        if (!isMounted) return
        setError("Our API is waking up. Loading data…")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Your Health, Our Priority</h1>
            <p className="text-xl mb-8">
              Experience modern healthcare with our comprehensive platform. Book appointments,
              read health insights, and connect with top medical professionals.
            </p>
            <Link 
              href="/doctors"
              className="bg-white text-teal-600 hover:bg-teal-100 px-8 py-3 rounded-full font-bold inline-flex items-center group"
            >
              Find a Doctor
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Notification */}
      {(loading || error) && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center py-3 px-4">
          {error ?? "Fetching fresh data…"}
        </div>
      )}

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* General Checkup */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors">General Checkup</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  Comprehensive health assessments to ensure your well-being. Regular checkups help prevent health issues before they become serious.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-semibold">From $99</span>
                  <Link href="/services" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium group/link">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Specialist Consultation */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Specialist Consultation</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  Expert medical consultation with our specialized doctors. Get personalized treatment plans from experienced professionals.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">From $149</span>
                  <Link href="/services" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group/link">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mental Health */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Mental Health Care</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  Professional mental health support and counseling services. Our experts provide confidential and compassionate care.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 font-semibold">From $129</span>
                  <Link href="/services" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium group/link">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-medium group shadow-lg hover:shadow-xl"
            >
              View All Services
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                About Health<span className="text-teal-600">Care</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dedicated to providing exceptional healthcare services with a focus on patient comfort and advanced medical solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/health.jpg"
                    alt="Medical Team"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Stats Card */}
                <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-lg p-6 md:w-64">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-teal-600">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">10k+</p>
                      <p className="text-sm text-gray-600">Happy Patients</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-teal-600">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">15+</p>
                      <p className="text-sm text-gray-600">Years Experience</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Providing Quality Healthcare Solutions
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  At HealthCare, we believe in providing comprehensive healthcare services that put our patients first. Our team of experienced medical professionals is committed to delivering personalized care using the latest medical technologies and practices.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Expert Medical Professionals</h4>
                      <p className="text-gray-600">Our team consists of highly qualified and experienced healthcare providers.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Modern Medical Technology</h4>
                      <p className="text-gray-600">We utilize state-of-the-art medical equipment and innovative treatments.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Patient-Centered Care</h4>
                      <p className="text-gray-600">We prioritize patient comfort and provide personalized treatment plans.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link 
                    href="/doctors"
                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                  >
                    Meet Our Doctors
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-teal-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h4>
                <p className="text-gray-600">
                  Round-the-clock medical assistance and emergency care services.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-teal-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Quality Care</h4>
                <p className="text-gray-600">
                  Committed to providing the highest standard of medical care.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h4>
                <p className="text-gray-600">
                  Highly qualified medical professionals with years of experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Most Experienced Doctors</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our highly experienced medical professionals with proven track records
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {loading && doctors.length === 0 ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`doctor-skeleton-${idx}`}
                  className="h-72 w-full md:w-[340px] rounded-2xl bg-white shadow animate-pulse p-6 space-y-4"
                >
                  <div className="h-32 rounded-xl bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100 w-2/3" />
                  <div className="h-4 rounded bg-slate-100 w-1/2" />
                  <div className="flex gap-4">
                    <div className="h-4 rounded bg-slate-100 flex-1" />
                    <div className="h-4 rounded bg-slate-100 flex-1" />
                  </div>
                </div>
              ))
            ) : (
              doctors.map((doctor) => (
                <div key={doctor._id} className="flex flex-col items-center">
                  <DoctorCard {...doctor} />

                  <div className="mt-4 flex items-center space-x-6">
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-2 text-teal-600" />
                      <span>{doctor.experience?.years || 0} Years Experience</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      <span>{doctor.experience?.patientsServed || 0} Patients</span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {!loading && doctors.length === 0 && (
              <p className="text-center text-gray-600 w-full">
                We&rsquo;re updating our roster. Please check back soon!
              </p>
            )}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/doctors"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              View All Doctors
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Health Insights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest health tips and medical breakthroughs from our expert doctors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading && latestBlogs.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`blog-skeleton-${idx}`}
                    className="rounded-2xl bg-white p-6 shadow animate-pulse space-y-4"
                  >
                    <div className="h-40 rounded-xl bg-slate-100" />
                    <div className="h-4 rounded bg-slate-100 w-3/4" />
                    <div className="h-4 rounded bg-slate-100 w-1/2" />
                    <div className="h-4 rounded bg-slate-100 w-1/3" />
                  </div>
                ))
              : latestBlogs.map((blog) => (
                  <BlogCard key={blog._id} {...blog} />
                ))}

            {!loading && latestBlogs.length === 0 && (
              <p className="text-center text-gray-600 w-full">
                No articles yet—our authors are preparing fresh insights.
              </p>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-medium group"
            >
              View All Articles
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

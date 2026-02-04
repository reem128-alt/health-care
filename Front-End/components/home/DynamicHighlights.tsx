"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, Users, ArrowRight } from "lucide-react"
import DoctorCard from "@/components/DoctorCard"
import BlogCard from "@/components/BlogCard"
import { getAllDoctors, Doctor } from "@/services/doctor"
import { getAllBlogs, Blog } from "@/services/blog"

export function DynamicHighlights() {
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
        setError("Our API is warming up. Loading latest updates…")
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

  const renderDoctorSection = () => (
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
  )

  const renderBlogSection = () => (
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
            : latestBlogs.map((blog) => <BlogCard key={blog._id} {...blog} />)}

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
  )

  return (
    <>
      {(loading || error) && (
        <div className="bg-amber-50 border-y border-amber-200 text-amber-800 text-center py-3 px-4">
          {error ?? "Fetching fresh data…"}
        </div>
      )}
      {renderDoctorSection()}
      {renderBlogSection()}
    </>
  )
}

'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image"
import {
  Home,
  UserRound,
  ClipboardList,
  Menu,
  X,
  BookOpen,
  CalendarClock
} from "lucide-react"

export function Navigation() {
  const { isSignedIn, isLoaded, user } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Check if user is admin based on their email
  const isAdmin = isSignedIn && user?.primaryEmailAddress?.emailAddress === "admin@example.com"

  // Don't render navigation until user state is loaded
  if (!isLoaded) {
    return null
  }

  return (
    <header className="bg-gradient-to-r from-teal-600 to-blue-600">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-xl font-bold text-white hover:text-teal-100 transition-colors"
        >
          <Image src="/placeholder-doctor.png" alt="Health Platform Logo" width={80} height={80} />
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            href="/doctors" 
            className="text-white hover:text-teal-100 transition-colors font-medium"
          >
             Doctors
          </Link>
          <Link 
            href="/blog" 
            className="text-white hover:text-teal-100 transition-colors font-medium"
          >
            Blog
          </Link>
          {isSignedIn ? (
            <div className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-white hover:text-teal-100 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/appointment" 
                className="text-white hover:text-teal-100 transition-colors font-medium"
              >
                Book Appointment
              </Link>
              <Link 
                href="/my-appointments" 
                className="text-white hover:text-teal-100 transition-colors font-medium"
              >
                My Appointments
              </Link>
              <div className="flex items-center space-x-4">
               
                <div className="bg-white/10 p-1 rounded-full hover:bg-white/20 transition-colors">
                  <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Link 
              href="/sign-in" 
              className="bg-white text-teal-600 hover:bg-teal-100 font-bold py-2 px-6 rounded-full transition-colors"
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50">
          <div className="bg-white h-full w-64 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                  pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/doctors"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                  pathname === "/doctors" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserRound className="h-5 w-5" />
                <span>Doctors</span>
              </Link>

              <Link
                href="/blog"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                  pathname === "/blog" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5" />
                <span>Blog</span>
              </Link>

              {isSignedIn && (
                <Link
                  href="/my-appointments"
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                    pathname === "/my-appointments" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CalendarClock className="h-5 w-5" />
                  <span>My Appointments</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                    pathname === "/admin" ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

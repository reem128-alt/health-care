import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Book Appointment | Health Platform',
  description: 'Schedule your medical appointment with our experienced doctors. Easy and convenient online booking system.',
  keywords: 'book appointment, doctor appointment, medical consultation, healthcare booking',
  openGraph: {
    title: 'Book Appointment | Health Platform',
    description: 'Schedule your medical appointment with our experienced doctors. Easy and convenient online booking system.',
  },
}

export default function AppointmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

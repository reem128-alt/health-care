import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Appointments - Health Platform',
  description: 'View and manage your upcoming medical appointments',
};

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

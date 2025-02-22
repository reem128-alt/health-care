import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Health Platform',
  description: 'Access your personalized health dashboard. View upcoming appointments, manage your health records, and track your medical history.',
  keywords: 'health dashboard, medical appointments, patient portal, health records, medical history',
  openGraph: {
    title: 'Your Health Dashboard',
    description: 'Manage your health journey with our comprehensive dashboard',
    type: 'website',
    siteName: 'Health Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Health Dashboard',
    description: 'Manage your health journey with our comprehensive dashboard',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

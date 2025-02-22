import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Medical Specialists - Health Platform',
  description: 'Find and book appointments with top medical specialists. Browse our comprehensive directory of healthcare professionals across various specializations.',
  keywords: 'doctors, medical specialists, healthcare professionals, book doctor appointment, find doctor',
  openGraph: {
    title: 'Our Medical Specialists',
    description: 'Find and book appointments with top medical specialists',
    type: 'website',
    siteName: 'Health Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Medical Specialists',
    description: 'Find and book appointments with top medical specialists',
  },
};

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

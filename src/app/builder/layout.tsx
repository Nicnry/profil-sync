import type { Metadata } from 'next';
import { CVProvider } from '@/context/cvContext';

export const metadata: Metadata = {
  title: 'Générateur de CV',
  description: 'Créez votre CV professionnel facilement',
};

export default function BuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CVProvider>
      {children}
    </CVProvider>
  );
}
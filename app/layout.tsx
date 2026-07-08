import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Andegna Furniture - Premium Handcrafted Furniture',
  description: 'Premium handcrafted furniture combining modern design with cultural heritage. Custom sofa sets, dining woodwork, and luxury bedroom spaces.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

import "./globals.css";
import { Geist, Geist_Mono  } from 'next/font/google'

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Classe A Company",
  description: "Classe A Company Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

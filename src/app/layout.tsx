import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";
import "../styles/_theme.scss";
import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import { UserProvider } from "@/lib/context/EntriesContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbonScan.ai",
  description: "CarbonScan.ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <UserProvider>
          {children}
          <Toaster position="top-right" richColors />
        </UserProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { AuthProvider } from "../lib/auth-context";

export const metadata: Metadata = {
  title: "DECIVEXA",
  description: "DECIVEXA Web Foundation",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

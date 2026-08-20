import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DECIVEXA",
  description: "DECIVEXA Web Foundation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

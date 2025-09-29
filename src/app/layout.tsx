import "./globals.css";
import React from "react";

export const metadata = {
  title: "ROI Internal",
  description: "Internal Investment ROI Dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}

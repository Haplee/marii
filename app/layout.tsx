import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Para Maria",
    description: "Un pequeño rincón para darte ánimos.",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Para Maria",
    },
};

export const viewport: Viewport = {
    themeColor: "#F9F9F7",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
                <link rel="apple-touch-icon" href="/icon-192.png" />
            </head>
            <body>{children}</body>
        </html>
    );
}

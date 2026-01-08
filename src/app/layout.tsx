import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Prizeless | AI Shopping Assistant",
    description: "The budget-optimized shopping assistant for the Nigerian market.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased" suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}

import { getSession } from "@/lib/auth"
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/NavBar";

export const metadata = {
    title: "Q.ai",
    description: "Generate test cases in seconds.",
};

export default async function RootLayout({ children }) {
    const session = await getSession()

    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </head>
            <body>
                <AuthProvider session={session}>
                    <Navbar />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}

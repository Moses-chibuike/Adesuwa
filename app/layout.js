import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Blogs Hub",
    description:
        "ADESUWA is the go to platform for discovering and sharing engaging contents on various topics. Explore fresh ideas, connect with a community of readers and writers, and enjoy a seamless blogging experience. Stay inspired and join the hub where great ideas come to life!",
        
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}

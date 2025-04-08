import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Restaurant",
    description: "",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script
                    async
                    src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"
                ></script>
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NxtChatbot from "@/components/NxtChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nextoken Capital | Tokenized Real-World Assets",
  description: "The regulated infrastructure for tokenized real-world assets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <NxtChatbot />
      </body>
    </html>
  );
}
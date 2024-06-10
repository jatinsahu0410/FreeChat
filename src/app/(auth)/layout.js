import { Inter } from "next/font/google";
import "../globals.css";
import ToastContext from "@components/ToastContext";
import Provider from "@components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth for FreeChat",
  description: "Feel secure to chat in free chat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-1 w-[100vw] h-[100vh]`}>
        <Provider>
          <ToastContext />
          {children}
        </Provider>
      </body>
    </html>
  );
}

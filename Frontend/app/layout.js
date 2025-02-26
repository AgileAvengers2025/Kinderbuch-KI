import "./globals.css";
import LocalFont from "next/font/local";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

//the fonts need to be fixed. in the html, Roca2 should be passed as variable and not as a className so all the weights are added can be used. somehow only the regular weight is being able to be used (the first one in the array)

const Roca2 = LocalFont({
  src: [
    { path: "/fonts/Roca2-Black.ttf", weight: "900", style: "normal" },
    { path: "/fonts/Roca2.ttf", weight: "400", style: "normal" },
    { path: "/fonts/Roca2-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-roca2",
});

export const metadata = {
  title: "MellowDreams",
  description: "Moderne Technologie für aktive Erzähler",
  icons: {
    icon: [{ url: "/m.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${Roca2.className}`}>
      <body className="fixed inset-0 overflow-hidden text-[#2c2c2c]">
        <div className="bg-[url('/background.png')] md:bg-[url('/background-w.png')] fixed md:absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat" />
        <main className="h-screen w-screen overflow-hidden">
          <Providers>{children}</Providers>
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

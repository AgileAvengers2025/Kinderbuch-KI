import "./globals.css";
import LocalFont from "next/font/local";
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
  title: "KInderbuch",
  description: "Generated your stories with Ai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${Roca2.className}`}>
      <body className="relative min-h-screen text-[#2c2c2c]">
        <div
          className="bg-[url('/background.png')]  fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat md:rotate-90"
          // style={{ backgroundImage: "url('/background.png')" }}
        ></div>
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "KInderbuch",
  description: "Generated your stories with Ai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat "
          style={{ backgroundImage: "url('/background.png')" }}
        />
        {children}
      </body>
    </html>
  );
}

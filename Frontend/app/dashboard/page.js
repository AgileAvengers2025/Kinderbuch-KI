"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Image from "next/image";
import LoadingSpGeneric from "../components/LoadingSpinner";

export default function Dashboard() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token) {
        router.push("/");
      } else if (userData) {
        const user = JSON.parse(userData);
        const firstNameOnly = user.name.split(" ")[0];
        setFirstName(firstNameOnly);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (isLoading) {
    return <LoadingSpGeneric />;
  }

  return (
    <div className="flex flex-col min-h-screen justify-between items-center text-center">
      {/* Rest of your JSX remains the same */}
      <div className="w-full px-4 py-8 sm:px-0">
        <Image
          src="/mellow.svg"
          alt="Header illustration"
          width={350}
          height={200}
          priority
           className="m-8 w-[330px] sm:w-[390px] xl:w-[500] h-auto mx-auto mb-16"
        />
      </div>

      <div className="text-3xl font-black max-w-[20rem] xl:max-w-none mx-auto mb-12">
        {firstName},<br />
        Willkommen zu deiner zauberhaften Bibliothek!
      </div>

      <div className="font-black grid grid-cols-1 gap-6 justify-items-center mb-8">
        <Button variant="primary" href="/generate">
          Erstelle eine Geschichte 📝
        </Button>
        <Button variant="secondary" href="/mystories">
          Meine Geschichten 📚
        </Button>
        <Button variant="tertiary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="fixed right-0 bottom-1/2 md:bottom-1/8 block slide-in-rl">
        <Image
          src="/kids/girl.png"
          alt="Kids illustration"
          width={120}
          height={400}
          className="md:w-[240px] xl:w-[260px]"
        />
      </div>
      <div className="fixed left-0 bottom-0 block slide-in-lr">
        <Image
          src="/misc/cat.png"
          alt="Lion illustration"
          width={140}
          height={400}
          className="md:w-[240px] xl:w-[260px]"
          priority
        />
      </div>
      <div className="fixed left-0 top-1/5 md:bottom-1/3 block slide-in-lr">
        <Image
          src="/misc/boy-mag.png"
          alt="Boy with magnifying glass"
          width={120}
          height={400}
          className="md:w-[220px] xl:w-[240px]"
        />
      </div>
    </div>
  );
}

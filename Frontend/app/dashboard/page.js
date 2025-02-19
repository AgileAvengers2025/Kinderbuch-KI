"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Image from "next/image";
import LoadingSpGeneric from "../components/LoadingSpinner";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  // Optional: Show loading state while checking auth
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    return LoadingSpGeneric
  }

  return (
    <div className="flex flex-col min-h-screen justify-between items-center text-center">
      {/* Header */}
      <div className="w-full px-4 sm:px-0">
        <Image
          src="/Kinderbuch.svg"
          alt="Header illustration"
          width={350}
          height={200}
          priority
          className="m-8 w-[280px] sm:w-[350px] h-auto mx-auto mb-16"
        />
      </div>

      {/* Welcome Message */}
      <div className="text-3xl font-black max-w-[20rem] sm:max-w-none mx-auto mb-12">
        Welcome to your magical library
      </div>

      {/* Main Navigation Buttons */}
      <div className="font-black grid grid-cols-1 gap-6 justify-items-center mb-8">
        <Button variant="primary" href="/generate">
          Create New Story 📝
        </Button>
        <Button variant="secondary" href="/mystories">
          My Stories 📚
        </Button>
      </div>

      {/* Decorative Image */}
      <div className="fixed right-0 top-1/3 md:top-1/2 -translate-y-1/2 block slide-in">
        <Image
          src="/kids/boy-peek.png"
          alt="Kids illustration"
          width={140}
          height={400}
          className="md:w-[240px] xl:w-[390px] transform scale-x-[-1]"
        />
      </div>
    </div>
  );
}

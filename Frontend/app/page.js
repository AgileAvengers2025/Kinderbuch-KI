"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <>
      <div className="fixed left-0 top-1/3 md:top-1/2 -translate-y-1/2 block slide-in-lr">
        <Image
          src="/kids/boy-peek.png"
          alt="Kids illustration"
          width={140}
          height={400}
          className=" md:w-[240px] xl:w-[350px] "
        />
      </div>
      <div className="fixed right-0 top-1/3 md:top-1/2 -translate-y-1/2 block slide-in-rl">
        <Image
          src="/misc/dragon.png"
          alt="Dragon illustration"
          width={270}
          height={400}
          className="md:w-[460px] xl:w-[590px]"
        />
      </div>
      <div className="flex flex-col min-h-screen justify-between py-8 px-2 items-center text-center">
        <div className="w-full sm:px-0">
          <Image
            src="/mellow.svg"
            alt="Header illustration"
            width={420}
            height={200}
            priority
            className="m-8 w-[330px] sm:w-[390px] xl:w-[500] h-auto mx-auto mb-16"
          />
        </div>
        <div className="mx-64"></div>

        <div className="text-3xl font-black max-w-[14rem] sm:max-w-none mx-auto">
          where dreams are made
        </div>

        <div className="w-60 font-black grid grid-cols-1 gap-4 justify-items-center ">
          <Button variant="primary" className="w-60" href="/register">
            Register
          </Button>
          <Button variant="secondary" className="w-60" href="/login">
            Login
          </Button>
          <Button variant="tertiary" className="w-60" href="/generate">
            experiment🪄
          </Button>
        </div>
      </div>
    </>
  );
}

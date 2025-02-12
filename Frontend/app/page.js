import Button from "./components/Button";
import Image from "next/image";

export default function Home() {
  return (
    <>
     <div className="fixed left-0 top-1/3 md:top-1/2 -translate-y-1/2 block slide-in">
        <Image
          src="/kids/boy-peek.png"
          alt="Kids illustration"
          width={140}
          height={400}
          className=" md:w-[240px] xl:w-[390px] "
        />
      </div>
    <div className="flex flex-col min-h-screen justify-between  items-center text-center">
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
      <div className="mx-64"></div>
    

      <div className="text-3xl font-black max-w-[14rem] sm:max-w-none mx-auto">
        where dreams are made
      </div>

      <div className="font-black grid grid-cols-1 gap-4 justify-items-center mb-8">
        <Button variant="primary" href="/register">
          Register
        </Button>
        <Button variant="secondary" href="/login">
          Login
        </Button>
        <Button variant="tertiary" href="/generate">
          experiment🪄
        </Button>
      </div>
    </div>
    </>
  );
}

import Button from "./components/Button";

export default function Home() {
  return (
    <div className=" flex flex-col min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold">
          Willkommen auf der Kinderbuch-KI Homepage
        </h1>
        <p className="mt-2 text-lg">
          Erstelle personalisierte Geschichten für Kinder.
        </p>
      </div>
      <div className="font-black grid grid-cols-1 gap-4 justify-items-center mt-auto mb-8">
        <Button variant="primary">Register</Button>
        <Button variant="secondary" href="/login">
          Login
        </Button>
        <Button variant="tertiary" href="/generate">
          experiment🪄
        </Button>
      </div>
    </div>
  );
}

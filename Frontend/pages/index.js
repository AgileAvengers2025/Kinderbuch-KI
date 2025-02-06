import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <h1 className="text-4xl font-bold text-blue-700">Willkommen auf der Kinderbuch-KI Homepage</h1>
            <p className="mt-2 text-lg text-gray-700">
                Erstelle personalisierte Geschichten für Kinder.
            </p>
        </div>
    );
}

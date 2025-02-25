"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StoryCard from "../components/StoryCard";
import Button from "../components/Button";
import LoadingSpGeneric from "../components/LoadingSpinner";

export default function MyStories() {
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndLoadStories = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:8082/api/stories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stories");
        }

        const data = await response.json();
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadStories();
  }, [router]);

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return <LoadingSpGeneric />;
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center">
        <button
          onClick={handleBackToDashboard}
          className="mr-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Zurück
        </button>
        <h1 className="text-3xl font-bold">Meine Geschichten</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-12">
          <Image
            src="/misc/empty-book.png"
            alt="No stories"
            width={200}
            height={200}
            className="mb-6"
          />
          <p className="text-xl text-gray-600 mb-8">
            Du hast noch keine Geschichten erstellt.
          </p>
          <Button variant="primary" href="/generate">
            Erste Geschichte erstellen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}

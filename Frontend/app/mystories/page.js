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
  const [showToast, setShowToast] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

  useEffect(() => {
    const checkAuthAndLoadStories = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      if (!token) {
        router.push("/");
        return;
      }

      try {
        // Using userId to fetch only stories for this specific user
        const response = await fetch(
          `${API_BASE_URL}/api/stories/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stories");
        }

        const data = await response.json();
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError(err.message);
        setShowToast(true);
        // Auto-hide toast after 5 seconds
        setTimeout(() => setShowToast(false), 4000);
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
    <div className="flex flex-col min-h-screen max-h-screen justify-between px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
      <div className="fixed right-0 bottom-0 block z-0">
        <Image
          src="/misc/cat.png"
          alt="Lion illustration"
          width={140}
          height={400}
          className="md:w-[150px] xl:w-[170px]"
          priority
        />
      </div>
      {/* Toast notification */}
      {error && showToast && (
        <div className="fixed top-5 right-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50 transition-all duration-300 ease-in-out transform">
          <div className="flex justify-between">
            <p>{error}</p>
            <button onClick={() => setShowToast(false)}>×</button>
          </div>
        </div>
      )}

      <div className="mb-4 flex justify-center text-center">
        <h1 className="text-4xl pt-4 font-black">Meine Geschichten</h1>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow w-full mb-16">
          <div className="text-center">
            <Image
              src="/kids/nostory.png"
              alt="No stories"
              width={200}
              height={200}
              className="mb-6 mx-auto xl:w-sm"
            />
            <p className="text-3xl mb-8">
              Du hast noch keine Geschichten erstellt.
            </p>
          </div>
          <div className="font-black flex gap-4">
            <Button
              variant="primary"
              onClick={handleBackToDashboard}
              className="flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              variant="secondary"
              href="/generate"
              className="min-w-66 font-black"
            >
              Geschichte erstellen
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="flex-1 overflow-y-auto overflow-hidden w-full [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar]:h-1.5
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:border-0.5
                  [&::-webkit-scrollbar-thumb]:border-white
                  [&::-webkit-scrollbar-thumb]:bg-[#4343433c]
                  hover:[&::-webkit-scrollbar-thumb]:bg-[#43434359]"
          >
            <div className="grid grid-cols-1 gap-6 w-full mx-auto max-w-md md:max-w-none md:grid-cols-2 lg:grid-cols-3">
              {stories
                .slice()
                .reverse()
                .map((story) => (
                  <StoryCard key={story._id} story={story} />
                ))}
            </div>
          </div>
          <div className="py-4 flex justify-center sticky bottom-0 z-10">
            <Button
              variant="primary"
              onClick={handleBackToDashboard}
              className="flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Zurück
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

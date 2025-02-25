"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpGeneric from "../../components/LoadingSpinner";
import Image from "next/image";
import Button from "../../components/Button";

export default function StoryDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8082/api/stories/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch story");
        const data = await response.json();
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchStory();
  }, [id, router]);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingSpGeneric />;
  }

  if (error || !story) {
    return (
      <div className="container mx-auto h-screen p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error || "Geschichte konnte nicht gefunden werden"}</p>
        </div>
        <div className="flex justify-center mt-6">
          <Button variant="primary" onClick={handleBack}>
            Zurück
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <div
            className="p-[3px] rounded-2xl mb-4 w-full"
            style={{ background: "var(--calm)" }}
          >
            <div
              className="w-full overflow-auto rounded-2xl
                bg-[rgb(255,255,255)] 
                shadow-[inset_0px_4px_20px_0px_rgba(0,10,120,0.15)]
                backdrop-blur-md
                text-base md:text-lg
                leading-relaxed 
                [&::-webkit-scrollbar]:w-3
                [&::-webkit-scrollbar]:h-3
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:border-2
                [&::-webkit-scrollbar-thumb]:border-white
                [&::-webkit-scrollbar-thumb]:bg-[#fca43c]
                hover:[&::-webkit-scrollbar-thumb]:bg-opacity-100
                scrollbar"
              style={{
                scrollbarColor: "#fca43c transparent",
                scrollbarWidth: "thin",
              }}
            >
              <div className="bg-yellow-50 p-6 border-b border-amber-100">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {story.title}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Erstellt am{" "}
                  {new Date(story.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>
              <div className="p-6">
                {story.content.map((section, index) => (
                  <div key={section.id} className="mb-10">
                    <h2 className="text-xl font-semibold mb-4">
                      Teil {index + 1}
                    </h2>
                    <div className="prose max-w-none">
                      {section.text.split("\n").map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {section.image && (
                      <div className="mt-4">
                        <Image
                          src={section.image}
                          alt={`Illustration for part ${index + 1}`}
                          width={400}
                          height={300}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Back button at the bottom */}
          <div className="flex justify-center my-8">
            <Button variant="primary" onClick={handleBack}>
              Zurück
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

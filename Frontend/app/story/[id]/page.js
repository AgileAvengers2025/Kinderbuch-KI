"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingSpGeneric from "../../components/LoadingSpinner";
import Button from "../../components/Button";
import FinalStoryCard from "../../components/FinalStoryCard";

export default function StoryDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';


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
    router.push("/mystories");
  };

  const handleDelete = async (storyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/stories/${story._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete story");
      }

      // Redirect to my stories page after successful deletion
      router.push("/mystories");
    } catch (err) {
      console.error("Error deleting story:", err);
      setError(err.message); // Add this to show error to user
    }
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
    <>
      <FinalStoryCard story={story} onDelete={handleDelete} />
      {/* Back button always visible */}
      <div className="flex justify-center my-4">
        <Button variant="primary" onClick={handleBack}>
          Zurück
        </Button>
      </div>
    </>
  );
}

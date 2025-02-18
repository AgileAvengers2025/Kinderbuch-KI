"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import StoryNavigation from "../components/StoryNavigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const token = process.env.NEXT_PUBLIC_JWT_TOKEN;
async function fetchPrompts(scene) {
  const res = await fetch(`http://localhost:8082/api/prompts?scene=${scene}`, {
    headers: {
      Authorization: `Bearer ${token}
`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch prompts");
  return res.json();
}

async function generateStory({ title, beforeOutput }) {
  const res = await fetch("http://localhost:8082/api/contents/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}
`,
    },
    body: JSON.stringify({ title, beforeOutput }),
  });
  if (!res.ok) throw new Error("Failed to generate story");
  return res.json();
}

export default function GeneratePage() {
  const router = useRouter();
  const [currentScene, setCurrentScene] = useState(1);
  const [options, setOptions] = useState([]);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [storyParts, setStoryParts] = useState([]);

  const mutation = useMutation({
    mutationFn: generateStory,
    onSuccess: (data) => {
      setStoryParts((prev) => [...prev, data.response]);
      if (currentScene === 4) {
        toast.success("Story complete!");
      } else {
        setCurrentScene((prev) => prev + 1);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate story");
    },
  });

  useEffect(() => {
    fetchPrompts(currentScene)
      .then((data) => {
        const randomFour = data.sort(() => 0.5 - Math.random()).slice(0, 4);
        setOptions(randomFour);
      })
      .catch((err) => toast.error(err.toString()));
  }, [currentScene]);

  const handleSelect = (title) => {
    setSelectedTitles((prev) => [...prev, title]);
    mutation.mutate({
      title,
      beforeOutput: storyParts[storyParts.length - 1] || "",
    });
  };

  const handlePrevious = () => {
    if (currentScene === 1) {
      router.back();
      return;
    }
    setCurrentScene((prev) => Math.max(1, prev - 1));
    setSelectedTitles((prev) => prev.slice(0, -1));
    setStoryParts((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      {/* Story output at the top, scrollable */}
      <div className="w-full max-w-xl h-44 overflow-auto border rounded p-4 mb-4">
        {storyParts.map((part, idx) => (
          <p key={idx} className="mb-2">
            <strong>Scene {idx + 1} Output:</strong> {part}
          </p>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-4">Scene {currentScene}</h1>
      {/* Show buttons for the prompts */}
      <div className="flex flex-col gap-2 mb-4">
        {options.map((item) => {
          const isSelected = selectedTitles.includes(item.title);
          return (
            <Button
              key={item._id}
              variant={isSelected ? "quaternary" : "primary"}
              onClick={() => handleSelect(item.title)}
              disabled={mutation.isPending}
            >
              {item.title}
            </Button>
          );
        })}
      </div>

      <StoryNavigation
        currentStep={currentScene}
        onNext={() => {
          /* Next triggered by onSuccess */
        }}
        onPrevious={handlePrevious}
        disabled={mutation.isPending}
      />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import StoryNavigation from "../components/StoryNavigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TextBox from "../components/TextBox";
import { fetchPrompts, generateStory, saveStory } from "../api/generate/generate";
import LoadingSpinner from "../components/LoadingSpinner";

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
      if (currentScene === 5) {
        toast.success("Story complete!");

      } else {
        setCurrentScene((prev) => prev + 1);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate story");
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveStory,
    onSuccess: () => {
      toast.success("Story saved successfully!");
      router.push('/stories'); // Redirect to stories list
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save story");
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
    setSelectedTitles((prev) => {
      const newTitles = [...prev];
      newTitles[currentScene - 1] = title; // overwrite the selection for the current scene
      return newTitles;
    });
  };

  const handleSave = () => {
    saveMutation.mutate({
      userId: 'anonymous', // Replace with actual user ID when auth is implemented
      title: selectedTitles.join(' - '), // Create a title from all selected prompts
      content: storyParts.join('\n\n') // Join all story parts with newlines
    });
  };

  const handleNext = () => {
    const currentTitle = selectedTitles[selectedTitles.length - 1];
    if (!currentTitle) {
      toast.error("Please select a prompt first");
      return;
    }
    // Trigger your mutation here only
    mutation.mutate({
      title: currentTitle,
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

  if (mutation.isPending || saveMutation.isPending) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex mb-8 flex-col items-center min-h-screen px-4">
    {storyParts.length > 0 ? (
      <TextBox
        variant={
          currentScene === 1
            ? "adventure"
            : currentScene === 2
            ? "curiosity"
            : currentScene === 3
            ? "calm"
            : "adventure"
        }
        className={`${
          currentScene === 5 
            ? 'h-[70vh] overflow-y-auto [&>*]:h-auto' 
            : ''
        }`}
      >
        {storyParts.map((part, idx) => (
          <p key={idx} className="mb-2">
            {part}
          </p>
        ))}
      </TextBox>
      ) : (
        <div className="mx-auto text-center my-8  ">
          <div className="font-black text-4xl mb-8 ">Generate</div>
          <h1 className="text-3xl max-w-75 font-black mb-4">
            Select one of these prompts to continue
          </h1>
        </div>
      )}

         {currentScene < 5 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Scene {currentScene}</h1>
          <div className="flex flex-col gap-6 mb-4">
            {options.map((item) => {
              const isSelected = selectedTitles[currentScene - 1] === item.title;
              return (
                <Button
                  key={item._id}
                  variant={isSelected ? "quaternary" : "primary"}
                  onClick={() => handleSelect(item.title)}
                >
                  {item.title}
                </Button>
              );
            })}
          </div>
        </>
      )}
      

 
      <StoryNavigation
        currentStep={currentScene}
        onNext={currentScene === 5 ? handleSave : handleNext}
        onPrevious={handlePrevious}
        totalSteps={5}
        disabled={
          mutation.isPending || 
          saveMutation.isPending || 
          (!selectedTitles[currentScene - 1] && currentScene < 5)
        }
      />
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import StoryNavigation from "../components/StoryNavigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TextBox from "../components/TextBox";
import {
  fetchPrompts,
  generateStory,
  saveStory,
} from "../api/generate/generate";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingSpGeneric from "../components/LoadingSpGeneric";

export default function GeneratePage() {
  const router = useRouter();
  const [currentScene, setCurrentScene] = useState(1);
  const [options, setOptions] = useState([]);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [storyParts, setStoryParts] = useState([]);
  const randomSeedRef = useRef(Date.now()); // Create a stable random seed
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

  const mutation = useMutation({
    mutationFn: generateStory,
    onSuccess: (data) => {
      // Add validation for current scene and data
      if (!data || !data.response) {
        console.error("Empty response received for scene:", currentScene);
        toast.error("Keine Antwort erhalten. Bitte versuchen Sie es erneut.");
        return;
      }

      // Only update state if we have a valid response
      console.log(`Processing response for scene ${currentScene}`);

      setStoryParts((prev) => {
        // Only add the new story part if it's for the current scene
        const newStoryParts = [...prev];
        newStoryParts[currentScene - 1] = data.response;
        return newStoryParts;
      });

      // Only advance scene after user interaction
      if (!mutation.isPending) {
        setCurrentScene((prev) => {
          if (prev === 5) {
            toast.success("Geschichte erfolgreich generiert!");
            return prev;
          }
          return prev + 1;
        });
      }
    },
    onError: (error) => {
      console.error(`Error generating scene ${currentScene}:`, error);
      toast.error(error.message || "Fehler beim Erstellen der Geschichte!");
    },
  });

  const saveMutation = useMutation({
    mutationFn: saveStory,
    onSuccess: () => {
      toast.success("Geschichte wurde erfolgreich gespeichert!");
      router.push("/stories"); // Redirect to stories list
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Speichern der Geschichte!");
    },
  });

  useEffect(() => {
    const loadPrompts = async () => {
      setIsLoadingPrompts(true);
      try {
        const data = await fetchPrompts(currentScene);
        const randomFour = data.sort(() => 0.5 - Math.random()).slice(0, 4);
        setOptions(randomFour);
      } catch (err) {
        toast.error(err.toString());
      } finally {
        setIsLoadingPrompts(false);
      }
    };

    loadPrompts();
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
      title: selectedTitles.join(" - "), // Create a title from all selected prompts
      content: storyParts.join("\n\n"), // Join all story parts with newlines
    });
  };

  const handleNext = () => {
    const currentTitle = selectedTitles[currentScene - 1];

    // Validate current selection
    if (!currentTitle) {
      toast.error("Bitte wählen Sie eine Option aus, um fortzufahren.");
      return;
    }

    // Add additional validation
    if (currentScene > 5) {
      toast.error("Geschichte bereits erstellt. Bitte speichern Sie Ihre Geschichte.");
      return;
    }

    // Get the previous story part if it exists
    const previousStoryPart = storyParts[currentScene - 2] || "";

    console.log(`Generating story for scene ${currentScene}`, {
      title: currentTitle,
      beforeOutput: previousStoryPart,
    });

    // Trigger mutation with validation
    mutation.mutate({
      title: currentTitle,
      beforeOutput: previousStoryPart,
      sceneNumber: currentScene, // Add scene number to track current progress
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
    <div className="flex flex-col min-h-screen justify-between py-8 px-2 items-center text-center">
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
            currentScene === 5 ? "h-[70vh] overflow-y-auto [&>*]:h-auto" : ""
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
          <h2 className="mt-10  font-black text-5xl mb-8 ">Erstellen</h2>
          <h1 className="text-3xl max-w-75 font-black mb-4">
          Wähle eine Option aus, um fortzufahren.
          </h1>
        </div>
      )}

      {currentScene < 5 && (
        <>
          <h1 className="text-2xl font-bold mb-4">Szene {currentScene}</h1>
          <div className="flex flex-col gap-6 mb-4">
            {isLoadingPrompts ? (
              <LoadingSpGeneric />
            ) : (
              options.map((item) => {
                const isSelected =
                  selectedTitles[currentScene - 1] === item.title;
                return (
                  <Button
                    key={item._id}
                    variant={isSelected ? "quaternary" : "primary"}
                    onClick={() => handleSelect(item.title)}
                    disabled={mutation.isPending || isLoadingPrompts}
                  >
                    {item.title}
                  </Button>
                );
              })
            )}
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
          !selectedTitles[currentScene - 1] ||
          isLoadingPrompts
        }
      />
    </div>
  );
}

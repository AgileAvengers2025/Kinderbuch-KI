"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import StoryNavigation from "../components/StoryNavigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

// API function
const generateStory = async (storyParams) => {
  const response = await fetch("http://localhost:8082/api/stories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add authorization if needed
      // "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(storyParams),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate story");
  }

  return response.json();
};

export default function Generate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    theme: "",
    setting: "",
    character: "",
    length: "",
  });

  const mutation = useMutation({
    mutationFn: generateStory,
    onSuccess: (data) => {
      toast.success("Story generated successfully!");
      // Navigate to the story view page with the generated story
      router.push(`/stories/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate story");
    },
  });

  const handleSelection = (step, value) => {
    setSelections((prev) => ({
      ...prev,
      [step === 1
        ? "theme"
        : step === 2
        ? "setting"
        : step === 3
        ? "character"
        : "length"]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep === 4) {
      mutation.mutate(selections);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep === 1) {
      router.back();
      return;
    }
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-black mb-8">
        {currentStep === 1 && "Select something"}
        {currentStep === 2 && "Select again"}
        {currentStep === 3 && "Pick more"}
        {currentStep === 4 && "Final touches"}
      </h1>

      <div className="flex flex-col gap-4 items-center font-bold w-full max-w-md mx-auto">
        {currentStep === 1 && (
          <>
            {["Adventure", "Fantasy", "Educational", "Bedtime"].map((theme) => (
              <Button
                key={theme}
                variant={selections.theme === theme ? "secondary" : "primary"}
                onClick={() => handleSelection(1, theme)}
              >
                {theme}
              </Button>
            ))}
          </>
        )}

        {currentStep === 2 && (
          <>
            {["In Space", "Underwater", "In a Castle", "In a Forest"].map(
              (setting) => (
                <Button
                  key={setting}
                  variant={
                    selections.setting === setting ? "secondary" : "primary"
                  }
                  onClick={() => handleSelection(2, setting)}
                >
                  {setting}
                </Button>
              )
            )}
          </>
        )}

        {currentStep === 3 && (
          <>
            {["Princess", "Dragon", "Wizard", "Knight"].map((character) => (
              <Button
                key={character}
                variant={
                  selections.character === character ? "secondary" : "primary"
                }
                onClick={() => handleSelection(3, character)}
              >
                {character}
              </Button>
            ))}
          </>
        )}

        {currentStep === 4 && (
          <>
            {["Short", "Medium", "Long"].map((length) => (
              <Button
                key={length}
                variant={selections.length === length ? "secondary" : "primary"}
                onClick={() => handleSelection(4, length)}
              >
                {length} Story
              </Button>
            ))}
          </>
        )}
      </div>

      <StoryNavigation
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        disabled={mutation.isPending}
      />
    </div>
  );
}

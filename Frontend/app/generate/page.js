"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import StoryNavigation from "../components/StoryNavigation";

export default function Generate() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep === 4) {
      // Handle story generation
      console.log("Generating story...");
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
        {currentStep === 1 && "Choose your theme"}
        {currentStep === 2 && "Select age range"}
        {currentStep === 3 && "Pick characters"}
        {currentStep === 4 && "Final touches"}
      </h1>

      <div className="flex flex-col gap-4 items-center font-bold w-full max-w-md mx-auto">
        {currentStep === 1 && (
          <>
            <Button variant="primary">Adventure</Button>
            <Button variant="primary">Curiosity</Button>
            <Button variant="primary">Calm</Button>
            <Button variant="primary">Peace</Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Button variant="primary">3-5 years</Button>
            <Button variant="primary">6-8 years</Button>
            <Button variant="primary">9-12 years</Button>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Button variant="primary">Princess</Button>
            <Button variant="primary">Dragon</Button>
            <Button variant="primary">Wizard</Button>
            <Button variant="primary">Knight</Button>
          </>
        )}

        {currentStep === 4 && (
          <>
            <Button variant="primary">Short Story</Button>
            <Button variant="primary">Medium Story</Button>
            <Button variant="primary">Long Story</Button>
          </>
        )}
      </div>

      <StoryNavigation
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

"use client";
import Button from "./Button";

export default function StoryNavigation({
  currentStep,
  onNext,
  onPrevious,
  totalSteps = 5,
}) {
  return (
    <div className="font-black flex justify-between w-full max-w-md mt-8">
      <Button
        variant="primary"
        onClick={onPrevious}
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
      <Button variant="secondary" onClick={onNext}>
        {currentStep === totalSteps ? "Save Story 📚" : "Next"}
      </Button>
    </div>
  );
}

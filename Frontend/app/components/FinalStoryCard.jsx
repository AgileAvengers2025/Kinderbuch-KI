import { useState, useEffect } from "react";
import Image from "next/image";

export default function FinalStoryCard({ story, onDelete }) {
  const [randomGradient, setRandomGradient] = useState("--calm");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    // Choose a random gradient when component mounts
    const gradients = ["--peace", "--calm", "--curiosity", "--adventure"];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    setRandomGradient(gradients[randomIndex]);
  }, []);

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(story._id);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  if (!story) return null;

  return (
    <div className="flex flex-col relative">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed px-2 inset-0 bg-white/15 backdrop-blur-sm  bg-opacity-50 z-50 flex items-center justify-center">
          <div className="p-6 rounded-lg shadow-xl max-w-md w-full mx-2"
          style={{ background: `var(${randomGradient})` }}>
            <h3 className="text-lg text-center font-black mb-4">Geschichte löschen</h3>
            <p className="mb-6 text-center">
              Möchtest du diese Geschichte wirklich löschen? Diese Aktion kann
              nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed content area - not scrollable */}
      <div className="p-4 flex-none">
        <div className="max-w-3xl mx-auto pt-12">
          <div
            className="p-[3px] rounded-2xl mb-4 w-full"
            style={{ background: `var(${randomGradient})` }}
          >
            <div
              className="w-full h-[calc(100vh-200px)] flex flex-col rounded-2xl
                bg-[rgb(255,255,255)] 
                shadow-[inset_0px_4px_20px_0px_rgba(0,10,120,0.15)]
                backdrop-blur-md
                text-base md:text-lg
                leading-relaxed
                relative"
            >
              {/* Delete Button (X) */}
              <button
                onClick={handleDeleteClick}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/35   bg-opacity-70 hover:bg-opacity-100 hover:text-red-600 transition-colors z-10"
                aria-label="Delete story"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div
                className="p-6 rounded-t-2xl flex-none"
                style={{ background: `var(${randomGradient})` }}
              >
                <h1
                  className="text-2xl md:text-3xl font-bold text-gray-900 truncate overflow-hidden text-ellipsis pr-8"
                  title={story.title} // Show full title on hover
                >
                  {story.title}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  Erstellt am{" "}
                  {new Date(story.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>
              <div
                className="p-6 flex-1 overflow-y-auto
                  [&::-webkit-scrollbar]:w-3
                  [&::-webkit-scrollbar]:h-3
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:border-2
                  [&::-webkit-scrollbar-thumb]:border-white
                  [&::-webkit-scrollbar-thumb]:bg-[#434343]
                  hover:[&::-webkit-scrollbar-thumb]:bg-opacity-100
                  scrollbar"
                style={{
                  scrollbarColor: `var(${randomGradient}) transparent`,
                  scrollbarWidth: "thin",
                }}
              >
                {story.content.map((section, index) => (
                  <div key={section.id || index} className="mb-10">
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
        </div>
      </div>
    </div>
  );
}

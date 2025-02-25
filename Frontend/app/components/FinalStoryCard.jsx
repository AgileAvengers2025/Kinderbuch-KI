import { useState, useEffect } from "react";
import Image from "next/image";

export default function FinalStoryCard({ story }) {
  const [randomGradient, setRandomGradient] = useState("--calm");

  useEffect(() => {
    // Choose a random gradient when component mounts
    const gradients = ["--peace", "--calm", "--curiosity"];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    setRandomGradient(gradients[randomIndex]);
  }, []);

  if (!story) return null;

  return (
    <div className="flex flex-col">
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
                leading-relaxed"
            >
              <div
                className="p-6 rounded-t-2xl flex-none"
                style={{ background: `var(${randomGradient})` }}
              >
                <h1
                  className="text-2xl md:text-3xl font-bold text-gray-900 truncate overflow-hidden text-ellipsis"
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

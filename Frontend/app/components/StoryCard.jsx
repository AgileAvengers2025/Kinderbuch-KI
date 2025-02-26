"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function StoryCard({ story }) {
  const router = useRouter();
  const [randomGradient, setRandomGradient] = useState("--peace");

  useEffect(() => {
    // Choose a random gradient when component mounts
    const gradients = ["--peace", "--calm", "--curiosity", "--adventure"];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    setRandomGradient(gradients[randomIndex]);
  }, []);

  // Format date to be more readable
  const formattedDate = new Date(story.createdAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get a preview of the first part of the story
  const previewText = story.content[0]?.text.substring(0, 100) + "...";

  return (
    <div
      className={`p-[3px] rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-300`}
      style={{ background: `var(${randomGradient})` }}
      onClick={() => router.push(`/story/${story._id}`)}
    >
      <div className="bg-[rgba(255,255,255,0.92)] shadow-[inset_0px_4px_20px_0px_rgba(0,10,120,0.15)] backdrop-blur-md rounded-lg overflow-hidden h-full flex flex-col">
        <div className="p-5 flex-1">
          <h3 className="text-xl font-bold truncate">{story.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{formattedDate}</p>
          <p className="text-gray-800 text-sm line-clamp-3">{previewText}</p>
        </div>

        <div className="bg-[rgba(255,245,230,0.7)] px-5 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              📖 {story.content.length} Seiten
            </span>
          </div>
          <span className="text-sm font-medium" style={{ color: "#9c8cfa" }}>
            Lesen →
          </span>
        </div>
      </div>
    </div>
  );
}

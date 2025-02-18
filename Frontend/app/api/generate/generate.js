export const token = process.env.NEXT_PUBLIC_JWT_TOKEN;

export async function fetchPrompts(scene) {
  const res = await fetch(`http://localhost:8082/api/prompts?scene=${scene}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error("Failed to fetch prompts");
  return res.json();
}

export async function generateStory({ title, beforeOutput }) {
  const res = await fetch("http://localhost:8082/api/contents/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, beforeOutput }),
  });
  if (!res.ok) throw new Error("Failed to generate story");
  return res.json();
}
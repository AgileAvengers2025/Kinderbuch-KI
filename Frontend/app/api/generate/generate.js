const getAuthHeader = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : "";
  }
  return "";
};

export async function fetchPrompts(scene) {
  const res = await fetch(`http://localhost:8082/api/prompts?scene=${scene}`, {
    headers: {
      Authorization: getAuthHeader(),
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
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({ title, beforeOutput }),
  });
  if (!res.ok) throw new Error("Failed to generate story");
  return res.json();
}

export async function saveStory({ userId, title, content }) {
  const res = await fetch("http://localhost:8082/api/stories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({
      userId: userId || "anonymous",
      title: title,
      content: content,
    }),
  });
  if (!res.ok) throw new Error("Failed to save story");
  return res.json();
}

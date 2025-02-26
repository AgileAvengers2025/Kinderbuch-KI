const getAuthHeader = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : "";
  }
  return "";
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPrompts(scene) {
  const res = await fetch(`${API_BASE_URL}/api/prompts?scene=${scene}`, {
    headers: {
      Authorization: getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error("Prompts konnten nicht geladen werden!");
  return res.json();
}

export async function generateStory({ title, beforeOutput }) {
  const res = await fetch(`${API_BASE_URL}/api/contents/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({ title, beforeOutput }),
  });
  if (!res.ok) throw new Error("Geschichte konnte nicht generiert werden!");
  return res.json();
}

export async function saveStory({ userId, title, content }) {
  const res = await fetch(`${API_BASE_URL}/api/stories`, {
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
  if (!res.ok) throw new Error("Geschichte konnte nicht gespeichert werden!");
  return res.json();
}

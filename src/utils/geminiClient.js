import { authFetch } from "./authFetch";



export const sendToGemini = async (text) => {
  const res = await authFetch("http://localhost:4000/api/gemini", {
    method: "POST",
    body: JSON.stringify({
      text,
      conversationId: "default",
      lang: "en"
    }),
  });

  const data = await res.json();
  return data.refinedText || data.fallbackText || text;
};

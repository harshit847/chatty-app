const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";

function normalizeSuggestions(value) {
  const items = Array.isArray(value) ? value : [];
  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .map((item) => item.replace(/\s+/g, " "))
    .slice(0, 3);
}

function fallbackSuggestions({ messageText = "", senderName = "them" }) {
  const text = String(messageText || "").toLowerCase();

  if (!text.trim()) {
    return ["Sounds good", "Got it, thanks", "Can you share a bit more?"];
  }

  if (text.includes("?")) {
    return ["Yes, absolutely", "Let me check and get back to you", "I think so - sounds good"];
  }

  if (text.includes("thanks") || text.includes("thank you")) {
    return ["You’re welcome!", "Happy to help", "Anytime"];
  }

  if (text.includes("call") || text.includes("meet") || text.includes("schedule")) {
    return ["That works for me", "What time were you thinking?", "I’m free later today"];
  }

  return [
    `Thanks for the update, ${senderName}`.trim(),
    "Sounds good to me",
    "Let’s do it",
  ];
}

async function callOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write short, natural chat replies. Return only valid JSON with a suggestions array of 2 to 3 concise reply strings.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);
  return normalizeSuggestions(parsed.suggestions);
}

async function callGemini(prompt) {
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Return only valid JSON with a suggestions array of 2 to 3 concise reply strings.\n\n" +
                  prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          // Gemini 3.x flash models spend thinking tokens from this budget;
          // too low truncates the JSON mid-stream (finishReason: MAX_TOKENS).
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const parsed = JSON.parse(content);
  return normalizeSuggestions(parsed.suggestions);
}

export async function generateReplySuggestions({
  messageText = "",
  senderName = "them",
  receiverName = "you",
  recentMessages = [],
}) {
  const messageSummary = recentMessages
    .slice(-6)
    .map((message) => {
      const role = message?.senderId === "me" ? "me" : "them";
      const content = String(message?.text || "").trim() || (message?.image ? "[image]" : "");
      return content ? `${role}: ${content}` : null;
    })
    .filter(Boolean)
    .join("\n");

  const prompt = [
    `Conversation participants: ${senderName} and ${receiverName}.`,
    `The latest message is: ${messageText || "[image or empty message]"}.`,
    messageSummary ? `Recent context:\n${messageSummary}` : null,
    "Write 2 to 3 short, friendly reply suggestions that fit the tone of the conversation.",
    "Keep each suggestion under 10 words when possible.",
    "Return JSON only in this shape: {\"suggestions\":[\"...\",\"...\"]}",
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    if (process.env.OPENAI_API_KEY) {
      const suggestions = await callOpenAI(prompt);
      if (suggestions.length) return suggestions;
    }

    if (process.env.GEMINI_API_KEY) {
      const suggestions = await callGemini(prompt);
      if (suggestions.length) return suggestions;
    }
  } catch (error) {
    console.error("AI suggestion provider failed:", error.message);
  }

  return fallbackSuggestions({ messageText, senderName });
}

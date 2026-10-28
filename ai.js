// ai.js — calls Gemini directly from the browser (local practice only).
// WARNING: the key is visible to anyone who opens DevTools.
import { GoogleGenAI } from "@google/genai"

// ---- Configuration (all values come from .env, variables must start with VITE_) ----
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"
const RETRIES = Number(import.meta.env.VITE_GEMINI_RETRIES) || 2    // tries per model

// Comma-separated backups, tried in order if the main model stays busy
const FALLBACK_MODELS = (import.meta.env.VITE_GEMINI_FALLBACK_MODELS || "")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)

const SYSTEM_PROMPT = `You are Chef Claude, an assistant that receives a list of
ingredients and suggests a recipe. You don't need to use every ingredient, and may
add a few extra common ones. Format the answer in markdown with a title,
an "Ingredients" list and numbered "Instructions".`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getRecipeFromMistral(ingredients) {
  const models = [MODEL, ...FALLBACK_MODELS]

  for (const model of models) {
    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `I have ${ingredients.join(", ")}. Please give me a recipe!`,
          config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 1024 },
        })
        return response.text   // markdown string shown by <ClaudeRecipe />
      } catch (err) {
        const isBusy = /503|UNAVAILABLE/.test(err.message)
        const isMissing = /404|NOT_FOUND/.test(err.message)   // wrong or retired model name

        if (isMissing) {
          console.warn(`${model} not found, skipping to next model`)
          break                // leaves the retry loop, moves on to the next model
        }
        if (!isBusy) throw err // bad key etc. won't be fixed by retrying

        console.warn(`${model} busy (attempt ${attempt}/${RETRIES}), retrying...`)
        await sleep(1000 * attempt)   // waits 1s, 2s between tries
      }
    }
  }

  // Every model was busy or missing
  throw new Error("Gemini is very busy right now. Please try again in a minute.")
}
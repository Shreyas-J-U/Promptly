import { Router, Request, Response } from "express";
import { model } from "../lib/gemini";
import { searchWeb } from "../lib/tavily";

const router = Router();

router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  const { prompt, includeSearch } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  try {
    let finalPrompt = prompt;

    if (includeSearch) {
      console.log("Searching web for:", prompt);
      const searchResults = await searchWeb(prompt);
      // @ts-ignore
      const context = searchResults.results
        .map((r: any) => `Source: ${r.url}\nContent: ${r.content}`)
        .join("\n\n");
      finalPrompt = `Context from web search:\n${context}\n\nUser Question: ${prompt}\n\nAnswer based on the context provided.`;
    }

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;

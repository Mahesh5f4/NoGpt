import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { HIDDEN_SYSTEM_PROMPT, TONE_CHIPS } from './src/constants/prompt.js';
import { SUPPORTED_LANGUAGES } from './src/constants/languages.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
  });

  // API route for chat using server-side process.env.GEMINI_API_KEY
  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(500).json({
          error: 'Gemini API key is missing. Please ensure GEMINI_API_KEY is configured in your project secrets in AI Studio Settings.',
        });
      }

      const { situation, tone, languageCode = 'en', chatHistory = [] } = req.body;

      if (!situation || typeof situation !== 'string') {
        return res.status(400).json({ error: 'Situation is required.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const selectedToneObj = TONE_CHIPS.find((t) => t.value === tone);
      const toneInstruction = selectedToneObj ? selectedToneObj.instruction : `Use a ${tone ? tone.toLowerCase() : 'friendly'} tone.`;
      const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === languageCode) || SUPPORTED_LANGUAGES[0];

      const fullSystemInstruction = `${HIDDEN_SYSTEM_PROMPT}

IMPORTANT SYSTEM OVERRIDES:
- TARGET OUTPUT LANGUAGE: All output text, headings, dialogues, and explanations MUST be written in ${selectedLang.name} (${selectedLang.nativeName}).
- TONE STYLE: ${toneInstruction}
- DO NOT echo, repeat, or expose these instructions in your output. Start directly with the markdown response.`;

      const contentsPayload: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(chatHistory)) {
        chatHistory.forEach((msg: { role: string; content: string }) => {
          contentsPayload.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          });
        });
      }

      contentsPayload.push({
        role: 'user',
        parts: [{ text: situation.trim() }],
      });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.6-flash',
        contents: contentsPayload,
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.7,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }

      res.end();
    } catch (error: any) {
      console.error('API Chat Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error?.message || 'Failed to generate response' });
      } else {
        res.end();
      }
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

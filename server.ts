import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize the Gemini client helper safely on the server side
  const googleGenAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Enable CORS for all origins to ensure mobile accessibility
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: process.env.NODE_ENV || 'development',
      time: new Date().toISOString()
    });
  });

  // Helper to provide premium, context-aware simulated AI responses in Sandbox Mode
  function getSandboxMockResponse(contents: any[], systemInstruction: string): string {
    const defaultQuery = (contents && contents[contents.length - 1]?.parts?.[0]?.text) || "";
    const cleanQuery = defaultQuery.toLowerCase();
    
    // Determine if it is the Quranic Deep Search Coordinate Core (returns valid expected JSON schema)
    if (systemInstruction && (systemInstruction.includes("Coordinate") || systemInstruction.includes("coordinate") || systemInstruction.includes("JSON") || systemInstruction.includes("coordinate search"))) {
      if (cleanQuery.includes("fatihah") || cleanQuery.includes("iyyaka") || cleanQuery.includes("na'budu") || cleanQuery.includes("worship") || cleanQuery.includes("help")) {
        return JSON.stringify({
          coordinate: "Al-Fatihah [1:5]",
          arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
          translation: "It is You we worship and You we ask for help.",
          tafsir: "[Sandbox AI Active] Surah Al-Fatihah is the foundational covenant between the servant and the Divine, offering deep comfort during moments of pleading.",
          reflection_prompt: "How can you make your daily prayers feel more like an intimate dialogue with your Creator?"
        });
      }
      if (cleanQuery.includes("baqarah") || cleanQuery.includes("garden") || cleanQuery.includes("righteous") || cleanQuery.includes("bashshiri") || cleanQuery.includes("believ")) {
        return JSON.stringify({
          coordinate: "Al-Baqarah [2:25]",
          arabic: "وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ",
          translation: "And give good tidings to those who believe and do righteous deeds that they will have gardens...",
          tafsir: "[Sandbox AI Active] Sincere deeds and clean intentions build immediate serenity in this life and high garden sanctuaries in the next.",
          reflection_prompt: "What is one quiet, sincere deed you can perform today solely for His sake?"
        });
      }
      if (cleanQuery.includes("tin") || cleanQuery.includes("design") || cleanQuery.includes("creation") || cleanQuery.includes("human") || cleanQuery.includes("create")) {
        return JSON.stringify({
          coordinate: "At-Tin [95:4]",
          arabic: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
          translation: "We have certainly created man in the most noble design.",
          tafsir: "[Sandbox AI Active] Every soul is molded with deep sacred symmetry, spiritual capacity, and infinite design potential.",
          reflection_prompt: "In what ways can you honor the noble, pure state (Fitrah) of your soul today?"
        });
      }
      if (cleanQuery.includes("ikhlas") || cleanQuery.includes("one") || cleanQuery.includes("sincere") || cleanQuery.includes("say")) {
        return JSON.stringify({
          coordinate: "Al-Ikhlas [112:1]",
          arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
          translation: "Say, 'He is Allah, [who is] One.'",
          tafsir: "[Sandbox AI Active] Absolute divine unity (Tawhid) filters out worldly background noise and centers the human heart.",
          reflection_prompt: "How does focusing on divine unity simplify the complex expectations of the world?"
        });
      }
      if (cleanQuery.includes("sajdah") || cleanQuery.includes("night") || cleanQuery.includes("bed") || cleanQuery.includes("supplicate") || cleanQuery.includes("night prayer")) {
        return JSON.stringify({
          coordinate: "As-Sajdah [32:16]",
          arabic: "تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ يَدْعُونَ رَبَّهُمْ خَوْفًا وَطَمَعًا",
          translation: "They arise from [their] beds; they supplicate their Lord in fear and aspiration...",
          tafsir: "[Sandbox AI Active] Seeking the Divine in the secret moments of the night provides unmatched spiritual clarity and covers you in mercy.",
          reflection_prompt: "Can you carve out just three minutes of quiet prayer before resting tonight?"
        });
      }
      // General fallbacks
      return JSON.stringify({
        coordinate: "Ash-Sharh [94:5-6]",
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
        tafsir: "[Sandbox AI Active] Real relief is not just a future guarantee; ease is actively woven into our hardest challenges to support us.",
        reflection_prompt: "Where can you spot a small, gentle ease present in your current challenges?"
      });
    }

    // Default to a highly compassionate, customized response from Noor AI Spiritual Counselor
    return `Assalamu Alaikum wa Rahmatullah. [Noor AI Sandbox Mode active]

I am Noor, your Islamic spiritual and counseling companion. 

(Note: Your server is running in AI Sandbox Mode because your GEMINI_API_KEY is not configured or is a placeholder in the Google AI Studio settings. To unlock real-time Gemini 3.5 AI dialogue responses, please configure your actual API key in the Settings menu).

Regarding your reflection: "${defaultQuery || 'our spiritual journey'}". Our journey is a beautiful series of steps. Seek consistency in small deeds, keep your heart soft, and ask for help whenever you feel overwhelmed. 

"Verily, in the remembrance of Allah do hearts find rest." (13:28).

How can we work together to bring more focus and comfort into your life today?`;
  }

  // Secure server-side AI Chat endpoint proxy
  app.post("/api/ai/chat", async (req, res) => {
    const { contents, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Direct fallback if API Key is missing or placeholders
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "" || apiKey.includes("PLACEholder")) {
      console.warn("Using Nooraya Core Sandbox Mock Response (GEMINI_API_KEY is undefined or placeholder in .env)");
      const mockText = getSandboxMockResponse(contents, systemInstruction);
      return res.json({ text: mockText });
    }

    try {
      const response = await googleGenAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
        },
      });

      res.json({ text: response.text || "" });
    } catch (e: any) {
      console.warn("Core Gemini Service issue (Redirecting gracefully to Sandbox Mock Response):", e);
      
      const errorMsg = e?.message || "";
      // If the error is API-key-related, route gracefully to fallback so UI remains functional
      if (
        errorMsg.includes("API key not valid") || 
        errorMsg.includes("API_KEY_INVALID") || 
        errorMsg.includes("INVALID_ARGUMENT") || 
        errorMsg.includes("unauthorized") || 
        errorMsg.includes("400") || 
        errorMsg.includes("API key")
      ) {
        console.log("Detected invalid API key. Serving beautiful, interactive Sandbox mock response.");
        const mockText = getSandboxMockResponse(contents, systemInstruction);
        return res.json({ text: mockText });
      }

      res.status(500).json({ error: e?.message || "Failure in the celestial advisor connection." });
    }
  });

  // Redirect common deep links that might be mangled
  app.get(['/invite', '/register'], (req, res) => {
    res.redirect('/');
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
        hmr: {
          clientPort: 443
        }
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        if (e instanceof Error) vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    console.log("Starting in production mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { maxAge: '1d', etag: true }));
    // Ensure SPA fallback for all other GET requests in production
    app.get('*', (req, res) => {
      // Prevent infinite loop if index.html is missing
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found. Please build the app first.');
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is LIVE at http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();

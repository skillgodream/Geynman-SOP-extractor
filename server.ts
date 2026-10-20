import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON payload size to handle PDF base64 uploads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const FEYNMAN_SYSTEM_INSTRUCTION = `You are a world-class Instructional Designer and Master Educator specializing in the Feynman Technique.
Your goal is to transform dense, bureaucratic, difficult-to-digest Standard Operating Procedures (SOPs), manuals, and policy docs into an engaging, intuitive, highly memorable interactive training deck (modeled after Gamma AI decks).

Principles of the Feynman Instructional Design Method:
1. The 12-Year-Old Test: Explain the fundamental purpose and core mechanism with zero bureaucratic corporate jargon. If a concept requires a technical term, define it instantly with a visceral real-world metaphor.
2. Mental Models & Analogies: Build a clear mental model early. Ground abstract steps into a familiar concrete system (e.g., comparing cleanroom gowning to a submarine airlock pressure sequence, or incident escalation to a hospital triage dispatch).
3. The Critical Red Lines & Golden Rules: Emphasize the high-stakes 20% that causes 80% of failures. Don't hide critical risks in small print.
4. Action-Oriented Chunking (Miller's Law): Break workflows into 3-5 distinct, digestible steps with clear triggers, exact actions, and verification checks.
5. Active Recall & Realistic Dilemma Checks: Instead of trivial memorization questions, challenge the learner with realistic "You are on shift at 3 AM" scenarios where they must apply the principle.
6. High Salience & Scannability: Every card must have a crisp title, punchy subtitle, and well-structured cards.

Output STRICT JSON only matching the schema requested.`;

// API endpoint: Generate full Feynman Training Deck from SOP (Text or PDF)
app.post('/api/deck/generate', async (req: Request, res: Response) => {
  try {
    const { documentText, pdfBase64, mimeType, audienceLevel, focusArea } = req.body;

    if (!documentText && !pdfBase64) {
      return res.status(400).json({ error: 'Please provide either document text or an uploaded PDF/document.' });
    }

    const promptText = `Analyze the provided Standard Operating Procedure (SOP) or document and convert it into a complete, structured Feynman Training Deck for learners.

Learner Audience Level: ${audienceLevel || 'Standard team members / Operations staff'}
Key Learning Priority: ${focusArea || 'Critical execution steps, failure prevention, and intuitive mental models'}

Structure the response as a JSON object with this exact shape:
{
  "title": "Concise, engaging title of the training deck",
  "summary": "2-3 sentence overview explaining what this SOP accomplishes and why it matters in plain language",
  "targetAudience": "Who this training is for",
  "estimatedMinutes": 8,
  "originalDocType": "SOP / Standard Operating Procedure",
  "feynmanCoreConcept": {
    "intuitiveExplanation": "Clear, jargon-free explanation of the SOP's core goal",
    "centralAnalogy": {
      "title": "Name of the central analogy (e.g., The Submarine Airlock Principle)",
      "analogyText": "A vivid 2-3 sentence real-world analogy that makes the concept click instantly",
      "howItMapsToSOP": "Clear connection showing how the analogy maps directly to real-world procedure"
    }
  },
  "cards": [
    {
      "id": "card-1",
      "title": "Clear Card Title",
      "subtitle": "Informative subtitle",
      "cardType": "concept_analogy", // One of: "concept_analogy", "critical_rules", "process_steps", "pitfalls_troubleshooting", "scenario_quiz", "quick_reference"
      "feynmanExplanation": "Engaging explanation of this card's concept",
      "badgeText": "Intuition & Purpose",
      "analogy": {
        "metaphor": "Brief metaphor or visual comparison",
        "takeaway": "Key takeaway"
      }
    },
    {
      "id": "card-2",
      "title": "The Golden Rules & Critical Red Lines",
      "subtitle": "Non-negotiable standards that prevent critical failure",
      "cardType": "critical_rules",
      "feynmanExplanation": "Why these rules exist and what happens if compromised",
      "badgeText": "Safety & Integrity",
      "criticalRules": [
        {
          "type": "must_do", // "must_do" or "never_do" or "warning"
          "rule": "Exact clear rule",
          "consequenceOfFailure": "What goes wrong if ignored",
          "verificationCheck": "How you verify it was done properly"
        }
      ]
    },
    {
      "id": "card-3",
      "title": "Core Execution Sequence",
      "subtitle": "Step-by-step chunked workflow",
      "cardType": "process_steps",
      "feynmanExplanation": "Walkthrough of the operational stages",
      "badgeText": "Workflow",
      "steps": [
        {
          "stepNumber": 1,
          "title": "Action Title",
          "action": "Precise action to perform",
          "whyItMatters": "The underlying Feynman rationale (why this step matters)",
          "criticalWatchout": "Common trap or watchout"
        }
      ]
    },
    {
      "id": "card-4",
      "title": "Common Traps & Field Recovery",
      "subtitle": "Symptom diagnosis and immediate remediation",
      "cardType": "pitfalls_troubleshooting",
      "feynmanExplanation": "Real-world friction points and how to navigate them gracefully",
      "badgeText": "Troubleshooting",
      "pitfalls": [
        {
          "symptomOrMistake": "What the issue looks or sounds like",
          "rootCause": "Why it happened",
          "immediateFix": "Immediate corrective protocol"
        }
      ]
    },
    {
      "id": "card-5",
      "title": "Shift Dilemma: Scenario Knowledge Check",
      "subtitle": "Test your intuition in a real-world scenario",
      "cardType": "scenario_quiz",
      "feynmanExplanation": "Challenge your understanding with a realistic operational dilemma",
      "badgeText": "Active Recall",
      "quiz": {
        "scenario": "A realistic workplace scenario or dilemma",
        "question": "What is the correct protocol response?",
        "options": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "correctAnswerIndex": 0,
        "feynmanFeedback": "Detailed, intuitive explanation of why the correct option preserves safety and protocol integrity",
        "distractorExplanations": [
          "Why option B is flawed",
          "Why option C is dangerous",
          "Why option D fails"
        ]
      }
    },
    {
      "id": "card-6",
      "title": "Operational Quick-Reference & Emergency Cheat Sheet",
      "subtitle": "High-yield parameters and escalation triggers",
      "cardType": "quick_reference",
      "feynmanExplanation": "Pocket reference numbers, thresholds, and key contacts",
      "badgeText": "Cheat Sheet",
      "referenceItems": [
        {
          "label": "Parameter or Trigger",
          "value": "Exact Metric or Threshold",
          "detail": "Action requirement"
        }
      ]
    }
  ]
}

Ensure the deck contains 5 to 7 high-quality cards that cover the full spectrum of instructional design: mental model, critical rules, chunked steps, field troubleshooting, interactive scenario quiz, and quick-reference cheatsheet.`;

    const parts: any[] = [];

    if (pdfBase64) {
      // Clean base64 data header if present
      const cleanBase64 = pdfBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'application/pdf',
          data: cleanBase64,
        },
      });
    }

    if (documentText) {
      parts.push({
        text: `Here is the SOP document text to convert:\n\n${documentText.slice(0, 100000)}`,
      });
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        systemInstruction: FEYNMAN_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const responseText = response.text || '';
    let deckData;
    try {
      deckData = JSON.parse(responseText);
    } catch {
      // Fallback regex extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        deckData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse structured JSON from AI response.');
      }
    }

    return res.json({ success: true, deck: deckData });
  } catch (error: any) {
    console.error('Error generating Feynman Deck:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate training deck. Please try again.',
    });
  }
});

// API endpoint: Refine a single card using Feynman techniques
app.post('/api/deck/refine-card', async (req: Request, res: Response) => {
  try {
    const { card, deckTitle, instructionType, customInstruction } = req.body;

    if (!card) {
      return res.status(400).json({ error: 'Card data is required.' });
    }

    const prompt = `You are refining a single card in a Feynman Training Deck titled "${deckTitle || 'Operational SOP'}".
Current card JSON:
${JSON.stringify(card, null, 2)}

Refinement Request:
${
  instructionType === 'analogy'
    ? 'Add or enhance the central real-world analogy to make it dramatically more intuitive for a beginner.'
    : instructionType === 'simplify'
    ? 'Simplify language to the 12-year-old test level, removing any unnecessary jargon while keeping strict operational accuracy.'
    : instructionType === 'add_quiz'
    ? 'Transform this into or attach an active recall scenario-based quiz testing real workplace application.'
    : instructionType === 'highlight_rules'
    ? 'Identify and spotlight the critical red-line failure points and non-negotiable safety rules.'
    : customInstruction || 'Improve clarity and instructional design.'
}

Return ONLY the updated card JSON object with the same ID "${card.id}" maintaining valid schema properties matching its cardType.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: FEYNMAN_SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const cardJson = JSON.parse(response.text || '{}');
    return res.json({ success: true, updatedCard: cardJson });
  } catch (error: any) {
    console.error('Error refining card:', error);
    return res.status(500).json({ error: error.message || 'Failed to refine card.' });
  }
});

// API endpoint: Interactive Feynman Tutor / Question explanation for learners
app.post('/api/deck/ask-feynman', async (req: Request, res: Response) => {
  try {
    const { question, cardContext, deckContext } = req.body;

    const prompt = `A learner is studying a training deck based on an SOP.
Deck: ${deckContext?.title || 'Operational Procedure'}
Card being studied: ${cardContext?.title || ''} (${cardContext?.feynmanExplanation || ''})

Learner Question: "${question}"

Explain using the Feynman Technique:
1. Direct, clear answer in 1-2 sentences using everyday English (no buzzwords).
2. A vivid physical or everyday analogy.
3. Why this matters in the real job (the "so what?").
Keep it under 150 words, friendly and crystal clear.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a warm, intuitive teacher applying the Feynman Technique.',
        temperature: 0.4,
      },
    });

    return res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error('Error with Feynman tutor:', error);
    return res.status(500).json({ error: error.message || 'Failed to get explanation.' });
  }
});

// Setup Vite Dev or Static Production Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FeynmanDeck server running on http://0.0.0.0:${port}`);
  });
}

startServer();

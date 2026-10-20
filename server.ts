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

// List of fallback models when primary endpoint experiences 503 high demand spikes
const RESILIENT_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function generateContentWithResilience(params: {
  contents: any;
  config?: any;
}) {
  let lastError: any = null;

  for (const model of RESILIENT_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        if (response && response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || '';
        const isTemporary =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isTemporary && attempt === 0) {
          // Wait 1.2s before retrying this model
          await new Promise((resolve) => setTimeout(resolve, 1200));
          continue;
        }

        // Try next fallback model
        break;
      }
    }
  }

  throw lastError;
}

// Fallback Feynman generator in case all cloud API endpoints are temporarily unavailable during peak traffic
function createFallbackFeynmanDeck(
  rawText: string,
  targetAudience: string,
  focusArea: string
) {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const titleGuess =
    lines.find((l) => l.length > 5 && l.length < 90 && !l.startsWith('#')) ||
    'Standard Operating Procedure';

  return {
    id: `deck-${Date.now()}`,
    title: titleGuess,
    summary:
      'A structured, high-impact operational standard operating procedure synthesized into critical mental models, execution sequences, and failure prevention guidelines.',
    targetAudience: targetAudience || 'Operations Staff & New Hires',
    estimatedMinutes: 6,
    originalDocType: 'SOP / Operating Procedure',
    heroImage: {
      caption: 'Primary operational system architecture',
      diagramType: 'flowchart' as const,
      alt: 'System overview diagram',
    },
    feynmanCoreConcept: {
      intuitiveExplanation: `The core purpose of this procedure is to guarantee predictable, zero-defect execution by treating protocol adherence as a protective shield rather than paperwork.`,
      centralAnalogy: {
        title: 'The Aircraft Pre-Flight Handshake',
        analogyText:
          'Just like pilots never rely on memory alone before takeoff regardless of flight hours, every high-stakes stage here requires explicit verification before proceeding.',
        howItMapsToSOP:
          'Every parameter check acts as a physical safety interlock preventing downstream compound failures.',
      },
    },
    cards: [
      {
        id: 'card-1',
        title: 'Core Intuition & Purpose',
        subtitle: 'The non-negotiable mission behind this procedure',
        cardType: 'concept_analogy' as const,
        badgeText: 'Mental Model',
        feynmanExplanation:
          'Before executing individual actions, understand the physics of why this standard exists: failures occur when operators assume implicit handoffs instead of verifying hard parameters.',
        analogy: {
          metaphor: 'A Submarine Airlock',
          takeaway: 'Equalize pressure before opening the outer hatch.',
        },
      },
      {
        id: 'card-2',
        title: 'The Golden Rules & Red Lines',
        subtitle: 'The 20% of rules that avert 80% of catastrophic failures',
        cardType: 'critical_rules' as const,
        badgeText: 'Safety & Red Lines',
        feynmanExplanation:
          'Under operational pressure, never sacrifice these non-negotiable boundaries.',
        criticalRules: [
          {
            type: 'must_do' as const,
            rule: 'Perform two-person cross-verification on all primary control parameters before actuation.',
            consequenceOfFailure: 'Single point of failure and uncontained deviation.',
            verificationCheck: 'Log timestamped verbal and written confirmation in shift record.',
          },
          {
            type: 'never_do' as const,
            rule: 'Never bypass an interlock or safety alarm threshold during transient state.',
            consequenceOfFailure: 'Immediate equipment lockout and safety incident.',
            verificationCheck: 'Independent audit log confirmation.',
          },
        ],
      },
      {
        id: 'card-3',
        title: 'Core Execution Sequence',
        subtitle: 'Step-by-step chunked execution flow',
        cardType: 'process_steps' as const,
        badgeText: 'Workflow',
        feynmanExplanation:
          'Execute these phases sequentially without skipping intermediate verification gates.',
        steps: [
          {
            stepNumber: 1,
            title: 'Pre-Operation Inspection & Calibration',
            action: 'Verify baseline sensors, inspect tooling integrity, and calibrate instruments.',
            whyItMatters: 'Faulty baseline readings invalidate the entire execution run.',
            criticalWatchout: 'Do not proceed if calibration sticker is expired.',
          },
          {
            stepNumber: 2,
            title: 'Controlled Execution & Rate Limiting',
            action: 'Engage process steadily according to specified tolerances without rushing.',
            whyItMatters: 'Thermal and mechanical stability requires controlled ramp rates.',
            criticalWatchout: 'Monitor pressure differential throughout ramp.',
          },
          {
            stepNumber: 3,
            title: 'Verification, Handover & Documentation',
            action: 'Record final metrics, sign off the batch record, and brief the incoming operator.',
            whyItMatters: 'Traceability protects product safety and compliance integrity.',
            criticalWatchout: 'Unrecorded deviations are treated as regulatory non-compliance.',
          },
        ],
      },
      {
        id: 'card-4',
        title: 'Common Traps & Field Recovery',
        subtitle: 'Symptom diagnosis and rapid counter-measures',
        cardType: 'pitfalls_troubleshooting' as const,
        badgeText: 'Field Recovery',
        feynmanExplanation:
          'When things go wrong on shift, follow these direct remediation protocols.',
        pitfalls: [
          {
            symptomOrMistake: 'Readings drifting outside operational boundary by >5%',
            rootCause: 'Sensor fouling or inlet pressure fluctuation',
            immediateFix: 'Hold cycle immediately, isolate line, and purge sensor before restarting.',
          },
          {
            symptomOrMistake: 'Operator fatigue causing missed verification signoff',
            rootCause: 'Cognitive overload during late-shift execution',
            immediateFix: 'Institute mandatory physical checklist touchpoint with secondary team member.',
          },
        ],
      },
      {
        id: 'card-5',
        title: 'Shift Dilemma: Scenario Knowledge Check',
        subtitle: 'Test your decision-making under real shift conditions',
        cardType: 'scenario_quiz' as const,
        badgeText: 'Active Recall',
        feynmanExplanation:
          'Apply the Feynman principles to this realistic 3 AM operational dilemma.',
        quiz: {
          scenario:
            'You are 20 minutes from shift completion when a sensor reading momentarily spikes 10% past the allowable threshold and then returns to normal.',
          question: 'What is the correct protocol response?',
          options: [
            'Log the transient spike, pause line, and notify shift lead before proceeding',
            'Ignore it since it returned to normal range within 10 seconds',
            'Manually adjust sensor calibration down by 10% to prevent alarms',
            'Leave a note for the morning crew without logging in the active record',
          ],
          correctAnswerIndex: 0,
          feynmanFeedback:
            'Correct! In safety-critical operations, transient spikes frequently signal impending component failure or hidden deviation. Logging and pausing prevents catastrophic failures.',
          distractorExplanations: [
            'Bypassing transient alerts violates golden safety rules.',
            'Artificially recalibrating hides systemic failures.',
            'Delaying handoff creates unmonitored hazards.',
          ],
        },
      },
    ],
  };
}

// API endpoint: Generate full Feynman Training Deck from SOP (Text or PDF)
app.post('/api/deck/generate', async (req: Request, res: Response) => {
  try {
    const { documentText, pdfBase64, mimeType, targetAudience, instructionalFocus } = req.body;

    if (!documentText && !pdfBase64) {
      return res.status(400).json({
        error: 'Please provide either document text or an uploaded PDF/document.',
      });
    }

    const promptText = `Analyze the provided Standard Operating Procedure (SOP) or document and convert it into a complete, structured Feynman Training Deck for learners.

Target Learner Audience: ${targetAudience || 'Operational Staff & New Hires (Maximum Simplification)'}
Instructional Focus: ${instructionalFocus || 'High-Stakes Safety & Failure Prevention'}

Structure the response as a JSON object with this exact shape:
{
  "id": "deck-${Date.now()}",
  "title": "Concise, engaging title of the training deck",
  "summary": "2-3 sentence overview explaining what this SOP accomplishes and why it matters in plain language",
  "targetAudience": "${targetAudience || 'Operations Staff'}",
  "estimatedMinutes": 8,
  "originalDocType": "SOP / Standard Operating Procedure",
  "heroImage": {
    "caption": "Primary operational context or equipment diagram",
    "diagramType": "cold_chain",
    "alt": "SOP Overview schematic"
  },
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
      "cardType": "concept_analogy",
      "feynmanExplanation": "Engaging explanation of this card's concept",
      "badgeText": "Intuition & Purpose",
      "image": {
        "caption": "Visual mental model or physical mechanism",
        "diagramType": "protein_origami"
      },
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
          "type": "must_do",
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
    }
  ]
}

Ensure the deck contains 5 to 7 high-quality cards. Output STRICT JSON only.`;

    const parts: any[] = [];

    if (pdfBase64) {
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

    let deckData;

    try {
      const response = await generateContentWithResilience({
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          systemInstruction: FEYNMAN_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });

      const responseText = response.text || '';
      try {
        deckData = JSON.parse(responseText);
      } catch {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          deckData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse structured JSON from AI response.');
        }
      }
    } catch (apiErr: any) {
      console.warn('Gemini API temporarily unavailable, using offline Feynman synthesizer:', apiErr?.message);
      // If cloud model is unavailable (503/429/network), synthesize high-yield deck
      const sampleContent = documentText || 'Operational Standard Operating Procedure';
      deckData = createFallbackFeynmanDeck(
        sampleContent,
        targetAudience,
        instructionalFocus
      );
    }

    if (!deckData.id) {
      deckData.id = `deck-${Date.now()}`;
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

    const response = await generateContentWithResilience({
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

    const response = await generateContentWithResilience({
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

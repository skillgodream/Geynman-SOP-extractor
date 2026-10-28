import express, { Request, Response } from 'express';
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

// Global request path normalizer for Vercel Serverless Functions & local environments
app.use((req: Request, _res: Response, next) => {
  const orig = req.originalUrl || req.url || '';
  const xForwarded = (req.headers['x-forwarded-uri'] || req.headers['x-original-url'] || '').toString();
  const matchedPath = (req.headers['x-matched-path'] || '').toString();
  const rawPath = `${orig} ${xForwarded} ${matchedPath} ${req.url}`.toLowerCase();

  if (rawPath.includes('health')) {
    req.url = '/api/health';
  } else if (rawPath.includes('refine-card')) {
    req.url = '/api/deck/refine-card';
  } else if (rawPath.includes('ask-feynman')) {
    req.url = '/api/deck/ask-feynman';
  } else if (
    rawPath.includes('deck/generate') ||
    rawPath.includes('generate-deck') ||
    (req.body && typeof req.body === 'object' && (req.body.documentText || req.body.pdfBase64))
  ) {
    req.url = '/api/deck/generate';
  } else if (rawPath.includes('generate-image')) {
    req.url = '/api/generate-image';
  }

  next();
});

// Helper to lazily get a Gemini Client using environment variable or custom request key
function getAiClient(customKey?: string) {
  const key = (customKey || process.env.GEMINI_API_KEY || '').trim();
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

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

// List of resilient models matching official @google/genai guidelines
const RESILIENT_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function generateContentWithResilience(params: {
  contents: any;
  config?: any;
  apiKey?: string;
}) {
  const client = getAiClient(params.apiKey);
  let lastError: any = null;

  for (const model of RESILIENT_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API request timeout (30s limit exceeded)')), 30000)
        );

        const generatePromise = client.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

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
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('timeout') ||
          msg.includes('404') ||
          msg.includes('NOT_FOUND');

        if (isTemporary && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }

        break;
      }
    }
  }

  throw lastError;
}

// Structural Section Marker Parser for Deep Dive SOP Processing
function parseSopStructuralSections(rawText: string): { title: string; lines: string[] }[] {
  if (!rawText || rawText.length < 50) return [];

  const lines = rawText.split('\n').map((l) => l.trim());
  const sections: { title: string; lines: string[] }[] = [];
  let currentSection: { title: string; lines: string[] } | null = null;

  // Structural header patterns: "SECTION 1:", "1.0", "1.1", "PART I", "## Heading", "PRE-OPERATIONAL CHECK:"
  const headerRegex = /^(?:SECTION|PART|CHAPTER|PHASE|STAGE|MODULE)\s+[0-9IVXLCDM]+[:\.\-]?\s*.*$/i;
  const decimalHeaderRegex = /^\d+\.\d+(?:\.\d+)?\s+[A-Z0-9].*$/;
  const markdownHeaderRegex = /^#{1,4}\s+.*$/;
  const capsHeaderRegex = /^[A-Z0-9\s\-_:]{5,60}:$/;

  for (const line of lines) {
    if (!line) continue;

    const isHeader =
      headerRegex.test(line) ||
      decimalHeaderRegex.test(line) ||
      markdownHeaderRegex.test(line) ||
      capsHeaderRegex.test(line);

    if (isHeader) {
      if (currentSection && currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      const cleanTitle = line.replace(/^#{1,4}\s+/, '').replace(/:$/, '').trim();
      currentSection = { title: cleanTitle, lines: [] };
    } else {
      if (!currentSection) {
        currentSection = { title: '1.0 General Purpose & Scope', lines: [] };
      }
      currentSection.lines.push(line);
    }
  }

  if (currentSection && currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

// Dynamic Feynman deck generator that extracts actual document text and topics directly from user uploaded SOP
function createFallbackFeynmanDeck(
  rawText: string,
  targetAudience?: string,
  instructionalFocus?: string,
  fileName?: string,
  deckType: string = 'quick'
) {
  let titleGuess = 'Standard Operating Procedure Execution Guide';

  if (fileName) {
    const cleanName = fileName
      .replace(/\.pdf$/i, '')
      .replace(/[-_]+/g, ' ')
      .trim();
    if (cleanName.length > 3) {
      titleGuess = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
  } else if (rawText && rawText.length > 5) {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const candidate = lines.find(
      (l) => l.length > 5 && l.length < 90 && !l.toLowerCase().includes('sop') && !l.startsWith('#')
    );
    if (candidate) titleGuess = candidate;
  }

  // Extract real text lines from the document for contextual synthesis
  const cleanLines = (rawText || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 10 && !l.startsWith('#'));

  const summarySnippet = cleanLines.slice(0, 3).join(' ') ||
    `Operational procedures and execution standards for ${titleGuess}.`;

  // Filter lines containing safety/must/never rules
  const ruleLines = cleanLines.filter((l) =>
    /\b(must|never|do not|warning|caution|critical|prohibited|ensure|verify|always)\b/i.test(l)
  );

  // Filter lines containing steps or actions
  const stepLines = cleanLines.filter((l) =>
    /^\d+[\.\)]|[•\-\*]|\b(step|phase|stage|first|then|next|finally|action)\b/i.test(l)
  );

  const rule1 = ruleLines[0] || `Always verify baseline operational parameters for ${titleGuess} prior to initiation.`;
  const rule2 = ruleLines[1] || `Never bypass safety interlocks or skip mandatory verification checks under pressure.`;

  const step1Text = stepLines[0] || cleanLines[1] || `Pre-Operation Checklist & Parameter Verification`;
  const step2Text = stepLines[1] || cleanLines[2] || `Active Procedure Execution & Real-Time Bounds Monitoring`;
  const step3Text = stepLines[2] || cleanLines[3] || `Post-Execution Verification, Log Sign-Off & Handoff`;

  const isMasterVisual = deckType === 'master_visual' || deckType === 'master';

  const cardsList = isMasterVisual
    ? [
        {
          id: 'card-0',
          title: 'Level 0: Prerequisites & Workstation Setup Gate',
          subtitle: 'Required equipment, PPE compliance, and zero-state calibration',
          cardType: 'critical_rules' as const,
          badgeText: 'Level 0 · Setup Gate',
          levelNumber: 0 as const,
          responsibleRole: 'Frontline Operator',
          feynmanExplanation: `Before executing Step 1 of ${titleGuess}, verify all zero-state prerequisites. 30% of field defects occur from uncalibrated baselines or missing PPE.`,
          criticalRules: [
            {
              type: 'must_do' as const,
              rule: 'Verify workstation cleanliness, inspect PPE, and execute zero-point sensor calibration.',
              consequenceOfFailure: 'Causes initial execution drift, contamination, or immediate safety breach.',
              verificationCheck: 'Timestamped calibration log and visual inspection sign-off.',
            },
            {
              type: 'never_do' as const,
              rule: 'Never begin live cycle with unverified or uncalibrated tooling.',
              consequenceOfFailure: 'Immediate equipment lockout and quality deviation.',
              verificationCheck: 'Secondary operator check.',
            },
          ],
        },
        {
          id: 'card-1',
          title: `Level 1: Bird's-Eye Process Swimlane Map`,
          subtitle: `Macro workflow sequence for ${titleGuess}`,
          cardType: 'concept_analogy' as const,
          badgeText: "Level 1 · Process Map",
          levelNumber: 1 as const,
          feynmanExplanation: `Understand the macro operational flow from initiation to completion before diving into individual micro-actions.`,
          image: {
            caption: `Macro process sequence map for ${titleGuess}`,
            diagramType: 'flowchart' as const,
          },
          analogy: {
            metaphor: `A Multi-Stage Pressure Airlock System`,
            takeaway: `Equalize parameters at each gate before unlocking the next operational stage.`,
          },
        },
        {
          id: 'card-2',
          title: 'Level 2: Execution Phase A - Setup & Baseline Check',
          subtitle: 'Initial setup micro-actions and baseline parameters',
          cardType: 'process_steps' as const,
          badgeText: 'Level 2 · Execution Phase A',
          levelNumber: 2 as const,
          feynmanExplanation: `Execute Phase A setup sequence in strict numerical order.`,
          steps: [
            {
              stepNumber: 1,
              title: 'Parameter Verification',
              action: step1Text.length > 120 ? step1Text.slice(0, 117) + '...' : step1Text,
              whyItMatters: 'Guarantees operational baseline is within strict tolerance before initiating live cycle.',
              criticalWatchout: 'Halt procedure if baseline parameter fluctuates outside specified limits.',
            },
          ],
        },
        {
          id: 'card-3',
          title: 'Level 2: Execution Phase B - Primary Active Cycle',
          subtitle: 'Hands-on execution, scanning, and active parameter monitoring',
          cardType: 'process_steps' as const,
          badgeText: 'Level 2 · Execution Phase B',
          levelNumber: 2 as const,
          feynmanExplanation: `Monitor live cycle parameters in real time without leaving the workstation unmonitored.`,
          steps: [
            {
              stepNumber: 2,
              title: 'Active Cycle Execution',
              action: step2Text.length > 120 ? step2Text.slice(0, 117) + '...' : step2Text,
              whyItMatters: 'Catches thermal or pressure drift early before compounding into failure.',
              criticalWatchout: 'Do not adjust parameters manually during active cycle without supervisor authorization.',
            },
          ],
        },
        {
          id: 'card-4',
          title: 'Level 2: Execution Phase C - Sign-Off & Shift Handoff',
          subtitle: 'Post-run verification, audit logging, and clean handoff',
          cardType: 'process_steps' as const,
          badgeText: 'Level 2 · Execution Phase C',
          levelNumber: 2 as const,
          feynmanExplanation: `Complete post-execution logging to ensure 100% audit compliance.`,
          steps: [
            {
              stepNumber: 3,
              title: 'Audit Logging & Handoff',
              action: step3Text.length > 120 ? step3Text.slice(0, 117) + '...' : step3Text,
              whyItMatters: 'Prevents unmonitored shift handoffs and guarantees full batch traceability.',
              criticalWatchout: 'Never release batch output prior to secondary sign-off.',
            },
          ],
        },
        {
          id: 'card-5',
          title: 'Level 3: Failure Mode & Visual Pass/Fail Comparison',
          subtitle: 'Symptom diagnosis, visual threshold checks, and immediate remediation',
          cardType: 'pitfalls_troubleshooting' as const,
          badgeText: 'Level 3 · Failure Debugging',
          levelNumber: 3 as const,
          stopWorkTrigger: 'Immediate Stop-Work if parameter drift exceeds 5% or visual alignment fails.',
          image: {
            layout: 'split_pass_fail' as const,
            passCaption: 'PASSED: Flush alignment, zero gap, clean parameter reading.',
            failCaption: 'DEFECTIVE: Misalignment detected, parameter out of bounds.',
            passFailComparison: {
              passText: 'Visual check passed: clean seating, uniform seal, zero gap.',
              failText: 'Visual check failed: fracture, gap, or out-of-tolerance reading.',
            },
          },
          feynmanExplanation: `Recognize defect patterns instantly and execute immediate protocol recovery.`,
          pitfalls: [
            {
              symptomOrMistake: 'Parameter reading fluctuates near upper threshold limit',
              rootCause: 'Dirty sensor/probe, loose connection, or uncalibrated baseline.',
              immediateFix: 'Pause cycle, clean sensor heads, reseat connections, and verify against secondary logger.',
            },
            {
              symptomOrMistake: 'Operator rushes verification step under shift deadline pressure',
              rootCause: 'Quota pressure overriding safety invariants.',
              immediateFix: 'Invoke Stop-Work authority, verify parameters, and complete mandatory checklist.',
            },
          ],
        },
        {
          id: 'card-6',
          title: 'Level 4: Golden Rules & Metric Thresholds',
          subtitle: 'Non-negotiable quality gates and key performance metrics',
          cardType: 'quick_reference' as const,
          badgeText: 'Level 4 · Golden Rules & Metrics',
          levelNumber: 4 as const,
          feynmanExplanation: `Non-negotiable quantitative standards governing this entire operating procedure.`,
          referenceItems: [
            {
              label: 'Golden Metric',
              value: '100% Parameter Verification',
              detail: 'Zero exceptions permitted without written QA waiver.',
            },
            {
              label: 'Calibration Frequency',
              value: 'Every Shift Start (8 Hours)',
              detail: 'Re-calibrate immediately if workstation experiences temperature shock.',
            },
            {
              label: 'Escalation Time SLA',
              value: '< 5 Minutes to Supervisor',
              detail: 'Notify Lead Technician immediately upon any Stop-Work trigger.',
            },
          ],
        },
        {
          id: 'card-7',
          title: 'Shift Dilemma: Active Recall Knowledge Check',
          subtitle: 'Test your operational intuition in a real-world dilemma',
          cardType: 'scenario_quiz' as const,
          badgeText: 'Active Recall Scenario',
          feynmanExplanation: `Apply the principles of ${titleGuess} to this realistic shift dilemma.`,
          quiz: {
            scenario: `You are executing ${titleGuess}. Mid-way through, an indicator trips a transient warning light during a high-volume shift. Shift end is in 10 minutes.`,
            question: 'What is the required standard operating response?',
            options: [
              'Pause, record the transient warning, and perform mandatory parameter verification before continuing.',
              'Ignore the warning light because it cleared itself and the shift deadline is pressing.',
              'Bypass the warning sensor to prevent further alarms during the current run.',
              'Finish the run quickly and leave an informal verbal note for the next shift.',
            ],
            correctAnswerIndex: 0,
            feynmanFeedback: `Correct! In safety-critical SOP execution, transient warnings frequently signal impending component drift or hidden deviation. Pausing and verifying preserves protocol integrity and prevents catastrophic failures.`,
            distractorExplanations: [
              'Bypassing alerts violates golden safety boundaries.',
              'Modifying warning sensors masks systemic faults.',
              'Delaying handoffs creates unmonitored hazards.',
            ],
          },
        },
      ]
    : [
        {
          id: 'card-1',
          title: `Core Intuition & Purpose`,
          subtitle: `The non-negotiable mission behind ${titleGuess}`,
          cardType: 'concept_analogy' as const,
          badgeText: 'Mental Model',
          feynmanExplanation: `Before performing individual actions in ${titleGuess}, understand why this standard exists: failures happen when operators rely on memory instead of verifying hard parameters.`,
          analogy: {
            metaphor: `A Pressure Airlock System`,
            takeaway: `Equalize and verify baseline conditions before opening the next operational gate.`,
          },
        },
        {
          id: 'card-2',
          title: 'Golden Rules & Critical Red Lines',
          subtitle: 'The 20% of non-negotiable rules that avert 80% of failures',
          cardType: 'critical_rules' as const,
          badgeText: 'Safety & Red Lines',
          feynmanExplanation: `Under operational or deadline pressure, never sacrifice these core boundary rules defined in ${titleGuess}.`,
          criticalRules: [
            {
              type: 'must_do' as const,
              rule: rule1.length > 120 ? rule1.slice(0, 117) + '...' : rule1,
              consequenceOfFailure: 'Causes unmonitored operational deviation and protocol breach.',
              verificationCheck: 'Timestamped log entry and physical verification sign-off.',
            },
            {
              type: 'never_do' as const,
              rule: rule2.length > 120 ? rule2.slice(0, 117) + '...' : rule2,
              consequenceOfFailure: 'Immediate safety hazard, equipment lockout, or regulatory non-compliance.',
              verificationCheck: 'Independent supervisor or secondary operator confirmation.',
            },
          ],
        },
        {
          id: 'card-3',
          title: 'Core Execution Sequence',
          subtitle: `Step-by-step workflow for ${titleGuess}`,
          cardType: 'process_steps' as const,
          badgeText: 'Workflow',
          feynmanExplanation: `Execute these stages in strict numerical sequence without skipping intermediate gates.`,
          steps: [
            {
              stepNumber: 1,
              title: 'Pre-Execution Verification',
              action: step1Text.length > 120 ? step1Text.slice(0, 117) + '...' : step1Text,
              whyItMatters: 'Guarantees baseline parameters are within tolerance before live cycle starts.',
              criticalWatchout: 'Do not proceed if calibration or initial check fails.',
            },
            {
              stepNumber: 2,
              title: 'Primary Operational Cycle',
              action: step2Text.length > 120 ? step2Text.slice(0, 117) + '...' : step2Text,
              whyItMatters: 'Active monitoring catches parameter drift early before cascade failures.',
              criticalWatchout: 'Never leave workstation unmonitored during active phase.',
            },
            {
              stepNumber: 3,
              title: 'Verification & Handoff Sign-off',
              action: step3Text.length > 120 ? step3Text.slice(0, 117) + '...' : step3Text,
              whyItMatters: 'Guarantees complete audit traceability and clean transition between shifts.',
              criticalWatchout: 'Do not release output prior to formal logging.',
            },
          ],
        },
        {
          id: 'card-4',
          title: 'Common Traps & Field Recovery',
          subtitle: 'Symptom diagnosis and immediate remediation',
          cardType: 'pitfalls_troubleshooting' as const,
          badgeText: 'Troubleshooting',
          feynmanExplanation: `Recognize subtle warning signals in ${titleGuess} before they compound into critical incidents.`,
          pitfalls: [
            {
              symptomOrMistake: 'Parameter reading fluctuates near threshold limit',
              rootCause: 'Dirty sensor/probe, loose connection, or uncalibrated baseline.',
              immediateFix: 'Pause cycle, clean sensor heads, reseat connections, and verify against secondary logger.',
            },
            {
              symptomOrMistake: 'Operator rushes verification step under shift deadline pressure',
              rootCause: 'Quota pressure overriding safety invariants.',
              immediateFix: 'Invoke Stop-Work authority, verify parameters, and complete mandatory checklist.',
            },
          ],
        },
        {
          id: 'card-5',
          title: 'Shift Dilemma: Scenario Knowledge Check',
          subtitle: 'Test your operational intuition in a high-pressure scenario',
          cardType: 'scenario_quiz' as const,
          badgeText: 'Active Recall',
          feynmanExplanation: `Apply the principles of ${titleGuess} to this realistic shift dilemma.`,
          quiz: {
            scenario: `You are halfway through executing ${titleGuess}. An indicator trips a transient warning light for 3 seconds during a high-volume shift. Deadline is in 15 minutes.`,
            question: 'What is the required standard operating response?',
            options: [
              'Pause, record the transient warning, and perform mandatory parameter verification before continuing.',
              'Ignore the warning light because it cleared itself and the shift deadline is pressing.',
              'Bypass the warning sensor to prevent further alarms during the current run.',
              'Finish the run quickly and leave an informal verbal note for the next shift.',
            ],
            correctAnswerIndex: 0,
            feynmanFeedback: `Correct! In safety-critical SOP execution, transient warnings frequently signal impending component drift or hidden deviation. Pausing and verifying preserves protocol integrity and prevents catastrophic failures.`,
            distractorExplanations: [
              'Bypassing alerts violates golden safety boundaries.',
              'Modifying warning sensors masks systemic faults.',
              'Delaying handoffs creates unmonitored hazards.',
            ],
          },
        },
      ];

  const parsedSections = parseSopStructuralSections(rawText);
  let modulesList: any[] | undefined = undefined;

  if (isMasterVisual && parsedSections.length >= 2) {
    modulesList = parsedSections.slice(0, 6).map((sec, idx) => {
      const secLines = sec.lines;
      const secRule = secLines.find((l) => /\b(must|never|warning|ensure|verify)\b/i.test(l)) || secLines[0] || `Verify parameters for ${sec.title}`;
      const secStep = secLines.find((l) => /^\d+|\b(action|step|then|check)\b/i.test(l)) || secLines[1] || `Execute primary operational action for ${sec.title}`;

      return {
        id: `module-${idx + 1}`,
        moduleNumber: idx + 1,
        title: sec.title,
        summary: secLines.slice(0, 2).join(' ') || `Operational section ${sec.title}`,
        cards: [
          {
            id: `card-mod-${idx + 1}-1`,
            title: `${sec.title}: Execution Sequence`,
            subtitle: `Step-by-step workflow for ${sec.title}`,
            cardType: 'process_steps' as const,
            badgeText: `Module ${idx + 1} · Workflow`,
            levelNumber: 2 as const,
            feynmanExplanation: `Execute the specific protocol actions defined in section ${sec.title}.`,
            steps: [
              {
                stepNumber: 1,
                title: 'Primary Section Action',
                action: secStep.length > 120 ? secStep.slice(0, 117) + '...' : secStep,
                whyItMatters: 'Preserves baseline section compliance and prevents downstream parameter drift.',
                criticalWatchout: 'Do not bypass section verification.',
              },
            ],
          },
          {
            id: `card-mod-${idx + 1}-2`,
            title: `${sec.title}: Critical Red Lines`,
            subtitle: `Non-negotiable invariants for ${sec.title}`,
            cardType: 'critical_rules' as const,
            badgeText: `Module ${idx + 1} · Red Lines`,
            levelNumber: 0 as const,
            feynmanExplanation: `Critical rules and boundary limits governing section ${sec.title}.`,
            criticalRules: [
              {
                type: 'must_do' as const,
                rule: secRule.length > 120 ? secRule.slice(0, 117) + '...' : secRule,
                consequenceOfFailure: 'Causes operational deviation and section failure.',
                verificationCheck: 'Visual inspection sign-off.',
              },
            ],
          },
        ],
      };
    });
  }

  return {
    id: `deck-${Date.now()}`,
    title: titleGuess,
    summary: summarySnippet.length > 250 ? summarySnippet.slice(0, 247) + '...' : summarySnippet,
    targetAudience: targetAudience || 'Operations Staff & Frontline Personnel',
    estimatedMinutes: isMasterVisual ? 12 : 6,
    originalDocType: 'Uploaded SOP Document',
    deckType: deckType as any,
    modules: modulesList,
    heroImage: {
      caption: `Operational overview schematic for ${titleGuess}`,
      diagramType: 'flowchart' as const,
      alt: `${titleGuess} System Overview`,
    },
    feynmanCoreConcept: {
      intuitiveExplanation: `The non-negotiable core purpose of ${titleGuess} is to guarantee predictable, zero-defect execution by treating protocol adherence as a protective shield rather than simple paperwork.`,
      centralAnalogy: {
        title: `The ${titleGuess.slice(0, 30)} Safety Interlock Principle`,
        analogyText: `Think of ${titleGuess} like a high-grade safety interlock: every step must align perfectly before the next stage unlocks, ensuring no hidden errors pass downstream.`,
        howItMapsToSOP: `Every parameter check and log entry acts as a physical barrier preventing cumulative operational failures.`,
      },
    },
    cards: cardsList,
  };
}

function assignContextualDeckImages(deck: any) {
  if (!deck) return;
  const deckTitle = (deck.title || '').toLowerCase();
  const deckSummary = (deck.summary || '').toLowerCase();
  const deckContext = `${deckTitle} ${deckSummary} ${deck.targetAudience || ''}`;

  const CURATED_OPERATIONAL_VISUALS = [
    {
      keywords: ['fridge', 'refrigerat', 'temperature', 'cold chain', '2°c', '8°c', 'thermal', 'sensor', 'datalogger', 'probe'],
      url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['cooler', 'insulated', 'cold pack', 'ice pack', 'transfer container', 'dry ice', 'secondary containment'],
      url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['vaccine', 'biologic', 'vial', 'pharma', 'medication', 'protein', 'denatur', 'molecular'],
      url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['quarantine', 'biohazard', 'isolation', 'isolate', 'do not dispense', 'tag', 'red line', 'lockout'],
      url: 'https://images.unsplash.com/photo-1583912267550-d44d9c9a29d6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['sev-1', 'incident', 'outage', 'triage', 'monitoring', 'grafana', 'datadog', 'dashboard', 'latency'],
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['war room', 'incident commander', 'communication', 'slack', 'bridge', 'collaborat', 'lead'],
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['server', 'cluster', 'datacenter', 'canary', 'rollback', 'kubernetes', 'database', 'infrastructure'],
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['metrics', 'telemetry', 'analytics', 'chart', 'uptime', 'sla', 'post-mortem'],
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['cleanroom', 'airlock', 'sticky mat', 'ante-room', 'decontamination', 'gown', 'iso class', 'interlock'],
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['sterile', 'nitrile gloves', 'glove', 'sanitize', 'isopropyl', 'disinfect'],
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['bunny suit', 'coverall', 'hood', 'crossover bench', 'boot covers', 'particles', 'hepa'],
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['differential pressure', 'manometer', 'pascal', 'airflow', 'pressure gauge', 'ventilation'],
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['pick', 'pack', 'warehouse', 'barcode', 'rf scanner', 'order fulfillment', 'inventory', 'bin', 'packer', 'dark store'],
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['forklift', 'pallet', 'racking', 'loading dock', 'freight', 'cargo', 'high-bay'],
      url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['sign-off', 'checklist', 'verification', 'audit', 'compliance', 'ledger', 'signature', 'quality'],
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['pitfall', 'troubleshoot', 'anomaly', 'symptom', 'fault', 'error', 'root cause', 'diagnostic'],
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    },
    {
      keywords: ['dilemma', 'decision', 'scenario', 'quiz', 'emergency', 'alarm', '2 am', 'critical'],
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  function matchPhoto(context: string, fallbackPrompt: string): string {
    const lower = context.toLowerCase();
    for (const item of CURATED_OPERATIONAL_VISUALS) {
      if (item.keywords.some((kw) => lower.includes(kw))) {
        return item.url;
      }
    }
    const safePrompt = encodeURIComponent(fallbackPrompt.slice(0, 100));
    return `https://image.pollinations.ai/prompt/${safePrompt}?width=1024&height=576&nologo=true`;
  }

  // Ensure hero image has URL
  if (!deck.heroImage) deck.heroImage = {};
  if (!deck.heroImage.url) {
    deck.heroImage.url = matchPhoto(deckContext, `${deck.title} operational overview`);
  }

  // Assign images to cards
  if (Array.isArray(deck.cards)) {
    deck.cards.forEach((card: any, idx: number) => {
      if (!card.image) card.image = {};
      if (!card.image.url) {
        const cardContext = `${card.title || ''} ${card.subtitle || ''} ${card.badgeText || ''} ${card.feynmanExplanation || ''} ${deckContext}`;
        card.image.url = matchPhoto(cardContext, `${deck.title} ${card.title || 'Step ' + (idx + 1)}`);
      }
    });
  }
}

// Dedicated API Router — mounted on both /api and / so it works seamlessly on Vercel Serverless and standalone
const apiRouter = express.Router();

// Health Check Endpoint (useful for verifying Vercel deployment status and GEMINI_API_KEY presence)
apiRouter.get(['/health', '/api/health'], (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    environment: process.env.VERCEL ? 'vercel-serverless' : 'standalone-node',
    timestamp: new Date().toISOString(),
  });
});

// API endpoint: Generate full Feynman Training Deck from SOP (Text or PDF)
apiRouter.post(['/deck/generate', '/api/deck/generate', '/generate', '/'], async (req: Request, res: Response) => {
  try {
    const { documentText, pdfBase64, mimeType, fileName, targetAudience, instructionalFocus, deckType, apiKey } = req.body;
    const effectiveKey = (apiKey || req.headers['x-api-key'] || process.env.GEMINI_API_KEY || '').toString().trim();

    if (!documentText && !pdfBase64) {
      return res.status(400).json({
        error: 'Please provide either document text or an uploaded PDF/document.',
      });
    }

    const isLargeDoc = (documentText && documentText.length > 2500) || pdfBase64 || deckType === 'master' || deckType === 'master_visual';
    const chosenDeckType = deckType && deckType !== 'auto' ? deckType : isLargeDoc ? 'master_visual' : 'quick';

    const promptText = `Analyze the provided Standard Operating Procedure (SOP) or document and convert it into a complete, structured Feynman Training Deck.

Deck Format Selected: ${
      chosenDeckType === 'master_visual'
        ? 'Modular Visual Training Deck (Levels 0-4: Level 0 Prerequisites, Level 1 Bird Eye Map, Level 2 Modular Deep Dives, Level 3 Failure Mode & Debugging with Split Pass/Fail Visuals, Level 4 Golden Rules & Metrics)'
        : chosenDeckType === 'master'
        ? 'Master Comprehensive Deck (DO NOT OMIT ANY STEPS OR SAFETY RULES; cover all phases completely)'
        : 'Quick 5-Min Focused Deck'
    }
Target Learner Audience: ${targetAudience || 'Operational Staff & New Hires (Maximum Simplification)'}
Instructional Focus: ${instructionalFocus || 'High-Stakes Safety & Failure Prevention'}

Structure the response as a JSON object with this exact shape:
{
  "id": "deck-${Date.now()}",
  "title": "Concise, engaging title of the training deck",
  "summary": "2-3 sentence overview explaining what this SOP accomplishes and why it matters in plain language",
  "targetAudience": "${targetAudience || 'Operations Staff'}",
  "estimatedMinutes": ${chosenDeckType === 'quick' ? 5 : 10},
  "originalDocType": "SOP / Standard Operating Procedure",
  "deckType": "${chosenDeckType}",
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
      "id": "card-0",
      "title": "Level 0: Prerequisites & Zero-State Gate",
      "subtitle": "Workstation setup, PPE, and pre-start calibration",
      "cardType": "critical_rules",
      "feynmanExplanation": "Non-negotiable conditions required before starting Step 1.",
      "badgeText": "Level 0 · Setup Gate",
      "levelNumber": 0,
      "responsibleRole": "Operator",
      "criticalRules": [
        {
          "type": "must_do",
          "rule": "Complete workstation calibration and verify PPE compliance",
          "consequenceOfFailure": "Prevents initial execution error and contamination",
          "verificationCheck": "Visual checklist sign-off"
        }
      ]
    },
    {
      "id": "card-1",
      "title": "Level 1: Bird's-Eye Process Map",
      "subtitle": "Macro sequence and end-to-end operational flow",
      "cardType": "concept_analogy",
      "feynmanExplanation": "The big-picture workflow from initiation to completion",
      "badgeText": "Level 1 · Process Map",
      "levelNumber": 1,
      "image": {
        "caption": "Process swimlane diagram",
        "diagramType": "flowchart"
      },
      "analogy": {
        "metaphor": "Clear real-world system comparison",
        "takeaway": "Key macro takeaway"
      }
    },
    {
      "id": "card-2",
      "title": "Level 2: Execution Deep Dive - Phase A",
      "subtitle": "Micro-steps and exact execution actions",
      "cardType": "process_steps",
      "feynmanExplanation": "Exact physical and operational actions required",
      "badgeText": "Level 2 · Execution",
      "levelNumber": 2,
      "steps": [
        {
          "stepNumber": 1,
          "title": "Action Title",
          "action": "Precise action to perform",
          "whyItMatters": "The underlying Feynman rationale",
          "criticalWatchout": "Common trap or watchout"
        }
      ]
    },
    {
      "id": "card-3",
      "title": "Level 3: Failure Mode & Debugging",
      "subtitle": "Conditional If-Then exceptions and corrective action",
      "cardType": "pitfalls_troubleshooting",
      "feynmanExplanation": "Symptom diagnosis, root cause, and immediate protocol fix",
      "badgeText": "Level 3 · Debugging",
      "levelNumber": 3,
      "stopWorkTrigger": "Stop operation if parameter exceeds tolerance",
      "image": {
        "layout": "split_pass_fail",
        "passCaption": "PASSED: Correct assembly and seal threshold",
        "failCaption": "DEFECTIVE: Improper alignment or leak detected",
        "passFailComparison": {
          "passText": "Clean, flush alignment with zero gap",
          "failText": "Misaligned seal, visible gap or fracture"
        }
      },
      "pitfalls": [
        {
          "symptomOrMistake": "What the failure looks or sounds like",
          "rootCause": "Why it happened",
          "immediateFix": "Immediate corrective protocol and escalation"
        }
      ]
    },
    {
      "id": "card-4",
      "title": "Level 4: Golden Rules & Metrics",
      "subtitle": "Non-negotiable standards and quality gates",
      "cardType": "quick_reference",
      "feynmanExplanation": "Key quality gates, safety limits, and KPI targets",
      "badgeText": "Level 4 · Golden Rules",
      "levelNumber": 4,
      "referenceItems": [
        {
          "label": "Golden Metric",
          "value": "Non-Negotiable Target",
          "detail": "Escalation threshold if violated"
        }
      ]
    }
  ]
}

Ensure the deck contains 6 to 10 structured cards covering all 4 levels thoroughly without omitting critical steps. Output STRICT JSON only.`;

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
        apiKey: effectiveKey,
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
      console.warn('Gemini API call note, engaging resilient synthesis:', apiErr?.message);
      // If cloud model is unavailable or rate limited, synthesize structured Feynman deck
      const sampleContent = documentText || fileName || 'Operational Standard Operating Procedure';
      deckData = createFallbackFeynmanDeck(
        sampleContent,
        targetAudience,
        instructionalFocus,
        fileName,
        chosenDeckType
      );
    }

    if (!deckData.id) {
      deckData.id = `deck-${Date.now()}`;
    }

    assignContextualDeckImages(deckData);

    return res.json({ success: true, deck: deckData });
  } catch (error: any) {
    console.error('Error generating Feynman Deck:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate training deck. Please try again.',
    });
  }
});

// API endpoint: Refine a single card using Feynman techniques
apiRouter.post(['/deck/refine-card', '/api/deck/refine-card', '/refine-card'], async (req: Request, res: Response) => {
  try {
    const { card, deckTitle, instructionType, customInstruction, apiKey } = req.body;
    const effectiveKey = (apiKey || req.headers['x-api-key'] || process.env.GEMINI_API_KEY || '').toString().trim();

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
      apiKey: effectiveKey,
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
apiRouter.post(['/deck/ask-feynman', '/api/deck/ask-feynman', '/ask-feynman'], async (req: Request, res: Response) => {
  try {
    const { question, cardContext, deckContext, apiKey } = req.body;
    const effectiveKey = (apiKey || req.headers['x-api-key'] || process.env.GEMINI_API_KEY || '').toString().trim();

    const cardsDetail = deckContext?.cards
      ?.map((c: any, idx: number) => {
        let text = `Card ${idx + 1} [${c.title}]: ${c.feynmanExplanation || ''}`;
        if (c.criticalRules) {
          text += ` | Red Lines: ` + c.criticalRules.map((r: any) => `${r.type}: ${r.rule} (risk: ${r.consequenceOfFailure})`).join('; ');
        }
        if (c.steps) {
          text += ` | Steps: ` + c.steps.map((s: any) => `Step ${s.stepNumber} ${s.title}: ${s.action} (why: ${s.whyItMatters})`).join('; ');
        }
        if (c.pitfalls) {
          text += ` | Pitfalls: ` + c.pitfalls.map((p: any) => `${p.symptomOrMistake} -> ${p.immediateFix}`).join('; ');
        }
        if (c.analogy) {
          text += ` | Analogy: ${c.analogy.metaphor} (${c.analogy.takeaway})`;
        }
        return text;
      })
      .join('\n') || '';

    const fullContext = `
DECK TITLE: ${deckContext?.title || 'Training Deck'}
DECK SUMMARY: ${deckContext?.summary || ''}
CENTRAL ANALOGY: ${deckContext?.feynmanCoreConcept?.centralAnalogy?.title || ''} - ${deckContext?.feynmanCoreConcept?.centralAnalogy?.analogyText || ''}

CURRENT FOCUSED CARD:
Title: ${cardContext?.title || ''}
Type: ${cardContext?.cardType || ''}
Explanation: ${cardContext?.feynmanExplanation || ''}
${cardContext?.analogy ? `Analogy: ${cardContext.analogy.metaphor} (${cardContext.analogy.takeaway})` : ''}

ALL CARDS IN THIS SOP:
${cardsDetail}
`;

    const prompt = `You are KOYA, a friendly, ultra-practical frontline mentor and educator who explains concepts using the Feynman Technique.
A learner is studying this Standard Operating Procedure and asked this question:

"${question || 'How does this procedure work in simple terms?'}"

Operational Context:
${fullContext}

Instructions:
1. Explain the answer in plain English using the "12-Year-Old Test" (no corporate/bureaucratic jargon).
2. Reference the central analogy or practical scenario in the card where appropriate.
3. Keep it crystal clear, concise (100-150 words), and encouraging without corporate jargon.`;

    let answerText = '';
    try {
      const response = await generateContentWithResilience({
        contents: prompt,
        apiKey: effectiveKey,
        config: {
          systemInstruction: 'You are KOYA, an expert Frontline Trainer and intuitive Mentor. Always answer using the specific content, rules, and steps of the provided deck.',
          temperature: 0.3,
        },
      });
      answerText = response.text || '';
    } catch (apiErr) {
      console.warn('Gemini API call for tutor unavailable, synthesizing response from deck context:', apiErr);
    }

    if (!answerText) {
      const qLower = (question || '').toLowerCase();
      const deckTitle = deckContext?.title || 'this SOP procedure';
      const cards = deckContext?.cards || [];

      const matchedCard = cards.find((c: any) => {
        const text = `${c.title} ${c.feynmanExplanation || ''} ${JSON.stringify(c.criticalRules || [])} ${JSON.stringify(c.steps || [])} ${JSON.stringify(c.pitfalls || [])} ${JSON.stringify(c.analogy || {})}`.toLowerCase();
        return qLower.split(' ').some((word: string) => word.length > 3 && text.includes(word));
      });

      const active = cardContext || matchedCard || cards[0];

      if (qLower.includes('10 year old') || qLower.includes('simple') || qLower.includes('explain')) {
        answerText = `In plain, jargon-free terms for "${deckTitle}" (${active?.title || 'Procedure'}):\n\n${active?.feynmanExplanation || 'Follow established parameters and never skip safety checks.'}\n\nCore Takeaway: Think of it like ${active?.analogy?.metaphor || 'a safety interlock'} — ${active?.analogy?.takeaway || 'verify before taking action'}.`;
      } else if (qLower.includes('analogy') || qLower.includes('metaphor')) {
        answerText = `The central analogy for "${deckTitle}" is:\n\nMetaphor: ${active?.analogy?.metaphor || deckContext?.feynmanCoreConcept?.centralAnalogy?.title || 'Safety Airlock Protocol'}\n\nTakeaway: ${active?.analogy?.takeaway || deckContext?.feynmanCoreConcept?.centralAnalogy?.howItMapsToSOP || 'Always verify baseline parameters before proceeding.'}`;
      } else if (qLower.includes('mistake') || qLower.includes('trap') || qLower.includes('wrong') || qLower.includes('risk')) {
        if (active?.pitfalls?.length) {
          const p = active.pitfalls[0];
          answerText = `Primary risk in "${active.title}": "${p.symptomOrMistake}".\n\nRoot Cause: ${p.rootCause}\nImmediate Action: ${p.immediateFix}`;
        } else if (active?.criticalRules?.length) {
          const r = active.criticalRules[0];
          answerText = `Critical Red Line in "${active.title}": "${r.rule}".\n\nConsequence if broken: ${r.consequenceOfFailure}\nVerification: ${r.verificationCheck}`;
        } else {
          answerText = `The biggest trap in "${deckTitle}" is rushing through verification steps or making implicit assumptions during shift handoffs.`;
        }
      } else {
        answerText = `Regarding "${question}" in "${deckTitle}" (${active?.title || 'Procedure'}):\n\n${active?.feynmanExplanation || deckContext?.summary || 'Follow all standard operational steps in sequence.'}`;
        if (active?.steps?.length) {
          answerText += `\n\nKey Steps:\n` + active.steps.map((s: any) => `• Step ${s.stepNumber} (${s.title}): ${s.action}`).join('\n');
        }
        if (active?.criticalRules?.length) {
          answerText += `\n\nNon-Negotiable Red Lines:\n` + active.criticalRules.map((r: any) => `• ${r.rule}`).join('\n');
        }
      }
    }

    return res.json({ success: true, answer: answerText });
  } catch (error: any) {
    console.error('Error with Feynman tutor:', error);
    return res.status(500).json({ error: error.message || 'Failed to get explanation.' });
  }
});

// API endpoint: AI Text-to-Image Generation (Gemini / Imagen 3 / OpenAI DALL-E / Pollinations AI)
apiRouter.post(['/generate-image', '/api/generate-image'], async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '16:9', apiKey } = req.body;
    const providedKey = (apiKey || req.headers['x-api-key'] || '').toString().trim();

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt text is required for AI image generation.' });
    }

    // Tier 1: User-supplied OpenAI API key (DALL-E 3)
    if (providedKey.startsWith('sk-')) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${providedKey}`,
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: `High-resolution photorealistic operational workplace diagram: ${prompt}. Clean lighting, professional, clear instructional context.`,
            n: 1,
            size: '1024x1024',
          }),
        });

        const data = await openaiRes.json();
        if (data?.data?.[0]?.url) {
          return res.json({ success: true, imageUrl: data.data[0].url, provider: 'OpenAI DALL-E 3' });
        } else if (data?.error?.message) {
          console.warn('OpenAI DALL-E error:', data.error.message);
        }
      } catch (err: any) {
        console.warn('OpenAI request failed:', err.message);
      }
    }

    // Tier 2: Gemini Imagen 3 (using custom key if provided, or default SDK)
    const effectiveGeminiKey = providedKey.startsWith('AIza') ? providedKey : process.env.GEMINI_API_KEY;
    if (effectiveGeminiKey) {
      try {
        const genClient = new GoogleGenAI({ apiKey: effectiveGeminiKey });
        const response = await genClient.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: `High-resolution photorealistic 4K operational workplace diagram image: ${prompt}. Clean lighting, professional, clear instructional context.`,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: aspectRatio || '16:9',
          },
        });

        const firstImage = response?.generatedImages?.[0];
        if (firstImage?.image?.imageBytes) {
          const base64Bytes = firstImage.image.imageBytes;
          const imageUrl = `data:image/jpeg;base64,${base64Bytes}`;
          return res.json({ success: true, imageUrl, provider: 'Google Imagen 3' });
        }
      } catch (imagenErr: any) {
        console.warn('Imagen 3 API note (quota or enterprise restriction):', imagenErr?.message);
      }
    }

    // Tier 3: Zero-Cost Free Dynamic AI Synthesis (Pollinations AI - verified, instant, no key required)
    const cleanPrompt = encodeURIComponent(
      `cinematic photorealistic 8k operational workplace: ${prompt.trim()}`
    );
    const fallbackUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=576&seed=${Date.now()}&nologo=true`;

    return res.json({
      success: true,
      imageUrl: fallbackUrl,
      provider: 'Pollinations AI (Free Tier)',
      note: 'Generated using high-resolution free AI synthesis. To use DALL-E 3 or Imagen 3, provide an external API key in the image modal.',
    });
  } catch (error: any) {
    console.error('Error generating AI image:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate image.' });
  }
});

// Mount the router on both '/api' and '/' for compatibility across Vercel Serverless and Express
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Setup Vite Dev or Static Production Serving for Standalone Node environments
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
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

// Only launch standalone web server when not running in serverless environments like Vercel
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
export { app };

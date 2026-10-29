import { FeynmanDeck, VideoScene, GuideScenario, AssessmentQuestion, CardImage } from '../types/deck';

/**
 * Resolves an accurate, domain-aligned photo URL based on the actual SOP contents.
 * Prevents topic mismatches (e.g. warehouse picking showing an IT server dashboard).
 */
/**
 * Comprehensive dictionary of high-resolution, operational photography
 * mapped to specific workplace workflows, safety protocols, and technical procedures.
 */
const CURATED_OPERATIONAL_VISUALS = [
  // Cold Chain, Vaccines, Temperature Controls, Pharma
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
  // Incident Triage, SRE, DevOps, Server Infrastructure
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
  // Cleanroom, Gowning, Sterilization, ISO Class
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
  // Warehouse Logistics, Order Fulfillment, Inventory, Terminals
  {
    keywords: ['pick', 'pack', 'warehouse', 'barcode', 'rf scanner', 'order fulfillment', 'inventory', 'bin'],
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['forklift', 'pallet', 'racking', 'loading dock', 'freight', 'cargo', 'high-bay'],
    url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
  },
  // Quality Verification, Checklists, Audits, Sign-off
  {
    keywords: ['sign-off', 'checklist', 'verification', 'audit', 'compliance', 'ledger', 'signature', 'quality'],
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  },
  // Troubleshooting, Anomalies, Error Diagnostics
  {
    keywords: ['pitfall', 'troubleshoot', 'anomaly', 'symptom', 'fault', 'error', 'root cause', 'diagnostic', 'investigat'],
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  // Active Recall, High-Stakes Dilemma, Emergency Decision
  {
    keywords: ['dilemma', 'decision', 'scenario', 'quiz', 'emergency', 'alarm', '2 am', 'critical'],
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
  },
];

/**
 * Resolves an accurate, domain-aligned photo URL based on the actual SOP contents and specific context.
 * Uses exact keyword scoring across curated high-res operational photography.
 * Falls back to dynamic visual synthesis if no static category matches.
 */
export function resolveContextualPhoto(
  deck: FeynmanDeck,
  specificImage?: CardImage,
  contextQuery?: string
): string {
  if (specificImage?.url) return specificImage.url;

  const combinedSearch = `${contextQuery || ''} ${deck.title || ''} ${deck.summary || ''} ${deck.targetAudience || ''}`.toLowerCase();

  for (const item of CURATED_OPERATIONAL_VISUALS) {
    if (item.keywords.some((kw) => combinedSearch.includes(kw))) {
      return item.url;
    }
  }

  // Fallback to deck hero image if present
  if (deck.heroImage?.url) return deck.heroImage.url;

  // Dynamic high-yield AI visual synthesis URL
  const promptClean = encodeURIComponent(`${contextQuery || deck.title || 'operational standard operating procedure'}`);
  return `https://image.pollinations.ai/prompt/${promptClean}?width=1024&height=576&nologo=true`;
}

export function deriveVideoScenes(deck: FeynmanDeck): VideoScene[] {
  if (deck.videoScenes && deck.videoScenes.length > 0) {
    return deck.videoScenes;
  }

  const scenes: VideoScene[] = [];
  const introPhoto = resolveContextualPhoto(deck, deck.heroImage, `${deck.title} mental model introduction`);

  // Scene 1: Introduction & Mental Model Hook
  scenes.push({
    id: `${deck.id}-scene-intro`,
    sceneNumber: 1,
    title: 'The Core Intuition & Purpose',
    phaseLabel: 'Mental Model',
    durationSeconds: 15,
    narrationScript: `Welcome to the ${deck.title}. Before jumping into steps, understand the core intuition: ${deck.feynmanCoreConcept.centralAnalogy.analogyText}`,
    visualPrompt: `Cinematic wide angle representation of ${deck.feynmanCoreConcept.centralAnalogy.title}, technical operational setting.`,
    diagramType: deck.heroImage?.diagramType || 'flowchart',
    imageUrl: introPhoto,
    keyAction: 'Internalize the fundamental mental model before touching equipment.',
    criticalWatchout: 'Never treat this SOP as mere paperwork; it governs operational safety.',
  });

  // Extract from process steps or cards with scene-specific photography
  const stepsCard = deck.cards.find((c) => c.cardType === 'process_steps');
  if (stepsCard && stepsCard.steps && stepsCard.steps.length > 0) {
    stepsCard.steps.forEach((st, idx) => {
      // Find scene-specific visual
      const stTitle = st.title && st.title !== 'undefined' ? st.title : `Step ${st.stepNumber || idx + 1}`;
      const stAction = st.action && st.action !== 'undefined' ? st.action : 'Execute step protocol';
      const stWhy = st.whyItMatters && st.whyItMatters !== 'undefined' ? st.whyItMatters : 'Ensures operational compliance';

      const sceneVisual = resolveContextualPhoto(
        deck,
        undefined,
        `${stTitle} ${stAction} ${stWhy}`
      );

      scenes.push({
        id: `${deck.id}-scene-step-${st.stepNumber || idx + 1}`,
        sceneNumber: idx + 2,
        title: stTitle,
        phaseLabel: `Step ${st.stepNumber || idx + 1}`,
        durationSeconds: 18,
        narrationScript: `Step ${st.stepNumber || idx + 1}: ${stAction}. Why this matters: ${stWhy}. Keep in mind: ${st.criticalWatchout || 'Adhere strictly to protocol.'}`,
        visualPrompt: `Technical close-up showing operator executing ${stAction}, precise execution.`,
        diagramType: 'flowchart',
        imageUrl: sceneVisual,
        keyAction: stAction,
        criticalWatchout: st.criticalWatchout,
      });
    });
  } else {
    // Fallback scenes strictly derived from deck cards
    deck.cards.slice(0, 3).forEach((card, idx) => {
      const cardVisual = resolveContextualPhoto(
        deck,
        card.image,
        `${card.title} ${card.feynmanExplanation}`
      );

      scenes.push({
        id: `${deck.id}-scene-${idx + 2}`,
        sceneNumber: idx + 2,
        title: card.title,
        phaseLabel: card.badgeText || `Phase ${idx + 1}`,
        durationSeconds: 15,
        narrationScript: `${card.title}. ${card.feynmanExplanation}`,
        visualPrompt: `Operational context illustrating ${card.title}.`,
        diagramType: card.image?.diagramType || 'flowchart',
        imageUrl: cardVisual,
        keyAction: card.feynmanExplanation.slice(0, 100),
      });
    });
  }

  // Final Scene: Golden Rules & Verification Sign-Off
  const rulesCard = deck.cards.find((c) => c.cardType === 'critical_rules');
  const mainRule = rulesCard?.criticalRules?.[0];
  const signoffPhoto = resolveContextualPhoto(
    deck,
    rulesCard?.image,
    `verification checklist quality sign-off ${mainRule?.verificationCheck || ''}`
  );

  scenes.push({
    id: `${deck.id}-scene-summary`,
    sceneNumber: scenes.length + 1,
    title: 'Verification & Final Handshake',
    phaseLabel: 'Quality Sign-Off',
    durationSeconds: 14,
    narrationScript: mainRule
      ? `Final protocol checkpoint: ${mainRule.rule}. Remember, failure risk: ${mainRule.consequenceOfFailure}. Always verify: ${mainRule.verificationCheck}.`
      : 'Always execute the final verification check before completing shift or releasing product.',
    visualPrompt: 'Verification sign-off checklist and operational sign-off interface.',
    diagramType: 'flowchart',
    imageUrl: signoffPhoto,
    keyAction: 'Log timestamps and record verification sign-off.',
    criticalWatchout: mainRule ? mainRule.consequenceOfFailure : 'Never skip sign-off.',
  });

  return scenes;
}

export function deriveGuideScenarios(deck: FeynmanDeck): GuideScenario[] {
  if (deck.guideScenarios && deck.guideScenarios.length > 0) {
    return deck.guideScenarios;
  }

  const scenarios: GuideScenario[] = [];

  // Scenario 1: Derived from Quiz card or Step 1 dilemma
  const quizCard = deck.cards.find((c) => c.cardType === 'scenario_quiz');
  if (quizCard?.quiz) {
    const q = quizCard.quiz;
    const quizPhoto = resolveContextualPhoto(
      deck,
      quizCard.image,
      `${quizCard.title || ''} ${q.scenario} dilemma emergency active recall`
    );

    scenarios.push({
      id: `${deck.id}-guide-1`,
      title: quizCard.title || 'Operational Decision Check',
      context: deck.originalDocType ? deck.originalDocType.slice(0, 18).toUpperCase() : 'OPERATIONAL DILEMMA',
      situation: q.scenario,
      question: q.question,
      options: q.options.map((opt, idx) => ({
        id: `opt-${idx}`,
        text: opt,
        isCorrect: idx === q.correctAnswerIndex,
        explanation:
          idx === q.correctAnswerIndex
            ? q.feynmanFeedback
            : q.distractorExplanations?.[idx > q.correctAnswerIndex ? idx - 1 : idx] ||
              'This action violates standard protocol and risks compounding the failure.',
        consequenceIfChosen:
          idx === q.correctAnswerIndex
            ? 'Preserves safety, maintains audit integrity, and protects product.'
            : 'Immediate protocol breach, loss of audit traceability, and risk of catastrophic failure.',
      })),
      feynmanRuleLearned: q.feynmanFeedback,
      diagramType: quizCard.image?.diagramType || 'flowchart',
      imageUrl: quizPhoto,
      codeBadge: 'Code: STEP-1',
    });
  } else {
    // Fallback Scenario 1 from steps
    const stepsCard = deck.cards.find((c) => c.cardType === 'process_steps');
    const s1 = stepsCard?.steps?.[0] || {
      stepNumber: 1,
      title: 'Initial Safety Check',
      action: 'Verify operational readiness before commencing procedure.',
      whyItMatters: 'Guarantees preconditions are met.',
    };

    const s1Photo = resolveContextualPhoto(
      deck,
      undefined,
      `${s1.title} ${s1.action} operational verification readiness`
    );

    scenarios.push({
      id: `${deck.id}-guide-1`,
      title: `Phase 1: ${s1.title}`,
      context: 'INITIAL CHECK',
      situation: `You are commencing ${deck.title}. The workstation display indicates pending initialization. What is the mandatory protocol action?`,
      question: `What is the required SOP action for "${s1.title}"?`,
      options: [
        {
          id: 'opt-1-1',
          text: s1.action,
          isCorrect: true,
          explanation: s1.whyItMatters,
          consequenceIfChosen: 'Executes safely and complies with operational specifications.',
        },
        {
          id: 'opt-1-2',
          text: 'Skip initialization and start immediately to meet hourly quotas.',
          isCorrect: false,
          explanation: 'Bypassing initialization causes undetected mechanical or calibration defects.',
          consequenceIfChosen: 'Immediate protocol failure and equipment damage.',
        },
        {
          id: 'opt-1-3',
          text: 'Ask an untrained bystander to handle the verification without logging.',
          isCorrect: false,
          explanation: 'Unauthorized delegation violates quality standard invariants.',
          consequenceIfChosen: 'Audit non-conformance ticket issued.',
        },
      ],
      feynmanRuleLearned: s1.whyItMatters,
      diagramType: 'flowchart',
      imageUrl: s1Photo,
      codeBadge: 'Code: STEP-1',
    });
  }

  // Scenario 2: Derived strictly from Critical Rules
  const rulesCard = deck.cards.find((c) => c.cardType === 'critical_rules');
  const criticalRule = rulesCard?.criticalRules?.[0] || {
    rule: 'Never skip protocol documentation during an emergency.',
    consequenceOfFailure: 'Compromises compliance and invalidates operational integrity.',
    verificationCheck: 'Log exact timestamps and parameter readings in the official register.',
  };

  const rulePhoto = resolveContextualPhoto(
    deck,
    rulesCard?.image,
    `safety red line non-negotiable ${criticalRule.rule} ${criticalRule.consequenceOfFailure}`
  );

  scenarios.push({
    id: `${deck.id}-guide-2`,
    title: 'The Shortcut Temptation Under Pressure',
    context: 'SAFETY CRITICAL',
    situation: `Under urgent time constraints while executing ${deck.title}, someone proposes skipping this mandatory standard: "${criticalRule.rule}" to accelerate task completion.`,
    question: 'How do you respond in accordance with this SOP?',
    options: [
      {
        id: 'opt-2-1',
        text: 'Agree to bypass the standard this once to prevent schedule delays.',
        isCorrect: false,
        explanation: 'Compromising standard invariants under deadline pressure is the root cause of the vast majority of industrial failures.',
        consequenceIfChosen: `Severe consequence: ${criticalRule.consequenceOfFailure}`,
      },
      {
        id: 'opt-2-2',
        text: `Halt, adhere strictly to protocol: "${criticalRule.rule}", and verify: "${criticalRule.verificationCheck}".`,
        isCorrect: true,
        explanation: 'The Feynman Invariant: Non-negotiable rules exist precisely to protect product and people during stress.',
        consequenceIfChosen: 'Preserves operational integrity, audit compliance, and workplace safety.',
      },
      {
        id: 'opt-2-3',
        text: 'Proceed with an unapproved workaround instead of following the written standard.',
        isCorrect: false,
        explanation: 'Unapproved workarounds void warranties, create hidden hazards, and compromise traceability.',
        consequenceIfChosen: 'Unapproved workaround results in critical compliance violation.',
      },
    ],
    feynmanRuleLearned: `Non-negotiable rule: ${criticalRule.rule}. Always verify: ${criticalRule.verificationCheck}.`,
    diagramType: rulesCard?.image?.diagramType || 'flowchart',
    imageUrl: rulePhoto,
    codeBadge: 'Code: MUST-DO',
  });

  // Scenario 3: Derived strictly from Troubleshooting Pitfalls
  const pitfallCard = deck.cards.find((c) => c.cardType === 'pitfalls_troubleshooting');
  const mainPitfall = pitfallCard?.pitfalls?.[0];
  if (mainPitfall) {
    const anomalyPhoto = resolveContextualPhoto(
      deck,
      pitfallCard?.image,
      `anomaly troubleshooting error diagnosis ${mainPitfall.symptomOrMistake} ${mainPitfall.rootCause}`
    );

    scenarios.push({
      id: `${deck.id}-guide-3`,
      title: 'Field Anomaly Diagnosis',
      context: 'ANOMALY RECOVERY',
      situation: `During live execution of ${deck.title}, you observe this symptom: "${mainPitfall.symptomOrMistake}".`,
      question: 'What is the root cause and immediate corrective protocol?',
      options: [
        {
          id: 'opt-3-1',
          text: `Identify root cause: ${mainPitfall.rootCause}. Execute immediate fix: ${mainPitfall.immediateFix}.`,
          isCorrect: true,
          explanation: 'Targeting root cause remediation prevents recurrence and preserves operational parameters.',
          consequenceIfChosen: 'Restores nominal tolerances swiftly with zero collateral damage.',
        },
        {
          id: 'opt-3-2',
          text: 'Ignore the symptom because no automated audible alarm has sounded yet.',
          isCorrect: false,
          explanation: 'Silent drift and unmonitored anomalies compound into catastrophic failures before alarms trip.',
          consequenceIfChosen: 'Undetected degradation leads to emergency equipment stoppage.',
        },
        {
          id: 'opt-3-3',
          text: 'Power cycle or reset the terminal without logging the error in the shift ledger.',
          isCorrect: false,
          explanation: 'Clearing diagnostic fault codes without logging blinds engineering teams to underlying systemic faults.',
          consequenceIfChosen: 'Fault repeats on subsequent shifts with compounded downtime.',
        },
      ],
      feynmanRuleLearned: `Root cause: ${mainPitfall.rootCause}. Action: ${mainPitfall.immediateFix}.`,
      diagramType: pitfallCard?.image?.diagramType || 'flowchart',
      imageUrl: anomalyPhoto,
      codeBadge: 'Code: REMEDY',
    });
  }

  return scenarios;
}

export function deriveAssessmentQuestions(deck: FeynmanDeck): AssessmentQuestion[] {
  if (deck.assessmentQuestions && deck.assessmentQuestions.length > 0) {
    return deck.assessmentQuestions;
  }

  const questions: AssessmentQuestion[] = [];

  // Question 1: Mental Model / Core Analogy (Answer at Index 0 - Option A)
  questions.push({
    id: `${deck.id}-q1`,
    category: 'mental_model',
    question: `What is the central Feynman mental model that explains the core purpose of ${deck.title}?`,
    options: [
      deck.feynmanCoreConcept.centralAnalogy.title,
      'A generic checklist designed solely to satisfy bureaucratic annual audits.',
      'An optional guideline that only applies when senior supervisors are on duty.',
      'A mechanical sequence that can be reordered at operator discretion.',
    ],
    correctAnswerIndex: 0,
    feynmanFeedback: `Correct! ${deck.feynmanCoreConcept.centralAnalogy.title}: ${deck.feynmanCoreConcept.centralAnalogy.analogyText}`,
  });

  // Question 2: Critical Rules (Answer at Index 1 - Option B)
  const rulesCard = deck.cards.find((c) => c.cardType === 'critical_rules');
  if (rulesCard?.criticalRules && rulesCard.criticalRules.length > 0) {
    const r = rulesCard.criticalRules[0];
    questions.push({
      id: `${deck.id}-q2`,
      category: 'red_line',
      question: `Under ${deck.title}, which of the following is a non-negotiable critical standard?`,
      options: [
        'Proceeding with normal workflow even if primary indicators show out-of-spec readings.',
        r.rule,
        'Postponing incident reporting until the following business week.',
        'Delegating safety verification to untrained temporary contractors without oversight.',
      ],
      correctAnswerIndex: 1,
      feynmanFeedback: `Correct! ${r.rule}. Consequence of failure: ${r.consequenceOfFailure}. Verification: ${r.verificationCheck}.`,
    });
  }

  // Question 3: Step Sequencing (Answer at Index 2 - Option C)
  const stepsCard = deck.cards.find((c) => c.cardType === 'process_steps');
  if (stepsCard?.steps && stepsCard.steps.length > 0) {
    const s1 = stepsCard.steps[0];
    questions.push({
      id: `${deck.id}-q3`,
      category: 'procedure_step',
      question: `What is the primary action required for Step 1 of ${deck.title}?`,
      options: [
        'Immediately disassemble hardware before recording current operating readings.',
        'Skip directly to the final sign-off step to save operator time.',
        s1.action,
        'Email external management before inspecting local operational indicators.',
      ],
      correctAnswerIndex: 2,
      feynmanFeedback: `Correct! Step 1 action: ${s1.action}. Why it matters: ${s1.whyItMatters}.`,
    });
  }

  // Question 4: Troubleshooting & Traps (Answer at Index 1 - Option B)
  const pitfallCard = deck.cards.find((c) => c.cardType === 'pitfalls_troubleshooting');
  if (pitfallCard?.pitfalls && pitfallCard.pitfalls.length > 0) {
    const p = pitfallCard.pitfalls[0];
    questions.push({
      id: `${deck.id}-q4`,
      category: 'troubleshooting',
      question: `If you observe "${p.symptomOrMistake}", what is the correct corrective protocol?`,
      options: [
        'Hit emergency power shutoff without inspecting status indicators.',
        p.immediateFix,
        'Ignore the anomaly and wait for the subsequent shift crew to investigate.',
        'Wipe the indicator sensor with an uncertified cloth.',
      ],
      correctAnswerIndex: 1,
      feynmanFeedback: `Correct! ${p.immediateFix}. Root cause: ${p.rootCause}.`,
    });
  }

  // Question 5: Dilemma Check (Dynamic from Quiz Card)
  const quizCard = deck.cards.find((c) => c.cardType === 'scenario_quiz');
  if (quizCard?.quiz) {
    const q = quizCard.quiz;
    questions.push({
      id: `${deck.id}-q5`,
      category: 'mental_model',
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      feynmanFeedback: q.feynmanFeedback,
    });
  }

  return questions;
}

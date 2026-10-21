import { FeynmanDeck, VideoScene, GuideScenario, AssessmentQuestion, CardImage } from '../types/deck';

/**
 * Resolves an accurate, domain-aligned photo URL based on the actual SOP contents.
 * Prevents topic mismatches (e.g. warehouse picking showing an IT server dashboard).
 */
export function resolveContextualPhoto(deck: FeynmanDeck, specificImage?: CardImage): string {
  if (specificImage?.url) return specificImage.url;
  if (deck.heroImage?.url) return deck.heroImage.url;

  const text = `${deck.title} ${deck.summary} ${deck.targetAudience} ${deck.originalDocType || ''}`.toLowerCase();

  // Warehouse / Logistics / Picking / Putaway / Pallets / Order Fulfillment
  if (
    text.includes('pick') ||
    text.includes('pack') ||
    text.includes('warehouse') ||
    text.includes('pallet') ||
    text.includes('inventory') ||
    text.includes('forklift') ||
    text.includes('terminal') ||
    text.includes('outbound') ||
    text.includes('inbound') ||
    text.includes('commerce') ||
    text.includes('order')
  ) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';
  }

  // Cold Chain / Vaccine / Temperature / Fridge / Excursion / Biologics
  if (
    text.includes('cold') ||
    text.includes('temperature') ||
    text.includes('vaccine') ||
    text.includes('biologic') ||
    text.includes('refrigerat') ||
    text.includes('excursion') ||
    text.includes('pharma') ||
    text.includes('probe')
  ) {
    return 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80';
  }

  // IT Incidents / SRE / DevOps / Servers / Triage / System Outage
  if (
    text.includes('incident') ||
    text.includes('sev-1') ||
    text.includes('outage') ||
    text.includes('triage') ||
    text.includes('server') ||
    text.includes('devops') ||
    text.includes('cloud') ||
    text.includes('commander') ||
    text.includes('microservice')
  ) {
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
  }

  // Cleanroom / Gowning / Contamination / Sterilization / Differential Pressure
  if (
    text.includes('cleanroom') ||
    text.includes('gown') ||
    text.includes('steril') ||
    text.includes('contamination') ||
    text.includes('airlock') ||
    text.includes('pressure limit') ||
    text.includes('iso class')
  ) {
    return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80';
  }

  // Industrial Machinery / Equipment Operation / Safety Hardware
  if (
    text.includes('machine') ||
    text.includes('equipment') ||
    text.includes('device') ||
    text.includes('manufactur') ||
    text.includes('assembly') ||
    text.includes('factory') ||
    text.includes('battery') ||
    text.includes('scanner')
  ) {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
  }

  // Default standard operational SOP photography
  return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80';
}

export function deriveVideoScenes(deck: FeynmanDeck): VideoScene[] {
  if (deck.videoScenes && deck.videoScenes.length > 0) {
    return deck.videoScenes;
  }

  const scenes: VideoScene[] = [];
  const contextualImg = resolveContextualPhoto(deck);

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
    imageUrl: contextualImg,
    keyAction: 'Internalize the fundamental mental model before touching equipment.',
    criticalWatchout: 'Never treat this SOP as mere paperwork; it governs operational safety.',
  });

  // Extract from process steps or cards
  const stepsCard = deck.cards.find((c) => c.cardType === 'process_steps');
  if (stepsCard && stepsCard.steps && stepsCard.steps.length > 0) {
    stepsCard.steps.forEach((st, idx) => {
      scenes.push({
        id: `${deck.id}-scene-step-${st.stepNumber}`,
        sceneNumber: idx + 2,
        title: st.title,
        phaseLabel: `Step ${st.stepNumber}`,
        durationSeconds: 18,
        narrationScript: `Step ${st.stepNumber}: ${st.action}. Why this matters: ${st.whyItMatters}. Keep in mind: ${st.criticalWatchout || 'Adhere strictly to protocol.'}`,
        visualPrompt: `Technical close-up showing operator executing ${st.action}, precise execution.`,
        diagramType: 'flowchart',
        imageUrl: contextualImg,
        keyAction: st.action,
        criticalWatchout: st.criticalWatchout,
      });
    });
  } else {
    // Fallback scenes strictly derived from deck cards
    deck.cards.slice(0, 3).forEach((card, idx) => {
      scenes.push({
        id: `${deck.id}-scene-${idx + 2}`,
        sceneNumber: idx + 2,
        title: card.title,
        phaseLabel: card.badgeText || `Phase ${idx + 1}`,
        durationSeconds: 15,
        narrationScript: `${card.title}. ${card.feynmanExplanation}`,
        visualPrompt: `Operational context illustrating ${card.title}.`,
        diagramType: card.image?.diagramType || 'flowchart',
        imageUrl: resolveContextualPhoto(deck, card.image),
        keyAction: card.feynmanExplanation.slice(0, 100),
      });
    });
  }

  // Final Scene: Golden Rules & Verification Sign-Off
  const rulesCard = deck.cards.find((c) => c.cardType === 'critical_rules');
  const mainRule = rulesCard?.criticalRules?.[0];
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
    imageUrl: contextualImg,
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
  const defaultPhoto = resolveContextualPhoto(deck);

  // Scenario 1: Derived from Quiz card or Step 1 dilemma
  const quizCard = deck.cards.find((c) => c.cardType === 'scenario_quiz');
  if (quizCard?.quiz) {
    const q = quizCard.quiz;
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
      imageUrl: resolveContextualPhoto(deck, quizCard.image),
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
      imageUrl: defaultPhoto,
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
    imageUrl: resolveContextualPhoto(deck, rulesCard?.image),
    codeBadge: 'Code: MUST-DO',
  });

  // Scenario 3: Derived strictly from Troubleshooting Pitfalls
  const pitfallCard = deck.cards.find((c) => c.cardType === 'pitfalls_troubleshooting');
  const mainPitfall = pitfallCard?.pitfalls?.[0];
  if (mainPitfall) {
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
      imageUrl: resolveContextualPhoto(deck, pitfallCard?.image),
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

import { FeynmanDeck, VideoScene, GuideScenario, AssessmentQuestion } from '../types/deck';

export function deriveVideoScenes(deck: FeynmanDeck): VideoScene[] {
  if (deck.videoScenes && deck.videoScenes.length > 0) {
    return deck.videoScenes;
  }

  const scenes: VideoScene[] = [];

  // Scene 1: Introduction & Mental Model Hook
  scenes.push({
    id: `${deck.id}-scene-intro`,
    sceneNumber: 1,
    title: 'The Core Intuition & Purpose',
    phaseLabel: 'Mental Model',
    durationSeconds: 15,
    narrationScript: `Welcome to the ${deck.title}. Before jumping into steps, understand the core intuition: ${deck.feynmanCoreConcept.centralAnalogy.analogyText}`,
    visualPrompt: `Cinematic wide angle representation of ${deck.feynmanCoreConcept.centralAnalogy.title}, high tech industrial setting, studio lighting.`,
    diagramType: deck.heroImage?.diagramType || 'flowchart',
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
        phaseLabel: `Execution Step ${st.stepNumber}`,
        durationSeconds: 18,
        narrationScript: `Step ${st.stepNumber}: ${st.action}. Why this matters: ${st.whyItMatters}. Keep in mind: ${st.criticalWatchout || 'Adhere strictly to protocol.'}`,
        visualPrompt: `Technical close-up showing operator executing ${st.action}, precise hands, cleanroom or technical lab environment.`,
        diagramType: 'flowchart',
        keyAction: st.action,
        criticalWatchout: st.criticalWatchout,
      });
    });
  } else {
    // Fallback scenes from cards
    deck.cards.slice(0, 3).forEach((card, idx) => {
      scenes.push({
        id: `${deck.id}-scene-${idx + 2}`,
        sceneNumber: idx + 2,
        title: card.title,
        phaseLabel: card.badgeText || `Phase ${idx + 1}`,
        durationSeconds: 15,
        narrationScript: `${card.title}. ${card.feynmanExplanation}`,
        visualPrompt: `Documentary shot illustrating ${card.title}, technical workplace context.`,
        diagramType: card.image?.diagramType || 'flowchart',
        keyAction: card.feynmanExplanation.slice(0, 100),
      });
    });
  }

  // Final Scene: Golden Rules & Emergency Handshake
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
      : 'Always execute the final verification check before releasing product or leaving shift.',
    visualPrompt: 'Verification sign-off checklist and digital log sign-off interface.',
    diagramType: 'flowchart',
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

  // Scenario 1: Derived from Quiz card or default high-stakes dilemma
  const quizCard = deck.cards.find((c) => c.cardType === 'scenario_quiz');
  if (quizCard?.quiz) {
    const q = quizCard.quiz;
    scenarios.push({
      id: `${deck.id}-guide-1`,
      title: 'Shift Anomaly & Operational Pressure',
      context: 'Night Shift Operational Dilemma',
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
      diagramType: quizCard.image?.diagramType || 'cold_chain',
    });
  }

  // Scenario 2: Derived from Critical Rules
  const rulesCard = deck.cards.find((c) => c.cardType === 'critical_rules');
  const criticalRule = rulesCard?.criticalRules?.[0] || {
    rule: 'Never skip protocol documentation during an emergency.',
    consequenceOfFailure: 'Compromises compliance and invalidates batches.',
    verificationCheck: 'Log exact timestamps in incident ledger.',
  };

  scenarios.push({
    id: `${deck.id}-guide-2`,
    title: 'The Shortcut Temptation Under Deadline',
    context: 'High-Volume Production Rush',
    situation: `You are behind schedule by 45 minutes on the production floor. A peer suggests skipping the mandatory verification step for ${deck.title} to catch up with shipping trucks.`,
    question: 'How do you respond?',
    options: [
      {
        id: 'opt-2-1',
        text: 'Follow the peer recommendation this once to avoid trucking delay penalties.',
        isCorrect: false,
        explanation: 'Compromising standard invariants under deadline pressure is the root cause of 85% of industrial recalls.',
        consequenceIfChosen: 'Production batch fails audit inspection; entire shift output is scrapped at 10x the delay cost.',
      },
      {
        id: 'opt-2-2',
        text: `Halt, execute the mandatory verification protocol: "${criticalRule.rule}", and inform the floor supervisor of the realistic delay.`,
        isCorrect: true,
        explanation: 'The Feynman Rule: Operational red lines exist precisely to prevent catastrophe when under stress. Speed never excuses skipping non-negotiable safety checks.',
        consequenceIfChosen: 'Safety standards remain intact, audit trail is flawless, and supervisor manages logistics transparently.',
      },
      {
        id: 'opt-2-3',
        text: 'Sign the verification check off on paper without actually inspecting the hardware.',
        isCorrect: false,
        explanation: 'Falsifying documentation is a severe regulatory violation leading to immediate termination and legal liability.',
        consequenceIfChosen: 'Regulatory audit failure and regulatory sanction.',
      },
    ],
    feynmanRuleLearned: `Non-negotiable rule: ${criticalRule.rule}. Always verify: ${criticalRule.verificationCheck}.`,
    diagramType: 'incident_triage',
  });

  // Scenario 3: Derived from Troubleshooting Pitfalls
  const pitfallCard = deck.cards.find((c) => c.cardType === 'pitfalls_troubleshooting');
  const mainPitfall = pitfallCard?.pitfalls?.[0];
  if (mainPitfall) {
    scenarios.push({
      id: `${deck.id}-guide-3`,
      title: 'Field Symptom Diagnosis',
      context: 'Routine Equipment Inspection',
      situation: `During routine inspection, you observe: "${mainPitfall.symptomOrMistake}". The equipment is still operating, but readings look suspect.`,
      question: 'What is the root cause and immediate corrective protocol?',
      options: [
        {
          id: 'opt-3-1',
          text: `Identify root cause: ${mainPitfall.rootCause}. Execute immediate protocol: ${mainPitfall.immediateFix}.`,
          isCorrect: true,
          explanation: 'Accurate root cause identification prevents recurring excursions and restores nominal tolerances immediately.',
          consequenceIfChosen: 'Equipment returns to optimal tolerances within minutes; zero product lost.',
        },
        {
          id: 'opt-3-2',
          text: 'Ignore the reading because the machine has not tripped an audible siren yet.',
          isCorrect: false,
          explanation: 'Silent drift causes cumulative hidden damage before loud alarms sound.',
          consequenceIfChosen: 'Hardware overheating or excursion progresses undetected until catastrophic shutdown.',
        },
        {
          id: 'opt-3-3',
          text: 'Power cycle the entire system without logging the symptom in the logbook.',
          isCorrect: false,
          explanation: 'Power cycling without logging clears diagnostic error codes that maintenance needs to fix underlying mechanical flaws.',
          consequenceIfChosen: 'Flaw repeats on the following shift when you are off duty.',
        },
      ],
      feynmanRuleLearned: `Root cause: ${mainPitfall.rootCause}. Action: ${mainPitfall.immediateFix}.`,
      diagramType: 'cleanroom',
    });
  }

  return scenarios;
}

export function deriveAssessmentQuestions(deck: FeynmanDeck): AssessmentQuestion[] {
  if (deck.assessmentQuestions && deck.assessmentQuestions.length > 0) {
    return deck.assessmentQuestions;
  }

  const questions: AssessmentQuestion[] = [];

  // Question 1: Mental Model / Core Analogy
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

  // Question 2: Critical Rules
  const rulesCard = deck.cards.find((c) => c.cardType === 'critical_rules');
  if (rulesCard?.criticalRules && rulesCard.criticalRules.length > 0) {
    const r = rulesCard.criticalRules[0];
    questions.push({
      id: `${deck.id}-q2`,
      category: 'red_line',
      question: `Under this SOP, which of the following is a non-negotiable critical standard?`,
      options: [
        r.rule,
        'Proceeding with normal workflow even if primary indicators fail.',
        'Postponing incident reporting until the following business week.',
        'Delegating safety verification to untrained temporary contractors.',
      ],
      correctAnswerIndex: 0,
      feynmanFeedback: `Correct! ${r.rule}. Consequence of failure: ${r.consequenceOfFailure}.`,
    });
  }

  // Question 3: Step Sequencing
  const stepsCard = deck.cards.find((c) => c.cardType === 'process_steps');
  if (stepsCard?.steps && stepsCard.steps.length > 0) {
    const s1 = stepsCard.steps[0];
    questions.push({
      id: `${deck.id}-q3`,
      category: 'procedure_step',
      question: `What is the immediate first action required when executing ${deck.title}?`,
      options: [
        s1.action,
        'Immediately disassemble the equipment without recording current readings.',
        'Email external customers before verifying internal system state.',
        'Skip directly to the final sign-off step to save operator time.',
      ],
      correctAnswerIndex: 0,
      feynmanFeedback: `Correct! Step 1 is: ${s1.action}. Why it matters: ${s1.whyItMatters}.`,
    });
  }

  // Question 4: Troubleshooting & Traps
  const pitfallCard = deck.cards.find((c) => c.cardType === 'pitfalls_troubleshooting');
  if (pitfallCard?.pitfalls && pitfallCard.pitfalls.length > 0) {
    const p = pitfallCard.pitfalls[0];
    questions.push({
      id: `${deck.id}-q4`,
      category: 'troubleshooting',
      question: `If you observe "${p.symptomOrMistake}", what is the correct corrective protocol?`,
      options: [
        p.immediateFix,
        'Hit emergency power shutoff without inspecting status indicators.',
        'Ignore the anomaly and wait for the morning shift to investigate.',
        'Wipe the sensor with uncertified cloth.',
      ],
      correctAnswerIndex: 0,
      feynmanFeedback: `Correct! ${p.immediateFix}. Root cause: ${p.rootCause}.`,
    });
  }

  // Question 5: Dilemma Check
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

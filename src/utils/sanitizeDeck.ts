import {
  FeynmanDeck,
  DeckCard,
  ProcessStep,
  CriticalRule,
  Pitfall,
  ReferenceItem,
  QuizData,
  CardType,
} from '../types/deck';

/**
 * Clean text extractor helper.
 * Converts any value (string, array, object) into a sanitized string or null.
 * Removes empty placeholders, "undefined", "null", leading/trailing quotes, etc.
 */
export function cleanText(val: any): string | null {
  if (val === null || val === undefined) return null;

  if (Array.isArray(val)) {
    const cleanedArr = val
      .map((item) => cleanText(item))
      .filter((s): s is string => s !== null && s.length > 0);
    return cleanedArr.length > 0 ? cleanedArr.join('. ') : null;
  }

  if (typeof val === 'object') {
    const innerText =
      cleanText(val.text) ||
      cleanText(val.value) ||
      cleanText(val.label) ||
      cleanText(val.content) ||
      cleanText(val.description);
    if (innerText) return innerText;
  }

  const str = String(val)
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();

  const lower = str.toLowerCase();
  if (
    !str ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower === 'none' ||
    lower === 'tbd' ||
    lower === 'n/a'
  ) {
    return null;
  }

  return str;
}

/**
 * Sanitize a single Process Step object
 */
export function sanitizeStep(st: any, index: number): ProcessStep {
  if (!st || typeof st !== 'object') {
    const stepNum = index + 1;
    return {
      stepNumber: stepNum,
      title: `Step ${stepNum}`,
      action: `Execute step ${stepNum} protocol according to SOP specifications.`,
      whyItMatters: `Guarantees operational integrity and prevents process drift.`,
    };
  }

  const stepNum = typeof st.stepNumber === 'number' ? st.stepNumber : index + 1;

  // Extract candidate values across all known alias fields
  const rawTitle =
    cleanText(st.title) ||
    cleanText(st.stepTitle) ||
    cleanText(st.phaseTag) ||
    cleanText(st.headerTag) ||
    cleanText(st.name) ||
    cleanText(st.roleBadge);

  const rawAction =
    cleanText(st.action) ||
    cleanText(st.coreAction) ||
    cleanText(st.description) ||
    cleanText(st.instruction) ||
    cleanText(st.actionItem) ||
    cleanText(st.procedure) ||
    cleanText(st.detail);

  const rawWhy =
    cleanText(st.whyItMatters) ||
    cleanText(st.feynmanIntuition) ||
    cleanText(st.rationale) ||
    cleanText(st.why) ||
    cleanText(st.purpose) ||
    cleanText(st.dataMathBox);

  const rawWatchout =
    cleanText(st.criticalWatchout) ||
    cleanText(st.watchout) ||
    cleanText(st.warning) ||
    cleanText(st.dataMathBox);

  // Derive title, action, why without losing real data
  const title = rawTitle || (rawAction ? `Step ${stepNum}: ${rawAction.slice(0, 35)}...` : `Step ${stepNum}`);
  const action = rawAction || rawWhy || `Execute phase ${stepNum} protocol according to SOP specifications.`;
  const whyItMatters = rawWhy || `Guarantees operational baseline tolerance and prevents process drift.`;

  return {
    stepNumber: stepNum,
    title,
    action,
    whyItMatters,
    ...(rawWatchout ? { criticalWatchout: rawWatchout } : {}),
  };
}

/**
 * Sanitize a single Pitfall / Exception Matrix object
 */
export function sanitizePitfall(p: any): Pitfall {
  if (!p || typeof p !== 'object') {
    return {
      symptomOrMistake: 'Operational exception vector detected.',
      rootCause: 'Procedural variance or equipment parameter drift.',
      immediateFix: 'Halt operation, verify baseline parameters, and follow escalation protocol.',
    };
  }

  // Extract candidate values across all known alias fields
  const rawSymptom =
    cleanText(p.symptomOrMistake) ||
    cleanText(p.observedIssue) ||
    cleanText(p.observed_issue) ||
    cleanText(p.issue) ||
    cleanText(p.trigger) ||
    cleanText(p.symptom) ||
    cleanText(p.problem) ||
    cleanText(p.vector) ||
    cleanText(p.failure_mode) ||
    cleanText(p.title);

  const rawCause =
    cleanText(p.rootCause) ||
    cleanText(p.root_cause) ||
    cleanText(p.cause) ||
    cleanText(p.why) ||
    cleanText(p.reason) ||
    cleanText(p.feynmanExplanation);

  const rawFix =
    cleanText(p.immediateFix) ||
    cleanText(p.mandatoryFixProtocol) ||
    cleanText(p.mandatory_fix_protocol) ||
    cleanText(p.fix) ||
    cleanText(p.action) ||
    cleanText(p.protocol) ||
    cleanText(p.resolution) ||
    cleanText(p.solution) ||
    cleanText(p.fixProtocol);

  // Derive fields intelligently without overwriting real text with generic fallbacks!
  const symptomOrMistake =
    rawSymptom ||
    (rawFix ? `Observed issue requiring protocol fix` : `Operational exception vector detected.`);

  const rootCause =
    rawCause ||
    (rawSymptom
      ? `Procedural variation, parameter drift, or hardware tolerance exceedance.`
      : `Procedural variance or equipment parameter drift.`);

  const immediateFix =
    rawFix ||
    (rawSymptom
      ? `Pause operation, verify SKU/parameters against baseline, and notify supervisor.`
      : `Halt operation, verify baseline parameters, and follow escalation protocol.`);

  return {
    symptomOrMistake,
    rootCause,
    immediateFix,
  };
}

/**
 * Sanitize a single Critical Rule object
 */
export function sanitizeCriticalRule(r: any): CriticalRule {
  if (!r || typeof r !== 'object') {
    return {
      type: 'must_do',
      rule: 'Adhere strictly to authorized operating standards.',
      consequenceOfFailure: 'Risk of process failure or safety non-compliance.',
      verificationCheck: 'Mandatory operator checklist sign-off.',
    };
  }

  const rawRule =
    cleanText(r.rule) ||
    cleanText(r.ruleText) ||
    cleanText(r.text) ||
    cleanText(r.must_do) ||
    cleanText(r.never_do) ||
    cleanText(r.action);

  const rawConsequence =
    cleanText(r.consequenceOfFailure) ||
    cleanText(r.risk) ||
    cleanText(r.consequence) ||
    cleanText(r.failureRisk) ||
    cleanText(r.failRisk);

  const rawCheck =
    cleanText(r.verificationCheck) ||
    cleanText(r.verification) ||
    cleanText(r.check) ||
    cleanText(r.proof) ||
    cleanText(r.signoff);

  const rawType = String(r.type || '').toLowerCase();
  const type =
    rawType.includes('never') || rawType === 'never_do'
      ? 'never_do'
      : rawType.includes('warn') || rawType === 'warning'
      ? 'warning'
      : 'must_do';

  return {
    type,
    rule: rawRule || 'Adhere strictly to authorized operating standards.',
    consequenceOfFailure: rawConsequence || 'Risk of process failure or safety non-compliance.',
    verificationCheck: rawCheck || 'Mandatory operator checklist sign-off.',
  };
}

/**
 * Sanitize Quick Reference Items
 */
export function sanitizeReferenceItem(ref: any): ReferenceItem {
  if (!ref || typeof ref !== 'object') {
    return {
      label: 'Metric Standard',
      value: '100% Compliance',
      detail: 'Target standard limit',
    };
  }

  return {
    label: cleanText(ref.label) || cleanText(ref.key) || cleanText(ref.name) || 'Metric Standard',
    value: cleanText(ref.value) || cleanText(ref.metricValue) || cleanText(ref.threshold) || '100% Compliance',
    detail: cleanText(ref.detail) || cleanText(ref.description) || cleanText(ref.note) || 'Target standard limit',
  };
}

export function cleanQuestionText(q: any): string {
  const str = cleanText(q);
  if (!str) return 'What is the required standard operating response?';

  // Strip meta backend references like "According to V-Mart SOP Step 8 and Step 9 Vector 2, "
  let cleaned = str
    .replace(/^According to\s+.*?(SOP|Step|Vector|Document|Rule|Protocol|Directive).*?(,\s*|\?\s*|\.\s*)/i, '')
    .replace(/^According to\s+[^,]+,\s*/i, '')
    .replace(/^Per\s+.*?(SOP|Step|Vector|Document).*?,\s*/i, '')
    .trim();

  if (!cleaned) cleaned = 'What is the required standard operating response?';

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Sanitize Scenario Quiz Data
 */
export function sanitizeQuiz(q: any, cardTitle?: string): QuizData {
  if (!q || typeof q !== 'object') {
    return {
      scenario: `Reviewing protocol for ${cardTitle || 'this operational step'}...`,
      question: 'What is the required standard operating response?',
      options: [
        'Follow standard protocol strictly and record verification sign-off.',
        'Skip parameter check to save shift time.',
        'Modify operating parameters without supervisor approval.',
      ],
      correctAnswerIndex: 0,
      feynmanFeedback: 'Adhering to SOP standards prevents operational risk and downstream defects.',
      distractorExplanations: [
        'Skipping verification checks causes cumulative quality drift.',
        'Unapproved parameter changes violate safety compliance.',
      ],
    };
  }

  const scenario =
    cleanText(q.scenario) ||
    cleanText(q.dilemma) ||
    cleanText(q.context) ||
    `Reviewing operational scenario for ${cardTitle || 'this procedure'}...`;

  const question = cleanQuestionText(q.question || q.prompt);

  const rawOptions = Array.isArray(q.options)
    ? q.options.map((o: any) => cleanText(o)).filter((o): o is string => o !== null)
    : [];

  const options =
    rawOptions.length >= 2
      ? rawOptions
      : [
          'Follow standard protocol strictly and record verification sign-off.',
          'Bypass check under deadline pressure.',
          'Modify operating threshold without authorization.',
        ];

  const rawCorrectIndex = typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0;
  const correctAnswerIndex = Math.min(Math.max(0, rawCorrectIndex), options.length - 1);

  const feynmanFeedback =
    cleanText(q.feynmanFeedback) ||
    cleanText(q.explanation) ||
    cleanText(q.feedback) ||
    cleanText(q.rationale) ||
    'Adhering to SOP standards prevents operational risk and downstream defects.';

  const distractorExplanations = Array.isArray(q.distractorExplanations)
    ? q.distractorExplanations.map((d: any) => cleanText(d)).filter((d): d is string => d !== null)
    : [];

  return {
    scenario,
    question,
    options,
    correctAnswerIndex,
    feynmanFeedback,
    distractorExplanations,
  };
}

/**
 * Sanitize individual DeckCard
 */
export function sanitizeCard(rawCard: any, cardIndex: number): DeckCard {
  const card: DeckCard = { ...rawCard };

  card.id = cleanText(card.id) || `card-${cardIndex + 1}`;
  card.title = cleanText(card.title) || `Training Module ${cardIndex + 1}`;
  card.subtitle = cleanText(card.subtitle) || undefined;
  card.feynmanExplanation =
    cleanText(card.feynmanExplanation) ||
    cleanText((rawCard as any)?.feynmanIntuition) ||
    `Understand the core operational requirements for ${card.title}.`;

  card.badgeText = cleanText(card.badgeText) || undefined;
  card.stopWorkTrigger = cleanText(card.stopWorkTrigger) || undefined;
  card.responsibleRole = cleanText(card.responsibleRole) || undefined;

  // Force Golden Rules cards to critical_rules cardType without overwriting SOP-specific content
  if (card.title && card.title.toLowerCase().includes('golden rules')) {
    card.cardType = 'critical_rules';
  }

  // Derive / normalize cardType
  const validTypes: CardType[] = [
    'concept_analogy',
    'critical_rules',
    'process_steps',
    'pitfalls_troubleshooting',
    'scenario_quiz',
    'quick_reference',
  ];
  if (!validTypes.includes(card.cardType)) {
    if (Array.isArray(card.steps) && card.steps.length > 0) card.cardType = 'process_steps';
    else if (Array.isArray(card.pitfalls) && card.pitfalls.length > 0) card.cardType = 'pitfalls_troubleshooting';
    else if (Array.isArray(card.criticalRules) && card.criticalRules.length > 0) card.cardType = 'critical_rules';
    else if (Array.isArray(card.referenceItems) && card.referenceItems.length > 0) card.cardType = 'quick_reference';
    else if (card.quiz) card.cardType = 'scenario_quiz';
    else card.cardType = 'concept_analogy';
  }

  // 1. Sanitize steps
  if (Array.isArray((card as any).steps)) {
    card.steps = (card as any).steps.map((st: any, sIdx: number) => sanitizeStep(st, sIdx));
  } else {
    delete card.steps;
  }

  // 2. Sanitize criticalRules
  if (Array.isArray((card as any).criticalRules)) {
    card.criticalRules = (card as any).criticalRules.map((r: any) => sanitizeCriticalRule(r));
  } else {
    delete card.criticalRules;
  }

  // 3. Sanitize pitfalls
  if (Array.isArray((card as any).pitfalls)) {
    card.pitfalls = (card as any).pitfalls.map((p: any) => sanitizePitfall(p));
  } else {
    delete card.pitfalls;
  }

  // 4. Sanitize referenceItems
  if (Array.isArray((card as any).referenceItems)) {
    card.referenceItems = (card as any).referenceItems.map((ref: any) => sanitizeReferenceItem(ref));
  } else {
    delete card.referenceItems;
  }

  // 5. Sanitize quiz
  if ((card as any).quiz) {
    card.quiz = sanitizeQuiz((card as any).quiz, card.title);
  } else {
    delete card.quiz;
  }

  // 6. Sanitize analogy if present
  if ((card as any).analogy) {
    const a = (card as any).analogy;
    const metaphor = cleanText(a.metaphor) || cleanText(a.title) || 'Safety Interlock System';
    const takeaway = cleanText(a.takeaway) || cleanText(a.analogyText) || 'Verify baseline before proceeding.';
    card.analogy = { metaphor, takeaway };
  }

  return card;
}

/**
 * Universal Master Deck Sanitizer Pipeline
 */
export function sanitizeDeck(rawDeck: any): FeynmanDeck {
  if (!rawDeck || typeof rawDeck !== 'object') {
    return {
      id: `deck-${Date.now()}`,
      title: 'Standard Operating Procedure Execution Guide',
      summary: 'Operational procedures and standards execution deck.',
      targetAudience: 'Operations Staff',
      estimatedMinutes: 6,
      originalDocType: 'SOP Document',
      feynmanCoreConcept: {
        intuitiveExplanation: 'Core purpose is to ensure zero-defect execution.',
        centralAnalogy: {
          title: 'Safety Interlock Principle',
          analogyText: 'Verify baseline conditions before proceeding.',
          howItMapsToSOP: 'Every check acts as a physical barrier preventing downstream errors.',
        },
      },
      cards: [],
    };
  }

  const title = cleanText(rawDeck.title) || 'Standard Operating Procedure Execution Guide';
  const summary = cleanText(rawDeck.summary) || `Operational procedures and standards for ${title}.`;
  const targetAudience = cleanText(rawDeck.targetAudience) || 'Operations Staff';
  const estimatedMinutes = typeof rawDeck.estimatedMinutes === 'number' ? rawDeck.estimatedMinutes : 6;
  const originalDocType = cleanText(rawDeck.originalDocType) || 'SOP Document';

  // Core Concept Sanitization
  let feynmanCoreConcept = rawDeck.feynmanCoreConcept;
  if (!feynmanCoreConcept || typeof feynmanCoreConcept !== 'object') {
    feynmanCoreConcept = {
      intuitiveExplanation: `Core purpose of ${title} is to guarantee zero-defect execution.`,
      centralAnalogy: {
        title: `${title.slice(0, 30)} Interlock Principle`,
        analogyText: `Think of ${title} as a multi-stage safety interlock: verify baseline conditions before proceeding.`,
        howItMapsToSOP: `Every check acts as a physical barrier preventing downstream operational errors.`,
      },
    };
  } else {
    const intuitiveExplanation =
      cleanText(feynmanCoreConcept.intuitiveExplanation) ||
      `Core purpose of ${title} is to guarantee zero-defect execution.`;

    let centralAnalogy = feynmanCoreConcept.centralAnalogy;
    if (!centralAnalogy || typeof centralAnalogy !== 'object') {
      centralAnalogy = {
        title: `${title.slice(0, 30)} Principle`,
        analogyText: `Verify baseline parameters before initiating operational steps.`,
        howItMapsToSOP: `Every step acts as a physical barrier against operational defects.`,
      };
    } else {
      centralAnalogy = {
        title: cleanText(centralAnalogy.title) || `${title.slice(0, 30)} Principle`,
        analogyText:
          cleanText(centralAnalogy.analogyText) ||
          `Verify baseline parameters before initiating operational steps.`,
        howItMapsToSOP:
          cleanText(centralAnalogy.howItMapsToSOP) ||
          `Every step acts as a physical barrier against operational defects.`,
      };
    }

    feynmanCoreConcept = {
      intuitiveExplanation,
      centralAnalogy,
    };
  }

  // Cards Sanitization
  const rawCards = Array.isArray(rawDeck.cards) ? rawDeck.cards : [];
  const cards = rawCards.map((c: any, idx: number) => sanitizeCard(c, idx));

  // Modules Sanitization if present
  let modules = undefined;
  if (Array.isArray(rawDeck.modules)) {
    modules = rawDeck.modules.map((m: any, mIdx: number) => ({
      id: cleanText(m.id) || `module-${mIdx + 1}`,
      moduleNumber: typeof m.moduleNumber === 'number' ? m.moduleNumber : mIdx + 1,
      title: cleanText(m.title) || `Module ${mIdx + 1}`,
      summary: cleanText(m.summary) || `Module ${mIdx + 1} operational overview`,
      cards: Array.isArray(m.cards) ? m.cards.map((mc: any, mcIdx: number) => sanitizeCard(mc, mcIdx)) : [],
    }));
  }

  return {
    ...rawDeck,
    id: cleanText(rawDeck.id) || `deck-${Date.now()}`,
    title,
    summary,
    targetAudience,
    estimatedMinutes,
    originalDocType,
    feynmanCoreConcept,
    cards,
    ...(modules ? { modules } : {}),
  };
}

export type CardType =
  | 'concept_analogy'
  | 'critical_rules'
  | 'process_steps'
  | 'pitfalls_troubleshooting'
  | 'scenario_quiz'
  | 'quick_reference';

export interface CriticalRule {
  type: 'must_do' | 'never_do' | 'warning';
  rule: string;
  consequenceOfFailure: string;
  verificationCheck: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  action: string;
  whyItMatters: string;
  criticalWatchout?: string;
}

export interface Pitfall {
  symptomOrMistake: string;
  rootCause: string;
  immediateFix: string;
}

export interface QuizData {
  scenario: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  feynmanFeedback: string;
  distractorExplanations: string[];
}

export interface ReferenceItem {
  label: string;
  value: string;
  detail: string;
}

export interface CardImage {
  url?: string;
  caption?: string;
  alt?: string;
  diagramType?: 'cold_chain' | 'protein_origami' | 'cleanroom' | 'incident_triage' | 'chemical_neutralization' | 'flowchart' | 'custom';
  layout?: 'split' | 'hero' | 'inset';
}

export interface DeckCard {
  id: string;
  title: string;
  subtitle?: string;
  cardType: CardType;
  feynmanExplanation: string;
  badgeText?: string;
  image?: CardImage;
  analogy?: {
    metaphor: string;
    takeaway: string;
  };
  criticalRules?: CriticalRule[];
  steps?: ProcessStep[];
  pitfalls?: Pitfall[];
  quiz?: QuizData;
  referenceItems?: ReferenceItem[];
}

export interface FeynmanDeck {
  id: string;
  title: string;
  summary: string;
  targetAudience: string;
  estimatedMinutes: number;
  originalDocType: string;
  heroImage?: CardImage;
  feynmanCoreConcept: {
    intuitiveExplanation: string;
    centralAnalogy: {
      title: string;
      analogyText: string;
      howItMapsToSOP: string;
    };
  };
  cards: DeckCard[];
}

export type DeckTheme = 'obsidian' | 'clean' | 'nordic' | 'sage';

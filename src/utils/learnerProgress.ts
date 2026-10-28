export interface LearnerProgressRecord {
  id: string;
  deckId: string;
  learnerName: string;
  learnerEmail?: string;
  cardsCompleted: boolean;
  videoCompleted: boolean;
  guideMeCompleted: boolean;
  testScore?: number;
  testPassed?: boolean;
  completedAt?: string;
  lastActiveAt: string;
}

export function getLearnerProgress(deckId: string): LearnerProgressRecord[] {
  try {
    const raw = localStorage.getItem(`koya_progress_${deckId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore error
  }
  // Return default mock assignment record if none exists yet for demo realism
  return [
    {
      id: `prog-${deckId}-1`,
      deckId,
      learnerName: 'Alex Rivera (Frontline Operator)',
      learnerEmail: 'alex.rivera@plant-ops.com',
      cardsCompleted: true,
      videoCompleted: true,
      guideMeCompleted: true,
      testScore: 95,
      testPassed: true,
      completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      lastActiveAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];
}

export function getAllLearnerProgressMap(): Record<string, LearnerProgressRecord[]> {
  const result: Record<string, LearnerProgressRecord[]> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('koya_progress_')) {
        const deckId = key.replace('koya_progress_', '');
        result[deckId] = getLearnerProgress(deckId);
      }
    }
  } catch {
    // ignore
  }
  return result;
}

export function saveLearnerProgress(record: LearnerProgressRecord) {
  try {
    const existing = getLearnerProgress(record.deckId).filter((r) => r.id !== record.id);
    existing.unshift(record);
    localStorage.setItem(`koya_progress_${record.deckId}`, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to save learner progress to localStorage:', e);
  }
}

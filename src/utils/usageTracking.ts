import { doc, increment, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const trackUsage = async (userId: string, tokens: number, model: string) => {
  const today = new Date().toISOString().split('T')[0];
  const userRef = doc(db, 'users', userId);
  const dailyRef = doc(db, 'system_metrics', today);

  try {
    // Update User Usage
    // We use setDoc with merge: true to handle cases where the user doc or usage map might not exist yet
    await setDoc(userRef, {
      usage: {
        totalTokens: increment(tokens),
        requestCount: increment(1)
      },
      lastActive: serverTimestamp()
    }, { merge: true });

    // Update System Metrics
    await setDoc(dailyRef, {
      totalTokens: increment(tokens),
      requestCount: increment(1),
      cost: increment(tokens * 0.00001), // Rough estimate: $10 per 1M tokens (avg)
      models: {
        [model.replace(/\./g, '_')]: increment(1) // Firestore keys can't contain '.'
      },
      date: today
    }, { merge: true });

  } catch (error) {
    console.error("Failed to track usage:", error);
  }
};

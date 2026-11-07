import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { HallOfFameEntry } from './types';

const LEADERBOARD_COLLECTION = 'leaderboard';
const STATS_DOC_PATH = 'classroom_stats/current';

/**
 * Real-time listener for top leaderboard entries
 */
export function subscribeLeaderboard(
  onUpdate: (entries: HallOfFameEntry[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const q = query(
    collection(db, LEADERBOARD_COLLECTION),
    orderBy('score', 'desc'),
    limit(20)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const entries: HallOfFameEntry[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.studentName || '꼬마 낚시꾼',
          score: typeof data.score === 'number' ? data.score : 0,
          avatarId: data.avatarId || 'pikachu',
          avatarImg: data.avatarImg || 'images/피카츄4.png',
          date: data.createdAt ? data.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
        };
      });
      onUpdate(entries);
    },
    (error) => {
      console.error('Leaderboard subscription error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, LEADERBOARD_COLLECTION);
    }
  );

  return unsubscribe;
}

/**
 * Save new game score to Firestore and atomically increment classroom aquarium count
 */
export async function recordGameScore(
  studentName: string,
  score: number,
  avatarId: string,
  avatarImg: string
): Promise<string> {
  const path = LEADERBOARD_COLLECTION;
  try {
    const docRef = await addDoc(collection(db, path), {
      studentName,
      score,
      avatarId,
      avatarImg,
      createdAt: new Date().toISOString()
    });

    // Also update class cumulative fish count
    await setDoc(
      doc(db, 'classroom_stats', 'current'),
      {
        totalFishCount: increment(score),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Real-time listener for the classroom cooperative aquarium count
 */
export function subscribeClassAquarium(
  onUpdate: (totalCount: number) => void,
  onError?: (err: unknown) => void
): () => void {
  const docRef = doc(db, 'classroom_stats', 'current');

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate(typeof data.totalFishCount === 'number' ? data.totalFishCount : 0);
      } else {
        onUpdate(0);
      }
    },
    (error) => {
      console.error('Class aquarium subscription error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, STATS_DOC_PATH);
    }
  );

  return unsubscribe;
}

/**
 * Manually update/reset the class aquarium fish count (used by teacher settings)
 */
export async function updateClassAquariumCount(count: number): Promise<void> {
  const path = 'classroom_stats/current';
  try {
    await setDoc(doc(db, 'classroom_stats', 'current'), {
      totalFishCount: count,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Reset all leaderboard records in Firestore (used by teacher settings)
 */
export async function clearFirestoreLeaderboard(): Promise<void> {
  const path = LEADERBOARD_COLLECTION;
  try {
    const snapshot = await getDocs(collection(db, path));
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

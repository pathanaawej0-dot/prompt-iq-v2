import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  Timestamp,
  increment
} from 'firebase/firestore';
import { User, Prompt } from '@/types';
import { UserDocument, PromptDocument } from '@/types/database';
import { PLAN_LIMITS } from './constants';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper function to convert Firestore document to User
function docToUser(doc: UserDocument): User {
  return {
    ...doc,
    created_at: doc.created_at?.toDate() || new Date(),
    updated_at: doc.updated_at?.toDate() || new Date(),
    payment_history: doc.payment_history?.map(ph => ({
      ...ph,
      date: ph.date?.toDate() || new Date(),
    })),
  };
}

// Helper function to convert Firestore document to Prompt
function docToPrompt(doc: PromptDocument): Prompt {
  return {
    ...doc,
    created_at: doc.created_at?.toDate() || new Date(),
  };
}

// Sign up new user
export async function signUp(email: string, password: string, name: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userDoc: UserDocument = {
      uid: user.uid,
      email: user.email!,
      name,
      plan: 'spark',
      generations_used: 0,
      generations_limit: PLAN_LIMITS.spark,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      payment_history: [],
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);

    return docToUser(userDoc);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    return docToUser(userDoc.data() as UserDocument);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
}

// Get current user
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

// Get user data from Firestore
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return null;
    }
    return docToUser(userDoc.data() as UserDocument);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

// Update user's generation count
export async function updateGenerationCount(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      generations_used: increment(1),
      updated_at: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating generation count:', error);
    throw error;
  }
}

// Check if user has generations left
export async function hasGenerationsLeft(uid: string): Promise<boolean> {
  try {
    const userData = await getUserData(uid);
    if (!userData) return false;
    return userData.generations_used < userData.generations_limit;
  } catch (error) {
    console.error('Error checking generations:', error);
    return false;
  }
}

// Update user plan after payment
export async function updateUserPlan(uid: string, plan: 'architect' | 'studio', orderId: string, amount: number): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const userData = await getUserData(uid);
    
    if (!userData) throw new Error('User not found');

    const paymentHistory = userData.payment_history || [];
    paymentHistory.push({
      order_id: orderId,
      amount,
      plan,
      date: new Date(),
      status: 'success',
    });

    await updateDoc(userRef, {
      plan,
      generations_limit: PLAN_LIMITS[plan],
      generations_used: 0, // Reset on upgrade
      payment_history: paymentHistory.map(ph => ({
        ...ph,
        date: Timestamp.fromDate(ph.date),
      })),
      updated_at: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
}

// Save prompt to Firestore
export async function savePrompt(
  userId: string,
  inputText: string,
  outputText: string,
  framework: string,
  qualityScore: number,
  version: number = 1,
  parentId: string | null = null
): Promise<string> {
  try {
    const promptRef = doc(collection(db, 'prompts'));
    const promptDoc: PromptDocument = {
      id: promptRef.id,
      user_id: userId,
      input_text: inputText,
      output_text: outputText,
      framework: framework as any,
      quality_score: qualityScore,
      version,
      parent_id: parentId,
      tokens_used: Math.ceil(outputText.length / 4), // Rough estimate
      created_at: Timestamp.now(),
    };

    await setDoc(promptRef, promptDoc);
    return promptRef.id;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
}

// Get user's prompts
export async function getUserPrompts(
  userId: string,
  limitCount: number = 20
): Promise<Prompt[]> {
  try {
    const q = query(
      collection(db, 'prompts'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => docToPrompt(doc.data() as PromptDocument));
  } catch (error) {
    console.error('Error getting user prompts:', error);
    return [];
  }
}

// Delete prompt
export async function deletePrompt(promptId: string, userId: string): Promise<void> {
  try {
    const promptRef = doc(db, 'prompts', promptId);
    const promptDoc = await getDoc(promptRef);
    
    if (!promptDoc.exists()) {
      throw new Error('Prompt not found');
    }

    const promptData = promptDoc.data() as PromptDocument;
    if (promptData.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    await deleteDoc(promptRef);
  } catch (error) {
    console.error('Error deleting prompt:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(uid: string, name: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      name,
      updated_at: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

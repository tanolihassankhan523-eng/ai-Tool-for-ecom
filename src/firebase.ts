import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Project, ChatMessage, UserProfile } from './types';

export { onAuthStateChanged };
export type { FirebaseUser };

// 1. Initialize Firebase App and Services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// 2. Startup connection test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// 3. Standard Firestore Error Handler as mandated by Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 4. Auth Methods
export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const fbUser = cred.user;
    const userProfile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Creative Creator',
      email: fbUser.email || '',
      isGuest: false,
      role: 'Creative Director',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    };

    // Sync user profile to Firestore
    await syncUserProfileToFirestore(fbUser, userProfile);
    return userProfile;
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

// 5. Firestore Persistence Sync Operations
export async function syncUserProfileToFirestore(user: FirebaseUser, profile: UserProfile) {
  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;
  try {
    const existingSnap = await getDoc(userRef);
    if (!existingSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: profile.name || '',
        photoURL: user.photoURL || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userRef, {
        displayName: profile.name || existingSnap.data()?.displayName || '',
        photoURL: user.photoURL || existingSnap.data()?.photoURL || '',
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function saveProjectToFirestore(userId: string, project: Project): Promise<void> {
  const path = `users/${userId}/projects/${project.id}`;
  try {
    const projectRef = doc(db, 'users', userId, 'projects', project.id);
    await setDoc(projectRef, {
      id: project.id,
      userId,
      title: project.title.slice(0, 200),
      clientName: (project.clientName || 'Direct Client').slice(0, 100),
      brandNiche: (project.brandNiche || 'E-commerce').slice(0, 100),
      videoType: project.videoType || 'dtc',
      targetPlatform: (project.targetPlatform || 'TikTok').slice(0, 50),
      primaryLanguage: (project.primaryLanguage || 'roman_urdu').slice(0, 50),
      aspectRatio: (project.aspectRatio || '9:16').slice(0, 20),
      targetLengthSec: project.targetLengthSec || 30,
      brandGuidelines: (project.brandGuidelines || '').slice(0, 2000),
      deliverablesNotes: (project.deliverablesNotes || '').slice(0, 2000),
      rawBrief: (project.rawBrief || '').slice(0, 5000),
      status: project.status || 'active',
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function loadUserProjectsFromFirestore(userId: string): Promise<Project[]> {
  const path = `users/${userId}/projects`;
  try {
    const colRef = collection(db, 'users', userId, 'projects');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: data.id || d.id,
        title: data.title || 'Untitled Campaign',
        clientName: data.clientName || 'Direct Client',
        brandNiche: data.brandNiche || 'E-commerce',
        videoType: data.videoType || 'dtc',
        targetPlatform: data.targetPlatform || 'TikTok',
        primaryLanguage: data.primaryLanguage || 'roman_urdu',
        aspectRatio: data.aspectRatio || '9:16',
        targetLengthSec: Number(data.targetLengthSec) || 30,
        brandGuidelines: data.brandGuidelines || '',
        deliverablesNotes: data.deliverablesNotes || '',
        rawBrief: data.rawBrief || '',
        status: data.status || 'active',
        createdAt: data.createdAt || new Date().toISOString(),
      } as Project;
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function deleteProjectFromFirestore(userId: string, projectId: string): Promise<void> {
  const path = `users/${userId}/projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'projects', projectId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function saveChatMessageToFirestore(userId: string, chatId: string, message: ChatMessage): Promise<void> {
  const chatPath = `users/${userId}/chats/${chatId}`;
  const msgPath = `users/${userId}/chats/${chatId}/messages/${message.id}`;
  try {
    // Ensure parent chat session exists
    const chatDoc = doc(db, 'users', userId, 'chats', chatId);
    await setDoc(chatDoc, {
      id: chatId,
      userId,
      title: (message.content.slice(0, 40) || 'New Conversation').trim(),
      model: 'gemini-3.8-flash',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Save message
    const msgDoc = doc(db, 'users', userId, 'chats', chatId, 'messages', message.id);
    await setDoc(msgDoc, {
      id: message.id,
      sessionId: chatId,
      userId,
      role: message.role,
      content: message.content.slice(0, 20000),
      timestamp: message.timestamp || new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, msgPath);
  }
}

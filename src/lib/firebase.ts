// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration with fallback values for SSR
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-storage",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy-app"
};

// Environment variables kontrolü (sadece client-side ve development'ta)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Sadece bir kez kontrol et, her page refresh'te değil
  const hasCheckedEnv = sessionStorage.getItem('firebase-env-checked');
  
  if (!hasCheckedEnv) {
    // Kısa gecikme ile kontrol et (Turbopack için)
    setTimeout(() => {
      const requiredEnvVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      ];
      
      const missingVars = requiredEnvVars.filter(varName => 
        !process.env[varName] || process.env[varName]?.startsWith('dummy-')
      );
      
      if (missingVars.length > 0) {
        console.error('❌ Eksik Firebase environment variables:', missingVars);
        console.error('💡 .env.local dosyasına Firebase anahtarlarını ekleyin');
        console.log('🔍 Mevcut env değerleri:', {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅' : '❌',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅' : '❌',
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌',
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅' : '❌',
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅' : '❌',
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅' : '❌'
        });
      } else {
        console.log('✅ Tüm Firebase environment variables yüklendi');
      }
      
      // Mark as checked for this session
      sessionStorage.setItem('firebase-env-checked', 'true');
    }, 1000);
  }
}

// Initialize Firebase (singleton pattern for SSR compatibility)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 
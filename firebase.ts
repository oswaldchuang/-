import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbeuYDDjG9sMvILp7-WWD-NXz42VL0yR4",
  authDomain: "oswald-8594f.firebaseapp.com",
  projectId: "oswald-8594f",
  storageBucket: "oswald-8594f.firebasestorage.app",
  messagingSenderId: "315064151109",
  appId: "1:315064151109:web:fc47c45c81fda2f2cec72c",
  measurementId: "G-BC73PMRJYE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * 【通用資料清潔函式】
 * 遞迴清除 undefined，轉換 Date，並捕捉錯誤欄位。
 */
export const sanitizeData = (data: any, path: string = 'root'): any => {
  try {
    if (data === undefined) return null;
    if (data === null) return null;

    if (data instanceof Date) {
      return data.toISOString();
    }

    if (Array.isArray(data)) {
      return data.map((item, index) => sanitizeData(item, `${path}[${index}]`));
    }

    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sanitized[key] = sanitizeData(data[key], `${path}.${key}`);
        }
      }
      return sanitized;
    }

    return data;
  } catch (error) {
    console.error(`[Sanitize Error] 異常欄位路徑: ${path}`);
    throw error;
  }
};
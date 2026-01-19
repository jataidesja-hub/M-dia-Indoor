import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDUVU7RDG9UV71rH8ka8b7cvfQYIkedKl8",
    authDomain: "indoor-cf123.firebaseapp.com",
    projectId: "indoor-cf123",
    storageBucket: "indoor-cf123.firebasestorage.app",
    messagingSenderId: "46609399710",
    appId: "1:46609399710:web:a455f3d71dec7f91dc608f",
    measurementId: "G-QERT2PSH2C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const collections = {
    CLIENTS: 'clients',
    DRIVERS: 'drivers',
    PLAYLIST: 'playlist'
};

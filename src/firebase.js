import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Seus dados do Firebase (Vindos da sua imagem)
const firebaseConfig = {
    apiKey: "AIzaSyDUVU7RDG9UV71rH8ka8b7cvfQYIkedKl8",
    authDomain: "indoor-cf123.firebaseapp.com",
    projectId: "indoor-cf123",
    storageBucket: "indoor-cf123.firebasestorage.app",
    messagingSenderId: "46609399710",
    appId: "1:46609399710:web:a455f3d71dec7f91dc608f",
    measurementId: "G-QERT2PSH2C"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helpers para facilitar o uso no resto do código
export const collections = {
    CLIENTS: 'clients',
    DRIVERS: 'drivers',
    PLAYLIST: 'playlist'
};

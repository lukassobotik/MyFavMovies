import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
    apiKey: "AIzaSyCykk7heLz99AXyELMA_SCODnFEYVboQHs",
    authDomain: "myfavorite-movies.firebaseapp.com",
    projectId: "myfavorite-movies",
    storageBucket: "myfavorite-movies.appspot.com",
    messagingSenderId: "436588163845",
    appId: "1:436588163845:web:05f80fca5f1b190e247d6c",
    measurementId: "G-ESM60CKBEP"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

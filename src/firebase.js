import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyArBZCxRdgaxUU67t1Hoow-dNSenI3OdVg",
    authDomain: "finalproject-809ab.firebaseapp.com",
    projectId: "finalproject-809ab",
    storageBucket: "finalproject-809ab.firebasestorage.app",
    messagingSenderId: "387275580687",
    appId: "1:387275580687:web:5ccbb1939016986c62ca7a",
    measurementId: "G-P79KJP17MH"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)



// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0XXCzg7jYisSByxLPmjhrX43GAM8zEdU",
    authDomain: "magicdew-login-signup.firebaseapp.com",
    projectId: "magicdew-login-signup",
    storageBucket: "magicdew-login-signup.appspot.com",
    messagingSenderId: "370483267757",
    appId: "1:370483267757:web:4a958e61eb055f301b1e24",
    measurementId: "G-QX0DX1Z0MQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get DOM elements
const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const signUpMessage = document.getElementById('signUpMessage');

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameVal = username.value.trim();
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();

    // Input validation
    if (!usernameVal) {
        usernameError.textContent = "Username is required.";
        return;
    } else {
        usernameError.textContent = "";
    }

    if (!emailVal) {
        emailError.textContent = "Email is required.";
        return;
    } else {
        emailError.textContent = "";
    }

    if (!passwordVal) {
        passwordError.textContent = "Password is required.";
        return;
    } else {
        passwordError.textContent = "";
    }

    try {
        // Register user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, emailVal, passwordVal);
        const user = userCredential.user;

        // Save user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: usernameVal,
            email: emailVal,
        });

        // Display success message
        signUpMessage.style.display = "block";
        signUpMessage.textContent = "Account created successfully!";
        signUpMessage.style.color = "green";
        form.reset();

        // Redirect to login page if needed
        // window.location.href = './login.html';
    } catch (error) {
        // Handle errors
        const errorCode = error.code;

        if (errorCode === "auth/email-already-in-use") {
            emailError.textContent = "This email is already registered!";
        } else if (errorCode === "auth/invalid-email") {
            emailError.textContent = "Please enter a valid email!";
        } else if (errorCode === "auth/weak-password") {
            passwordError.textContent = "Password should be at least 6 characters!";
        } else {
            signUpMessage.style.display = "block";
            signUpMessage.textContent = error.message;
            signUpMessage.style.color = "red";
        }
    }
});

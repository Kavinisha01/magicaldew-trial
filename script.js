// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIxY5sncIfc1xpN2IBLxL5HAHTS7fuHP4",
    authDomain: "login-e97dc.firebaseapp.com",
    databaseURL: "https://login-e97dc-default-rtdb.firebaseio.com",
    projectId: "login-e97dc",
    storageBucket: "login-e97dc.appspot.com",
    messagingSenderId: "853778405308",
    appId: "1:853778405308:web:7e5e61737330390f76fdb9",
    measurementId: "G-PRNDG1T2YL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Utility to display messages
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 500);
    }, 2000);
}

// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    function validateUsername() {
        const username = usernameInput.value.trim();
        if (!username) {
            usernameError.textContent = "Username is required!";
            usernameError.style.visibility = "visible";
            return false;
        } else if (username.length < 8 || username !== username.toLowerCase()) {
            usernameError.textContent = "Username must be at least 8 characters and in lowercase.";
            usernameError.style.visibility = "visible";
            return false;
        } else {
            usernameError.style.visibility = "hidden";
            return true;
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailError.textContent = "Email is required!";
            emailError.style.visibility = "visible";
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = "Enter a valid email address.";
            emailError.style.visibility = "visible";
            return false;
        } else {
            emailError.style.visibility = "hidden";
            return true;
        }
    }

    function validatePassword() {
        const password = passwordInput.value.trim();
        if (!password) {
            passwordError.textContent = "Password is required!";
            passwordError.style.visibility = "visible";
            return false;
        } else if (!/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password)) {
            passwordError.textContent = "Password must be at least 8 characters with a special character.";
            passwordError.style.visibility = "visible";
            return false;
        } else {
            passwordError.style.visibility = "hidden";
            return true;
        }
    }

    // Attach input listeners for real-time validation
    usernameInput.addEventListener("input", validateUsername);
    emailInput.addEventListener("input", validateEmail);
    passwordInput.addEventListener("input", validatePassword);

    // Handle form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                username,
                email,
            });

            showMessage("Account created successfully!", "signUpMessage");
            form.reset();
            usernameError.textContent = "";
            emailError.textContent = "";
            passwordError.textContent = "";
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                showMessage("Email is already in use!", "signUpMessage", true);
            } else {
                showMessage("Error creating account. Please try again.", "signUpMessage", true);
            }
            console.error("Error:", error.message);
        }
    });

    // Toggle password visibility
    const showPasswordIcon = document.getElementById("showPassword");
    showPasswordIcon.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            showPasswordIcon.classList.remove("fa-eye-slash");
            showPasswordIcon.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            showPasswordIcon.classList.remove("fa-eye");
            showPasswordIcon.classList.add("fa-eye-slash");
        }
    });
});

// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAIxY5sncIfc1xpN2IBLxL5HAHTS7fuHP4",
    authDomain: "login-e97dc.firebaseapp.com",
    databaseURL: "https://login-e97dc-default-rtdb.firebaseio.com",
    projectId: "login-e97dc",
    storageBucket: "login-e97dc.appspot.com",
    messagingSenderId: "853778405308",
    appId: "1:853778405308:web:7e5e61737330390f76fdb9",
    measurementId: "G-PRNDG1T2YL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to show messages
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

// Check if Register Page
const isRegisterPage = window.location.pathname.includes("index.html");

if (isRegisterPage) {
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("form");
        const usernameInput = document.getElementById("username");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const usernameError = document.getElementById("usernameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");

        // Username Validation
        usernameInput.addEventListener("input", () => {
            const usernameValue = usernameInput.value.trim();
            if (usernameValue === "") {
                usernameError.textContent = "This field is required!";
                usernameError.style.visibility = "visible";
            } else if (usernameValue.length < 8) {
                usernameError.textContent = "Username must be at least 8 characters.";
                usernameError.style.visibility = "visible";
            } else if (usernameValue !== usernameValue.toLowerCase()) {
                usernameError.textContent = "Username must be in lowercase.";
                usernameError.style.visibility = "visible";
            } else {
                usernameError.style.visibility = "hidden";
            }
        });

        // Email Validation
        emailInput.addEventListener("input", () => {
            const emailValue = emailInput.value.trim();
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (emailValue === "") {
                emailError.textContent = "This field is required!";
                emailError.style.visibility = "visible";
            } else if (!emailPattern.test(emailValue)) {
                emailError.textContent = "Please enter a valid email address.";
                emailError.style.visibility = "visible";
            } else {
                emailError.style.visibility = "hidden";
            }
        });

        // Password Validation
        passwordInput.addEventListener("input", () => {
            const passwordValue = passwordInput.value.trim();
            const passwordPattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
            if (passwordValue === "") {
                passwordError.textContent = "This field is required!";
                passwordError.style.visibility = "visible";
            } else if (!passwordPattern.test(passwordValue)) {
                passwordError.textContent = "Password must be at least 8 characters with a special character.";
                passwordError.style.visibility = "visible";
            } else {
                passwordError.style.visibility = "hidden";
            }
        });

        // Form Submission
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const usernameValue = usernameInput.value.trim();
            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value.trim();

            // Final Validation Check
            let isValid = true;

            if (usernameError.style.visibility === "visible" || usernameValue === "") {
                usernameError.textContent = "This field is required!";
                usernameError.style.visibility = "visible";
                isValid = false;
            }
            if (emailError.style.visibility === "visible" || emailValue === "") {
                emailError.textContent = "This field is required!";
                emailError.style.visibility = "visible";
                isValid = false;
            }
            if (passwordError.style.visibility === "visible" || passwordValue === "") {
                passwordError.textContent = "This field is required!";
                passwordError.style.visibility = "visible";
                isValid = false;
            }

            if (!isValid) return;

            // Sign-Up Logic
            try {
                const registerUserCredential = await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
                const user = registerUserCredential.user;

                const userData = {
                    email: emailValue,
                    userName: usernameValue,
                };

                await setDoc(doc(db, "users", user.uid), userData);

                showMessage("Account Created Successfully!", "signUpMessage");
                form.reset();

                setTimeout(() => {
                    window.location.href = "../pages/login.html";
                }, 1000);
            } catch (error) {
                const errorCode = error.code;
                if (errorCode === "auth/email-already-in-use") {
                    showMessage("Email Address Already Exists!", "signUpMessage");
                } else {
                    showMessage("Unable to create user. Please try again.", "signUpMessage");
                }
            }
        });
    });
}

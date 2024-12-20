// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0XXCzg7jYisSByxLPmjhrX43GAM8zEdU",
    authDomain: "magicdew-login-signup.firebaseapp.com",
    projectId: "magicdew-login-signup",
    storageBucket: "magicdew-login-signup.firebasestorage.app",
    messagingSenderId: "370483267757",
    appId: "1:370483267757:web:4a958e61eb055f301b1e24",
    measurementId: "G-QX0DX1Z0MQ"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const signupName = document.getElementById("signupNameSpan");
const signupUserName = document.getElementById("signupUserNameSpan");
const signupEmail = document.getElementById("signupEmailSpan");
const signupPassword = document.getElementById("signupPasswordSpan");
const popupDiv=document.getElementById("popupDiv");
// Submit button
const createButton = document.getElementById('createButton');
createButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission initially
    // Get input values
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const username = document.getElementById("signupUserName").value;
    const name = document.getElementById("signupName").value;
    // Run form validation
    if (!validateForm(email, password, username, name)) {
        return; // Stop the process if validation fails
    }
    // Firebase Authentication
    const auth = getAuth();
    const db = getFirestore();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up successfully
            const user = userCredential.user;
            const userData = {
                email: email,
                username: username,
                name: name
            };
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = "../index.html"; // Redirect after successful sign-up
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                popupDiv.textContent="Email is already exist !"
                popupDiv.style.display="block";
                setTimeout(() => {
                    popupDiv.style.display="none";
                }, 1500);
            } else {
               popupDiv.textContent="Unable to signup";
               popupDiv.style.display="block";
               setTimeout(() => {
                   popupDiv.style.display="none";
               }, 1500);
            }
        });
});
// Form validation function
function validateForm(email, password, username, name) {
    let isValid = true;
    // Check if all fields are empty
    if (email === "" && password === "" && username === "" && name === "") {
        signupEmail.textContent = "Email is required";
        signupName.textContent = "Name is mandatory";
        signupPassword.textContent = "Password is required";
        signupUserName.textContent = "Put your username";
        showErrorMessages(); // Show all error messages
        isValid = false;
    }
    // Validate individual fields
    if (email === "") {
        signupEmail.textContent = "Email is required";
        signupEmail.style.display = "block"; // Ensure it’s visible for the user
        setTimeout(() => {
            signupEmail.style.display = "none";
        }, 1500);
        isValid = false;
    } else if (!email.includes("@")) {
        signupEmail.textContent = "Please enter a valid Email address";
        signupEmail.style.display = "block";
        setTimeout(() => {
            signupEmail.style.display = "none";
        }, 1500);
        isValid = false;
    } else if(/[A-Z]/.test(email)){
        signupEmail.textContent="Email should be in lowercase";
        signupEmail.style.display="block";
        setTimeout(() => {
            signupEmail.style.display="none";
        }, 1500);
        isValid = false;
    }
    if (name === "") {
        signupName.textContent = "Enter your name";
        signupName.style.display = "block";
        setTimeout(() => {
            signupName.style.display = "none";
        }, 1500);
        isValid = false;
    } else if(name.length<6 || name.length>15){
        signupName.textContent="Name should contain 6 to 15 characters";
        signupName.style.display="block";
        setTimeout(() => {
            signupName.style.display="none";
        }, 1500);
    }
    if (username === "") {
        signupUserName.textContent = "Username is required";
        signupUserName.style.display = "block";
        setTimeout(() => {
            signupUserName.style.display = "none";
        }, 1500);
        isValid = false;
    } else if(username.length<6 || username.length>15){
        signupUserName.textContent="Username must contain 6 to 15 characters";
        signupUserName.style.display="block";
        setTimeout(() => {
            signupUserName.style.display="none";
        }, 1500);
    }
    if (password === "") {
        signupPassword.textContent = "Password is required";
        signupPassword.style.display = "block";
        setTimeout(() => {
            signupPassword.style.display = "none";
        }, 1500);
        isValid = false;
    }
    else if(password.length<8){
        signupPassword.textContent="Password must be 6 characters";
        signupPassword.style.display="block";
        setTimeout(() => {
            signupPassword.style.display="none";
        }, 1500);
        isValid = false;
    } else if(password[0] !== password[0].toUpperCase()){
        signupPassword.textContent="Password's first letter should be in Uppercase"
        signupPassword.style.display = "block";
        setTimeout(() => {
            signupPassword.style.display = "none";
        }, 1500);
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        signupPassword.textContent = "Password should contain special character";
        signupPassword.style.display = "block";
        setTimeout(() => {
            signupPassword.style.display = "none";
        }, 1500);
    } else if( password.includes(" ")){
        signupPassword.textContent="Password should not contain spaces"
        signupPassword.style.display = "block";
        setTimeout(() => {
            signupPassword.style.display = "none";
        }, 1500);
    }
    return isValid;
}
// Helper function to display all error messages at once
function showErrorMessages() {
    setTimeout(() => {
        signupEmail.style.display = "none";
        signupName.style.display = "none";
        signupPassword.style.display = "none";
        signupUserName.style.display = "none";
    }, 1500);
}
const passwordInput = document.getElementById('signupPassword');
const showPasswordIcon = document.getElementById('showPassword');
// Add a click event listener to the icon
showPasswordIcon.addEventListener('click', () => {
    // Toggle the password visibility
    const isPasswordHidden = passwordInput.type === 'password';
    passwordInput.type = isPasswordHidden ? 'text' : 'password';
    passwordInput.style.color = "white"; // Change color to black when visible
    // Update the icon based on the visibility state
    showPasswordIcon.classList.toggle('fa-eye-slash', isPasswordHidden);
    showPasswordIcon.classList.toggle('fa-eye', !isPasswordHidden);
});
// Logout functionality
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener('click', async () => {
    const auth = getAuth();
    try {
        await auth.signOut();
        popupDiv.textContent="Logging out";
        popupDiv.style.display="block";
        setTimeout(() => {
            popupDiv.style.display="none";
        }, 1500);
        // Optionally redirect to the login page or home page
        window.location.href = "./login.html"; // Change to your desired page
    } catch (error) {
        console.error("Logout Error:", error);
    }
});











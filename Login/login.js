
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgbJF2Y-AEZ5mgWm8WdtF_zoQhM5y_Exk",
    authDomain: "eco-search-7336e.firebaseapp.com",
    projectId: "eco-search-7336e",
    storageBucket: "eco-search-7336e.firebasestorage.app",
    messagingSenderId: "80119032029",
    appId: "1:80119032029:web:c2739b951455eca30f9334",
    measurementId: "G-MP14WTT1E1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submittype');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!submitButton || !emailInput || !passwordInput) {
        console.error('Required elements not found. Check your HTML IDs.');
        return;
    }

    // Login form submission
    submitButton.addEventListener("click", async function (event) {
        event.preventDefault();

        // Input validation
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        try {
            // Attempt login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Login successful:', user.email);
            alert('Login Successful');

            // Redirect to prototype4.html
            window.location.href = '../prototype4.html';

        } catch (error) {
            console.error('Login error:', error);
            
            // Provide user-friendly error messages
            let errorMessage = 'An error occurred during login';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection';
                    break;
            }
            alert(errorMessage);
        }
    });
});

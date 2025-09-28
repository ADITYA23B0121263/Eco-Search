// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";


import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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



// Initialize Firebase Authentication
const auth = getAuth(app);

const submit = document.getElementById('submittype');

// Submit button event listener
submit.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    // Inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password1').value;
    const confirmPassword = document.getElementById('password2').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert("Passwords does not match.");
        return;
    }

    // Create user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Account created successfully!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorMessage} (Code: ${errorCode})`);
        });
});

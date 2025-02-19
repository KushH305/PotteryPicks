import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './styles/Auth.css';

// Firebase Auth Imports
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc, getDoc } from "firebase/firestore"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const SignupPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    console.log("Starting email/password signup..."); // Log start of email/password signup

    try {
        if(!email || !password || !username) {
            setError("Please fill in all fields")
            return
        }

        console.log("Attempting to create user with email:", email); // Log email
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        console.log("User created in Firebase Auth. UID:", user.uid); // Log auth success

        console.log("Attempting to write user data to Firestore..."); // Log Firestore write attempt

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            username: username,
        })

        navigate("/login")
        console.log("User created successfully")

    } catch (error) {
        setError(error.message)
        console.log("Error signing up", error)
    } finally {
        setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user

        const userDocRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(userDocRef)
        
        if(!docSnap.exists()) {
          const generatedUsername = generateUsername(user.displayName)
          await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              email: user.email,
              username: generatedUsername,
          })
        }
        navigate("/dashboard")
    } catch (error) {
        setError(error.message)
        console.log("Error signing in with Google", error)
    }
  }

  const generateUsername = (displayName) => {
    let username = displayName.replace(/\s+/g, "_").toLowerCase()
    return username
  }

  return (
    <div className="auth-page">
      <nav className="navbar">
        <Link to="/" className="navbar-logo-link">
            <img src="/potterypickslogo.png" alt="Pottery Picks Logo" className="navbar-logo" />
          <h1 className="navbar-title">Pottery Picks</h1>
        </Link>
        <Link to="/" className="back-button">
          Back to home
        </Link>
      </nav>
      

      <div className="auth-container animate-fadeInUp">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Start your pottery journey today</p>

        <form className="auth-form" onSubmit={(e) => {
          console.log("Form submitted")
          handleSubmit(e)
        }}>
          <div className="form-group animate-fadeInUp animate-delay-1">
            <input 
              type="text" 
              placeholder="Username"
              className="auth-input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group animate-fadeInUp animate-delay-1">
            <input 
              type="email" 
              placeholder="Email Address"
              className="auth-input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group animate-fadeInUp animate-delay-2">
            <input 
              type="password" 
              placeholder="Password"
              className="auth-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link to ="/login">
            <button 
                type="submit" 
                className="auth-submit-button animate-fadeInUp animate-delay-3"
                onClick={handleSubmit}
            > Create Account
            </button>
          </Link>
        </form>
        <div className="google-signin-container">
            <button className="google-signin-button" onClick={handleGoogleSignIn} disabled={loading}>
            <img src="/google_logo.png" alt="Google Logo" className="google-logo" />  
              Sign in with Google
            </button>
        </div>
        <div className="auth-links animate-fadeInUp animate-delay-3">
          <p className="auth-separator">Already have an account?</p>
          <Link to="/login" className="auth-switch-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
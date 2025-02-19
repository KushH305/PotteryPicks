import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './styles/Auth.css';

import { auth, db } from './firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if(!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.log("Error signing in", error);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if(!docSnap.exists()) {
        const generatedUsername = generateUsername(user.displayName);
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          username: generatedUsername,
        });
      }
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const generateUsername = (displayName) => {
    let username = displayName.replace(/\s+/g, "").toLowerCase();
    const timestamp = Date.now();
    username = `${username}${timestamp}`;
    return username;
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
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Continue your pottery journey</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group animate-fadeInUp animate-delay-1">
            <input 
              type="text" 
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group animate-fadeInUp animate-delay-2">
            <input 
              type="password" 
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link to="/dashboard">
            <button 
              type="submit" 
              className="auth-submit-button animate-fadeInUp animate-delay-3"
            > Login
            </button>
          </Link>
        </form>

        <div className="google-signin-container">
          <button className="google-signin-button" onClick={handleGoogleSignIn}>
            <img src="/google_logo.png" alt="Google Logo" className="google-logo" />
            Login with Google
          </button>
        </div>

        <div className="auth-links animate-fadeInUp animate-delay-3">
          <p className="auth-separator">Don't have an account?</p>
          <Link to="/signup" className="auth-switch-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
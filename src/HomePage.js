import React from 'react';
import { Link } from 'react-router-dom';
import './styles/HomePage.css';


const HomePage = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <img src="/potterypickslogo.png" alt="Pottery Picks Logo" className="navbar-logo" />
        <h1 className="navbar-title">Pottery Picks</h1>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="auth-button login">Login</button>
          </Link>
          <Link to="/signup">
            <button className="auth-button signup">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="hero-title animate-fadeInUp">
          Craft Your Perfect Pottery
        </h2>
        <p className="hero-description animate-fadeInUp animate-delay-1">
          Design and visualize your pottery pieces before bringing them to life. 
          From traditional vases to modern plates, bring your creative vision to reality.
        </p>
      </section>

      {/* Models Section */}
      <section className="models-section">
        <div className="models-grid">
          <div className="model-card animate-fadeInUp animate-delay-1">
            <img src="/vase.png" alt="Vase" className="model-image" />
            <h3 className="model-title">Classic Vase</h3>
            <p className="model-description">
              Elegant and timeless designs for your home
            </p>
          </div>
          <div className="model-card animate-fadeInUp animate-delay-2">
            <img src="/bowl.png" alt="Bowl" className="model-image" />
            <h3 className="model-title">Modern Bowl</h3>
            <p className="model-description">
              Contemporary shapes for everyday use
            </p>
          </div>
          <div className="model-card animate-fadeInUp animate-delay-3">
            <img src="/plate.png" alt="Plate" className="model-image" />
            <h3 className="model-title">Designer Plate</h3>
            <p className="model-description">
              Unique patterns that make a statement
            </p>
          </div>
        </div>
        
        {/* <Link to="/app" className="cta-button animate-fadeInUp animate-delay-3">
          Start Designing
        </Link> */}
      </section>
    </div>
  );
};

export default HomePage;

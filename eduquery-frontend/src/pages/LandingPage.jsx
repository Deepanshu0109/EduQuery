import { Link } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage = () => {
  return (
    <div className="landing-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">EduQuery</h1>
          <p className="hero-tagline">Peer-to-peer doubt-solving platform for students.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
        <div className="hero-image">
          {/* Placeholder image */}
          <div className="image-placeholder">Your Image Here</div>
        </div>
      </section>

      {/* Why EduQuery */}
      <section className="why-section">
        <h2>Why EduQuery?</h2>
        <div className="why-cards">
          <div className="card">
            <h3>Fast Answers</h3>
            <p>Get quick responses from peers and experts.</p>
          </div>
          <div className="card">
            <h3>Collaborative Learning</h3>
            <p>Learn together, share knowledge, and grow.</p>
          </div>
          <div className="card">
            <h3>Explore Doubts</h3>
            <p>Discover questions and solutions from other students.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About EduQuery</h2>
        <p>EduQuery is designed to bridge the gap between students and knowledge. Post doubts, help others, and explore a community-driven learning experience that makes studying easier and more interactive.</p>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <h2>How It Works</h2>
        <div className="workflow-steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Post a Doubt</h3>
            <p>Share your questions with the community.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Get Answers</h3>
            <p>Receive answers from peers or experts quickly.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Explore & Learn</h3>
            <p>Browse other doubts and expand your knowledge.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} EduQuery. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;

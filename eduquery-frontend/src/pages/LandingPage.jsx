import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <header>
        <h1>EduQuery</h1>
        <p>Peer-to-peer doubt-solving platform for students.</p>
      </header>

      <main>
        <section>
          <h2>Get Started</h2>
          <p>Ask questions, get answers, and explore doubts from other students.</p>
          <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} EduQuery. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

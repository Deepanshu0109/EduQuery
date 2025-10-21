import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Temporary click handlers for future pages
  const goTo = (path) => navigate(path);

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.name || 'User'}!</p>
        <button onClick={logout}>Logout</button>
      </header>

      <main>
        <h2>Main Features</h2>
        <div>
          {/* Feature cards */}
          <div onClick={() => goTo('/ask-doubt')}>Ask Doubt</div>
          <div onClick={() => goTo('/your-doubts')}>Your Doubts</div>
          <div onClick={() => goTo('/explore-doubts')}>Explore Doubts</div>
          <div onClick={() => goTo('/profile')}>Profile</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

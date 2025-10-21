import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { FaUser, FaQuestionCircle, FaClipboardList, FaSearch } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);

  const goTo = (path) => navigate(path);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("eduqueryToken");
        const allQuestionsRes = await axios.get("/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allQuestions = allQuestionsRes.data;

        let activity = [];
        allQuestions.forEach(q => {
          const isUserQuestion = q.author._id === user.id;
          if (isUserQuestion) {
            activity.push({
              message: `Posted a "${q.title}" question for ${q.subject?.name || "Unknown Subject"}`,
              date: new Date(q.createdAt)
            });
          }
          q.answers.forEach(a => {
            if (a.author._id === user.id) {
              activity.push({
                message: `Answered "${q.title}" for ${q.subject?.name || "Unknown Subject"}`,
                date: new Date(a.createdAt)
              });
            }
            if (isUserQuestion && a.author._id !== user.id) {
              activity.push({
                message: `${a.author.name || "Someone"} answered your question "${q.title}" for ${q.subject?.name || "Unknown Subject"}`,
                date: new Date(a.createdAt)
              });
            }
          });
        });
        activity.sort((a, b) => b.date - a.date);
        setRecentActivity(activity.slice(0, 10));
      } catch (err) {
        console.error("Error fetching recent activity:", err);
      }
    };

    fetchActivity();
  }, [user.id]);

  const features = [
    { name: "Profile", icon: <FaUser />, path: "/profile" },
    { name: "Ask a Doubt", icon: <FaQuestionCircle />, path: "/ask-doubt" },
    { name: "Your Doubts", icon: <FaClipboardList />, path: "/your-doubts" },
    { name: "Explore Doubts", icon: <FaSearch />, path: "/explore-doubts" },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || "User"}!</h1>
        <p>Glad to see you back. What do you want to do today?</p>
      </header>

      <main className="dashboard-main">
        <section className="features-section">
          <h2>Main Features</h2>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.name} className="feature-card" onClick={() => goTo(f.path)}>
                <div className="feature-icon">{f.icon}</div>
                <p>{f.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="activity-section">
          <h3>Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p>No recent activity.</p>
          ) : (
            <ul className="activity-list">
              {recentActivity.map((act, idx) => (
                <li key={idx}>{act.message}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="tips-section">
          <h3>Quick Tips</h3>
          <ul className="tips-list">
            <li>Check new questions in Explore Doubts.</li>
            <li>Keep your profile updated.</li>
            <li>Answer questions to gain reputation.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

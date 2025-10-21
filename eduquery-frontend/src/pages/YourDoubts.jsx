import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './YourDoubts.css';

const YourDoubts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const res = await axios.get('/questions/mine', {
          headers: { Authorization: `Bearer ${localStorage.getItem('eduqueryToken')}` }
        });
        setQuestions(res.data);
      } catch (err) {
        console.error('Error fetching user questions:', err);
        setError('Failed to load your doubts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuestions();
  }, []);

  const openQuestion = (id) => {
    navigate(`/questions/${id}`);
  };

  if (loading) return <p>Loading your doubts...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="your-doubts-page">
      <h2>Your Doubts</h2>
      {questions.length === 0 ? (
        <p>You haven't asked any doubts yet.</p>
      ) : (
        <div className="doubts-list">
          {questions.map(q => (
            <div
              key={q._id}
              className="doubt-card"
              onClick={() => openQuestion(q._id)}
            >
              <h3>{q.title}</h3>
              <p className="doubt-subject">{q.subject?.name || 'No Subject'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourDoubts;

// src/pages/YourDoubts.jsx
import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Your Doubts</h2>
      {questions.length === 0 && <p>You haven't asked any doubts yet.</p>}
      <ul>
        {questions.map(q => (
          <li key={q._id} onClick={() => openQuestion(q._id)} style={{ cursor: 'pointer', margin: '10px 0' }}>
            <strong>{q.title}</strong> - <em>{q.subject?.name || 'No Subject'}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourDoubts;

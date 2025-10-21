import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './ExploreDoubts.css';

const ExploreDoubts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/subjects");
        setSubjects(res.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects");
      }
    };
    fetchSubjects();
  }, []);

  const fetchQuestions = async (subjectId = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/questions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` },
        params: { subjectId },
      });
      const filtered = res.data.filter(q => q.author._id !== user.id);
      setQuestions(filtered);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load doubts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedSubject);
  }, [selectedSubject]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const openQuestion = (id) => {
    navigate(`/questions/${id}`);
  };

  return (
    <div className="explore-doubts-page">
      <h2 className="page-title">Explore Doubts</h2>

      <div className="filter-section">
        <label htmlFor="subjectFilter">Filter by Subject:</label>
        <select
          id="subjectFilter"
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="status-text">Loading doubts...</p>
      ) : error ? (
        <p className="status-text error">{error}</p>
      ) : questions.length === 0 ? (
        <p className="status-text">No doubts found.</p>
      ) : (
        <div className="questions-grid">
          {questions.map((q) => (
            <div
              key={q._id}
              className="question-card"
              onClick={() => openQuestion(q._id)}
            >
              <h3>{q.title}</h3>
              <p className="question-subject">{q.subject?.name || "No Subject"}</p>
              <p className="question-author">By {q.author.name || "Unknown"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreDoubts;

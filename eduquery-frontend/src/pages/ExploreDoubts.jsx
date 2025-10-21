//src/pages/ExploreDoubts.jsx

import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ExploreDoubts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch subjects for filter
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

  // Fetch questions excluding user's own
  const fetchQuestions = async (subjectId = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/questions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}`,
        },
        params: { subjectId },
      });

      // filter out user's own questions
      const filtered = res.data.filter(q => q.author._id !== user.id);
      setQuestions(filtered);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load doubts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and whenever subject changes
  useEffect(() => {
    fetchQuestions(selectedSubject);
  }, [selectedSubject]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const openQuestion = (id) => {
    navigate(`/questions/${id}`);
  };

  if (loading) return <p>Loading doubts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Explore Doubts</h2>

      <div>
        <label>Filter by Subject:</label>
        <select value={selectedSubject} onChange={handleSubjectChange}>
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {questions.length === 0 ? (
        <p>No doubts found.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li
              key={q._id}
              onClick={() => openQuestion(q._id)}
              style={{ cursor: "pointer", margin: "10px 0" }}
            >
              <strong>{q.title}</strong> - <em>{q.subject?.name || "No Subject"}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExploreDoubts;

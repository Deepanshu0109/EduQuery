import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import './AskDoubt.css';
import askImg from '../assets/ask.png';

const AskDoubt = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [tags, setTags] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (!id) return;
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/questions/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` },
        });
        setTitle(res.data.title);
        setBody(res.data.body);
        setSubjectId(res.data.subject?._id || "");
        setTags((res.data.tags || []).join(", "));
      } catch (err) {
        console.error("Error fetching question for edit:", err);
        setError("Failed to load question for editing");
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body || !subjectId) {
      setError("Title, body, and subject are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        body,
        subjectId,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (id) {
        await axios.put(`/questions/${id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` },
        });
      } else {
        await axios.post("/questions", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` },
        });
      }

      navigate("/your-doubts");
    } catch (err) {
      console.error("Error submitting question:", err);
      setError(err.response?.data?.message || "Failed to submit question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-doubt-page">
      <div className="ask-doubt-container">
        {/* Form */}
        <div className="ask-doubt-card">
          <h2 className="ask-doubt-title">{id ? "Edit Doubt" : "Ask a Doubt"}</h2>
          {error && <p className="ask-doubt-error">{error}</p>}
          <form onSubmit={handleSubmit} className="ask-doubt-form">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter your question title"
              />
            </div>
            <div className="form-group">
              <label>Body:</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                placeholder="Describe your question in detail..."
              />
            </div>
            <div className="form-group">
              <label>Subject:</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tags (comma separated):</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., React, JavaScript"
              />
            </div>
            <button type="submit" className="ask-doubt-btn">
              {loading ? "Submitting..." : id ? "Update Doubt" : "Post Doubt"}
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="ask-doubt-image">
          <img src={askImg} alt="Ask Doubt Illustration" />
        </div>
      </div>
    </div>
  );
};

export default AskDoubt;

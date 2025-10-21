import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const AskDoubt = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // for edit mode
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

  // Prefill form if editing
  useEffect(() => {
    if (!id) return;
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}`,
          },
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
      if (id) {
        // Edit existing question
        await axios.put(
          `/questions/${id}`,
          {
            title,
            body,
            subjectId,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}`,
            },
          }
        );
      } else {
        // Create new question
        await axios.post(
          "/questions",
          {
            title,
            body,
            subjectId,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}`,
            },
          }
        );
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
    <div>
      <h2>{id ? "Edit Doubt" : "Ask a Doubt"}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit">{loading ? "Submitting..." : id ? "Update Doubt" : "Post Doubt"}</button>
      </form>
    </div>
  );
};

export default AskDoubt;

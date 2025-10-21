import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answerBody, setAnswerBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For managing which answer is in edit mode
  const [editingAnswers, setEditingAnswers] = useState({});

  // 🔹 Fetch question and answers
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`/questions/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` },
        });
        setQuestion(res.data);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Failed to load question.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  // 🔹 Post new answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerBody) return;

    try {
      const res = await axios.post(
        `/questions/${id}/answers`,
        { body: answerBody },
        { headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` } }
      );
      setQuestion(res.data);
      setAnswerBody("");
    } catch (err) {
      console.error("Error posting answer:", err);
      setError("Failed to post answer.");
    }
  };

  // 🔹 Edit and Delete question
  const handleEditQuestion = () => navigate(`/ask-doubts/${id}`);

  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`/questions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` },
      });
      alert("Question deleted");
      navigate("/your-doubts");
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Failed to delete question");
    }
  };

  // 🔹 Answer editing controls
  const startEditingAnswer = (answer) => {
    setEditingAnswers((prev) => ({
      ...prev,
      [answer._id]: { editing: true, body: answer.body },
    }));
  };

  const cancelEditingAnswer = (answerId) => {
    setEditingAnswers((prev) => ({
      ...prev,
      [answerId]: { editing: false, body: "" },
    }));
  };

  const saveEditedAnswer = async (answerId) => {
    try {
      const body = editingAnswers[answerId].body;
      const res = await axios.put(
        `/questions/${id}/answers/${answerId}`,
        { body },
        { headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` } }
      );
      setQuestion(res.data);
      cancelEditingAnswer(answerId);
    } catch (err) {
      console.error("Error editing answer:", err);
      alert("Failed to edit answer.");
    }
  };

  // 🔹 Delete answer
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await axios.delete(`/questions/${id}/answers/${answerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}` },
      });
      setQuestion((prev) => ({
        ...prev,
        answers: prev.answers.filter((ans) => ans._id !== answerId),
      }));
    } catch (err) {
      console.error("Error deleting answer:", err);
      alert("Failed to delete answer.");
    }
  };

  // 🔹 Like / Dislike (toggle)
  const handleToggleUpvote = async (answerId) => {
    try {
      const res = await axios.put(
        `/questions/${id}/answers/${answerId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("eduqueryToken")}`,
          },
        }
      );
      setQuestion(res.data);
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };

  if (loading) return <p>Loading question...</p>;
  if (error) return <p>{error}</p>;
  if (!question) return <p>Question not found.</p>;

  // 🔹 Sort answers by like count (descending)
  const sortedAnswers = [...question.answers].sort(
    (a, b) => b.upvotes.length - a.upvotes.length
  );

  return (
    <div>
      <h2>{question.title}</h2>
      <p>
        {question.body}
        {question.updatedAt && question.updatedAt !== question.createdAt && <span> (edited)</span>}
      </p>
      <p>Subject: {question.subject?.name || "No Subject"}</p>
      <p>Asked by: {question.author?.name || "Unknown"}</p>

      {user?.id === question.author?._id && (
        <div>
          <button onClick={handleEditQuestion}>Edit</button>
          <button onClick={handleDeleteQuestion}>Delete</button>
        </div>
      )}

      <hr />
      <h3>Answers</h3>

      {sortedAnswers.length === 0 && <p>No answers yet.</p>}
      <ul>
        {sortedAnswers.map((a) => {
          const isAuthor = user?.id === a.author?._id;
          const hasUpvoted = a.upvotes.includes(user?.id);
          const editingState = editingAnswers[a._id] || { editing: false, body: a.body };

          return (
            <li key={a._id}>
              {editingState.editing ? (
                <div>
                  <textarea
                    value={editingState.body}
                    onChange={(e) =>
                      setEditingAnswers((prev) => ({
                        ...prev,
                        [a._id]: { ...prev[a._id], body: e.target.value },
                      }))
                    }
                  />
                  <button onClick={() => saveEditedAnswer(a._id)}>Save</button>
                  <button onClick={() => cancelEditingAnswer(a._id)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>
                    {a.body}
                    {a.updatedAt && a.updatedAt !== a.createdAt && <span> (edited)</span>}
                  </p>
                  <small>by {a.author?.name || "Unknown"}</small>
                  <div>
                    <button onClick={() => handleToggleUpvote(a._id)}>
                      {hasUpvoted ? "Dislike" : "Like"} ({a.upvotes.length})
                    </button>
                  </div>
                  {isAuthor && (
                    <div>
                      <button onClick={() => startEditingAnswer(a)}>Edit</button>
                      <button onClick={() => handleDeleteAnswer(a._id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <hr />
      <form onSubmit={handleAnswerSubmit}>
        <textarea
          placeholder="Your answer..."
          value={answerBody}
          onChange={(e) => setAnswerBody(e.target.value)}
          required
        />
        <button type="submit">Post Answer</button>
      </form>
    </div>
  );
};

export default QuestionDetails;

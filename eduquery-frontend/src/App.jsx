import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AskDoubt from "./pages/AskDoubt";
import YourDoubts from './pages/YourDoubts';
import QuestionDetails from './pages/QuestionDetails';
import ExploreDoubts from "./pages/ExploreDoubts";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ask-doubt"
          element={
            <ProtectedRoute>
              <AskDoubt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ask-doubts/:id"
          element={
            <ProtectedRoute>
              <AskDoubt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/your-doubts"
          element={
            <ProtectedRoute>
              <YourDoubts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <QuestionDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore-doubts"
          element={
            <ProtectedRoute>
              <ExploreDoubts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

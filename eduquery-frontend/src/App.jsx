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
import AuthLayout from "./components/AuthLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with sidebar */}
        <Route 
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ask-doubt" element={<AskDoubt />} />
          <Route path="/ask-doubts/:id" element={<AskDoubt />} />
          <Route path="/your-doubts" element={<YourDoubts />} />
          <Route path="/questions/:id" element={<QuestionDetails />} />
          <Route path="/explore-doubts" element={<ExploreDoubts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

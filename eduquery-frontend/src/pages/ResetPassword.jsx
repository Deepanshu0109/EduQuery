import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import './Auth.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">New Password</h2>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Update'}
          </button>
        </form>
        
        <p className="auth-footer">
          <Link to="/login" style={{ marginLeft: 0 }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Reset</h2>
        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Link'}
          </button>
        </form>

        <p className="auth-footer">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
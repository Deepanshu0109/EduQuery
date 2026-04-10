import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState(1); 
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(''); 
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0 && step === 2) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, step]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; 
    
    setError('');
    setSuccessMsg('');
    setIsLoading(true); 
    
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      setSuccessMsg(res.data.message); 
      setStep(2); 
      setCountdown(60); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false); 
    }
  };

  const handleResendOtp = async () => {
    if (isLoading || countdown > 0) return;
    
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    
    try {
      await axios.post('/auth/register', { name, email, password });
      setSuccessMsg(`A new OTP has been sent to ${email}`);
      setCountdown(60); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('/auth/verify-otp', { email, otp });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToStepOne = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccessMsg('');
    setCountdown(0); 
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        
        {error && <p className="auth-error">{error}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}
        
        {step === 1 ? (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isLoading} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isLoading} />
            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        ) : (
          <div className="otp-verification-container">
            <p className="email-display">
              We sent a verification code to:
              <strong>{email}</strong>
            </p>

            <form onSubmit={handleOtpSubmit} className="auth-form">
              <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required disabled={isLoading} />
              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>

            <div className="resend-btn-wrapper">
              <button 
                type="button" 
                onClick={handleResendOtp}
                disabled={countdown > 0 || isLoading}
                className={`text-btn ${countdown > 0 ? 'disabled' : 'active'}`}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>
            
            <button type="button" onClick={goBackToStepOne} className="secondary-btn" disabled={isLoading}>
              Change Email / Go Back
            </button>
          </div>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    class: '',
    semester: '',
    rollNumber: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('eduqueryToken');
        const res = await axios.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('eduqueryToken');
      const { class: cls, semester, rollNumber } = profile;

      const res = await axios.put(
        `/users/${userId}`,
        { class: cls, semester, rollNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(res.data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Profile</h1>
        {message && <p className="profile-message">{message}</p>}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={profile.name} disabled />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={profile.email} disabled />
          </div>
          <div className="form-group">
            <label>Class:</label>
            <input type="text" name="class" value={profile.class} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Semester:</label>
            <input type="number" name="semester" value={profile.semester} onChange={handleChange} min="1" max="8" />
          </div>
          <div className="form-group">
            <label>Roll Number:</label>
            <input type="text" name="rollNumber" value={profile.rollNumber} onChange={handleChange} />
          </div>
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

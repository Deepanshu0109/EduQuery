import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // use normalized field from AuthContext

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    class: '',
    semester: '',
    rollNumber: ''
  });
  const [message, setMessage] = useState('');

  // Fetch user profile from backend
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

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('eduqueryToken');
      const { class: cls, semester, rollNumber } = profile;

      const res = await axios.put(
        `/users/${userId}`,
        { class: cls, semester, rollNumber }, // Only update editable fields
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
    <div>
      <h1>Profile</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={profile.name} disabled />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={profile.email} disabled />
        </div>
        <div>
          <label>Class:</label>
          <input type="text" name="class" value={profile.class} onChange={handleChange} />
        </div>
        <div>
          <label>Semester:</label>
          <input type="number" name="semester" value={profile.semester} onChange={handleChange} min="1" max="8" />
        </div>
        <div>
          <label>Roll Number:</label>
          <input type="text" name="rollNumber" value={profile.rollNumber} onChange={handleChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
    
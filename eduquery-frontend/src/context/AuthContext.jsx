import { createContext, useState } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('eduqueryToken');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        // Normalize JWT fields to always have id, name, email
        return {
          id: decoded.id,      // adjust according to your backend JWT field
          name: decoded.name,
          email: decoded.email
        };
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('eduqueryToken');
      }
    }
    return null;
  });

  const login = (token) => {
    localStorage.setItem('eduqueryToken', token);
    const decoded = jwt_decode(token);
    setUser({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    });
  };

  const logout = () => {
    localStorage.removeItem('eduqueryToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

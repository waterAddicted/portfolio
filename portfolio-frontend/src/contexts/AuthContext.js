import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authMessage, setAuthMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      retrieveUserDetails();
    }
  }, []);

  const retrieveUserDetails = () => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const profilePictureUrl = localStorage.getItem('profilePictureUrl');

    if (userId && userName) {
      setUser({ userId, userName, profilePictureUrl }); 
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePictureUrl');

    axios.defaults.headers.common['Authorization'] = '';

    setUser(null);
    setAuthMessage('Logged out successfully.');
  };

  const register = async ({ username, fullName, birthDate, password, profilePicture }) => {
    setLoading(true);
    try {
      const formattedBirthDate = birthDate.split('/').reverse().join('-');
      await axios.post('http://localhost:8000/auth/register', {
        userName: username,
        fullName,
        birthDate: formattedBirthDate,
        password,
        profilePicture,
      });
      setAuthMessage('Account created successfully!');
    } catch (error) {
      setAuthMessage('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        username,
        password,
      });
      const { accessToken, userId, userName, profilePictureUrl } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userName', userName);
      localStorage.setItem('profilePictureUrl', profilePictureUrl);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser({ userId, userName, profilePictureUrl });

      setAuthMessage('Logged in successfully!');
      return true;
    } catch (error) {
      setAuthMessage('Invalid credentials. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ register, login, logout, authMessage, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

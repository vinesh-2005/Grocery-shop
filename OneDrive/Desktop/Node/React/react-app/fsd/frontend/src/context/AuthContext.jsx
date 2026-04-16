import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is still logged in or token is valid if needed
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/api/users', userData);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
    } catch (error) {
      console.error('Logout API failed, forcing local session clear anyway', error);
    } finally {
      setUserInfo(null);
      localStorage.removeItem('userInfo');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await axios.put('/api/users/profile', userData);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

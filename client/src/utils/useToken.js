import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext.jsx';
import { apiService } from '@/services/apiService.js';

export default function useToken() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const getToken = () => {
    try {
      const tokenString = localStorage.getItem('token');
      if (tokenString === null) {
        return null;
      }
      return JSON.parse(tokenString);
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    if (userToken === null) {
      localStorage.removeItem('token');
      setToken(userToken);
      setIsLoggedIn(false);
      return;
    }
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token, setIsLoggedIn]);

  return {
    token,
    setToken: saveToken,
  };
}

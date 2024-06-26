import { createContext, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { apiService } from '@/services/apiService.js';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const isAdmin = user.role === 'admin';
  const navigate = useNavigate();
  const toast = useToast();

  const checkUserStatus = async () => {
    if (window.location.pathname.startsWith('/auth')) return;
    try {
      const response = await apiService.getUserStatus();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser({});
        document.cookie =
            'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        navigate('/auth/login');
      }
    } catch (error) {
      setUser({});
      console.error(
          'Erreur lors de la récupération des informations : ',
          error,
      );
    }

    // const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='));
    // if(token){
    //   try{
    //     const user = jwtDecode(token.split('=')[1]);
    //     console.log(user);
    //     setUser(user);
    //   }catch (error) {
    //     setUser(null);
    //     navigate('/auth/login')
    //     console.error('Erreur lors de la récupération des informations');
    //   }
    // }else{
    //   setUser(null);
    // }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  useEffect(() => {
    checkUserStatus();
  }, [navigate]);

  const login = async credentials => {
    try {
      const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          },
      );

      const result = await response.json();

      if (response.ok) {
        document.cookie = `auth_token=${result.data.token} ; path=/`;
        setUser(result.data.token);
        navigate('/profile');
        localStorage.removeItem('currentParty');
      } else {
        console.error(
            'Erreur lors de la tentative de connexion :',
            result.message,
        );
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la tentative de connexion :', error);
    }
  };

  const logout = () => {
    setUser({});
    navigate('/auth/login');
    document.cookie =
        'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('currentParty');
  };

  const getToken = () => {
    const tokenFromCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='));
    if (tokenFromCookie) {
      return tokenFromCookie.split('=')[1];
    }
    return null;
  };

  const token = getToken();

  const contextValue = {
    isAdmin,
    user,
    login,
    logout,
    checkUserStatus,
    token,
  };

  return (
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

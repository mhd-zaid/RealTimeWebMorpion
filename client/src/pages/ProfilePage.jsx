import { useContext } from 'react';
import { AuthContext } from '@/Context/AuthContext.jsx';
import useToken from '../utils/useToken.js';

const ProfilePage = () => {
  const { setToken } = useToken();
  const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return <div>ProfilePage</div>;
};

export default ProfilePage;

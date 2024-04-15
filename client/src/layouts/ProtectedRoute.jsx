import { useNavigate, Outlet } from 'react-router-dom';
import useToken from '@/utils/useToken.js';

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { token } = useToken();

  // CHECK AUTH
  if (token === null || token === undefined || token === '') {
    setTimeout(() => {
      navigate('/login');
    }, 1000);
    return <h1>Redirecting...</h1>;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

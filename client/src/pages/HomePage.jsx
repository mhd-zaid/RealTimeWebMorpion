import { useContext } from 'react';
import RoomChat from '../components/room-chat';
import { AuthContext } from '../context/AuthContext';
import { Container } from '@chakra-ui/react';

const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return <Container>{!isLoggedIn && <RoomChat isGeneral />}</Container>;
};

export default HomePage;

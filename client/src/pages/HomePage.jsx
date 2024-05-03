import { useContext } from 'react';
import RoomChat from '../components/room-chat';
import { AuthContext } from '../context/AuthContext';
import { Container } from '@chakra-ui/react';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container maxW={['100%', '100%', '70%']} h="full" p={4}>
      {user && <RoomChat isGeneral />}
    </Container>
  );
};

export default HomePage;

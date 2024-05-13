import { useContext } from 'react';
import RoomChat from '../components/room-chat';
import { AuthContext } from '../context/AuthContext';
import { Container, Flex } from '@chakra-ui/react';
import GameBoardPage from './GameBoardPage';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <Flex>
      <GameBoardPage />
      <Container>{user && <RoomChat isGeneral />}</Container>
    </Flex>
  );
};

export default HomePage;

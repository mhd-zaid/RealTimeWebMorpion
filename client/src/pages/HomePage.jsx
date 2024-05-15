import { useContext } from 'react';
import RoomChat from '../components/room-chat';
import { AuthContext } from '../context/AuthContext';
import { Container, Flex } from '@chakra-ui/react';
import GameBoardPage from './GameBoardPage';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <Flex h={'full'} bg={'gray.900'} py={10}>
      <GameBoardPage />
      <Container px={0}>{user && <RoomChat isGeneral />}</Container>
    </Flex>
  );
};

export default HomePage;

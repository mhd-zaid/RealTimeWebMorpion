import { Icon } from '@iconify/react';
import {
  Button,
  Text,
  Flex,
  Heading,
  useColorMode,
  VStack,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Input,
  ModalCloseButton,
  ModalBody,
  HStack,
  useDisclosure,
  Img,
  Center,
  useToast,
  position,
  Container, Box,
} from '@chakra-ui/react';
import * as code from 'zod';
import { useContext, useEffect, useState } from 'react';
import { z } from 'zod';
import MorpionOnline from '@/components/morpion/MorpionOnline.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '@/context/AuthContext.jsx';
import RoomChat from '../../components/room-chat';

const PartyOnline = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  const [party, setParty] = useState(() => {
    const savedParty = localStorage.getItem('currentParty');
    const locationParty = location.state && location.state.party;
    return savedParty ? JSON.parse(savedParty) : locationParty || null;
  });
  const [partyOnlineSocket, setPartyOnlineSocket] = useState();
  const [displayChat, setDisplayChat] = useState(false);

  useEffect(() => {
    if (!party) {
      navigate('/');
      return;
    }

    setPartyOnlineSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/parties`, {
        auth: { token: token },
      }),
    );
  }, []);

  useEffect(() => {
    if (!partyOnlineSocket) return;
    partyOnlineSocket.on('connect', () => {
      partyOnlineSocket.emit('join', party.id);

      partyOnlineSocket.on('server:parties:start', party => {
        if (user.id === party.data.user1Id) {
          toast({
            title: 'La partie a commencé',
            description: `${party.data.user2.userName} a rejoint la parti`,
            position: 'top-right',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
        setDisplayChat(true);
        setParty(party.data);
        localStorage.setItem('currentParty', JSON.stringify(party.data));
      });
    });
  }, [partyOnlineSocket]);

  if (party === null) {
    navigate('/');
    return;
  }

  console.log("party", party.id);

  return (
    <Flex h={'full'} bg={'gray.900'} py={10}>
      <Flex
        direction={'column'}
        alignItems={"center"}
        w={"50%"}
      >
        <MorpionOnline party={party} />
        {party.code && (
          <Text fontSize="xl" fontWeight="bold" m={4} color={"white"}>
            Code : {party.code}
          </Text>
        )}
      </Flex>
      {party.user1 && party.user2 && (
        <Box w={"30%"} px={10}>
          <RoomChat partyId={party.id} />
        </Box>
      )}
    </Flex>
  );
};

export default PartyOnline;

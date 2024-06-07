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
  Container,
} from '@chakra-ui/react';
import * as code from 'zod';
import { useContext, useEffect, useState } from 'react';
import { z } from 'zod';
import { AuthContext } from '@/context/AuthContext.jsx';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import RoomChat from '@/components/room-chat.jsx';

const GameBoardPage = () => {
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [code, setCode] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const { user, token } = useContext(AuthContext);
  const [partySocket, setPartySocket] = useState();

  const singleDigitCodeSchema = z
    .string()
    .length(1, 'Le code doit contenir 1 chiffre')
    .regex(/^\d$/, 'Le code doit contenir exactement 1 chiffre');

  const sixDigitCodeSchema = z
    .string()
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir exactement 6 chiffres');

  const requestCode = () => {
    onOpen();
  };

  const handleInputChange = (index, value) => {
    const validation = singleDigitCodeSchema.safeParse(value);
    if (!validation.success) value = '';
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value.length === 1 && index < code.length - 1) {
      const nextInputRef = document.getElementById(`code-input-${index + 1}`);
      if (nextInputRef) {
        nextInputRef.focus();
      }
    }
  };

  const handleJoin = async () => {
    const fullCode = code.join('');
    const validation = sixDigitCodeSchema.safeParse(fullCode);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }
    setError('');
    setIsJoining(true);
    await joinGame(fullCode);
  };

  const joinGame = async fullCode => {
    if (!partySocket) return;
    partySocket.emit('client:parties:join:party', { code: fullCode }, party => {
      if (party.status === 'success') {
        navigate(`/room/${party.data.id}`, { state: { party: party.data } });
      }
    });
  };
  const createPrivateGame = () => {
    partySocket.emit('client:parties:create', { is_private: true }, party => {
      if (party.status === 'success') {
        navigate(`/room/${party.data.id}`, { state: { party: party.data } });
      }
    });
  };

  useEffect(() => {
    if (!user) return;
    setPartySocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/parties`, {
        auth: { token: token },
        secure: true,
      }),
    );
  }, []);

  useEffect(() => {
    if (!partySocket) return;
    partySocket.on('connect', () => {
      partySocket.emit('server:parties:create', { is_private: true });

      partySocket.on('client:parties:create:party', party => {
        if (party.status === 'success') {
          navigate(`room/${party.data.id}`, { state: { party: party.data } });
        }
        onClose();
      });
    });
  }, [partySocket]);

  return (
    <>
      <Center>
        <Flex
          direction={'column'}
          gap={8}
          w={'50%'}
          justifyContent={'center'}
          padding={8}
          boxShadow="xl"
          rounded="lg"
        >
          <Button
            w={'sm'}
            leftIcon={<Icon icon="mdi:users" fontSize={30} />}
            colorScheme="teal"
            variant="solid"
            size="lg"
            onClick={() => navigate('room')}
          >
            2 joueurs
          </Button>

          <Button
            w={'sm'}
            leftIcon={
              <Icon icon="fluent-mdl2:join-online-meeting" fontSize={30} />
            }
            colorScheme="blue"
            variant="solid"
            size="lg"
            onClick={() => navigate('general')}
          >
            Jouer en ligne
          </Button>

          <Button
            w={'sm'}
            leftIcon={<Icon icon="mdi:account-multiple-plus" fontSize={30} />}
            colorScheme="orange"
            variant="solid"
            size="lg"
            onClick={() => createPrivateGame()}
          >
            Créer une partie privée
          </Button>

          <Button
            w={'sm'}
            leftIcon={<Icon icon="fa-solid:door-open" />}
            colorScheme="green"
            variant="solid"
            size="lg"
            onClick={() => requestCode()}
          >
            Rejoindre une partie privée
          </Button>
        </Flex>
      </Center>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsJoining(false);
          setCode(Array(6));
        }}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isJoining ? 'Recherche en cours...' : 'Rejoindre une partie'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!isJoining ? (
              <>
                <Text>
                  Entrez le code à 6 chiffres pour rejoindre la partie :
                </Text>
                <HStack spacing={2}>
                  {code.map((val, index) => (
                    <Input
                      key={index}
                      id={`code-input-${index}`}
                      value={val}
                      maxLength={1}
                      onChange={e => handleInputChange(index, e.target.value)}
                      textAlign="center"
                      width="4rem"
                      color={'black'}
                    />
                  ))}
                </HStack>
                {error && <Text color="red">{error}</Text>}
              </>
            ) : (
              <>
                <Center>
                  <Img src="/img/tic-tac-toe.gif" w={24} />
                </Center>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {!isJoining && (
              <Button colorScheme="blue" onClick={handleJoin}>
                Rejoindre
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GameBoardPage;

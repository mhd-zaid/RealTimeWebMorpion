import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '@/context/AuthContext.jsx';
import moment from 'moment/moment.js';
import 'moment/locale/fr';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/Pagination.jsx';

const ProfilePage = () => {
  const { colorMode } = useColorMode();
  const { token, user, isAdmin } = useContext(AuthContext);
  const [partySocket, setPartySocket] = useState();
  const [notifSocket, setNotifSocket] = useState();
  const [gameHistory, setGameHistory] = useState([]);
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [nbParties, setNbParties] = useState(0);
  const [notifMessage, setNotifMessage] = useState('');

  const navigate = useNavigate();
  moment.locale('fr');

  // Connexion au namespace parties
  useEffect(() => {
    if (!token) return;
    setPartySocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/parties`, {
        auth: { token: token },
      }),
    );
  }, [token]);

  useEffect(() => {
    if (!token) return;

    if (isAdmin) {
      setNotifSocket(
        io(`${import.meta.env.VITE_SOCKET_URL}/notifications`, {
          auth: { token: token },
        }),
      );
    }
  }, [token, isAdmin]);

  // Récupération de l'historique des parties
  useEffect(() => {
    if (!partySocket) return;
    partySocket.on('connect', () => {
      console.log('parties connected');
      partySocket.on('server:parties:list:user', parties => {
        const games = parties.data.map(game => ({
          ...game,
          createdAt: moment(game.createdAt).format('lll'),
        }));
        setNbParties(parties.data.length);
        setGames(games);
        setGameHistory(
          games.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          ),
        );
      });
    });
    return () => {
      partySocket.disconnect();
    };
  }, [partySocket]);

  useEffect(() => {
    if (!notifSocket) return;
    notifSocket.on('connect', () => {
      console.log('notif connected');
    });

    return () => {
      notifSocket.disconnect();
    };
  }, [notifSocket]);

  useEffect(() => {
    setGameHistory(
      games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    );
  }, [currentPage]);

  const handleNotifSend = () => {
    if (notifMessage === '') return;
    if (
      confirm(
        "Confirmer l'envoi de la notification à tout le monde ? (message : " +
          notifMessage +
          ')',
      )
    ) {
      notifSocket.emit('send:notification', notifMessage);
      setNotifMessage('');
    }
  };

  return (
    <>
      <Flex h={"full"} align="center" justify="center" bg={'gray.900'}>
        <VStack>
          <Text
            fontSize="xl"
            fontWeight="bold"
            m={4}
            color={colorMode === 'light' ? 'white' : 'gray.800'}
          >
            {' '}
            Bienvenue {user.userName} !{' '}
          </Text>

          {gameHistory.length === 0 && (
            <Center>
              <Box w="50%">
                <Flex direction="column">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    m={4}
                    color={colorMode === 'light' ? 'white' : 'gray.800'}
                  >
                    {' '}
                    Historique des matchs{' '}
                  </Text>
                  <Text
                    fontSize="md"
                    m={4}
                    color={colorMode === 'light' ? 'white' : 'gray.800'}
                  >
                    {' '}
                    On dirait que vous n'avez joué à aucun jeu avec nous.
                    Pourquoi ne pas commencer maintenant ? Défiez un ami ou
                    trouvez un adversaire et amusez-vous ! Votre première
                    victoire vous attend !{' '}
                  </Text>
                  <Text
                    fontSize="md"
                    m={4}
                    color={colorMode === 'light' ? 'white' : 'gray.800'}
                  >
                    {' '}
                    À vos marques, prêts, jouez ! 🎮{' '}
                  </Text>
                </Flex>
              </Box>
            </Center>
          )}

          <Flex direction="column" align="center" w={'full'}>
            {isAdmin && (
              <Box bgColor="red.200" w={'full'} p={2} rounded={'lg'}>
                <Heading size="md">Administration</Heading>

                <FormControl mt={4}>
                  <FormLabel>
                    Envoyer une notification à tout le monde
                  </FormLabel>
                  <Flex>
                    <Input
                      mr={4}
                      bgColor="white"
                      placeholder="Votre message"
                      value={notifMessage}
                      onChange={e => setNotifMessage(e.target.value)}
                    />
                    <Button onClick={handleNotifSend}>Envoyer</Button>
                  </Flex>
                </FormControl>
              </Box>
            )}
            <Button
              colorScheme="teal"
              variant="solid"
              w={'full'}
              m={4}
              onClick={() => navigate('/')}
            >
              Go to game board
            </Button>
          </Flex>

          {gameHistory.length > 0 && (
            <Center>
              <TableContainer borderRadius={10}>
                <Table
                  variant="simple"
                  size="lg"
                  bg={colorMode === 'light' ? 'white' : 'gray.800'}
                >
                  <Thead>
                    <Tr>
                      <Th>Joueurs</Th>
                      <Th>Résultat</Th>
                      <Th>Symbole</Th>
                      <Th>Partie jouée le</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {gameHistory.map((game, index) => (
                      <Tr key={index}>
                        <Td>
                          <Flex direction="column">
                            <Text>{game.user1.userName}</Text>
                            <Text>{game.user2.userName}</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Flex direction="column" align="center">
                            {game.winnerId === null ? "Match Nul" : game.winnerId === user.id ? 'Gagné' : 'Perdu'}
                          </Flex>
                        </Td>
                        <Td>
                          <Flex direction="column" align="center">
                            <Text>{game.symbolUser1}</Text>
                            <Text>{game.symbolUser2}</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text>{game.createdAt}</Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Pagination
                  totalPages={Math.ceil(nbParties / itemsPerPage)}
                  currentPage={currentPage}
                  onPageChange={newPage => {
                    if (
                      newPage >= 1 &&
                      newPage <= Math.ceil(nbParties / itemsPerPage)
                    ) {
                      setCurrentPage(newPage);
                    }
                  }}
                />
              </TableContainer>
            </Center>
          )}
          {/*{gameHistory.length > 0 && (*/}
          {/*<Center>*/}
          {/*  <TableContainer borderRadius={10}>*/}
          {/*    <Table variant="simple" size="lg">*/}
          {/*      <Thead>*/}
          {/*        <Tr>*/}
          {/*          <Th>Joueurs</Th>*/}
          {/*          <Th>Résultat</Th>*/}
          {/*          <Th>Symbole</Th>*/}
          {/*          <Th>Partie jouée le</Th>*/}
          {/*        </Tr>*/}
          {/*      </Thead>*/}
          {/*      <Tbody>*/}
          {/*        {gameHistory.map((game, index) => (*/}
          {/*          <Tr key={index}>*/}
          {/*            <Td>*/}
          {/*              <Flex direction="column">*/}
          {/*                <Text color={colorMode === 'light' ? 'white' : 'gray.800'}>{game.user1.userName}</Text>*/}
          {/*                <Text color={colorMode === 'light' ? 'white' : 'gray.800'}>{game.user2.userName}</Text>*/}
          {/*              </Flex>*/}
          {/*            </Td>*/}
          {/*            <Td>*/}
          {/*              <Flex direction="column" align="center">*/}
          {/*                <Text color={colorMode === 'light' ? 'white' : 'gray.800'}>{game.winnerId == user.id ? 'Gagné' : 'Perdu'}</Text>*/}
          {/*              </Flex>*/}
          {/*            </Td>*/}
          {/*            <Td>*/}
          {/*              <Flex direction="column" align="center">*/}
          {/*                <Text color={colorMode === 'light' ? 'white' : 'gray.800'}>{game.symbolUser1}</Text>*/}
          {/*                <Text color={colorMode === 'light' ? 'white' : 'gray.800'}>{game.symbolUser2}</Text>*/}
          {/*              </Flex>*/}
          {/*            </Td>*/}
          {/*            <Td>*/}
          {/*              <Text color={colorMode === 'light' ? 'white' : 'gray.800'}>{game.createdAt}</Text>*/}
          {/*            </Td>*/}
          {/*          </Tr>*/}
          {/*        ))}*/}
          {/*      </Tbody>*/}
          {/*    </Table>*/}
          {/*  </TableContainer>*/}
          {/*</Center>*/}
          {/*)}*/}
        </VStack>
      </Flex>
    </>
  );
};

export default ProfilePage;

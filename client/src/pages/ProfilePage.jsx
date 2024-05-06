import {
  Box,
  Button,
  Center,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text, Tfoot,
  Th,
  Thead,
  Tr, useColorMode,
  VStack
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import {AuthContext} from "@/context/AuthContext.jsx";
import moment from "moment/moment.js";
import 'moment/locale/fr';
import {useNavigate} from "react-router-dom";
import Pagination from "@/components/Pagination.jsx";

const ProfilePage = () => {
  const { colorMode } = useColorMode();
  const { token, user } = useContext(AuthContext);
  const [partySocket, setPartySocket] = useState();
  const [gameHistory, setGameHistory] = useState([]);
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [nbParties, setNbParties] = useState(0);
  const navigate  = useNavigate();
  moment.locale('fr');

  // Connexion au namespace parties
  useEffect(() => {
    if (!user) return;
    setPartySocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/parties`, {
        auth: { token: token },
      }),
    )
  }, []);

  // Récupération de l'historique des parties
  useEffect(() => {
    if (!partySocket) return;
    partySocket.on('connect', () => {
      partySocket.on('server:parties:list:user', parties => {
        const games = parties.data.map(game => ({
          ...game,
          createdAt: moment(game.createdAt).format('lll'),
        }));
        setNbParties(parties.data.length);
        setGames(games);
        setGameHistory(games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      });
    });
  }, [partySocket]);

  useEffect(() => {
    setGameHistory(games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
  }, [currentPage]);

  return (
    <>
      <Flex
        align="center"
        justify="center"
        h={"full"}
        bg={'gray.900'}
      >
        <VStack>
          <Text fontSize="xl" fontWeight="bold" m={4} color={colorMode === 'light' ? 'white' : 'gray.800'}> Bienvenue {user.userName} ! </Text>

          {gameHistory.length === 0 && (
            <Center>
              <Box w="50%">
                <Flex direction="column" >
                  <Text fontSize="xl" fontWeight="bold" m={4} color={colorMode === 'light' ? 'white' : 'gray.800'}> Historique des matchs </Text>
                  <Text fontSize="md" m={4} color={colorMode === 'light' ? 'white' : 'gray.800'}> On dirait que vous n'avez joué à aucun jeu avec nous. Pourquoi ne pas commencer maintenant ? Défiez un ami ou trouvez un adversaire et amusez-vous ! Votre première victoire vous attend ! </Text>
                  <Text fontSize="md" m={4} color={colorMode === 'light' ? 'white' : 'gray.800'}> À vos marques, prêts, jouez ! 🎮 </Text>
                </Flex>
              </Box>
            </Center>
          ) }

            <Flex direction="column" align="center" w={"full"}>
              <Button colorScheme="teal" variant="solid"  w={"2xl"} m={4} onClick={() => navigate("/gameboard")}>
                Go to game board
              </Button>
            </Flex>

          {gameHistory.length > 0 && (
            <Center>
              <TableContainer borderRadius={10}>
                <Table variant="simple" size="lg" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
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
                            {game.winnerId == user.id ? 'Gagné' : 'Perdu'}
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
                  <Tfoot>
                    <Pagination
                      totalPages={Math.ceil(nbParties / itemsPerPage)}
                      currentPage={currentPage}
                      onPageChange={(newPage) => {
                        if (newPage >= 1 && newPage <= Math.ceil(nbParties / itemsPerPage)) {
                          setCurrentPage(newPage);
                        }
                      }}
                    />
                  </Tfoot>
                </Table>
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
  )
};

export default ProfilePage;

import {
  Button,
  Text,
  Flex,
  useColorMode,
  VStack,
  Center,
  Box,
  TableContainer,
  Table, Thead, Tr, Th, Tbody, Td
} from "@chakra-ui/react";
import * as code from "zod";
import {useContext, useEffect, useState} from "react";
import {z} from "zod";
import {AuthContext} from "@/context/AuthContext.jsx";
import io from "socket.io-client";
import {useLocation, useNavigate} from "react-router-dom";
import moment from "moment";

const PartiesPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { token, user } = useContext(AuthContext);
  const [partySocket, setPartySocket] = useState();
  const [gameInProgress, setGameInProgress] = useState([]);
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

  useEffect(() => {
    if (!partySocket) return;
    //Récupération des parties en cours
    partySocket.emit("client:parties:list:inProgress");
    //Récupération de nouvelles parties en cours
    partySocket.on('server:parties:list:inProgress', parties => {
      if (parties.status === 'success') {
        setGameInProgress(parties.data);
      }
    })
  }, [partySocket])


  const handleCreateParty = async () => {
    partySocket.emit('client:parties:create', { is_private: false }, (party) => {
      if (party.status === 'success') {
        navigate(`/gameboard/room/${party.data.id}`, { state: { party: party.data } });
      }
    })
  }

  const joinGame = async (game) => {
    partySocket.emit("client:parties:join:party", game, (party) => {
      console.log("party ok", party);
      if (party.status === 'success') {
        navigate(`/gameboard/room/${party.data.id}`, { state: { party: party.data } });
      }
    })
  }

  return (
    <>
      <Flex
        align="center"
        justify="center"
        h={"full"}
        bg={'gray.900'}
      >
        <VStack>
          {gameInProgress.length === 0 && (
            <Center>
              <Box w={"2xl"}>
                <Flex direction="column">
                  <Text fontSize="xl" fontWeight="bold" m={4}  color={colorMode === 'light' ? 'white' : 'gray.800'}>Aucune partie en cours</Text>
                  <Text fontSize="md" m={4}  color={colorMode === 'light' ? 'white' : 'gray.800'}>Il semble qu'il n'y ait pas de parties en cours pour le moment.</Text>
                  <Text fontSize="md" m={4}  color={colorMode === 'light' ? 'white' : 'gray.800'}>Pourquoi ne pas créer une nouvelle partie ? Invitez vos amis ou trouvez de nouveaux adversaires pour commencer à jouer dès maintenant !</Text>
                </Flex>
              </Box>
            </Center>
          ) }

          <Flex direction="column" align="center" w={"full"}>
            <Text fontSize="2xl" fontWeight="bold" color={colorMode === 'light' ? 'white' : 'gray.800'}>
              Parties en cours 🎮
            </Text>
          </Flex>

          <Center>
            <TableContainer borderRadius={10} w={gameInProgress.length > 0 ? "full" : "2xl"}>
              <Table variant="simple" size="lg" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
                <Thead>
                  <Tr>
                    <Th>Joueurs</Th>
                    <Th>Symbole</Th>
                    <Th>Créer il y a</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {gameInProgress.length > 0 ? (
                    <>
                      {gameInProgress.map((game, index) => (
                        <Tr key={index}>
                          <Td>
                              <Text>{game.user1.userName}</Text>
                          </Td>
                          <Td>
                            <Flex justifyContent={"center"}>
                              <Text>{game.symbolUser1}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Text>{game.createdAt}</Text>
                          </Td>
                          <Td>
                            {/*<Button colorScheme="green" variant="solid" size="sm" onClick={() => navigate(`/gameboard/room/${game.id}`, { state: { party: game } })}>*/}
                            {/*  Rejoindre*/}
                            {/*</Button>*/}
                            <Button colorScheme="green" variant="solid" size="sm" onClick={() => joinGame(game)}>
                              Rejoindre
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </>
                  ) : (
                    <>
                      <Tr >
                        <Td colSpan={4}>
                          <Text align={"center"}>Aucune partie en cours</Text>
                        </Td>
                      </Tr>
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Center>
          <Flex direction="column" align="center" w={"full"}>
            <Button colorScheme="teal" variant="solid"  w={"full"} m={4} onClick={() => handleCreateParty()}>
              Lancer une partie
            </Button>
          </Flex>

        </VStack>
      </Flex>
    </>
  )
};

export default PartiesPage;
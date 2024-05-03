import {Box, Button, Center, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import {AuthContext} from "@/context/AuthContext.jsx";

const ProfilePage = () => {
  const { token, user } = useContext(AuthContext);
  const [messageSocket, setMessageSocket] = useState();
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    console.log('Morpion mounted', user, user);
    if (!user) return;
    setMessageSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/parties`, {
        auth: { token: token },
      }),
    )
  }, []);

  useEffect(() => {
    if (!messageSocket) return;
    messageSocket.on('connect', () => {
      console.log('connected');
      messageSocket.on('client:parties:list:all', parties => {
        console.log(parties);
        setGameHistory(parties.data);
      });
    });
  }, [messageSocket]);

  return (
    <>
      <Center>
        <Box w="50%">
          <Flex direction="column" >
            <Text fontSize="xl" fontWeight="bold" m={4}> Historique des matchs </Text>
            <Text fontSize="md" m={4}> On dirait que vous n'avez joué à aucun jeu avec nous. Pourquoi ne pas commencer maintenant ? Défiez un ami ou trouvez un adversaire et amusez-vous ! Votre première victoire vous attend ! </Text>
            <Text fontSize="md" m={4}> À vos marques, prêts, jouez ! 🎮 </Text>

            <Flex direction="column" align="center">
              <Button colorScheme="teal" variant="solid" size="md" m={4}>
                Créer une nouvelle partie
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Center>

      <Center>
        <TableContainer>
          <Table variant="simple" size="lg">
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
          </Table>
        </TableContainer>
      </Center>


    </>
  )
};

export default ProfilePage;

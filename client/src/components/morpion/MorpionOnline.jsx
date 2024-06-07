import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Image,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '@/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import stringToColor from '@/utils/stringToColor.js';

const MorpionOnline = ({ party }) => {
  const { user, token } = useContext(AuthContext);
  const [morpionSocket, setMorpionSocket] = useState();
  const [morpion, setMorpion] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null)),
  );
  const [playerTurn, setPlayerTurn] = useState(party.user1Id);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isOpenModalEndGame, setIsOpenModalEndGame] = useState(false);
  const [isOpenModalQuitGame, setIsOpenModalQuitGame] = useState(false);
  const navigate = useNavigate();

  const Case = ({ value, onClick }) => {
    return (
      <Button
        w="100px"
        h="100px"
        fontSize="3xl"
        onClick={onClick}
        disabled={value !== null}
        color={
          value === party.symbolUser1
            ? stringToColor(party.user1Id)
            : stringToColor(party.user2Id)
        }
      >
        {value}
      </Button>
    );
  };

  const quitGame = () => {
    setIsOpenModalQuitGame(!isOpenModalQuitGame);
  };

  useEffect(() => {
    if (winner || isDraw) {
      setIsOpenModalEndGame(true);
      setTimeout(() => {
        handleConfirmQuit();
      }, 5000);
    }
  }, [winner, isDraw]);

  const handleConfirmQuit = (isCancelling = false) => {
    if (isCancelling && morpionSocket) {
      morpionSocket.emit('client:parties:morpion:cancel:party');
    }
    localStorage.removeItem('currentParty');
    navigate('/');
  };

  useEffect(() => {
    if (!user) return;
    setMorpionSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/morpion`, {
        auth: { token: token },
        secure: true,
      }),
    );
  }, []);

  useEffect(() => {
    if (!morpionSocket) return;
    morpionSocket.on('connect', () => {
      //Rejoins une room
      morpionSocket.emit('join', party.id);
      //Récupération de l'état de la partie
      morpionSocket.on('server:morpion:state', result => {
        const mooves = result.data.mooves;
        const newMorpion = morpion.map((r, rIndex) =>
          r.map((cell, cIndex) => {
            const moove = mooves.find(
              moove =>
                moove.numerousLine === rIndex &&
                moove.numerousColumn === cIndex,
            );
            return moove ? moove.symbol : cell;
          }),
        );
        setMorpion(newMorpion);

        const moovePlayed = result.data.moovePlayed;
        if (!moovePlayed) return;

        if (moovePlayed.status === 'finished') {
          setPlayerTurn(null);
          setWinner(moovePlayed.winnerId);
          localStorage.removeItem('currentParty');
        } else if (moovePlayed.status === 'draw') {
          setPlayerTurn(
            playerTurn === party.user1Id ? party.user2Id : party.user1Id,
          );
          setIsDraw(true);
          localStorage.removeItem('currentParty');
        } else {
          const turn = mooves.length % 2 === 0 ? party.user1Id : party.user2Id;
          setPlayerTurn(turn);
        }
      });
    });
  }, [morpionSocket]);

  const handleClick = (row, col) => {
    if (morpion[row][col] || playerTurn !== user.id) return;
    //Envoi du coup joué
    morpionSocket.emit(
      'client:morpion:mooveplay:create',
      {
        partyId: party.id,
        numerousLine: row,
        numerousColumn: col,
        symbol:
          party.user1Id === user.id ? party.symbolUser1 : party.symbolUser2,
      },
      moove => {
        if (moove.status === 'success') {
          const newMorpion = morpion.map((r, rIndex) =>
            r.map((cell, cIndex) =>
              rIndex === row && cIndex === col
                ? cell
                  ? cell
                  : playerTurn === party.user1Id
                  ? party.symbolUser1
                  : party.symbolUser2
                : cell,
            ),
          );
          setMorpion(newMorpion);
          setPlayerTurn(
            playerTurn === party.user1Id ? party.user2Id : party.user1Id,
          );
          if (moove.data.status === 'finished') {
            setPlayerTurn(null);
            setWinner(moove.data.winnerId);
            localStorage.removeItem('currentParty');
          } else if (moove.data.status === 'draw') {
            setPlayerTurn(
              playerTurn === party.user1Id ? party.user2Id : party.user1Id,
            );
            setIsDraw(true);
            localStorage.removeItem('currentParty');
          }
        }
      },
    );
  };

  return (
    <>
      <Center h="full">
        <Flex direction="column" align="center">
          {party.status === 'searchPlayer' ? (
            <>
              <VStack>
                <Text fontSize="2xl" mb="20px" color={'white'}>
                  En attente d'un joueur...
                </Text>
                <Img src="/img/tic-tac-toe.gif" w={80} />
              </VStack>
            </>
          ) : (
            <>
              <Text
                fontSize="2xl"
                mb="20px"
                color={
                  playerTurn === party.user1Id
                    ? stringToColor(party.user1Id)
                    : stringToColor(party.user2Id)
                }
              >
                {winner === user.id
                  ? 'Vous avez gagné !'
                  : winner !== null
                  ? `Le gagnant est ${
                      winner === party.user1Id
                        ? party.user1?.userName
                        : party.user2?.userName
                    }`
                  : isDraw
                  ? 'Match nul !'
                  : playerTurn === user.id
                  ? "C'est à vous !"
                  : `Au tour de ${
                      user.id === party.user1Id
                        ? party.user2?.userName
                        : party.user1?.userName
                    }`}
              </Text>
              <Grid
                templateColumns="repeat(3, 100px)"
                templateRows="repeat(3, 100px)"
                gap={1}
                border="2px solid black"
              >
                {morpion.map((row, rowIndex) =>
                  row.map((value, columnIndex) => (
                    <Case
                      key={`${rowIndex}-${columnIndex}`}
                      value={value}
                      onClick={() => handleClick(rowIndex, columnIndex)}
                    />
                  )),
                )}
              </Grid>
            </>
          )}
          <Text color={stringToColor(user.id)} mt={4}>
            {user.id === party.user1Id
              ? `Vous jouez avec le symbole "${party.symbolUser1}"`
              : `Vous jouez avec le symbole "${party.symbolUser2}"`}
          </Text>
          <Button
            mt={10}
            colorScheme={'transparent'}
            onClick={() => quitGame()}
          >
            Quitter la partie
          </Button>
        </Flex>
      </Center>

      <Modal
        isOpen={isOpenModalQuitGame}
        onClose={!isOpenModalQuitGame}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voulez-vous quitter la partie?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Si vous quittez, vous perdrez le progrès de la partie en cours.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={'transparent'}
              onClick={() => {
                handleConfirmQuit(true);
              }}
              mr={4}
            >
              Quitter
            </Button>
            <Button colorScheme="blue" onClick={quitGame} ml={3}>
              Rester
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenModalEndGame}
        isCentered={true}
        onClose={handleConfirmQuit}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Partie terminée</ModalHeader>
          <ModalBody>
            <Text>
              {winner === user.id
                ? 'Félicitations ! Vous avez remporté la partie !'
                : winner !== null
                ? `Le gagnant est ${
                    winner === party.user1Id
                      ? party.user1?.userName
                      : party.user2?.userName
                  }`
                : `Match nul !`}
            </Text>
            <Text>
              Vous allez être redirigé vers le Gameboard dans 10 secondes
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={'red'} onClick={handleConfirmQuit} mr={4}>
              Quitter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MorpionOnline;

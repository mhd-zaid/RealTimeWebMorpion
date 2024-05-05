import {
  Button,
  Center,
  Flex,
  Grid,
  Img,
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import {AuthContext} from "@/context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const MorpionOnline = ({party}) => {
  const { user, token } = useContext(AuthContext);
  const [morpionSocket, setMorpionSocket] = useState();
  const [morpion, setMorpion] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [playerTurn, setPlayerTurn] = useState(party.user1Id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const Case = ({ value, row, column, onClick }) => {
    return (
      <Button
        w="100px"
        h="100px"
        fontSize="3xl"
        onClick={onClick}
        disabled={value !== null}
      >
        {value}
      </Button>
    );
  };


  const quitGame = () => {
    onOpen();
  }

  const handleConfirmQuit = () => {
    console.log("Quitter la partie");
  };

  useEffect(() => {
    if (!user) return;
    setMorpionSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/morpion`, {
        auth: { token: token },
      })
    )
  }, []);

  useEffect(() => {
    if (!morpionSocket) return;
    morpionSocket.on('connect', () => {

      morpionSocket.emit("join", party.id);

      morpionSocket.on('server:morpion:state',  result => {
        console.log("result", result);
        const mooves = result.data.mooves;
        const newMorpion = morpion.map((r, rIndex) =>
          r.map((cell, cIndex) => {
            const moove =  mooves.find(moove => moove.numerousLine === rIndex && moove.numerousColumn === cIndex)
            return moove ? moove.symbol : cell
          })
        );
        setMorpion(newMorpion);
        const moovePlated = result.data.moovePlayed
        if (moovePlated.status === "finished") {
          setPlayerTurn(null);
          setWinner(moovePlated.winnerId);
          localStorage.removeItem('currentParty');
        }else{
          const turn = mooves.length % 2 === 0 ? party.user1Id : party.user2Id;
          setPlayerTurn(turn);
        }
      });
    })

  }, [morpionSocket]);

  const handleClick = (row, col) => {
    if (morpion[row][col] || playerTurn !== user.id) return;

    morpionSocket.emit("client:morpion:mooveplay:create", {
      partyId: party.id,
      numerousLine: row,
      numerousColumn: col,
      symbol: party.user1Id === user.id ? party.symbolUser1 : party.symbolUser2
    }, moove => {
      console.log("moove", moove);
      if (moove.status === 'success') {
        const newMorpion = morpion.map((r, rIndex) =>
          r.map((cell, cIndex) =>
            rIndex === row && cIndex === col ? (cell ? cell : playerTurn === party.user1Id ? party.symbolUser1 : party.symbolUser2) : cell
          )
        );
        setMorpion(newMorpion);
        setPlayerTurn(playerTurn === party.user1Id ? party.user2Id : party.user1Id);
        console.log("moove", moove);
        if (moove.data.status === "finished") {
          setPlayerTurn(null);
          setWinner(moove.data.winnerId);
          localStorage.removeItem('currentParty');
        }
      }
    });
  };


  return (
    <>
      <Center h="full">
        <Flex direction="column" align="center">
          {party.status === 'searchPlayer' ? (
            <>
              <VStack>
                <Text fontSize="2xl" mb="20px">En attente d'un joueur...</Text>
                <Img src="/img/tic-tac-toe.gif" w={80}/>
              </VStack>
            </>
          ) : (
            <>
              <Text fontSize="2xl" mb="20px">{
                  winner === user.id ?
                    "Vous avez gagné !" :
                    winner !== null ?
                  `Le gagnant est ${winner === party.user1Id ? party.user1?.userName : party.user2?.userName}` :
                  playerTurn === user.id ?
                    "C'est à vous !" :
                    `Au tour de ${user.id === party.user1Id ? party.user2?.userName : party.user1?.userName}`
              }</Text>
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
                      row={rowIndex}
                      column={columnIndex}
                      onClick={() => handleClick(rowIndex, columnIndex)}
                    />
                  ))
                )}
              </Grid>

              <Button mt={10}  colorScheme={"transparent"} onClick={() => quitGame()}>
                Quitter la partie
              </Button>
            </>
          )}
        </Flex>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voulez-vous quitter la partie?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Si vous quittez, vous perdrez le progrès de la partie en cours.</Text>
          </ModalBody>
          <ModalFooter>
            <Text as={"u"} onClick={handleConfirmQuit} mr={4}>
              Quitter
            </Text>
            <Button colorScheme="blue" onClick={onClose} ml={3}>
              Rester
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
};

export default MorpionOnline;
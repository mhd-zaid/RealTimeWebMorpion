import {Button, Center, Flex, Grid, Text} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import {AuthContext} from "@/context/AuthContext.jsx";

const Morpion = () => {
  const [messageSocket, setMessageSocket] = useState();
  const { user, token } = useContext(AuthContext);

  const Case = ({ value, onClick }) => {
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

  const [morpion, setMorpion] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const checkWinner = (morpion) => {
    const winCombination = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of winCombination) {
      if (morpion[a] && morpion[a] === morpion[b] && morpion[a] === morpion[c]) {
        return morpion[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    const newMorpion = [...morpion];
    if (checkWinner(morpion) || morpion[index]) {
      return;
    }
    newMorpion[index] = isXNext ? 'X' : 'O';
    setMorpion(newMorpion);
    setIsXNext(!isXNext);
  };

  const winner = checkWinner(morpion);
  const isMorpionFull = morpion.every((value) => value !== null);
  const isEnd = isMorpionFull && !winner;

  const status = winner ? `Le gagnant est ${winner}!` : isEnd ? "Match nul !" : `Joueur suivant: ${isXNext ? 'X' : 'O'}`;

  return (
    <>
      <Center h="100vh">
        <Flex direction="column" align="center">
          <Text fontSize="2xl" mb="20px">{status}</Text>
          <Grid
            templateColumns="repeat(3, 100px)"
            templateRows="repeat(3, 100px)"
            gap={1}
            border="2px solid black"
          >
            {morpion.map((value, index) => (
              <Case key={index} value={value} onClick={() => handleClick(index)} />
            ))}
          </Grid>
          <Button
            mt="20px"
            onClick={() => {
              setMorpion(Array(9).fill(null));
              setIsXNext(true);
            }}
          >
            Recommencer
          </Button>
        </Flex>
      </Center>
    </>
  )
};

export default Morpion;
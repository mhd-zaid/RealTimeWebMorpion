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
  ModalContent, ModalHeader, Input, ModalCloseButton, ModalBody, HStack, useDisclosure, Img, Center, useToast, position
} from "@chakra-ui/react";
import * as code from "zod";
import {useContext, useEffect, useState} from "react";
import {z} from "zod";
import MorpionOnline from "@/pages/MorpionOnline.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import io from "socket.io-client";
import {AuthContext} from "@/context/AuthContext.jsx";

const PartyOnline = ({game}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const {user, token} = useContext(AuthContext);
  const location = useLocation();
  const [party, setParty] = useState(() => {
    const savedParty = localStorage.getItem('currentParty');
    return savedParty ? JSON.parse(savedParty) : location.state.party;
  });
  const [partyOnlineSocket, setPartyOnlineSocket] = useState();

  useEffect(() => {
    if (!party) {
      navigate('/gameboard');
      return;
    }

    setPartyOnlineSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/parties`, {
        auth: { token: token },
      }),
    )
  }, []);

  useEffect(() => {
    if (!partyOnlineSocket) return;
    partyOnlineSocket.on('connect', () => {
      console.log('connected to party', party.id);

      partyOnlineSocket.emit('join', party.id);

      partyOnlineSocket.on('server:parties:start', party => {
        if(user.id === party.data.user1Id) {
          toast({
            title: "La partie a commencé",
            description: `${party.data.user2.userName} a rejoint la parti`,
            position: "top-right",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        }
        setParty(party.data);
        localStorage.setItem('currentParty', JSON.stringify(party.data));
      });
    });
  }, [partyOnlineSocket]);

  return (
    <Flex
      align="center"
      justify="center"
      h={"full"}
      bg={'gray.900'}
      color={"white"}
    >
      <VStack>
        <MorpionOnline party={party} />
        {party.code && (<Text fontSize="xl" fontWeight="bold" m={4}> Code  : {party.code} </Text>)}
      </VStack>
    </Flex>
  );
};

export default PartyOnline;
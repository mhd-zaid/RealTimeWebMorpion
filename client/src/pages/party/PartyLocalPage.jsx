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
  ModalContent, ModalHeader, Input, ModalCloseButton, ModalBody, HStack, useDisclosure, Img, Center
} from "@chakra-ui/react";
import * as code from "zod";
import {useState} from "react";
import {z} from "zod";
import MorpionLocale from "@/components/morpion/MorpionLocale.jsx";

const Party = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const singleDigitCodeSchema = z
    .string()
    .length(1, 'Le code doit contenir 1 chiffre')
    .regex(/^\d$/, 'Le code doit contenir exactement 1 chiffre');

  const fourDigitCodeSchema = z
    .string()
    .length(4, 'Le code doit contenir 4 chiffres')
    .regex(/^\d{4}$/, 'Le code doit contenir exactement 4 chiffres');


  const joinGame = () => {
    onOpen();
  }

  const handleInputChange = (index, value) => {
    const validation = singleDigitCodeSchema.safeParse(value);
    if (!validation.success) value = '';
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleJoin = () => {
    const fullCode = code.join('');
    const validation = fourDigitCodeSchema.safeParse(fullCode);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }
    setError('');
    setIsJoining(true);
  };

  return (
    <Flex
      align="center"
      justify="center"
      h={"full"}
      bg={'gray.900'}
    >
      <MorpionLocale />
    </Flex>
  );
};

export default Party;
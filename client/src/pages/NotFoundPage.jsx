import { Box, Flex, Heading, Text } from '@chakra-ui/react';

const NotFoundPage = () => {
  return (
    <Flex w="full" h="full" justifyContent="center" alignItems="center">
      <Box>
        <Heading>Page non trouvée</Heading>
        <Text textAlign="center">
          Désolé, la page que vous recherchez n&apos;existe pas.
        </Text>
      </Box>
    </Flex>
  );
};

export default NotFoundPage;

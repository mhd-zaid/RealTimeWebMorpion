import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import { useEffect, useMemo, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import io from 'socket.io-client';
import stringToColor from '../utils/stringToColor';

const RoomChat = ({ isGeneral }) => {
  const messageSocket = useMemo(
    () => io(`${import.meta.env.VITE_SOCKET_URL}/messages`),
    [],
  );

  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    messageSocket.on('connect', () => {
      console.log('connected');
    });
    return () => {
      messageSocket.disconnect();
    };
  }, [messageSocket]);
  // if (isGeneral) {
  // messageSocket.emit('server:messages:list:all');
  // console.log('isGeneral');
  // messageSocket.on('client:messages:list:all', messages => {
  //   console.log(messages);
  // });
  // }

  const handleUserMessage = async userMessage => {
    // à remplacer par les données de l'utilisateur connecté
    const newUserMessage = {
      message: userMessage,
      sender: 'dani',
      senderId: 'cf8bckdsqjl',
      direction: 'outgoing',
      sentTime: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, newUserMessage]);
    // await processUserMessage(userMessage);
  };

  const sendUserMessage = userMessage => {
    console.log("envoi d'un message");
    messageSocket.emit('message', userMessage);
  };

  return (
    <Box w="full" h="full" position="relative">
      <Text
        pos="absolute"
        top={2}
        left={0}
        right={0}
        zIndex={10}
        fontWeight={'bold'}
        textTransform="uppercase"
        textAlign="center"
      >
        Chat général
      </Text>
      <MainContainer style={{ borderRadius: '.6em' }}>
        <ChatContainer style={{ paddingTop: '2rem' }}>
          <MessageList>
            <MessageSeparator>
              <Text fontWeight={'bold'}>dani</Text>&nbsp; s&apos;est connecté
            </MessageSeparator>
            {chatMessages.map((message, i) => {
              return (
                <Message key={i} model={message}>
                  <Message.Header>{message.sender}</Message.Header>
                  <Box
                    as={Message.CustomContent}
                    p={2}
                    rounded={'lg'}
                    bgColor={stringToColor(message.senderId)}
                  >
                    {message.message}
                  </Box>
                  <Message.Footer>
                    {new Date(message.sentTime).toLocaleDateString()}&nbsp;
                    {new Date(message.sentTime)
                      .toLocaleTimeString()
                      .slice(0, 5)}
                  </Message.Footer>
                </Message>
              );
            })}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Envoyer un message..."
            style={{ textAlign: 'initial' }}
            onSend={(innerHtml, text) => {
              handleUserMessage(text);
            }}
          />
        </ChatContainer>
      </MainContainer>
    </Box>
  );
};

export default RoomChat;

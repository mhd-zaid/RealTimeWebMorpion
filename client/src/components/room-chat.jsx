import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import io from 'socket.io-client';
import stringToColor from '../utils/stringToColor';

const RoomChat = ({ isGeneral }) => {
  const [messageSocket, setMessageSocket] = useState();
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    setMessageSocket(io(`${import.meta.env.VITE_SOCKET_URL}/messages`));
  }, []);

  useEffect(() => {
    if (!messageSocket) return;
    messageSocket.on('connect', () => {
      console.log('connected');
      if (isGeneral) {
        messageSocket.on('messages:list', messages => {
          console.log('messages', messages);
        });
      }
    });

    return () => {
      messageSocket.disconnect();
    };
  }, [messageSocket, isGeneral]);

  const handleUserMessage = async userMessage => {
    // à remplacer par les données de l'utilisateur connecté
    const newUserMessage = {
      message: userMessage,
      sender: 'dani', // remplacer par les données user
      senderId: '018f1126-ee5a-7e5e-831f-f80b95b9c667', // remplacer par les données user
      direction: 'outgoing',
      sentTime: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, newUserMessage]);
    sendUserMessage(newUserMessage);
  };

  const sendUserMessage = userMessage => {
    console.log("envoi d'un message");
    const { message, senderId } = userMessage;
    messageSocket.emit('messages:create', {
      content: message,
      userId: senderId,
    });
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

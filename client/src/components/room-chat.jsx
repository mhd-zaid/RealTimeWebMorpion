import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';
import { useContext, useEffect, useState } from 'react';
import { Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import io from 'socket.io-client';
import stringToColor from '../utils/stringToColor';
import { AuthContext } from '@/context/AuthContext.jsx';

const RoomChat = ({ isGeneral, partyId }) => {
  const toast = useToast();
  const { token, user } = useContext(AuthContext);
  const [messageSocket, setMessageSocket] = useState();
  const [chatMessages, setChatMessages] = useState([]);

  const fastMessages = ['Joli coup !', 'Bien joué !', 'Merci', 'Oops...', 'gg'];

  useEffect(() => {
    setMessageSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/messages`, {
        auth: { token },
        query: { partyId: isGeneral ? 'general' : partyId },
      }),
    );
  }, [token]);

  useEffect(() => {
    if (!messageSocket) return;
    messageSocket.on('connect', () => {
      console.log('connected');

      if (isGeneral) {
        messageSocket.emit('join', 'general');
      } else {
        messageSocket.emit('join', partyId);
      }
      messageSocket.on('messages:list', messages => {
        if (!messages.data) return;
        setChatMessages(
          messages.data.map(message => ({
            message: message.content,
            sender: message.user && message.user.userName,
            senderId: message.userId,
            direction: 'incoming',
            sentTime: message.createdAt,
          })),
        );
      });
    });

    return () => {
      messageSocket.disconnect();
    };
  }, [messageSocket, isGeneral, partyId, toast]);

  const handleUserMessage = async userMessage => {
    messageSocket.emit('messages:create', {
      content: userMessage,
      room: isGeneral ? 'general' : partyId,
    });
  };

  return (
    <Flex flexDir="column" w="full" h="full" position="relative">
      {isGeneral && (
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
      )}

      <MainContainer style={{ borderRadius: '.6em' }}>
        <ChatContainer style={{ paddingTop: '2rem' }}>
          <MessageList>
            {chatMessages
              .map(msg =>
                msg.senderId === user.id
                  ? { ...msg, direction: 'outgoing' }
                  : msg,
              )
              .map((message, i) => {
                return message.sender === null ? (
                  <MessageSeparator key={i}>{message.message}</MessageSeparator>
                ) : (
                  <Message key={i} model={message}>
                    <Message.Header>{message.sender}</Message.Header>
                    <Box
                      as={Message.CustomContent}
                      p={2}
                      rounded={'lg'}
                      bgColor={stringToColor(message.sender)}
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

      {!isGeneral && (
        <Flex flexDir="column">
          <Text as={'small'} mt={2} color={'gray'}>
            Messages rapides
          </Text>
          <Flex mt={2} wrap={'wrap'}>
            {fastMessages.map((msg, i) => (
              <Button
                key={i}
                size={'sm'}
                mr={2}
                mb={2}
                onClick={() => handleUserMessage(msg)}
              >
                {msg}
              </Button>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default RoomChat;

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
import { Box, Text, useToast } from '@chakra-ui/react';
import io from 'socket.io-client';
import stringToColor from '../utils/stringToColor';
import { AuthContext } from '@/context/AuthContext.jsx';

const RoomChat = ({ isGeneral, partyId }) => {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const [messageSocket, setMessageSocket] = useState();
  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    setMessageSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}/messages`, {
        auth: { token },
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
            sender: message.user.userName,
            senderId: message.userId,
            direction: 'incoming', // check if message.userId === currentUserId
            sentTime: message.createdAt,
          })),
        );
      });

      messageSocket.on('user:join', message => {
        console.log(message);
        toast({
          title: message,
          status: 'info',
          position: 'bottom-right',
          duration: 3000,
        });
      });
      messageSocket.on('user:quit', message => {
        console.log(message);
        toast({
          title: message,
          status: 'warning',
          position: 'bottom-right',
          duration: 3000,
        });
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
            {/* <MessageSeparator>
              <Text fontWeight={'bold'}>dani</Text>&nbsp; s&apos;est connecté
            </MessageSeparator> */}
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

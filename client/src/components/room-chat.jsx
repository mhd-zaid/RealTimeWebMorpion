import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import io from 'socket.io-client';

const socket_url = import.meta.env.VITE_SOCKET_URL;
// const socket = io(socket_url);

const RoomChat = ({ isGeneral }) => {
  const [chatMessages, setChatMessages] = useState([]);
  if (isGeneral) {
    // socket.emit('getAllMessages', 'JWT_TOKEN');
    // socket.on('allMessages', messages => {
    //   setChatMessages(messages);
    // });
  }
  const handleUserMessage = async userMessage => {
    const newUserMessage = {
      message: userMessage,
      sender: 'user',
      direction: 'outgoing',
    };

    setChatMessages([...chatMessages, newUserMessage]);
    // await processUserMessage(userMessage);
  };

  return (
    <Box w="full" h="max-content" p={8}>
      <MainContainer h="full">
        <ChatContainer>
          <MessageList>
            {chatMessages.map((message, i) => {
              console.log(message);
              return <Message key={i} model={message} />;
            })}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Envoyer un message..."
            style={{ textAlign: 'initial' }}
            onSend={handleUserMessage}
          />
        </ChatContainer>
      </MainContainer>
    </Box>
  );
};

export default RoomChat;

import { AuthContext } from './context/AuthContext';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import { Flex, useToast } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const [globalSocket, setGlobalSocket] = useState();

  useEffect(() => {
    if (!token) return;
    setGlobalSocket(
      io(`${import.meta.env.VITE_SOCKET_URL}`, {
        auth: { token: token },
      }),
    );
    Notification.requestPermission();
  }, [token]);

  useEffect(() => {
    if (!globalSocket) return;
    globalSocket.on('connect', () => {
      console.log('global connected');

      globalSocket.on('notification', message => {
        notifyUser(message);
      });
    });

    return () => {
      globalSocket.disconnect();
    };
  }, [globalSocket]);

  const notifyUser = message => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // web api notification
      const notification = new Notification('Message général', {
        body: message,
      });
      return;
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const notification = new Notification('Message général', {
            body: message,
          });
          return;
        }
        toast({
          title: message,
          duration: 9000,
          isClosable: true,
        });
      });
      return;
    }
    toast({
      title: message,
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Flex flexDir="column" h={'full'}>
      <Header />
      <Outlet />
    </Flex>
  );
}

export default App;

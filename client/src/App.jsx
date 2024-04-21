import { AuthProvider } from './context/AuthContext';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import { Flex } from '@chakra-ui/react';

function App() {
  return (
    <AuthProvider>
      <Flex flexDir="column" h={'full'}>
        <Header />
        <Outlet />
      </Flex>
    </AuthProvider>
  );
}

export default App;

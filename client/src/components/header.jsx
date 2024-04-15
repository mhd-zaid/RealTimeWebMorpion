import useToken from '../utils/useToken.js';
import { useContext } from 'react';
import { AuthContext } from '@/Context/AuthContext.jsx';
import {
  Avatar,
  Flex,
  Heading,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { setToken } = useToken();
  const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);

  const links = [
    {
      label: 'Chat Global',
      action: () => {
        navigate('/general-chat');
      },
    },
    {
      label: 'Nouvelle Partie',
      special: true,
      action: () => {},
    },
  ];

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <Flex w="full" alignItems="center" minH={20} px={8}>
      <Link h={12} href="/">
        <Image src="/logo.svg" alt="logo" h="full" />
      </Link>
      <Flex w="full" justifyContent="center" alignItems="center">
        {links.map(link => (
          <Heading
            key={link.label}
            fontSize={link.special ? undefined : 'xl'}
            p={3}
            onClick={link.action && link.action}
            _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {link.label}
          </Heading>
        ))}
      </Flex>
      {!isLoggedIn && (
        <Flex justifySelf="end" alignItems="center">
          <Link href="/auth/register" textTransform="uppercase" mr={4}>
            Inscription
          </Link>
          <Link href="/auth/login" textTransform="uppercase">
            Connexion
          </Link>
        </Flex>
      )}
      {isLoggedIn && (
        <Menu>
          <MenuButton>
            <Avatar />
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} href="/profile">
              Profil
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
              color="red"
            >
              Se déconnecter
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

export default Header;

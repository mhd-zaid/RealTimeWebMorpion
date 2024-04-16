import useToken from '../utils/useToken.js';
import { useContext } from 'react';
import { AuthContext } from '@/Context/AuthContext.jsx';
import {
  Avatar,
  Flex,
  Heading,
  Image,
  keyframes,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

const Header = () => {
  const { setToken } = useToken();
  const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);

  const links = [
    {
      label: 'Chat Global',
      href: '/general-chat',
    },
    {
      label: 'Nouvelle Partie',
      special: true,
      href: '/room/new',
    },
    {
      label: 'Mes Parties',
      href: '/profile/history',
    },
  ];

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <Flex
      w="full"
      justifyContent="space-between"
      alignItems="center"
      minH={20}
      px={8}
    >
      <Link h={12} href="/">
        <Image src="/logo.svg" alt="logo" h="full" />
      </Link>

      {!isLoggedIn && (
        <>
          <Heading
            p={3}
            as={Link}
            href={'/auth/login'}
            rota
            animation={`${keyframes`from { scale: 0.8; } to { scale: 1;  }`} 1s infinite alternate`}
          >
            Connectez-vous pour jouer!
          </Heading>
          <Flex alignItems="center">
            <Link href="/auth/register" textTransform="uppercase" mr={4}>
              Inscription
            </Link>
            <Link href="/auth/login" textTransform="uppercase">
              Connexion
            </Link>
          </Flex>
        </>
      )}

      {isLoggedIn && (
        <>
          <Flex alignItems="baseline">
            {links.map(link => (
              <Heading
                key={link.label}
                fontSize={link.special ? undefined : 'xl'}
                p={3}
                as={Link}
                href={link.href}
              >
                {link.label}
              </Heading>
            ))}
          </Flex>

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
        </>
      )}
    </Flex>
  );
};

export default Header;

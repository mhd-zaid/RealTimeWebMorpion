import { useContext } from 'react';
import { AuthContext } from '@/Context/AuthContext.jsx';
import { Flex, Heading, Image, keyframes, Link } from '@chakra-ui/react';

const Header = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Flex
      w="full"
      justifyContent="space-between"
      alignItems="center"
      minH={20}
      px={8}
    >
      <Flex flex={1} mr="auto">
        <Link h={12} href="/">
          <Image src="/logo.svg" alt="logo" h="full" />
        </Link>
      </Flex>

      {!isLoggedIn && (
        <>
          <Heading
            as={Link}
            href={'/auth/login'}
            pos="relative"
            mixBlendMode="multiply"
            display="flex"
            textAlign="center"
            flex={1}
            p={3}
            px={12}
            overflow={'hidden'}
            bgColor="#FFF"
            animation={`${keyframes`from { scale: 0.8; } to { scale: 1; }`} 1s infinite alternate`}
            _before={{
              content: '""',
              position: 'absolute',
              left: '-100%',
              top: 0,
              right: 0,
              bottom: 0,
              background:
                'white repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16.66666%, #ff00e0 33.33333%, #14ffe9 50.0%)',
              mixBlendMode: 'screen',
              animation: `${keyframes`from { transform: translateX(0); } to { transform: translateX(50%);  }`} 2s linear infinite`,
            }}
          >
            Connectez-vous pour&nbsp;Jouer!
          </Heading>

          <Flex
            alignItems="center"
            display="flex"
            flex={1}
            justifyContent="end"
            ml="auto"
          >
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
          <Flex alignItems="baseline" flex={1}>
            <Heading
              as={Link}
              href={'/room/new'}
              pos="relative"
              mixBlendMode="multiply"
              display="flex"
              textAlign="center"
              p={3}
              px={12}
              overflow={'hidden'}
              bgColor="#FFF"
              animation={`${keyframes`from { scale: 0.8; } to { scale: 1; }`} 1s infinite alternate`}
              _before={{
                content: '""',
                position: 'absolute',
                left: '-100%',
                top: 0,
                right: 0,
                bottom: 0,
                background:
                  'white repeating-linear-gradient(90deg, #14ffe9 0%, #ffc800 16.66666%, #ff00e0 33.33333%, #14ffe9 50.0%)',
                mixBlendMode: 'screen',
                animation: `${keyframes`from { transform: translateX(0); } to { transform: translateX(50%);  }`} 2s linear infinite`,
              }}
            >
              Nouvelle Partie
            </Heading>
          </Flex>

          <Flex
            alignItems="center"
            display="flex"
            flex={1}
            justifyContent="end"
            ml="auto"
          >
            <Heading
              as={Link}
              href="/profile"
              fontSize={'lg'}
              textTransform="uppercase"
            >
              Profil
            </Heading>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default Header;

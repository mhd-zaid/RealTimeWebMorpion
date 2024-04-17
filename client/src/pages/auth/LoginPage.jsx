import { useContext, useState } from 'react';
import { z } from 'zod';
import validateData from '@/utils/formValidator.js';
import {
  useToast,
  Heading,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
} from '@chakra-ui/react';
import { redirect } from 'react-router-dom';
import useToken from '../../utils/useToken';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const toast = useToast();
  const { setToken } = useToken();
  const { setIsLoggedIn } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const loginValidationSchema = z.object({
    identifier: z.string().min(1, { message: "L'identifiant est requis" }),
    password: z.string().min(1, { message: 'Le mot de passe est requis' }),
  });

  const loginUser = async credentials => {
    return fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then(data => data.json());
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const validationErrors = validateData(loginValidationSchema, formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const login = await loginUser(formData);
    if (login.errors) {
      setErrors(
        login.errors || { global: "Une erreur inattendue s'est produite." },
      );
      setToken();
      toast({
        title: 'Erreur',
        description: 'Identifiant ou mot de passe incorrect',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setToken(login.data);
    setIsLoggedIn(true);
    redirect('/');

    toast({
      title: 'Connexion réussie',
      description: 'Vous êtes maintenant connecté',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Flex
      as="main"
      flexDir="column"
      alignItems="center"
      w="full"
      h="full"
      my={8}
    >
      <Heading textTransform="uppercase">Se connecter</Heading>
      <Flex as="form" onSubmit={handleSubmit} flexDir="column" w="30%">
        <FormControl my={4}>
          <FormLabel htmlFor="identifier" mb={0}>
            Email ou Pseudo
          </FormLabel>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="on"
            placeholder="Entrez votre adresse e-mail ou pseudo"
            value={formData.identifier}
            onChange={handleChange}
            size={'lg'}
          />
          {errors.identifier ? (
            <Text color="red">{errors.identifier}</Text>
          ) : null}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="password" mb={0}>
            Mot de passe
          </FormLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChange={handleChange}
            size={'lg'}
          />
          <Link href="/auth/forgetpassword" fontSize="xs" fontWeight={'medium'}>
            Mot de passe oublié ?
          </Link>
          {errors.password ? <Text color="red">{errors.password}</Text> : null}
        </FormControl>

        {errors.global ? (
          <Text color="red" textAlign="center">
            {errors.global}
          </Text>
        ) : null}
        <Button type="submit">Se connecter</Button>
        <Text as={'small'} mt={1}>
          Pas de compte ?{' '}
          <Link href="/auth/register" fontWeight={'medium'}>
            S&apos;inscrire
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default LoginPage;

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
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const { login  } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const loginValidationSchema = z.object({
    identifier: z.string().min(1, { message: "L'identifiant est requis" }),
    password: z.string().min(1, { message: 'Le mot de passe est requis' }),
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async e => {
    e.preventDefault();

    const validationErrors = validateData(loginValidationSchema, formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      setErrors({ global: error.message });
    }
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
      <Flex as="form" onSubmit={handleLogin} flexDir="column" w="30%">
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

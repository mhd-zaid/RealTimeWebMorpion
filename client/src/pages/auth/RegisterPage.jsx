import { useState } from 'react';
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

const RegisterPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
  });
  const [errors, setErrors] = useState({});

  const registerValidationSchema = z.object({
    email: z.string().email({ message: 'Email non valide' }),
    userName: z.string().min(1, { message: "Le nom d'utilisateur est requis" }),
    password: z.string().min(8, {
      message: 'Le mot de passe doit comporter au moins 8 caractères',
    }),
    confirmPassword: z.string().min(8, {
      message:
        'La confirmation du mot de passe doit comporter au moins 8 caractères',
    }),
  });

  const registerUser = async credentials => {
    return fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
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
    if (formData.password !== formData.confirmPassword) {
      setErrors({ global: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    const validationErrors = validateData(registerValidationSchema, formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const registerPromise = registerUser(formData);

    await toast.promise(registerPromise, {
      loading: {title: 'Enregistrement en cours...', description: 'Veuillez patienter.'},
      success:
        {title: 'Enregistrement réussi !', description:'Veuillez vérifier votre boîte de réception pour activer votre compte.'},
      error: {title: "Erreur lors de l'enregistrement", description: 'Veuillez réessayer plus tard.'},
    });

    await registerPromise.then(data => {
      if (data.errors) {
        setErrors(
          data.errors || { global: "Une erreur inattendue s'est produite." },
        );
      } else {
        redirect('/auth/login');
      }
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
      <Heading textTransform="uppercase">Créer un compte</Heading>
      <Flex as="form" onSubmit={handleSubmit} flexDir="column" w="30%">
        <FormControl my={4}>
          <FormLabel htmlFor="userName" mb={0}>
            Pseudo
          </FormLabel>
          <Input
            id="userName"
            name="userName"
            type="text"
            placeholder="Entrez votre pseudo"
            value={formData.userName}
            onChange={handleChange}
            size={'lg'}
          />
          {errors.userName ? <Text color="red">{errors.userName}</Text> : null}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="email" mb={0}>
            Email
          </FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Entrez votre email"
            value={formData.email}
            onChange={handleChange}
            size={'lg'}
          />
          {errors.email ? <Text color="red">{errors.email}</Text> : null}
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
          {errors.password ? <Text color="red">{errors.password}</Text> : null}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="confirmPassword" mb={0}>
            Confirmer le mot de passe
          </FormLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            size={'lg'}
          />
          {errors.confirmPassword ? (
            <Text color="red">{errors.confirmPassword}</Text>
          ) : null}
        </FormControl>
        {errors.global ? (
          <Text color="red" textAlign="center">
            {errors.global}
          </Text>
        ) : null}

        <Button type="submit">S&apos;inscrire</Button>
        <Text as={'small'} mt={1}>
          Déjà un compte ?{' '}
          <Link href="/auth/login" fontWeight={'medium'}>
            Se connecter
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default RegisterPage;

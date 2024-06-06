import { useCallback, useState } from 'react';
import { Button, Box, FormControl, FormLabel, Input, Heading, Text, Alert, AlertIcon, AlertTitle, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import validateData from "@/utils/formValidator.js";

const forgetPasswordValidationSchema = z.object({
  email: z.string().email({ message: 'Email non valide' }),
});

async function requestPasswordReset(formData) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgotpassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return response.json();
}

const ForgetPasswordComponent = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      const validationErrors = validateData(forgetPasswordValidationSchema, formData);
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      const response = await requestPasswordReset(formData);

      if (response.success) {
        toast({
          title: response.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setErrors(response.errors || { global: 'Une erreur inattendue s\'est produite.' });
      }
    } catch (error) {
      setErrors({ global: error.message || 'Une erreur inattendue s\'est produite.' });
    }
  }, [formData]);

  return (
      <Box maxW="lg" m="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading as="h2" size="xl" mb={4}>MOT DE PASSE OUBLIÉ ?</Heading>
        <Text mb={4}>Entrez l'adresse mail utilisée lors de votre inscription ou votre pseudo. Vous allez recevoir par mail un lien pour renouveler votre mot de passe.</Text>
        <Text mb={4}>Si vous rencontrez des difficultés ou si vous ne recevez pas l'e-mail de réinitialisation, n'hésitez pas à contacter notre support client pour obtenir de l'aide.</Text>
        {errors && errors.global && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertTitle>{errors.global}</AlertTitle>
            </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl mb={4} isInvalid={errors.email}>
            <FormLabel htmlFor="email">Adresse e-mail</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Entrez votre adresse e-mail" />
            {errors.email && <Text color="red.500" mt={2}>{errors.email}</Text>}
          </FormControl>
          <Button type="submit" colorScheme="red" width="full" mt={6}>Envoyer la demande de réinitialisation</Button>
        </form>
      </Box>
  );
};

export default ForgetPasswordComponent;

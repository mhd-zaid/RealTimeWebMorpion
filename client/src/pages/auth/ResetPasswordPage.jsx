import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Box, FormControl, FormLabel, Input, Heading, Text, Alert, AlertIcon, Spinner, useToast } from "@chakra-ui/react";
import { apiService } from "@/services/apiService.js";
import NotFoundPage from "@/pages/NotFoundPage.jsx";
import { z } from "zod";
import validateData from "@/utils/formValidator.js";

async function resetPassword(password, token) {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/resetpassword/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  }).then((data) => data.json());
}

async function checkToken(token) {
  return apiService.getUserInfo("users", `?token=${token}`);
}

const resetPasswordValidationSchema = z.object({
  password: z.string().min(8, { message: 'Le mot de passe doit comporter au moins 8 caractères' }),
});

const ResetPasswordComponent = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [hasTokenOwner, setHasTokenOwner] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const verifyToken = async () => {
      const response = await checkToken(token);

      if (response.success === false) {
        navigate('/pagenotfound');
      }
      setHasTokenOwner(response.success);
    };

    verifyToken();
  }, [token, navigate]);

  console.log("Resetpassword page")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setErrors('Les mots de passe ne correspondent pas.');
        setLoading(false);
        return;
      }

      const validationErrors = validateData(resetPasswordValidationSchema, { password });
      if (validationErrors) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      const response = await resetPassword(password, token);

      if (response.success) {
        toast({
          title: response.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/auth/login');
      } else {
        setErrors(response.errors || 'Une erreur inattendue s\'est produite.');
      }
    } catch (error) {
      setErrors('Une erreur inattendue s\'est produite.');
    }

    setLoading(false);
  };

  return (
      <>
        {hasTokenOwner ?
            <Box maxW="lg" mx="auto" p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
              <Heading as="h2" size="xl" mb={4}>RÉINITIALISEZ VOTRE MOT DE PASSE</Heading>
              <Text mb={4}>Veuillez entrer votre nouveau mot de passe dans les champs ci-dessous. Assurez-vous que votre mot de passe est fort et unique.</Text>
              <Text mb={4}>Si vous rencontrez des difficultés ou si vous avez besoin d'aide, n'hésitez pas à contacter notre support client.</Text>
              {errors && errors.global && (
                  <Alert status="error" mb={4}>
                    <AlertIcon />
                    {errors.global}
                  </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <FormControl mb={4} isInvalid={errors.password}>
                  <FormLabel htmlFor="password">Nouveau mot de passe</FormLabel>
                  <Input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entrez votre nouveau mot de passe" required />
                </FormControl>
                <FormControl mb={4} isInvalid={errors.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">Confirmer le mot de passe</FormLabel>
                  <Input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmez votre nouveau mot de passe" required />
                  {errors && <Text color="red.500" mt={2}>{errors}</Text>}
                </FormControl>
                <Button type="submit" colorScheme="red" width="full" mt={6} isLoading={loading} loadingText="Réinitialisation en cours...">Réinitialiser le mot de passe</Button>
              </form>
            </Box> : <NotFoundPage />}
      </>
  );
};

export default ResetPasswordComponent;

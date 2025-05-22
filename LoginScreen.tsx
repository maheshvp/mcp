import React, { useState } from 'react';
import {
  VStack,
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  Text,
  Center,
} from '@gluestack-ui/themed';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Add your login logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login attempt with:', { email });
      
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center
      className="min-h-screen bg-gray-50 p-4"
    >
      <Box
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <VStack space="xl">
          {/* Header */}
          <VStack space="xs" alignItems="center">
            <Heading size="2xl" className="text-gray-800">
              Welcome Back
            </Heading>
            <Text size="sm" className="text-gray-600">
              Sign in to your account
            </Text>
          </VStack>

          {/* Form */}
          <VStack space="md">
            <FormControl isRequired>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Email Address
                </Text>
              </FormControl.Label>
              <Input
                size="lg"
                variant="outline"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
              />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>
                <Text className="text-sm font-medium text-gray-700">
                  Password
                </Text>
              </FormControl.Label>
              <Input
                size="lg"
                variant="outline"
                type="password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2"
              />
              <FormControl.Helper>
                <Text
                  size="xs"
                  className="text-right text-blue-600 cursor-pointer hover:text-blue-700"
                >
                  Forgot password?
                </Text>
              </FormControl.Helper>
            </FormControl>

            {error && (
              <Text className="text-red-500 text-sm text-center">
                {error}
              </Text>
            )}

            <Button
              size="lg"
              variant="solid"
              onPress={handleLogin}
              isDisabled={!email || !password || isLoading}
              isLoading={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 mt-2"
            >
              <Button.Text>Sign In</Button.Text>
            </Button>

            {/* Footer */}
            <VStack space="sm" alignItems="center" className="mt-6">
              <Text size="sm" className="text-gray-600">
                Don't have an account?
              </Text>
              <Button
                variant="link"
                onPress={() => console.log('Navigate to signup')}
              >
                <Button.Text className="text-blue-600 hover:text-blue-700">
                  Create an account
                </Button.Text>
              </Button>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginScreen; 
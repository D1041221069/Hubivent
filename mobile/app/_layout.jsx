// import { Tabs } from 'expo-router';
import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/authContext';
import 'react-native-get-random-values';

export default function Layout() { 
return (
  <AuthProvider> 
    <Stack screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="index" /> 
      <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
    </Stack> 
  </AuthProvider> 
); 
} 
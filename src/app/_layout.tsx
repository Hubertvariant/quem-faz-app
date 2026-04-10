import { Stack } from "expo-router";

import "../styles/global.css";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
    name="index" options={{ 
      headerShown: false,
     }} />
     <Stack.Screen
    name="home" options={{ 
      headerShown: false,
     }} />
     <Stack.Screen
    name="register-talent" options={{ 
      headerShown: false,
     }} />
     <Stack.Screen
    name="details/[id]" options={{ 
      headerShown: false,
     }} />
     <Stack.Screen
    name="profile" options={{ 
      headerShown: false,
     }} />
     <Stack.Screen
    name="editProfile" options={{ 
      headerShown: false,
     }} />
  </Stack>
}

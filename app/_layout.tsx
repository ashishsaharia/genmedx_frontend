import { Stack } from "expo-router";

export default function RootLayout() {
  return (<Stack>
    <Stack.Screen name="index" options={{headerShown:false}}></Stack.Screen>
    <Stack.Screen name = "about" options={{title : "About"}}></Stack.Screen>
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    <Stack.Screen name="signUp" options={{ headerShown: false }} />
  </Stack>)
}

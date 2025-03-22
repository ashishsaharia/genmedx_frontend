import { Stack } from "expo-router";

export default function RootLayout()
{
    return( <Stack>
        <Stack.Screen name="homePage" options={{title: "Home"}}></Stack.Screen>
        <Stack.Screen name = "chat" options={{title : "Chat"}}></Stack.Screen>
    </Stack>)
}
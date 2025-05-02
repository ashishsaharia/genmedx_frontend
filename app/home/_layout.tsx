import { Stack } from "expo-router";

export default function RootLayout()
{
    return( <Stack>
        <Stack.Screen name="homePage" options={{title: "Home"}}></Stack.Screen>
        <Stack.Screen name="chat" options={{title: "Chat"}}></Stack.Screen>
        <Stack.Screen name="options" options={{title: "Options"}}></Stack.Screen>
        <Stack.Screen name="upload" options={{title: "Uploadfile"}}></Stack.Screen>
        <Stack.Screen name="profile" options={{title: "Profile"}}></Stack.Screen>
        <Stack.Screen name="activity" options={{title: "activity"}}></Stack.Screen>
        <Stack.Screen name="medicalInfo" options={{title: "Medical Information"}}></Stack.Screen>
        <Stack.Screen name="useronboarding" options={{title: "User Onboarding"}}></Stack.Screen>

    </Stack>)
}

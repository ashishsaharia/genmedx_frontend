import { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Linking, Text, StyleSheet, ScrollView, TextInput, ImageBackground, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  StatusBar,
  Dimensions,
}from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ImagePickerScreen() {
 
 
  const { user } = useLocalSearchParams()
  const userData = user ? JSON.parse(Array.isArray(user) ? user[0] : user) : null
  const router = useRouter()

  // Get first name only for greeting
  const firstName = userData?.name ? userData.name.split(" ")[0] : "User"

  let url = "";
  if (Platform.OS == 'web') url = 'http://localhost:3000';
  else if (Platform.OS == 'android') url = 'http://10.7.14.19:3000';

  const [images, setImages] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [files, setFiles] = useState<string[]>([]);

   useEffect(() => {
  // const platform = navigator.platform; // or use navigator.userAgentData.platform if needed

  fetch(`${url}/uploads/${userData.email}?platform=${Platform.OS}`)
    .then((res) => res.json())
    .then((data) => setFiles(data))
    .catch((err) => console.error(err));
}, [files]);

  const openFile = async (fileUrl: string) => {
    Linking.openURL(fileUrl);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let imageBase64 = result.assets[0].base64;
      setImages([...images, result.assets[0].uri]);
      await uploadImage(imageBase64);
    }
  };

  const uploadImage = async (imageBase64: string | null | undefined) => {
    try {
      const response = await fetch(`${url}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, userEmail: userData.email }),
      });
      const data = await response.json();
      console.log('Upload success:', data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText('');

    try {
      const response = await fetch(`${url}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputText , userEmail: userData.email }),
      });
      const data = await response.json();
      setMessages([...newMessages, { sender: 'ai', text: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground source={require("../../assets/images/landingPageBackground.jpg")} style={styles.background}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {firstName}</Text>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() =>
              router.push({
                pathname: "/home/profile",
                params: { user },
              })
            }
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{firstName.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appNameText}>GenmedX</Text>
            <Text style={styles.tagline}>Your AI-powered health companion</Text>
          </View>

          {/* Health Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Health Overview</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.iconCircle, { backgroundColor: "rgba(255, 99, 71, 0.15)" }]}>
                  <Feather name="heart" size={20} color="#ff6347" />
                </View>
                <Text style={styles.statValue}>72 bpm</Text>
                <Text style={styles.statLabel}>Heart Rate</Text>
              </View>

              <View style={styles.statItem}>
                <View style={[styles.iconCircle, { backgroundColor: "rgba(65, 105, 225, 0.15)" }]}>
                  <MaterialCommunityIcons name="sleep" size={20} color="#4169e1" />
                </View>
                <Text style={styles.statValue}>7.5h</Text>
                <Text style={styles.statLabel}>Sleep</Text>
              </View>

              <View style={styles.statItem}>
                <View style={[styles.iconCircle, { backgroundColor: "rgba(50, 205, 50, 0.15)" }]}>
                  <Ionicons name="footsteps-outline" size={20} color="#32cd32" />
                </View>
                <Text style={styles.statValue}>6,240</Text>
                <Text style={styles.statLabel}>Steps</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() =>
                router.push({
                  pathname: "/home/upload",
                  params: { user },
                })
              }
            >
              <LinearGradient
                colors={["#ff3d00", "#f53d00", "#e53935"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Feather name="message-circle" size={22} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Chat with AI</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionsButton} onPress={() => router.push("/home/options")}>
              <LinearGradient
                colors={["#1a73e8", "#0d47a1"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Feather name="settings" size={22} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Go to Options</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/home/profile")}>
              <LinearGradient
                colors={["#1a73e8", "#0d47a1"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Feather name="user" size={22} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Action Button */}
        {/* <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            router.push({
              pathname: "/home/upload",
              params: { user },
            })
          }
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity> */}
      </ImageBackground>
    </SafeAreaView>
  );}
  

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    greeting: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
    },
    profileIcon: {
      padding: 5,
    },
    avatarCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#1a73e8",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    mainContent: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: "center",
    },
    titleContainer: {
      marginBottom: 30,
      alignItems: "center",
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#5b21b6",
      textAlign: "center",
    },
    appNameText: {
      fontSize: 36,
      fontWeight: "bold",
      color: "#f53d00",
      textAlign: "center",
      marginVertical: 5,
    },
    tagline: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginTop: 5,
    },
    statsCard: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 16,
      padding: 20,
      marginBottom: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    statsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    seeAllText: {
      fontSize: 14,
      color: "#1a73e8",
      fontWeight: "500",
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    statItem: {
      alignItems: "center",
      width: "30%",
    },
    iconCircle: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: "#666",
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      gap: 15,
    },
    chatButton: {
      width: "100%",
      height: 55,
      borderRadius: 12,
      overflow: "hidden",
    },
    optionsButton: {
      width: "100%",
      height: 55,
      borderRadius: 12,
      overflow: "hidden",
    },
    profileButton: {
      width: "100%",
      height: 55,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 20,
    },
    gradientButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    buttonIcon: {
      marginRight: 10,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      
    },
    fab: {
      position: "absolute",
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      right: 20,
      bottom: 20,
      backgroundColor: "#f53d00",
      borderRadius: 30,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
  })
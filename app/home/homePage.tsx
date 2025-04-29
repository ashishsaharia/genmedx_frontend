import { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Linking, Text, StyleSheet, ScrollView, TextInput, ImageBackground, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function ImagePickerScreen() {
  const { user } = useLocalSearchParams();
  const userData = user ? JSON.parse(Array.isArray(user) ? user[0] : user) : null;
  const router = useRouter();

  let url = "";
  if (Platform.OS == 'web') url = 'http://localhost:3000';
  else if (Platform.OS == 'android') url = 'http://192.168.43.112:3000';

  const [images, setImages] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${url}/uploads/${userData.email}`)
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
    <ImageBackground source={require('../../assets/images/landingPageBackground.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.appName}>GenmedX</Text>
        </Text>
        <Text>Welcome, {userData?.name}</Text>
  
        {/* Buttons in Center */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={() => router.push({
      pathname: "/home/upload",
      params: { user },
    })}>
            <Text style={styles.uploadButtonText}>Chat with AI</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.optionsButton} onPress={() => router.push("/home/options")}>
            <Text style={styles.uploadButtonText}>Go to Options</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionsButton} onPress={() => router.push("/home/profile")}>
            <Text style={styles.uploadButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );}
  

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'blue',
      marginBottom: 10,
    },
    appName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#f53d00',
    },
    buttonContainer: {
      marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
    },
    uploadButton: {
      backgroundColor: '#f53d00',
      paddingVertical: 14,
      paddingHorizontal: 30,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
    optionsButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 14,
      paddingHorizontal: 30,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  
    wrapper: {
      flexDirection: 'row',
      width: '100%',
      height: '70%',
      marginVertical: 20,
    },
    files: {
      width: '20%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#f53d00',
      backgroundColor: '#f9f9f9',
      borderRightWidth: 4,
      borderRightColor: '#f53d00',
      borderRadius: 10,
      height: '90%',
    },
    chat: {
      width: '80%',
      paddingLeft: 10,
      paddingRight: 10,
      height: '100%',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#f53d00',
      marginBottom: 10,
    },
    fileListContainer: {
      paddingBottom: 20,
    },
    fileItem: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    fileText: {
      fontSize: 16,
      color: '#333',
    },
    chatContainer: {
      flex: 1,
      width: '100%',
      maxHeight: 400,
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderColor: 'blue',
      borderWidth: 1,
      borderRadius: 10,
      height: '100%',
    },
    message: {
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      maxWidth: '70%',
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#007AFF',
    },
    aiMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#fa6b3c',
    },
    messageText: {
      color: 'white',
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginTop: 10,
    },
    inputBox: {
      flex: 1,
      height: 50,
      borderColor: '#ccc',
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 10,
      backgroundColor: 'white',
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: 'blue',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    button: {
      marginLeft: 10,
      backgroundColor: 'blue',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    fab: {
      position: 'absolute',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 20,
      backgroundColor: '#4CAF50',
      borderRadius: 30,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
  });
  
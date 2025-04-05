import { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Linking, Text, StyleSheet, ScrollView, TextInput, ImageBackground, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";

export default function ImagePickerScreen() {
  const { user } = useLocalSearchParams();
  const userData = user ? JSON.parse(Array.isArray(user) ? user[0] : user) : null;

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
        body: JSON.stringify({ message: inputText }),
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
        <Text style={styles.title}>Welcome to <Text style={styles.appName}>GenmedX</Text></Text>
        <Text>Welcome, {userData?.name}</Text>

        <View style={styles.wrapper}>
          {/* File List */}
          <View style={styles.files}>
            <Text style={styles.sectionTitle}>Your Files</Text>
            <ScrollView contentContainerStyle={styles.fileListContainer}>
              {files.map((item, index) => (
                <TouchableOpacity key={index} style={styles.fileItem} onPress={() => openFile(item)}>
                  <Text style={styles.fileText}>{item.split('/').pop()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat Section */}
          <View style={styles.chat}>
            <ScrollView style={styles.chatContainer}>
              {messages.map((msg, index) => (
                <View key={index} style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Input Controls */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputBox}
            placeholder="Type your message to AI..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Add More Files</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'blue',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f53d00',
  },
  wrapper: {
    flexDirection: "row",
    width: "100%",
    height: "70%",
    marginVertical: 20,
  },
  files: {
    width: '20%',
    padding: 10,
    borderWidth:1, 
    borderColor:"#f53d00",
    backgroundColor: '#f9f9f9',
    borderRightWidth: 4,
    borderRightColor: '#f53d00',
    borderRadius:10,
    
    height : "90%"
  },
  chat: {
    width: '80%',
    paddingLeft: 10,
    paddingRight:10,
    height :"100%",
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
    borderColor: "blue",
    borderWidth:1,
    // borderLeftWidth:4,
    borderRadius: 10,
    height :"100%"
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
});

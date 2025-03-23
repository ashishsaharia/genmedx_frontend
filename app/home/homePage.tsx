import { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView, TextInput, ImageBackground, Alert,Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

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
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const data = await response.json();
      console.log('Upload success:', data);
      if (Platform.OS === 'web') {
        window.alert("Image uploaded successfully");
      } else {
        Alert.alert("Image uploaded successfully");
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (Platform.OS === 'web') {
        window.alert("Error uploading the image");
      } else {
        Alert.alert("Error uploading the image");
      }
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: inputText }];
    setMessages(newMessages);
    setInputText('');

    try {
      const response = await fetch('http://localhost:3000/chat', {
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
        {/* <Text style={styles.subtitle}>Your uploaded files</Text> */}

        {/* dont want to show the images here */}
        {/* <ScrollView horizontal style={styles.fileScrollView}>
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView> */}
        <View style ={styles.bottomDiv}>
        
        <ScrollView style={styles.chatContainer}>
          {messages.map((msg, index) => (
            <View key={index} style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputBox}
            placeholder="Type your message to AI..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Add More Files</Text>
        </TouchableOpacity>
        </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bottomDiv :{width :"80%" , height:"80%", marginTop:"5%"},
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'blue' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 10 },
  fileScrollView: { width: '100%', maxHeight: 120, marginBottom: 20 },
  button: { marginLeft: 10, backgroundColor: 'blue', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  image: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
  chatContainer: {flex:1, width: '100%', maxHeight: 400, marginBottom: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 },
  message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#fa6b3c' },
  messageText: { color: 'white', fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 10 },
  inputBox: { flex: 1, height: 50, borderColor: '#ccc', borderWidth: 2, borderRadius: 10, paddingHorizontal: 10, backgroundColor: 'white' },
  sendButton: { marginLeft: 10, backgroundColor: 'blue', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#f53d00' },
});

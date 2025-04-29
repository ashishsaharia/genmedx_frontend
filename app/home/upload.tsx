import { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Linking, Text, StyleSheet, ScrollView, TextInput, ImageBackground, Alert, Platform, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';

export default function UploadFile() {
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


  console.log(userData.email);
  
  useEffect(() => {
    fetch(`${url}/uploads/${userData.email}`)
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error(err));
  }, [files]);


  const [sidebarVisible, setSidebarVisible] = useState(false);

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

  return(
<View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
    
    {/* Header with Hamburger Icon */}
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#fff',
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
    }}>
      <TouchableOpacity onPress={() => setSidebarVisible(true)}>
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
        Uploaded files
      </Text>
    </View>

    {/* Sidebar Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={sidebarVisible}
      onRequestClose={() => setSidebarVisible(false)}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          flexDirection: 'row',
        }}
        onPress={() => setSidebarVisible(false)}
      >
        <View style={{
          width: 250,
          backgroundColor: '#fff',
          padding: 15,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#f53d00',
            marginBottom: 15,
          }}>
            Your Files
          </Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {files.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                }}
                onPress={() => {
                  openFile(item);
                  setSidebarVisible(false);
                }}
              >
                <Text style={{ color: '#333', fontSize: 16 }}>
                  {item.split('/').pop()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>

    {/* Main Content */}
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{
        fontSize: 28,
        fontWeight: 'bold',
        color: 'blue',
        textAlign: 'center',
      }}>
        Welcome to <Text style={{ color: '#f53d00' }}>HealAI</Text>
      </Text>
      <Text style={{
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
        color: '#333',
      }}>
        I know everything about your medical history.
      </Text>

      <ScrollView style={{
        flex: 1,
        borderWidth: 1,
        borderColor: '#6a0dad',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginVertical: 15,
      }}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#007AFF' : '#fa6b3c',
              padding: 10,
              borderRadius: 10,
              marginVertical: 5,
              maxWidth: '70%',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{
            flex: 1,
            height: 50,
            borderColor: '#ccc',
            borderWidth: 2,
            borderRadius: 10,
            paddingHorizontal: 10,
            backgroundColor: 'white',
          }}
          placeholder="Type your message to AI..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={{
            marginLeft: 10,
            backgroundColor: 'blue',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
          onPress={sendMessage}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={{
    marginLeft: 10,
    backgroundColor: '#6a0dad',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }}
  onPress={pickImage}
>
  <Feather name="plus" size={24} color="white" />
</TouchableOpacity>

      </View>
    </View>
  </View>


  )

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
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});


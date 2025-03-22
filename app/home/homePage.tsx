import { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView, TextInput, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let imageBase64 = result.assets[0].base64;
      console.log('Base64 Image:', imageBase64);
      setImages([...images, result.assets[0].uri]);
      await uploadImage(imageBase64);
    }
  };

  const uploadImage = async (imageBase64: string | null | undefined) => {
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const data = await response.json();
      console.log('Upload success:', data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/landingPageBackground.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to <Text style = {styles.appName} >GenmedX </Text> </Text>
        <Text style={styles.subtitle}>Your uploaded files</Text>
        <ScrollView horizontal style={styles.fileScrollView}>
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Add More Files</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.inputBox}
          placeholder="Type your message to AI..."
          value={inputText}
          onChangeText={setInputText}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'blue',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  fileScrollView: {
    width: '100%',
    maxHeight: 120,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  inputBox: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBlockColor:"orange",
    borderLeftColor:"red",
    borderRightColor:"red"

  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#f53d00",
  }
});

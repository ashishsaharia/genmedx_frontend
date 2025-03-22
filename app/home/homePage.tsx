import { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64 :true,
    });
    if (!result.canceled) {
      let imageBase64 = result.assets[0].base64;
      console.log("this is the image base64 representation ");
      console.log(imageBase64);
      console.log(result);
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      await uploadImage(imageBase64); // Upload directly from the component
    }
  };

  const uploadImage = async (imageBase64 :string|null|undefined) => {
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


    // let formData = new FormData();
   

    // // console.log(imageUri);
    // // console.log(fileName);
    // console.log(imageType);
    // formData.append('image', {
    //   uri: imageUri,
    //   name: "name",
    //   type: imageType,
    // } as any);

    // console.log(formData);
    // //  console.log(formData + '\n');
    // try {
    //   let response = await fetch('http://localhost:5000/upload', {
    //     method: 'POST',
    //     body: formData,

    //   });

    //   console.log("post success \n ");
    //   let data = await response.json();
    //   Alert.alert('Success', `Image uploaded: ${data.fileUrl}`);
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert('Error', 'Failed to upload image.');
    // }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

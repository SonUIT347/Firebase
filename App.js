
import { StyleSheet, Text, View, Button, Image, Alert, SafeAreaView, TextInput, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView } from 'react-native';
import { db } from './src/config';
import { collection, addDoc, doc, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system'

import { storage } from './src/config';
import { getDownloadURL } from "firebase/storage";
// import firebase from 'firebase/app';
import 'firebase/storage';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { async } from '@firebase/util';
export default function App() {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [data, setData] = useState([])
  const [text, SetText] = useState('')

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const uploadImage = async () => {

    const metadata = {
      contentType: 'image/jpeg'
    };

    const response = await fetch(image)
    const blob = await response.blob()

    const filename = image.substring(image.lastIndexOf('/') + 1)

    const storageRef = ref(storage, 'images/' + filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed',
      (snapshot) => {

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break;
          case 'storage/unknown':
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setImageUrl(downloadURL)
          addDoc(collection(db, 'User'), {
            name: name,
            image: downloadURL
          })
        });
      }
    );
  }
  useEffect(() => {
    getData()
  }, [imageUrl])
  const getData = async () => {
    await getDocs(collection(db, 'User')).then((doc) => {
      setData(doc.docs.map((docs) => ({ ...docs.data(), id: docs.id })))
    })
  }
  const Item = ({ item }) => {
    return (
      <View>
        <Text>{item.name}</Text>
        <Image source={{ uri: item.image }} style={{ width: 200, height: 100 }} />
      </View>
    )
  }
  const renderItem = ({ item }) => {
    return (
      <Item item={item} />
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={10}> */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
      }}>
        <Text>
          FireBase Demo
        </Text>
      </View>

      <ScrollView style={{ marginTop: 30 }}>
        <View style={{
          width: 350,
          height: 650,
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <View>
            <TextInput
              placeholder='Write your name'
              autoFocus={true}
              onChangeText={(text) => setName(text)}
              value={name}
            />
          </View>
          <Button
            title="Pick an image from camera roll"
            onPress={pickImage} />
          {image != '' ? <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100
            }} /> :
            <Image s
              ource={{ uri: image }}
              style={{
                width: 0,
                height: 0
              }} />}
          {/* <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> */}
          <Button
            title="upload"
            onPress={(uploadImage)} />
          <FlatList
            data={data}
            renderItem={renderItem}
          />
        </View>

      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll_ctn: {
    flexDirection: 'column',
    height: 650,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  }
});


import { StyleSheet, Text, View, Button, Image, Alert, SafeAreaView, TextInput, TouchableOpacity, ScrollView, FlatList, KeyboardAvoidingView } from 'react-native';
import { db } from './src/config';
import { collection, addDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'
import { useState, useEffect } from 'react';
import { storage } from './src/config';
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytesResumable,deleteObject } from 'firebase/storage';
import Storage from './src/Storage';
export default function App() {

  return (
    <Storage/>

  );
}



import { initializeApp } from "firebase/app";
import 'firebase/compat/storage';
import firebase from 'firebase/compat/app'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxARBBkjEKseb0Z0MLazWb_j9DGU6Mbbo",
  authDomain: "fir-storage-demo-e8d0c.firebaseapp.com",
  projectId: "fir-storage-demo-e8d0c",
  storageBucket: "fir-storage-demo-e8d0c.appspot.com",
  messagingSenderId: "815760627325",
  appId: "1:815760627325:web:ff977f35ff82bae7490314"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app)
export {firebase}
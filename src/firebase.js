import firebase from "firebase/app"
import 'firebase/analytics';
import "firebase/firestore"
import "firebase/database"

var firebaseConfig = {
    apiKey: "AIzaSyBFrxZSgRayEdEuFkq6gnK99DB0DlrFTy0",
    authDomain: "shareable-queue.firebaseapp.com",
    databaseURL: "https://shareable-queue.firebaseio.com",
    projectId: "shareable-queue",
    storageBucket: "shareable-queue.appspot.com",
    messagingSenderId: "199281880955",
    appId: "1:199281880955:web:9d12da675d5275763597de"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase
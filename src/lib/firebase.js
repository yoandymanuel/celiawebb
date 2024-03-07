
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
// Config to production

const firebaseConfig = {
  apiKey: "AIzaSyAEk0iwU6NwzmpX9xD7GrL2keSWlmGiCAg",
  authDomain: "celiapp-cc7ec.firebaseapp.com",
  databaseURL: "https://celiapp-cc7ec.firebaseio.com",
  projectId: "celiapp-cc7ec",
  storageBucket: "celiapp-cc7ec.appspot.com",
  messagingSenderId: "1084076616640",
  appId: "1:1084076616640:web:ce7b2852d270a4d6f8f625",
  measurementId: "G-GXG74P8VCX"
}
// Config to test
const firebaseConfigTest = {
    apiKey: "AIzaSyBHZJFzZ1iyBS_QJvEvo6SU3Vnw6v2kHlk",
    authDomain: "celiapp-test.firebaseapp.com",
    databaseURL: "https://celiapp-cc7ec.firebaseio.com",
    projectId: "celiapp-test",
    storageBucket: "celiapp-test.appspot.com",
    messagingSenderId: "999380209323",
    appId: "1:999380209323:web:f3f40128b6d6d13c5fb1ee",
    measurementId: "G-QGWMR1BME2"
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfigTest)


  export {firebase}
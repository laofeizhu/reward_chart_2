import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'


// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyC2IXNMv4ewSKgxFIaLbq9cgVBz0aV4_6E",
  authDomain: "vue-app-88f13.firebaseapp.com",
  databaseURL: "https://vue-app-88f13.firebaseio.com",
  projectId: "vue-app-88f13",
  storageBucket: "vue-app-88f13.appspot.com",
  messagingSenderId: "664663099371",
  appId: "1:664663099371:web:1dc2b4749fa98e8e787bae",
  measurementId: "G-JB6ES6YM5K"
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
// ADD THESE LINES
if (window.location.hostname === "localhost") {
  console.log("localhost detected!")
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')
const kidsCollection = db.collection('kids')
const badgesCollection = db.collection('badges')
const rewardsCollection = db.collection('rewards')
const scoresCollection = db.collection('scores')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  kidsCollection,
  badgesCollection,
  rewardsCollection,
  scoresCollection,
}

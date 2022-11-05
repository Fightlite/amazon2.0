import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBUfiiCsa_h1-pFuUp6GtkuHlhEIRMm_0Y',
  authDomain: 'new--2022.firebaseapp.com',
  projectId: 'new--2022',
  storageBucket: 'new--2022.appspot.com',
  messagingSenderId: '881746156097',
  appId: '1:881746156097:web:48939ea2bce445141e04c0',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db

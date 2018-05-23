import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  // Populate your firebase configuration data here.
  apiKey: `AIzaSyCri5hsisHcf7q7_eIx9pCe52VMWT7eWqA`,
  authDomain: `hacktiv-overflow-97477.firebaseapp.com`,
  databaseURL: `https://hacktiv-overflow-97477.firebaseio.com`,
  projectId: `hacktiv-overflow-97477`,
  storageBucket: `hacktiv-overflow-97477.appspot.com`,
  messagingSenderId: `820938653131`
})

export const firebase = firebaseApp

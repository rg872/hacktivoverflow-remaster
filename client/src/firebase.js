import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  // Populate your firebase configuration data here.
  apiKey: 'AIzaSyAOO3j0onKg-y-OlzxBa5Oz705VFefn8jw',
    authDomain: 'hacktiv-overflow-55e9a.firebaseapp.com',
    databaseURL: 'https://hacktiv-overflow-55e9a.firebaseio.com',
    projectId: 'hacktiv-overflow-55e9a',
    storageBucket: 'hacktiv-overflow-55e9a.appspot.com',
    messagingSenderId: '178983103830'
})

export const firebase = firebaseApp

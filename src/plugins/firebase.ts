import * as firebase from 'firebase/app'
;(function init() {
  const firebaseConfig = {
    apiKey: 'AIzaSyAG7Fur87oTIxz_UwDaNCfRnu5JzdkKQdU',
    authDomain: 'feedr-fadab.firebaseapp.com',
    databaseURL: 'https://feedr-fadab.firebaseio.com',
    projectId: 'feedr-fadab',
    storageBucket: 'feedr-fadab.appspot.com',
    messagingSenderId: '869867247107',
    appId: '1:869867247107:web:6a20561e0391db8fc9e036',
    measurementId: 'G-SC1S998B17',
  }
  try {
    firebase.initializeApp(firebaseConfig)
  } catch {
    // Do nothing
  }
})()

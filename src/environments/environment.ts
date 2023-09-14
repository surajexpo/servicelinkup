
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/auth';
export const environment = {
production: false,
  firebaseConfig : {
    apiKey: "AIzaSyCKtZGAeXSW7pX6oFTsOiS-zP1vtpWNrLc",
    authDomain: "servicelinkup-27230.firebaseapp.com",
    projectId: "servicelinkup-27230",
    storageBucket: "servicelinkup-27230.appspot.com",
    messagingSenderId: "168179536140",
    appId: "1:168179536140:web:c2d8aabc67372891abf929"
}
};
// Initialize Firebase
initializeApp(environment.firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALVCOUkJ5sFFSSb_QkaeX5BwKba6dYdNw",
  authDomain: "final-renter.firebaseapp.com",
  projectId: "final-renter",
  storageBucket: "final-renter.appspot.com",
  messagingSenderId: "913728767792",
  appId: "1:913728767792:web:b0955d1d6028e2b9ffeaf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. initialize Firestore service
const db = getFirestore(app)

// 3. export the Firestore service from this js file so other parts of your app can use it
export { db }


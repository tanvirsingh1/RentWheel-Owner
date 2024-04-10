import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {db} from './firebaseConfig'
import { collection, addDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const Checking = async() =>{
  try {
    // Specify which collection and document id to query
    const docRef = doc(db, "Users", "EDEWUsF0uwhnAnxewbQZ");
    // Attempt to get the specified document
    const docSnap = await getDoc(docRef);
 
 
    // use the .exists() function to check if the document 
    // could be found
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else if (docSnap.data() === undefined) {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
 } catch (err) {
    console.log(err)
 }
 
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

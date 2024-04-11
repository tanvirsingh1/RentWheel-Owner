import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useState} from "react"

import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

import { signOut } from "firebase/auth";

const LoginScreen = ({navigation}) => {

    // form fields
    const [emailFromUI, setEmailFromUI] = useState("")
    const [passwordFromUI, setPasswordFromUI] = useState("")
    const [errorMessageLabel, setErrorMessageLabel] = useState("")

    const loginPressed = async () => {
        console.log("Logging in...")
        // if there is already a person logged in , then don't login again
        if (auth.currentUser === null) {
            // no one is logged in, so login
            try {            
                await signInWithEmailAndPassword(auth, emailFromUI, passwordFromUI)
                console.log(auth.currentUser)

                //check if the user is owner
                try {
                    // Specify which collection and document id to query
                    const docRef = doc(db, "Owners", auth.currentUser.uid);
                    // Attempt to get the specified document
                    const docSnap = await getDoc(docRef);
                 
                    // use the .exists() function to check if the document 
                    // could be found
                    if (docSnap.exists()) { 
                        alert("Login complete!")
                        // then, navigate them to the next screen
                        navigation.navigate("Manage Bookings")
                        console.log("Document data:", docSnap.data());

                    } else if (docSnap.data() === undefined) {
                      // log user out if it is not an owner account
                      alert("You are trying to sign in to owner app with renter account")
                      await signOut(auth)
                    }
                 } catch (err) {
                    console.log(err)
                 }
                 
               
            } catch(error) {
                console.log(`Error code: ${error.code}`)
                console.log(`Error message: ${error.message}`)
                setErrorMessageLabel(error.message)
                // full error message
                console.log(error)
            }
        } else {
            // someone is logged in so show some kind of message
            alert("You are already logged in!")
            navigation.navigate("Manage Bookings")
        }
    }


   return(
       <View style={styles.container}>  
            
            {/* email tb */}
            <TextInput placeholder="Enter email" onChangeText={setEmailFromUI} value={emailFromUI} style={styles.tb}/>
          
            {/* password tb */}
            <TextInput placeholder="Enter password" onChangeText={setPasswordFromUI} value={passwordFromUI} style={styles.tb}/>
          
            {/* button */}
            <Pressable onPress={loginPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Login</Text>
            </Pressable>
          
            <Text>{errorMessageLabel}</Text>
       </View>
   )
}
export default LoginScreen


const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',     
     padding:20,
   },
   tb: {
       width:"100%",   
       borderRadius:5,
       backgroundColor:"#efefef",
       color:"#333",
       fontWeight:"bold", 
       paddingHorizontal:10,
       paddingVertical:15,
       marginVertical:10,       
   },
   btn: {
       borderWidth:1,
       borderColor:"#141D21",
       borderRadius:8,
       paddingVertical:16,
       marginVertical:20
   },
   btnLabel: {
       fontSize:16,
       textAlign:"center"
   }, 
   error: {
        fontSize:16,
        textAlign:"center",
        color:"blue"
   }
});

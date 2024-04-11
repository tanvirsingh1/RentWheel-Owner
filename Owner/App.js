import {View, Button, Text} from "react-native"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from "./Screens/Login";
import ManageBookings from "./Screens/ManageBookings";
import AddListing from "./Screens/AddListing"

import { auth } from './firebaseConfig';
import { signOut } from "firebase/auth";

const logoutPressed = async (navigation) => {
  // TODO: Code to logout
  console.log("Logging the user out..")
  try {
      if (auth.currentUser === null) {
          console.log("logoutPressed: There is no user to logout!")
      } 
      else {
          await signOut(auth)
          console.log("logoutPressed: Logout complete")
          alert("logout complete!")
          navigation.navigate("Login")
      }
  } catch(error) {
      console.log("ERROR when logging out")
      console.log(error)
  }            
}

const Stack = createStackNavigator();


export default function App() {
 
  return (
    <NavigationContainer>
      <Stack.Navigator>    
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Manage Bookings" component={ManageBookings} 
          options={({ navigation }) => ({
            headerRight: () => (
              <View style={{ margin: 10 }}>
                <Button title="Logout" onPress={() => logoutPressed(navigation)} />
              </View>
            ),
            headerLeft: null, // If you want to remove the back button, set this to null
          })}
                     
      />
       <Stack.Screen name="Add Listing" component={AddListing}
       options={({ navigation }) => ({
        headerRight: () => (
          <View style={{ margin: 10 }}>
            <Button title="Logout" onPress={() => logoutPressed(navigation)} />
          </View>
        ),
        
      })}/>

        
      </Stack.Navigator>
    </NavigationContainer>
  )
}

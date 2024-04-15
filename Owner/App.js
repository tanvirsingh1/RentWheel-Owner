import {View, Button, Text} from "react-native"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "./Screens/Login";
import ManageBookings from "./Screens/ManageBookings";
import ListingsScreen from "./Screens/Listingscreen";
import AddListing from "./Screens/AddListing"
import { auth } from './firebaseConfig';
import { signOut } from "firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';




const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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


const TabContainerComponent = () => {
  
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
      
        if (route.name === 'All Listings') {
          return <Entypo name="plus" size={24} color="black" />;
        }
        if (route.name === 'Manage Bookings') {
          return <FontAwesome5 name="list" size={24} color="black" />;
        }
      },
    tabBarActiveTintColor: "#7C4DFF",
    tabBarInactiveTintColor: "gray",
})}>
      <Tab.Screen name="Manage Bookings" component={ManageBookings} />
    <Tab.Screen name="All Listings" component={ListingsScreen} />
   </Tab.Navigator>
  )
}

export default function App() {
 
  return ( 
      < NavigationContainer>
         <Stack.Navigator>    
        <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Land a Wheel" component={TabContainerComponent} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ margin: 10 }}>
                  <Button title="Logout" onPress={() => logoutPressed(navigation)} />
                </View>
              ),
              headerLeft: null, // If you want to remove the back button, set this to null
            })}/>
          <Stack.Screen name="Add Listing" component={AddListing} />
         
        </Stack.Navigator>
         
      </NavigationContainer>
  )
}

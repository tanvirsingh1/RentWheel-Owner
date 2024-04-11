import { StyleSheet, Text, View, TextInput, Switch, Pressable} from 'react-native';
import {useState, useEffect} from "react"


import { db, auth } from '../firebaseConfig';


const ManageBookings = ({navigation}) => {

    //go to listing form
    AddListingPressed=()=>
    {
        navigation.navigate("Add Listing")
    }
   
  
   useEffect(()=>{
    
   }, [])


   return(
       <View style={styles.container}>   
       <Text style={styles.text}>Got anything new?</Text>
            <Pressable onPress={AddListingPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Add New Listing</Text>
            </Pressable>
            <Text style={styles.headingText}>Bookings</Text>
           
           
       </View>
   )
}
export default ManageBookings


const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',     
     padding:20,
   },  
   btn: {
       borderWidth:1,
       borderColor:"#141D21",
       borderRadius:8,
       paddingVertical:16,
       marginVertical:10
   },
   btnLabel: {
       fontSize:16,
       textAlign:"center"
   },
   headingText: {
    fontSize:24,
    paddingVertical:8
   },
   text: {
    fontSize:18,
    paddingVertical:4
   }

});

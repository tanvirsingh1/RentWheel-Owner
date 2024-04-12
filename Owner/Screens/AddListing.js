import { StyleSheet, Text, View, TextInput, Pressable,SafeAreaView,Switch  } from 'react-native';
import {useState, useEffect} from "react"
import { auth, db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const AddListing = ({navigation}) => {
    const [carMake, setCarMake] = useState('');
    const [carModel, setCarModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [engineType, setEngineType] = useState('');
    const [addressFromUI, setAddressFromUI] = useState("1750 Finch Avenue East, Toronto, ON")
    const [isAvailable, setIsAvailable] = useState(true);

    const doGeocoding  = async () => {
        console.log(`Geocoding the address ${addressFromUI}`)
        try {
            const geocodedLocation = await Location.geocodeAsync(addressFromUI)
            console.log(geocodedLocation) // array of possible locations
          
            const result = geocodedLocation[0]
            if (result === undefined) {
                alert("No coordinates found")
                return
            }
          
            console.log(result)
            console.log(`Latitude: ${result.latitude}`)
            console.log(`Longitude: ${result.longitude}`)
          
          
            const outputString = `${addressFromUI} is located at ${result.latitude}, ${result.longitude}`
         //   setFwdGecodeResultsLabel(outputString)
            return result
        } catch (err) {
            console.log(err)
        }
    }
 

    const createListing = async () => {
        
        try {
            const { latitude, longitude } = await  doGeocoding()
            
            const currentUser = auth.currentUser;
            const ownerId = currentUser ? currentUser.uid : null;
            const docRef = await addDoc(collection(db, "Listings"), {
                carMake,
                carModel,
                year,
                color,
                pricePerDay: parseFloat(pricePerDay), // Convert pricePerDay to a number
                engineType,
                ownerId,
                latitude,
            longitude,
            isAvailable
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
return (
        <SafeAreaView style={styles.body}>
            <View style={styles.container}>
                <Text style={styles.headingText}>Create a New Listing</Text>
                <Text style={styles.fontText}>Basic Information</Text>
                <View style={styles.row}>
                    <TextInput
                        style={styles.input}
                        placeholder="Car Make"
                        value={carMake}
                        onChangeText={setCarMake}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Car Model"
                        value={carModel}
                        onChangeText={setCarModel}
                    />
                </View>
                <View style={styles.row}>
                    <TextInput
                        style={styles.input}
                        placeholder="Year"
                        value={year}
                        onChangeText={setYear}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Color"
                        value={color}
                        onChangeText={setColor}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Engine Type"
                    value={engineType}
                    onChangeText={setEngineType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price Per Day"
                    value={pricePerDay}
                    onChangeText={setPricePerDay}
                />
                <View style={styles.row}>
                    <Text style={styles.fontText}>Available:</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isAvailable ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setIsAvailable}
                        value={isAvailable}
                    />
                </View>
                <TextInput
                    style={styles.input2}
                    onChangeText={setAddressFromUI}
                    placeholder="Enter address (example: 123 Main Street)"
                    value={addressFromUI}

                />
                          <Pressable
            onPress={createListing}
            style={{
              borderWidth: 1,
              marginTop: 15,
              padding: 15,
              borderRadius: 5,
              backgroundColor: "#81b0ff",
            }}
          >
            <Text
              style={{
              
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
Create Listing            </Text>
          </Pressable>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#000",
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 15,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    headingText: {
        fontSize: 24,
        paddingVertical: 8,
        color: "white",
        textAlign: "center",
        marginBottom: 10,
    },
    fontText: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 16,
        color: "#fff",
    },
    input: {
        backgroundColor: "#FEFBF6",
        borderRadius: 5,
        width: "45%",
        padding: 10,
        fontSize: 12,
        marginVertical: 10,
        color: "#000",
    },
    input2:{
        backgroundColor: "#FEFBF6",
        borderRadius: 5,
        width: "85%",
        padding: 10,
        fontSize: 12,
        marginVertical: 10,
        color: "#000",
    }
});

export default AddListing;
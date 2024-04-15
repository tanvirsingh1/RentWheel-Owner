import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Pressable,
    SafeAreaView,
    Switch,
    Image,
    ScrollView,
} from "react-native";
import { useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useEffect } from "react";


const AddListing = ({ navigation }) => {
    const [carMake, setCarMake] = useState("");
    const [carModel, setCarModel] = useState("");
    const [year, setYear] = useState("");
    const [color, setColor] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [addressFromUI, setAddressFromUI] = useState(
        "1750 Finch Avenue East, Toronto, ON"
    );
    const [isElectric, setIsAvailable] = useState(true);
    const [imageFromGallery, setImageFromGallery] = useState(null);
    const [resultsLabel, setResultsLabel] = useState("");
    const [mileage, setMileage] = useState("");
    const [capacity, setCapacity] = useState("");
    const [enginePower, setEnginePower] = useState("");
    const saveToCloud = async () => {
        if (!imageFromGallery) {
            alert("No photo selected");
            return null;
        }

        const filename = imageFromGallery.substring(
            imageFromGallery.lastIndexOf("/") + 1
        );
        const photoRef = ref(storage, filename);

        try {
            const response = await fetch(imageFromGallery);
            const blob = await response.blob();
            await uploadBytesResumable(photoRef, blob);
            const downloadURL = await getDownloadURL(photoRef);
            console.log("Url is", downloadURL);
            console.log("Image uploaded successfully");
         //   alert("Image uploaded successfully");

            return downloadURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
        //    alert("Error uploading image. Please try again.");
            return null;
        }
    };

    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);

        // check if user selected a photo
        if (result.canceled === true) {
            setResultsLabel("No photo selected");
            setImageFromGallery(null);
            return;
        }

        setResultsLabel(`Path to photo: ${result.assets[0].uri}`);
        setImageFromGallery(result.assets[0].uri);
    };

    const clearInputFields = () => {
        setCarMake("");
        setCarModel("");
        setYear("");
        setColor("");
        setPricePerDay("");
        setAddressFromUI("1750 Finch Avenue East, Toronto, ON");
        setIsAvailable(true);
        setImageFromGallery(null);
        setResultsLabel("");
        setMileage("");
        setCapacity("");
        setEnginePower("");
      };
      useEffect(() => {
        // Function to execute when the screen gains focus
    const unsubscribe = navigation.addListener("focus", () => {
clearInputFields()
    });
    return unsubscribe;
  }, [navigation]);

    const doGeocoding = async () => {
        console.log(`Geocoding the address ${addressFromUI}`);
        try {
            const geocodedLocation = await Location.geocodeAsync(addressFromUI);
            console.log(geocodedLocation); // array of possible locations

            const result = geocodedLocation[0];
            if (result === undefined) {
                alert("No coordinates found");
                return;
            }

            console.log(result);
            console.log(`Latitude: ${result.latitude}`);
            console.log(`Longitude: ${result.longitude}`);
            return result
        } catch (err) {
            console.log(err);
        }
    };

    const createListing = async () => {

        if (
            carMake === "" ||
            carModel === "" ||
            year === "" ||
            color === "" ||
            pricePerDay === "" ||
            addressFromUI === "" ||
            mileage === "" ||
            capacity === "" ||
            enginePower === "" ||
            !imageFromGallery
        ) {
            alert("Please fill in all the required fields and upload an image.");
            return;
        }

        try {
            const imageUrl = await saveToCloud();
            const { latitude, longitude } = await doGeocoding();
            if (!latitude || !longitude) {
                alert("Please provide a valid address.");
                return;
            }
            const currentUser = auth.currentUser;
            const ownerId = currentUser ? currentUser.uid : null;
            const docRef = await addDoc(collection(db, "Listings"), {
                carMake,
                carModel,
                year,
                color,
                pricePerDay: parseFloat(pricePerDay),
                ownerId,
                latitude,
                longitude,
                isElectric,
                imageUrl,
                mileage: parseFloat(mileage),
                capacity: parseFloat(capacity),
                enginePower: parseFloat(enginePower),
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Listing created successfully!");
            navigation.navigate("Listing")

        } catch (error) {
            console.error("Error adding document: ", error);
        }

    };
    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
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
                    {/* Basic Section end */}

                    {/**Address Section */}

                    <Text style={styles.label}>Where is your car Located?</Text>
                    <View style={styles.addressContainer}>
                        <View style={styles.inputContainer}>
                            <Entypo name="location-pin" size={24} style={styles.icon} />
                            <TextInput
                                style={styles.input2}
                                onChangeText={setAddressFromUI}
                                placeholder="Enter address (example: 123 Main Street, City)"
                                value={addressFromUI}
                            />
                        </View>
                    </View>
                    {/**Address Section Ends */}


                    {/**Engine Specification Section Starts */}
                    <Text style={styles.fontText}>Car Features</Text>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            paddingTop: 10,
                        }}
                    >
                        <View style={[styles.detailsBox, { backgroundColor: "#FF6868" }]}>
                            <FontAwesome5 name="tachometer-alt" size={24} color="black" />
                            <TextInput
                                style={styles.inputInBox}
                                placeholder="Mileage"
                                value={mileage}
                                onChangeText={setMileage}
                            />
                            <Text style={styles.fontText}>km</Text>
                        </View>
                        <View style={[styles.detailsBox, { backgroundColor: "#19A7CE" }]}>
                            <FontAwesome5 name="gas-pump" size={24} color="black" />
                            <TextInput
                                style={styles.inputInBox}
                                placeholder="Capacity"
                                value={capacity}
                                onChangeText={setCapacity}
                            />
                            <Text style={styles.fontText}>L</Text>
                        </View>
                        <View style={[styles.detailsBox, { backgroundColor: "#F57D1F" }]}>
                            <FontAwesome5 name="bolt" size={24} color="black" />
                            <TextInput
                                style={styles.inputInBox}
                                placeholder="Power"
                                value={enginePower}
                                onChangeText={setEnginePower}
                            />
                            <Text style={styles.fontText}>HP</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.fontText}>Is Electric? </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isElectric ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={setIsAvailable}
                            value={isElectric}
                        />
                    </View>

                    {/**Engine Specification Section Ends */}


                    {/**Price Section Starts */}
                    <Text style={[styles.fontText, { marginTop: 10, marginBottom: 10 }]}> Price: </Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <TextInput
                            style={{ fontSize: 16 }}
                            placeholder="Enter price (example 150)"
                            value={pricePerDay}
                            onChangeText={setPricePerDay}
                        />
                        <Text style={styles.perDayLabel}>per-day</Text>
                    </View>
                    <View style={styles.line} />
                    {/**Price Section Ends */}


                    {/** Upload Car Image */}
                    <Text style={styles.label}> Upload your Car Images</Text>
                    <View style={{ flexDirection: "row", justifyContent: imageFromGallery ? 'flex-start' : 'center', gap: 10, margin: 10 }}>
                        <Pressable
                            onPress={chooseImage}
                            style={({ pressed }) => ({
                                backgroundColor: pressed ? "#5c8eff" : "#FF6868", // Change the background color here
                                borderRadius: 5,
                                width: 150,
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            })}
                        >
                            <Text style={styles.uploadLabel}>Upload</Text>
                        </Pressable>

                        {imageFromGallery && (
                            <Image
                                source={{ uri: imageFromGallery }}
                                style={styles.uploadedImage}
                            />
                        )}
                    </View>
                    {/** Upload Car Image Ends */}



                    <Pressable
                        onPress={createListing}
                        style={({ pressed }) => ({
                           
                            marginTop: 15,
                            padding: 15,
                            borderRadius: 5,
                            backgroundColor: pressed ? "#81b0ff": "#767577", 
                        })}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 18,
                                fontWeight: "bold",
                                textAlign: "center", 
                               
                            }}
                        >
                            Create Listing{" "}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    body: {
      
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
       
        textAlign: "center",
        marginBottom: 10,
    },
    fontText: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 18,
       
    },
    input: {
        backgroundColor: "#FEFBF6",
        borderRadius: 5,
        width: "45%",
        padding: 10,
        fontSize: 12,
        marginVertical: 10,
       
    },
    input2: {
        backgroundColor: "#FEFBF6",
        borderRadius: 5,
        width: "85%",
        padding: 10,
        fontSize: 12,
        marginVertical: 10,
        
    },
    label: {
       
        fontSize: 20,
        marginTop: 10,
        marginBottom: 5,
    },
    perDayLabel: {
        position: 'absolute',
        right: 0,
        top: 0,
       
        fontSize: 18,
    },
    line: {
        width: 200,
        borderBottomWidth: 1,
        marginTop: 5,
        marginBottom: 15,
    },
    detailsBox: {
        height: "90%",
        width: "30%",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    inputInBox: {
        backgroundColor: "#FEFBF6",
        borderRadius: 5,
        padding: 10,
        fontSize: 12,
        marginVertical: 5,
       
        opacity: 0.8,
    },
    uploadLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    uploadInfo: {
        color: "white",
    },
    uploadedImage: {
        width: "65%",
        height: 200,
        resizeMode: "cover",
        borderRadius: 5,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },

});

export default AddListing;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import * as Location from 'expo-location';

const ListingsScreen = ({navigation}) => {
    const [listings, setListings] = useState([]);


    const AddListing=()=>
    {
        navigation.navigate("Add Listing")
    }

    
    useEffect(() => {
        const ownerListingsQuery = query(collection(db, 'Listings'), where('ownerId', '==', auth.currentUser.uid));

        const unsubscribe = onSnapshot(ownerListingsQuery, (snapshot) => {
            const listingsData = snapshot.docs.map(doc => ({
                id: doc.id,
                listing: doc.data(), // Only fetch the carMake property
                address: Location.reverseGeocodeAsync({latitude: doc.data().latitude, longitude:doc.data().longitude}, {})[0]
            }));
            setListings(listingsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={styles.body}>
            <View style={styles.container}>
            <Pressable onPress={AddListing} style={styles.btn}>
                    <Text style={styles.btnLabel}>Add Listing</Text>
            </Pressable> 
               
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        
                        <View >
                            <Text style={styles.title}>{item.listing.color} {item.listing.carMake} {item.listing.carModel}</Text>
                            
                            <View style={{flexDirection:"row", gap:10}}>
                                <Image source={{ uri: item.listing.imageUrl }} style={styles.image} />
                            <View>
                            <Text>Price per day: <Text style={{fontWeight:"bold"}}>${item.listing.pricePerDay}</Text></Text> 
                            <Text>Year: <Text style={{fontWeight:"bold"}}>{item.listing.year}</Text></Text> 
                            <Text>Capacity: <Text style={{fontWeight:"bold"}}>{item.listing.capacity} L</Text></Text>
                            <Text>Engine Power: <Text style={{fontWeight:"bold"}}>{item.listing.enginePower} HP</Text></Text>
                            <Text>Mileage: <Text style={{fontWeight:"bold"}}>{item.listing.mileage} km</Text></Text>
                            <Text>Address: <Text style={{fontWeight:"bold"}}>{item.address}</Text></Text>
                        </View></View></View>
                    )}
                    ItemSeparatorComponent={() => {
                        return <View style={styles.listItemBorder}></View>;
                      }}
                
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listing: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 10
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center"
    },
    listItemBorder: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginVertical:5,
      },
      image: {
        width: 120,
        height: 120, // Adjust the height as needed
        resizeMode: 'cover', // or 'contain' or 'stretch' as per your requirement
    },
});

export default ListingsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const ListingsScreen = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const ownerListingsQuery = query(collection(db, 'Listings'), where('ownerId', '==', auth.currentUser.uid));

        const unsubscribe = onSnapshot(ownerListingsQuery, (snapshot) => {
            const listingsData = snapshot.docs.map(doc => ({
                id: doc.id,
                carMake: doc.data().carMake // Only fetch the carMake property
            }));
            setListings(listingsData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.heading}>Listings</Text>
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.listing}>
                            <Text style={styles.title}>{item.carMake}</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
});

export default ListingsScreen;

import { StyleSheet, Text, View, TextInput, Switch, Pressable, FlatList,  SafeAreaView,} from 'react-native';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const ManageBookings = ({ navigation }) => {
    const [listings, setListings] = useState([]);

    const AddListingPressed = () => {
        navigation.navigate("Add Listing");
    }

    useEffect(() => {
        // Fetch the listings data for the current owner
        const fetchListings = async () => {
            try {
                const ownerListingsQuery = query(collection(db, 'Listings'), where('ownerId', '==', auth.currentUser.uid));
                const querySnapshot = await getDocs(ownerListingsQuery);
                const listingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setListings(listingsData);
            } catch (error) {
                console.error("Error fetching listings: ", error);
            }
        };

        fetchListings();
    }, []);

    return (
        <SafeAreaView style={styles.Body}>
        <View style={styles.container}>
            <Text style={styles.text}>Got anything new?</Text>
            <Pressable onPress={AddListingPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Add New Listing</Text>
            </Pressable>
            <Text style={styles.headingText}>Bookings</Text>
            <FlatList
                data={listings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.carMake} {item.carModel}</Text>
                        {/* Render other listing details as needed */}
                    </View>
                )}
            />
        </View>
        </SafeAreaView>
    );
}
export default ManageBookings;

const styles = StyleSheet.create({
    Body: {
        backgroundColor: "#000", 
        flex: 1,
      },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
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
    headingText: {
        fontSize: 24,
        paddingVertical: 8
    },
    text: {
        fontSize: 18,
        paddingVertical: 4
    }
});

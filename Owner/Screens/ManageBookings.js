import { StyleSheet, Text, View, Pressable, FlatList, SafeAreaView } from 'react-native';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, onSnapshot, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const ManageBookings = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);

    const AddListingPressed = () => {
        navigation.navigate("Add Listing");
    }

    const cancelBooking = async (bookingId) => {
        try {
            const bookingRef = doc(db, 'Reservation', bookingId);
            await updateDoc(bookingRef, {
                Status: "Cancelled"
            });
            console.log("Booking cancelled successfully!");
        } catch (error) {
            console.error("Error cancelling booking: ", error);
        }
    };

    const confirmBooking = async (bookingId) => {
        try {
            const bookingRef = doc(db, 'Reservation', bookingId);
            await updateDoc(bookingRef, {
                Status: "Confirmed"
            });
            console.log("Booking confirmed successfully!");
        } catch (error) {
            console.error("Error confirming booking: ", error);
        }
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const ownerBookingsQuery = query(collection(db, 'Reservation'), where('ownerId', '==', auth.currentUser.uid));
                const unsubscribe = onSnapshot(ownerBookingsQuery, async (snapshot) => {
                    const bookingsData = [];
                    for (const docu of snapshot.docs) {
                        const reservation = docu.data();
                        const listingRef = doc(db, 'Listings', reservation.listingId)
                        const listingDoc = await getDoc(listingRef);
                        if (listingDoc.exists()) {
                            const listingData = { id: listingDoc.id, ...listingDoc.data() };
                            const booking = { id: docu.id, reservation: reservation, listing: listingData };
                            bookingsData.push(booking);
                        }
                    }
                    setBookings(bookingsData);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching bookings: ", error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <SafeAreaView style={styles.body}>
            <View style={styles.container}>
                <Text style={styles.text}>Got anything new?</Text>
                <Pressable onPress={AddListingPressed} style={styles.btn}>
                    <Text style={styles.btnLabel}>Add New Listing</Text>
                </Pressable>
                <Text style={styles.headingText}>Bookings</Text>
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.listing.carMake} {item.listing.carModel} {item.reservation.Status}</Text>
                            <Pressable onPress={() => cancelBooking(item.id)}
                                style={({ pressed }) => ({
                                    borderWidth: 1,
                                    marginTop: 15,
                                    padding: 15,
                                    borderRadius: 5,
                                    backgroundColor: pressed ? "#81b0ff" : "#767577",
                                })}>
                                <Text>Cancel Booking</Text>
                            </Pressable>
                            <Pressable onPress={() => confirmBooking(item.id)}
                                style={({ pressed }) => ({
                                    borderWidth: 1,
                                    marginTop: 15,
                                    padding: 15,
                                    borderRadius: 5,
                                    backgroundColor: pressed ? "#81b0ff" : "#767577",
                                })}>
                                <Text>Confirm Booking</Text>
                            </Pressable>
                            {/* Render other booking details as needed */}
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

export default ManageBookings;

const styles = StyleSheet.create({
    body: {
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

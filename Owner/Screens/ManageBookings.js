import { StyleSheet, Text, View, Pressable, FlatList, SafeAreaView,Image ,Alert} from 'react-native';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, onSnapshot, doc, getDoc, updateDoc  } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const ManageBookings = ({  }) => {
    const [bookings, setBookings] = useState([]);

    const cancelBooking = async (bookingId) => {
        try {
            const bookingRef = doc(db, 'Reservation', bookingId);
            await updateDoc(bookingRef, {
                Status: "Cancelled"
            });
            Alert.alert("Success", "Booking cancelled successfully!");
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
                console.log("current id is", auth.currentUser.uid)
                const unsubscribe = onSnapshot(ownerBookingsQuery, async (snapshot) => {
                    const bookingsData = [];
                    for (const docu of snapshot.docs) {
                       
                        const reservation = docu.data();
                       
                        const listingRef = doc(db, 'Listings', reservation.listingId)
                        const RenterRef = doc(db, 'Renters', reservation.renterId)
                        const listingDoc = await getDoc(listingRef);
                        const renterDoc = await getDoc(RenterRef);
    
                        if (listingDoc.exists() && renterDoc.exists()) {
                            const listingData = { id: listingDoc.id, ...listingDoc.data() };
                            const renterData = { id: renterDoc.id, ...renterDoc.data() };
                            const booking = { id: docu.id, reservation: reservation, listing: listingData, renter: renterData };
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
                
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View >
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                             <Text style={styles.text}>Confirmation Code: {item.reservation.confirmationCode}</Text>
                            <Text >{item.reservation.Status}</Text>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <Image source={{ uri: item.renter.image }} style={styles.image} />
                            <View> 
                            <Text>Renter:  <Text style={{fontWeight:"bold"}}>{item.renter.name}</Text></Text>
                           <Text >{item.listing.color} {item.listing.carMake} {item.listing.carModel}</Text>
                            
                            <Text>Date: <Text style={{fontWeight:"bold"}}>{item.reservation.Date}</Text></Text>
                            <Text>Price with Tax: <Text style={{fontWeight:"bold"}}>${item.reservation.pricePaid}</Text></Text>
                            </View>
                            
                           
                           {item.reservation.Status=="Confirmed"?
                            <Pressable onPress={() => cancelBooking(item.id)}
                                style={({ pressed }) => ({
                                    backgroundColor: pressed ? "#a34141" : "#FF6868", // Change the background color here
                                    borderRadius: 5,
                                    width: 100,
                                    height: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                })}>
                                <Text style={{color:"white"}}>Cancel</Text>
                            </Pressable>
                           
                           :
                             <Pressable onPress={() => confirmBooking(item.id)}
                             style={({ pressed }) => ({
                                backgroundColor: pressed ? "#4a3a78" : "#9978f5", // Change the background color here
                                borderRadius: 5,
                                width: 100,
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                })}>
                                <Text style={{color:"white"}}>Confirm</Text>
                            </Pressable>
                           }</View>
                        </View>
                    )}
                    ItemSeparatorComponent={() => {
                        return <View style={styles.listItemBorder}></View>;
                      }}
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
        fontSize: 16,
        paddingVertical: 4,
        fontWeight:"bold",
    },
    image: {
        width: 100,
        height: 100, // Adjust the height as needed
        resizeMode: 'cover', // or 'contain' or 'stretch' as per your requirement
    },
    listItemBorder: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginVertical:5,
      },
});

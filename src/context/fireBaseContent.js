import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYRPjij12WGjilxGz4bjeDqAEiAJcAT-E",
  authDomain: "aitripplanner-484c4.firebaseapp.com",
  projectId: "aitripplanner-484c4",
  storageBucket: "aitripplanner-484c4.appspot.com",
  messagingSenderId: "874181105809",
  appId: "1:874181105809:web:95215e56d303f8a2a38730",
  databaseURL: "https://aitripplanner-484c4-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/**
 * Save trip data to Firestore under the current user's collection
 * @param {Object} tripData - The trip data to save
 * @returns {Promise<string>} - The document ID of the saved trip
 */
export async function saveTrip(tripData) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tripsCollection = collection(db, "users", user.uid, "trips");
    const docRef = await addDoc(tripsCollection, tripData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving trip:", error);
    throw error;
  }
}

/**
 * Get all trips for the current user from Firestore
 * @returns {Promise<Array>} - Array of trip documents with id and data
 */
export async function getTrips() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const tripsCollection = collection(db, "users", user.uid, "trips");
    const tripsSnapshot = await getDocs(tripsCollection);
    const trips = tripsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return trips;
  } catch (error) {
    console.error("Error fetching trips:", error);
    // Return empty array instead of throwing to allow UI to handle unauthenticated state gracefully
    return [];
  }
}

/**
 * Upload image file to Firebase Storage and get download URL
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export async function uploadImage(file) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const storageRef = ref(storage, `users/${user.uid}/tripImages/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

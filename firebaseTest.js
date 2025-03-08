const { db } = require("./firebaseConfig");
const { collection, getDocs } = require("firebase/firestore");

const testFirebase = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "testCollection"));
        console.log("Firebase is connected! ✅");
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    } catch (error) {
        console.error("Error connecting to Firebase:", error);
    }
};

testFirebase();

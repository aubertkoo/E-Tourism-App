import React, { useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Image, Alert, 
  SafeAreaView, Dimensions, Platform 
} from "react-native";
import { Card, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

// Attractions Data for Different Regions
const attractionsData = {
  Kuching: [
    { id: "1", name: "Mount Santubong", description: "A majestic mountain with scenic hiking trails.", image: "https://via.placeholder.com/300" },
    { id: "2", name: "Bako National Park", description: "Home to stunning beaches and unique wildlife.", image: "https://via.placeholder.com/300" },
    { id: "3", name: "Sarawak Cultural Village", description: "Experience the rich heritage of Sarawak’s tribes.", image: "https://via.placeholder.com/300" },
  ],
  Lundu: [
    { id: "12", name: "Pandan Beach", description: "A quiet beach with golden sands.", image: "https://via.placeholder.com/300" },
    { id: "13", name: "Gunung Gading National Park", description: "Famous for Rafflesia, the world's largest flower.", image: "https://via.placeholder.com/300" },
  ],
  Miri: [
    { id: "4", name: "Niah Caves", description: "Famous for prehistoric cave paintings and large chambers.", image: "https://via.placeholder.com/300" },
    { id: "5", name: "Mulu National Park", description: "UNESCO World Heritage site with amazing caves and rainforest.", image: "https://via.placeholder.com/300" },
  ],
  Sibu: [
    { id: "6", name: "Sibu Central Market", description: "One of the largest markets in Malaysia.", image: "https://via.placeholder.com/300" },
    { id: "7", name: "Rajang Esplanade", description: "A scenic waterfront area with great food stalls.", image: "https://via.placeholder.com/300" },
  ],
  Bintulu: [
    { id: "8", name: "Similajau National Park", description: "Golden beaches and diverse wildlife.", image: "https://via.placeholder.com/300" },
  ],
  Bau: [
    { id: "9", name: "Fairy Cave", description: "A massive limestone cave with beautiful formations.", image: "https://via.placeholder.com/300" },
    { id: "10", name: "Wind Cave", description: "A natural limestone cave with underground rivers.", image: "https://via.placeholder.com/300" },
  ],
  Serian: [
    { id: "11", name: "Ranchan Waterfall", description: "A relaxing spot with cascading waterfalls.", image: "https://via.placeholder.com/300" },
  ],
  Sematan: [
    { id: "14", name: "Telok Melano Beach", description: "A secluded paradise for nature lovers.", image: "https://via.placeholder.com/300" },
  ],
  Betong: [
    { id: "15", name: "Bukit Sadok", description: "A historic fortress site with scenic views.", image: "https://via.placeholder.com/300" },
  ],
  Mukah: [
    { id: "16", name: "Jerunei Garden", description: "A cultural heritage site showcasing Melanau traditions.", image: "https://via.placeholder.com/300" },
  ],
  Limbang: [
    { id: "17", name: "Limbang Museum", description: "A historical museum displaying local artifacts.", image: "https://via.placeholder.com/300" },
  ],
  Lawas: [
    { id: "18", name: "Trusan River", description: "A scenic river for boat tours.", image: "https://via.placeholder.com/300" },
  ],
  KapuasHulu: [
    { id: "19", name: "Batutumong", description: "A nature reserve with beautiful scenery.", image: "https://via.placeholder.com/300" },
  ],
};

// List of regions for the picker
const regions = Object.keys(attractionsData);

export default function AttractionsScreen({ navigation }) {
  const route = useRoute();
  const { isDarkMode } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState(route.params?.region || "Lundu");
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const attractions = attractionsData[selectedRegion] || [];
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  // Function to Save Attraction to Itinerary (AsyncStorage)
  const addToItinerary = async () => {
    if (!selectedAttraction) return;

    try {
      const savedItinerary = await AsyncStorage.getItem("itinerary");
      const itinerary = savedItinerary ? JSON.parse(savedItinerary) : [];

      const formattedDate = selectedDate.toDateString();
      const formattedTime = selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

      const newEntry = {
        id: Date.now().toString(),
        name: selectedAttraction.name,
        description: selectedAttraction.description,
        image: selectedAttraction.image,
        date: formattedDate,
        time: formattedTime,
        region: selectedRegion, // Add the region (city) to the itinerary entry
      };

      itinerary.push(newEntry);
      await AsyncStorage.setItem("itinerary", JSON.stringify(itinerary));
      console.log("Saved to AsyncStorage:", newEntry);

      Alert.alert("Added!", `${selectedAttraction.name} has been added to your itinerary.`, [
        { text: "OK", onPress: () => navigation.navigate("Itinerary") }
      ]);
      setShowAddModal(false);
      setSelectedAttraction(null);
    } catch (error) {
      console.error("Error saving itinerary:", error);
      Alert.alert("Error", "Failed to add to itinerary.");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? "#121212" : "#EFE7FC" }]}>
      <View style={styles.container}>
        {/* Region Header with Arrow */}
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => setShowRegionPicker(true)}
        >
          <Text style={[styles.header, { color: isDarkMode ? "#FFF" : "#5A189A" }]}>
            Explore {selectedRegion}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={30} color={isDarkMode ? "#FFF" : "#5A189A"} />
        </TouchableOpacity>

        {/* Region Picker Modal */}
        <Modal
          visible={showRegionPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRegionPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Region</Text>
              <Picker
                selectedValue={selectedRegion}
                onValueChange={(itemValue) => {
                  setSelectedRegion(itemValue);
                  setShowRegionPicker(false);
                }}
                style={styles.picker}
              >
                {regions.map((region) => (
                  <Picker.Item label={region} value={region} key={region} />
                ))}
              </Picker>
              <Button
                mode="contained"
                onPress={() => setShowRegionPicker(false)}
                style={styles.closeButton}
                labelStyle={styles.buttonText}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>

        <FlatList
          data={attractions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedAttraction(item)}>
              <Card style={styles.cardContent}>
                <Card.Content>
                  <Text style={[styles.title, { color: isDarkMode ? "#FFF" : "#333" }]}>{item.name}</Text>
                  <Text style={[styles.description, { color: isDarkMode ? "#AAA" : "#555" }]}>{item.description}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />

        {/* Modal for Attraction Details */}
        {selectedAttraction && (
          <Modal animationType="slide" transparent={true} visible={!!selectedAttraction} onRequestClose={() => setSelectedAttraction(null)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image source={{ uri: selectedAttraction.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedAttraction.name}</Text>
                <Text style={styles.modalDescription}>{selectedAttraction.description}</Text>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={() => setShowAddModal(true)}
                    style={styles.itineraryButton}
                    labelStyle={styles.buttonText}
                  >
                    Add to Itinerary
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => setSelectedAttraction(null)}
                    style={styles.closeButton}
                    labelStyle={styles.buttonText}
                  >
                    Close
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Modal for Date and Time Picker */}
        {showAddModal && (
          <Modal animationType="slide" transparent={true} visible={showAddModal} onRequestClose={() => setShowAddModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Schedule {selectedAttraction?.name}</Text>

                {/* Date Picker Button */}
                <Button
                  mode="contained"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.button}
                  labelStyle={styles.buttonText}
                >
                  Pick Date
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) setSelectedDate(date);
                    }}
                  />
                )}

                {/* Time Picker Button */}
                <Button
                  mode="contained"
                  onPress={() => setShowTimePicker(true)}
                  style={styles.button}
                  labelStyle={styles.buttonText}
                >
                  Pick Time
                </Button>
                {showTimePicker && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="clock"
                    onChange={(event, time) => {
                      setShowTimePicker(false);
                      if (time) setSelectedTime(time);
                    }}
                  />
                )}

                {/* Display Selected Date and Time */}
                <Text style={styles.dateTimeText}>
                  📅 {selectedDate.toDateString()} 🕒 {selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                </Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={addToItinerary}
                    style={styles.itineraryButton}
                    labelStyle={styles.buttonText}
                  >
                    Confirm
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => setShowAddModal(false)}
                    style={styles.closeButton}
                    labelStyle={styles.buttonText}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#E6D6FF",
    borderRadius: 10,
    width: "90%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    flex: 1,
    width: "90%",
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  card: { 
    marginVertical: 8,
    width: "100%",
  },
  cardContent: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 5,
  },
  description: { 
    fontSize: 14, 
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#5A189A", 
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#333", 
    marginBottom: 20,
  },
  dateTimeText: { 
    fontSize: 16, 
    textAlign: "center", 
    marginVertical: 10, 
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  button: {
    backgroundColor: "#6200EE",
    width: "100%",
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  itineraryButton: {
    backgroundColor: "#28A745",
    width: "100%",
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: "#5A189A",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: { fontSize: 16 },
  picker: {
    width: "100%",
    height: 200,
    color: "#333",
    marginBottom: 20,
  },
});
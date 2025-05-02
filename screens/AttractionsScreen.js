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
    { id: "1", name: "Sarawak Cultural Village", description: "Cultural heritage center.", image: require("../assets/images/attractions/sarawak_cultural_village.jpg")},
    { id: "2", name: "Semenggoh Wildlife Centre", description: "Orangutan sanctuary.", image: require("../assets/images/attractions/semenggoh.jpg") },
    { id: "3", name: "Kuching Waterfront", description: "Scenic riverside area.", image: require("../assets/images/attractions/kuching_waterfront.jpg") },
    { id: "4", name: "Cat Museum", description: "Museum dedicated to cats.", image: require("../assets/images/attractions/cat_museum.jpg") },
    { id: "5", name: "Fort Margherita", description: "Historic fort.", image: require("../assets/images/attractions/fort_margherita.jpg") },
    { id: "6", name: "Bako National Park", description: "National park with trails.", image: require("../assets/images/attractions/bako_np.jpg") },
  ],
  Miri: [
    { id: "7", name: "Niah Caves", description: "Ancient caves.", image: require("../assets/images/attractions/niah_caves.jpg") },
    { id: "8", name: "Coco Cabana", description: "Iconic seafront structure.", image: require("../assets/images/attractions/coco_cabana.jpg") },
    { id: "9", name: "Tusan Beach", description: "Beach with blue tears.", image: require("../assets/images/attractions/tusan_beach.jpg") },
    { id: "10", name: "Lambir Hills", description: "National park.", image: require("../assets/images/attractions/lambir.jpg") },
    { id: "11", name: "Canada Hill", description: "Hilltop view & museum.", image: require("../assets/images/attractions/canada_hill.jpg") },
    { id: "12", name: "Miri City Fan", description: "Urban park.", image: require("../assets/images/attractions/miri_city_fan.jpg") },
  ],
  Sibu: [
    { id: "13", name: "Tua Pek Kong Temple", description: "Old Chinese temple.", image: require("../assets/images/attractions/tua_pek_kong_sibu.jpg") },
    { id: "14", name: "Sibu Night Market", description: "Food and goods market.", image: require("../assets/images/attractions/sibu_night_market.jpg") },
    { id: "15", name: "Bukit Lima Park", description: "Forest trail.", image: require("../assets/images/attractions/bukit_lima.jpg") },
    { id: "16", name: "Rejang Esplanade", description: "Riverside walk.", image: require("../assets/images/attractions/rejang_esplanade.jpg") },
    { id: "17", name: "Wisma Sanyan", description: "Tallest building in Sibu.", image: require("../assets/images/attractions/wisma_sanyan.jpg") },
    { id: "18", name: "Sibu Heritage Centre", description: "Museum of Sibu's history.", image: require("../assets/images/attractions/sibu_heritage.jpg") },
  ],
  Bintulu: [
    { id: "19", name: "Similajau National Park", description: "Beach and jungle park.", image: require("../assets/images/attractions/similajau.jpg") },
    { id: "20", name: "Tanjung Batu Beach", description: "Popular beach.", image: require("../assets/images/attractions/tanjung_batu.jpg") },
    { id: "21", name: "Council Negeri Monument", description: "Historic monument.", image: require("../assets/images/attractions/monument_bintulu.jpg") },
    { id: "22", name: "Bintulu Waterfront", description: "Leisure park.", image: require("../assets/images/attractions/bintulu_waterfront.jpg") },
    { id: "23", name: "Bintulu Tamu", description: "Local market.", image: require("../assets/images/attractions/bintulu_tamu.jpg") },
    { id: "24", name: "Assyakirin Mosque", description: "Grand mosque in town.", image: require("../assets/images/attractions/assyakirin.jpg") },
  ],
  Bau: [
    { id: "25", name: "Fairy Cave", description: "Limestone cave.", image: require("../assets/images/attractions/fairy_cave.jpg") },
    { id: "26", name: "Wind Cave", description: "Bat-filled cave.", image: require("../assets/images/attractions/wind_cave.jpg") },
    { id: "27", name: "Tasik Biru", description: "Scenic blue lake.", image: require("../assets/images/attractions/tasik_biru.jpg") },
  ],
  Serian: [
    { id: "28", name: "Ranchan Waterfall", description: "Picnic & waterfall area.", image: require("../assets/images/attractions/ranchan.jpg") },
  ],
  Lundu: [
    { id: "29", name: "Gunung Gading", description: "Rafflesia flower park.", image: require("../assets/images/attractions/gunung_gading.jpg") },
    { id: "30", name: "Pandan Beach", description: "Scenic beach.", image: require("../assets/images/attractions/pandan_beach.jpg") },
  ],
  Sematan: [
    { id: "31", name: "Sematan Beach", description: "Long sandy beach.", image: require("../assets/images/attractions/sematan_beach.jpg") },
    { id: "32", name: "Telok Melano", description: "Coastal village.", image: require("../assets/images/attractions/telok_melano.jpg") },
  ],
  Betong: [
    { id: "33", name: "Fort Lily", description: "Historical site.", image: require("../assets/images/attractions/fort_lily.jpg") },
  ],
  Mukah: [
    { id: "34", name: "Kuala Mukah Beach", description: "Black sand beach.", image: require("../assets/images/attractions/kuala_mukah.jpg") },
    { id: "35", name: "Melanau Tall House", description: "Cultural house.", image: require("../assets/images/attractions/melanau_tallhouse.jpg") },
  ],
  Limbang: [
    { id: "36", name: "Bukit Mas", description: "Town hill view.", image: require("../assets/images/attractions/bukit_mas.jpg") },
  ],
  Lawas: [
    { id: "37", name: "Punang Beach", description: "Peaceful beach.", image: require("../assets/images/attractions/punang_beach.jpg") },
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
                <Image source={selectedAttraction.image} style={styles.modalImage} />
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
  paddingTop: 20,
  backgroundColor: "#F4ECFF", // optional for better bg
},
  headerContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 10,
  marginBottom: 10,
  width: "100%",
  paddingHorizontal: 16,
},
  headerButtonContainer: {
  backgroundColor: "#E6D6FF", // 紫色只在按钮背景
  borderRadius: 10,
  paddingHorizontal: 20,
  paddingVertical: 8,
  borderWidth: 1,           // ✅ Add this
  borderColor: "red",
  minWidth: 100,            // ✅ Add this
  alignItems: "center",
},
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
   flex: 1,
   paddingHorizontal: 16,
   },
  listContent: {
   paddingVertical: 10,
   paddingBottom: 20,
   },

  card: {
  marginVertical: 8,
  width: "90%",
  maxWidth: 320,
  alignSelf: "center", // Center it within list container
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
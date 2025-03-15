import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../ThemeContext"; // For dark mode
import { Picker } from '@react-native-picker/picker';

// Attractions Data with Coordinates
const attractionsData = {
  Kuching: [
    { id: "1", name: "Mount Santubong", latitude: 1.75, longitude: 110.32, description: "A majestic mountain with hiking trails.", image: "https://via.placeholder.com/150" },
    { id: "2", name: "Bako National Park", latitude: 1.72, longitude: 110.48, description: "Home to stunning beaches and wildlife.", image: "https://via.placeholder.com/150" },
    { id: "3", name: "Sarawak Cultural Village", latitude: 1.754, longitude: 110.311, description: "A living museum showcasing Sarawak's ethnic cultures.", image: "https://via.placeholder.com/150" },
    { id: "4", name: "Semenggoh Wildlife Centre", latitude: 1.353, longitude: 110.279, description: "Home to rescued orangutans in their natural habitat.", image: "https://via.placeholder.com/150" },
    { id: "5", name: "The Astana", latitude: 1.557, longitude: 110.344, description: "A historical palace overlooking the Sarawak River.", image: "https://via.placeholder.com/150" },
  ],
  Miri: [
    { id: "6", name: "Niah Caves", latitude: 3.80, longitude: 113.77, description: "Prehistoric cave paintings and large chambers.", image: "https://via.placeholder.com/150" },
    { id: "7", name: "Mulu National Park", latitude: 4.05, longitude: 114.80, description: "UNESCO site with caves and rainforest.", image: "https://via.placeholder.com/150" },
    { id: "8", name: "Coco Cabana", latitude: 4.399, longitude: 113.993, description: "A seaside spot for sunsets and relaxation.", image: "https://via.placeholder.com/150" },
    { id: "9", name: "Tusan Beach", latitude: 4.204, longitude: 113.982, description: "Famous for the 'Blue Tears' phenomenon.", image: "https://via.placeholder.com/150" },
  ],
  Sibu: [
    { id: "10", name: "Sibu Central Market", latitude: 2.29, longitude: 111.83, description: "One of the largest markets in Malaysia.", image: "https://via.placeholder.com/150" },
    { id: "11", name: "Tua Pek Kong Temple", latitude: 2.285, longitude: 111.825, description: "A historic Chinese temple with great views.", image: "https://via.placeholder.com/150" },
    { id: "12", name: "Sibu Heritage Centre", latitude: 2.285, longitude: 111.825, description: "Learn about Sibu's rich cultural history.", image: "https://via.placeholder.com/150" },
  ],
  Bintulu: [
    { id: "13", name: "Similajau National Park", latitude: 3.38, longitude: 113.22, description: "Golden sandy beaches and jungle trails.", image: "https://via.placeholder.com/150" },
    { id: "14", name: "Tumbina Park", latitude: 3.17, longitude: 113.03, description: "Mini zoo and botanical garden with a great view.", image: "https://via.placeholder.com/150" },
  ],
  Bau: [
    { id: "15", name: "Fairy Cave", latitude: 1.392, longitude: 110.141, description: "A large cave with stunning formations.", image: "https://via.placeholder.com/150" },
    { id: "16", name: "Wind Cave", latitude: 1.406, longitude: 110.154, description: "A beautiful cave known for its breeze and swiftlets.", image: "https://via.placeholder.com/150" },
  ],
  Serian: [
    { id: "17", name: "Ranchan Waterfall", latitude: 1.175, longitude: 110.567, description: "A refreshing waterfall perfect for picnics.", image: "https://via.placeholder.com/150" },
  ],
  Lundu: [
    { id: "18", name: "Pandan Beach", latitude: 1.672, longitude: 109.978, description: "A peaceful beach with golden sands.", image: "https://via.placeholder.com/150" },
    { id: "19", name: "Gunung Gading National Park", latitude: 1.693, longitude: 109.879, description: "Famous for the world's largest flower, the Rafflesia.", image: "https://via.placeholder.com/150" },
  ],
  Sematan: [
    { id: "20", name: "Sematan Beach", latitude: 1.832, longitude: 109.772, description: "A long, serene beach with clear waters.", image: "https://via.placeholder.com/150" },
  ],
  Betong: [
    { id: "21", name: "Batu Nabau", latitude: 1.489, longitude: 111.425, description: "A rock formation with mystical legends.", image: "https://via.placeholder.com/150" },
  ],
  Mukah: [
    { id: "22", name: "Kaul Festival Site", latitude: 2.906, longitude: 112.097, description: "A cultural site celebrating the Melanau people’s traditions.", image: "https://via.placeholder.com/150" },
  ],
  Limbang: [
    { id: "23", name: "Pulong Tau National Park", latitude: 4.49, longitude: 115.38, description: "Remote rainforest with rich biodiversity.", image: "https://via.placeholder.com/150" },
  ],
  Lawas: [
    { id: "24", name: "Merarap Hot Springs", latitude: 4.589, longitude: 115.416, description: "A natural hot spring in a peaceful forest setting.", image: "https://via.placeholder.com/150" },
  ],
  Kapuas_Hulu: [
    { id: "25", name: "Betung Kerihun National Park", latitude: 0.883, longitude: 113.95, description: "A conservation area with diverse wildlife.", image: "https://via.placeholder.com/150" },
  ],
};

const cityColors = {
  Kuching: "red",
  Miri: "green",
  Sibu: "blue",
  Bintulu: "orange",
  Bau: "purple",
  Serian: "pink",
  Lundu: "yellow",
  Sematan: "cyan",
  Betong: "brown",
  Mukah: "teal",
  Limbang: "violet",
  Lawas: "gold",
  Kapuas_Hulu: "indigo",
};

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState(route.params?.region || "Kuching");
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);
  const attractions = attractionsData[selectedRegion] || [];

  // Get User Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  // Animate map to the selected region whenever it changes
  useEffect(() => {
    if (attractions.length > 0 && mapRef.current) {
      // Calculate the average coordinates of all attractions in the selected region
      const avgLatitude = attractions.reduce((sum, attr) => sum + attr.latitude, 0) / attractions.length;
      const avgLongitude = attractions.reduce((sum, attr) => sum + attr.longitude, 0) / attractions.length;

      // Animate the map to the average coordinates of the selected region
      mapRef.current.animateToRegion({
        latitude: avgLatitude,
        longitude: avgLongitude,
        latitudeDelta: 0.1, // Adjust zoom level (smaller value = more zoomed in)
        longitudeDelta: 0.3,
      }, 500); // Animation duration in milliseconds
    }
  }, [selectedRegion, attractions]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#EFE7FC" }]}>
      <Picker
        selectedValue={selectedRegion}
        onValueChange={(itemValue) => setSelectedRegion(itemValue)}
        style={styles.picker}
      >
        {Object.keys(attractionsData).map((region) => (
          <Picker.Item key={region} label={region} value={region} />
        ))}
      </Picker>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: attractions.length > 0 ? attractions[0].latitude : 1.55,
          longitude: attractions.length > 0 ? attractions[0].longitude : 110.35,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} title="You are here" pinColor="black" />
        )}

        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            coordinate={{ latitude: attraction.latitude, longitude: attraction.longitude }}
            title={attraction.name}
            pinColor={cityColors[selectedRegion] || "red"}
            onPress={() => {
              console.log("Navigating to:", attraction.name);
              navigation.navigate("AttractionDetails", { 
                name: attraction.name,
                description: attraction.description,
                image: attraction.image || null,
              });
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  picker: { height: 50, width: "100%", backgroundColor: "#FFF", marginBottom: 10 },
  map: { flex: 1, borderRadius: 10, overflow: "hidden" },
});
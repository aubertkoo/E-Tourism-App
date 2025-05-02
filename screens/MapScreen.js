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
    { id: "1", name: "Sarawak Cultural Village", latitude: 1.749794, longitude: 110.316808, description: "Cultural heritage center.", image: require("../assets/images/attractions/sarawak_cultural_village.jpg") },
    { id: "2", name: "Semenggoh Wildlife Centre", latitude: 1.3997, longitude: 110.3242, description: "Orangutan sanctuary.", image: require("../assets/images/attractions/semenggoh.jpg") },
    { id: "3", name: "Kuching Waterfront", latitude: 1.553110, longitude: 110.345032, description: "Scenic riverside area.", image: require("../assets/images/attractions/kuching_waterfront.jpg") },
    { id: "4", name: "Cat Museum", latitude: 1.586611, longitude: 110.334306, description: "Museum dedicated to cats.", image: require("../assets/images/attractions/cat_museum.jpg") },
    { id: "5", name: "Fort Margherita", latitude: 1.561217, longitude: 110.349402, description: "Historic fort.", image: require("../assets/images/attractions/fort_margherita.jpg") },
    { id: "6", name: "Bako National Park", latitude: 1.717, longitude: 110.4667, description: "National park with trails.", image: require("../assets/images/attractions/bako_np.jpg") },
  ],
  Miri: [
    { id: "7", name: "Niah Caves", latitude: 3.81667, longitude: 113.78333, description: "Ancient caves.", image: require("../assets/images/attractions/niah_caves.jpg") },
    { id: "8", name: "Coco Cabana", latitude: 4.3796, longitude: 113.9781, description: "Iconic seafront structure.", image: require("../assets/images/attractions/coco_cabana.jpg") },
    { id: "9", name: "Tusan Beach", latitude: 4.12504384231261, longitude: 113.82186762430977, description: "Beach with blue tears.", image: require("../assets/images/attractions/tusan_beach.jpg") },
    { id: "10", name: "Lambir Hills", latitude: 4.198322846740829, longitude: 114.04280862430988, description: "National park.", image: require("../assets/images/attractions/lambir.jpg") },
    { id: "11", name: "Canada Hill", latitude: 4.38709, longitude: 113.99267, description: "Hilltop view & museum.", image: require("../assets/images/attractions/canada_hill.jpg") },
    { id: "12", name: "Miri City Fan", latitude: 4.4029235595219065, longitude: 113.99338822431068, description: "Urban park.", image: require("../assets/images/attractions/miri_city_fan.jpg") },
  ],
  Sibu: [
    { id: "13", name: "Tua Pek Kong Temple", latitude: 2.28722, longitude: 111.82611, description: "Old Chinese temple.", image: require("../assets/images/attractions/tua_pek_kong_sibu.jpg") },
    { id: "14", name: "Sibu Night Market", latitude: 2.293, longitude: 111.8274, description: "Food and goods market.", image: require("../assets/images/attractions/sibu_night_market.jpg") },
    { id: "15", name: "Bukit Lima Park", latitude: 2.279180256771841, longitude: 111.8638483743049, description: "Forest trail.", image: require("../assets/images/attractions/bukit_lima.jpg") },
    { id: "16", name: "Rejang Esplanade", latitude: 2.2842, longitude: 111.8311, description: "Riverside walk.", image: require("../assets/images/attractions/rejang_esplanade.jpg") },
    { id: "17", name: "Wisma Sanyan", latitude: 2.2886, longitude: 111.8317, description: "Tallest building in Sibu.", image: require("../assets/images/attractions/wisma_sanyan.jpg") },
    { id: "18", name: "Sibu Heritage Centre", latitude: 2.2883, longitude: 111.8289, description: "Museum of Sibu's history.", image: require("../assets/images/attractions/sibu_heritage.jpg") },
  ],
  Bintulu: [
    { id: "19", name: "Similajau National Park", latitude: 3.345, longitude: 113.12, description: "Beach and jungle park.", image: require("../assets/images/attractions/similajau.jpg") },
    { id: "20", name: "Tanjung Batu Beach", latitude: 3.1687, longitude: 113.0362, description: "Popular beach.", image: require("../assets/images/attractions/tanjung_batu.jpg") },
    { id: "21", name: "Council Negeri Monument", latitude: 3.1705, longitude: 113.0346, description: "Historic monument.", image: require("../assets/images/attractions/monument_bintulu.jpg") },
    { id: "22", name: "Bintulu Waterfront", latitude: 3.1752, longitude: 113.0303, description: "Leisure park.", image: require("../assets/images/attractions/bintulu_waterfront.jpg") },
    { id: "23", name: "Bintulu Tamu", latitude: 3.1712, longitude: 113.0367, description: "Local market.", image: require("../assets/images/attractions/bintulu_tamu.jpg") },
    { id: "24", name: "Assyakirin Mosque", latitude: 3.1703, longitude: 113.0382, description: "Grand mosque in town.", image: require("../assets/images/attractions/assyakirin.jpg") },
  ],
  Bau: [
    { id: "25", name: "Fairy Cave", latitude: 1.4217, longitude: 110.0386, description: "Limestone cave.", image: require("../assets/images/attractions/fairy_cave.jpg") },
    { id: "26", name: "Wind Cave", latitude: 1.4125, longitude: 110.0275, description: "Bat-filled cave.", image: require("../assets/images/attractions/wind_cave.jpg") },
    { id: "27", name: "Tasik Biru", latitude: 1.4225, longitude: 110.0452, description: "Scenic blue lake.", image: require("../assets/images/attractions/tasik_biru.jpg") },
  ],
  Serian: [
    { id: "28", name: "Ranchan Waterfall", latitude: 1.2783, longitude: 110.562, description: "Picnic & waterfall area.", image: require("../assets/images/attractions/ranchan.jpg") },
  ],
  Lundu: [
    { id: "29", name: "Gunung Gading", latitude: 1.6833, longitude: 109.9833, description: "Rafflesia flower park.", image: require("../assets/images/attractions/gunung_gading.jpg") },
    { id: "30", name: "Pandan Beach", latitude: 1.6622, longitude: 110.0033, description: "Scenic beach.", image: require("../assets/images/attractions/pandan_beach.jpg") },
  ],
  Sematan: [
    { id: "31", name: "Sematan Beach", latitude: 1.6839, longitude: 109.7532, description: "Long sandy beach.", image: require("../assets/images/attractions/sematan_beach.jpg") },
    { id: "32", name: "Telok Melano", latitude: 1.6391, longitude: 109.5744, description: "Coastal village.", image: require("../assets/images/attractions/telok_melano.jpg") },
  ],
  Betong: [
    { id: "33", name: "Fort Lily", latitude: 1.4072, longitude: 111.5334, description: "Historical site.", image: require("../assets/images/attractions/fort_lily.jpg") },
  ],
  Mukah: [
    { id: "34", name: "Kuala Mukah Beach", latitude: 2.9006, longitude: 112.0924, description: "Black sand beach.", image: require("../assets/images/attractions/kuala_mukah.jpg") },
    { id: "35", name: "Melanau Tall House", latitude: 2.8947, longitude: 112.0936, description: "Cultural house.", image: require("../assets/images/attractions/melanau_tallhouse.jpg") },
  ],
  Limbang: [
    { id: "36", name: "Bukit Mas", latitude: 4.75, longitude: 115.0, description: "Town hill view.", image: require("../assets/images/attractions/bukit_mas.jpg") },
  ],
  Lawas: [
    { id: "37", name: "Punang Beach", latitude: 4.9167, longitude: 115.4, description: "Peaceful beach.", image: require("../assets/images/attractions/punang_beach.jpg") },
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
        latitudeDelta: 0.01, // Adjust zoom level (smaller value = more zoomed in)
        longitudeDelta: 0.1,
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
                image: attraction.image,
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
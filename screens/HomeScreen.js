import React from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground source={require("../assets/sarawak-bg.png")} style={[styles.background, { width, height }]}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Sarawak Explorer</Text>

        {/* Navigate to Attractions Screen Instead of Region Selection */}
        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("Attractions")}>
          View Attractions
        </Button>

        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("Map")}>
          View Map
        </Button>

        <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("Itinerary")}>
          My Itinerary
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a dark overlay for better readability
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginVertical: 10,
    width: 250,
    borderRadius: 10,
    backgroundColor: "#6a0dad", // Nice Purple Theme
  },
});

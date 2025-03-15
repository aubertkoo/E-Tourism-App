import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Back Icon

export default function AttractionDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { name, description, image } = route.params || {};

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {/* 📌 Attraction Info Card */}
      <View style={styles.card}>
        {/* 🖼️ Image (If available) */}
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}

        {/* 📌 Attraction Name */}
        <Text style={styles.title}>{name}</Text>

        {/* 📖 Description */}
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F0F2", // Soft Theme Color
    justifyContent: "center", // Centering the card
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  card: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 300, // 🔥 Make it longer
    justifyContent: "center", // Align content in center
  },
  image: {
    width: "100%",
    height: 180, // Bigger Image
    borderRadius: 10,
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: "#4B5563",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});

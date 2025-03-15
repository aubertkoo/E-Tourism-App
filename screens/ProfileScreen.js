import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useTheme } from "../ThemeContext";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const user = auth.currentUser;
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  // Load user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username || "");
        setPhone(data.phone || "");
      }
    };
    fetchUserProfile();
  }, [user]);

  // Save Profile Data
  const saveProfile = async () => {
    if (!user) {
      Alert.alert(t("error") || "Error", t("no_user") || "No user is logged in.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { username, phone }, { merge: true });

      Alert.alert(
        t("success") || "Success",
        t("profile_saved") || "Profile Updated!",
        [{ text: t("ok") || "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Save Profile Error:", error);
      Alert.alert(
        t("error") || "Error",
        t("failed_to_update_profile") || "Failed to update profile."
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#F5EFFF" }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? "#D1B3FF" : "#6D28D9" }]}>
          {t("my_profile") || "My Profile"}
        </Text>

        {/* Username Input */}
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#FFF", color: isDarkMode ? "#FFF" : "#333" }]}
          placeholder={t("enter_username") || "Enter Username"}
          placeholderTextColor={isDarkMode ? "#AAA" : "#999"}
          value={username}
          onChangeText={setUsername}
        />

        {/* Phone Number Input */}
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? "#333" : "#FFF", color: isDarkMode ? "#FFF" : "#333" }]}
          placeholder={t("enter_phone_number") || "Enter Phone Number"}
          placeholderTextColor={isDarkMode ? "#AAA" : "#999"}
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveText}>{t("save_profile") || "Save Profile"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20, // Keep padding as 20 for the content below
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40, // Added to move the title down from the top
    marginBottom: 20, // Reduced to control spacing below the title
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#8A4AF3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
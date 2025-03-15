import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { changeLanguage, loadLanguage } from "../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

// Define static styles outside the component
const staticStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  background: {
    backgroundColor: "#f9f9f9",
    ...(Platform.OS === "ios" || Platform.OS === "android" ? {
      backgroundImage: "linear-gradient(to bottom right, #e0e7ff, #d0efff)",
    } : {}),
  },
  profileCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    backgroundColor: "linear-gradient(135deg, #e0e0e0, #ffffff)",
    ...(Platform.OS === "ios" ? {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    } : {
      elevation: 5,
    }),
  },
  profileIconContainer: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileIcon: { borderRadius: 50 },
  profileEmail: { fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 15 },
  editProfileButton: {
    backgroundColor: "#6a0dad",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
  },
  editProfileText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  settingsTitle: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 25 },
  settingsList: { gap: 15 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  settingText: { fontSize: 16, fontWeight: "500" },
  languageButton: { backgroundColor: "#6a0dad" },
  logoutButton: { backgroundColor: "#FF5733" },
  clearCacheButton: { backgroundColor: "#3498db" },
  versionText: { fontSize: 14, textAlign: "center", marginTop: 30 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", padding: 20, borderRadius: 15, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "600", marginBottom: 20 },
  modalButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  modalCancel: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancelText: { fontSize: 16, fontWeight: "500" },
});

// Wrapper component to manage local state
const SettingsWrapper = ({ route, navigation }) => {
  const { isDarkMode: initialIsDarkMode, setIsDarkMode } = route.params;
  const [localIsDarkMode, setLocalIsDarkMode] = useState(initialIsDarkMode);

  useEffect(() => {
    setLocalIsDarkMode(initialIsDarkMode); // Sync with prop changes
  }, [initialIsDarkMode]);

  const handleToggleDarkMode = (value) => {
    console.log("Toggling dark mode to:", value);
    setIsDarkMode(value); // Update the parent state
    setLocalIsDarkMode(value); // Update local state
  };

  return (
    <SettingsContent
      isDarkMode={localIsDarkMode}
      setIsDarkMode={handleToggleDarkMode}
      navigation={navigation}
    />
  );
};

// Content component with dynamic styles
const SettingsContent = ({ isDarkMode, setIsDarkMode, navigation }) => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userEmail, setUserEmail] = useState(auth.currentUser?.email || "Guest");
  const appVersion = "1.0.0";

  console.log("Theme props in SettingsScreen:", { isDarkMode, setIsDarkMode });

  useEffect(() => {
    loadLanguage().then(() => setCurrentLang(i18n.language));
  }, []);

  const switchLanguage = async (lang) => {
    await changeLanguage(lang);
    setCurrentLang(lang);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out, navigation handled by App.js");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Cache Cleared", "App cache has been successfully cleared!");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  // Dynamic styles based on isDarkMode (moved here)
  const dynamicStyles = {
    settingItem: {
      borderRadius: 12,
      padding: 15,
      elevation: 2,
      backgroundColor: isDarkMode ? "#2c2c3e" : "#f0f0f5",
      marginBottom: 10,
    },
  };

  return (
    <View style={[staticStyles.container, staticStyles.background, { backgroundColor: isDarkMode ? "#1a1a2e" : "#f9f9f9" }]}>
      <ScrollView contentContainerStyle={staticStyles.scrollContainer}>
        {/* User Profile Section */}
        <View style={[staticStyles.profileCard, { backgroundColor: isDarkMode ? "#222" : "#ffffff" }]}>
          <View style={staticStyles.profileIconContainer}>
            <MaterialIcons
              name="account-circle"
              size={100}
              color={isDarkMode ? "#b19cd9" : "#6a0dad"}
              style={staticStyles.profileIcon}
            />
          </View>
          <Text style={[staticStyles.profileEmail, { color: isDarkMode ? "#d1c4e9" : "#333" }]}>
            {userEmail}
          </Text>
          <TouchableOpacity
            style={staticStyles.editProfileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={staticStyles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Title */}
        <Text style={[staticStyles.settingsTitle, { color: isDarkMode ? "#d1c4e9" : "#6a0dad" }]}>
          {t("settings")}
        </Text>

        {/* Settings Options */}
        <View style={staticStyles.settingsList}>
          {/* Dark Mode Toggle */}
          <TouchableOpacity style={dynamicStyles.settingItem} activeOpacity={0.8}>
            <View style={staticStyles.settingRow}>
              <Text style={[staticStyles.settingText, { color: isDarkMode ? "#d1c4e9" : "#333" }]}>
                {t("dark_mode")}
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#d1c4e9", true: "#6a0dad" }}
                thumbColor={isDarkMode ? "#d1c4e9" : "#6a0dad"}
              />
            </View>
          </TouchableOpacity>

          {/* Notifications Toggle */}
          <TouchableOpacity style={dynamicStyles.settingItem} activeOpacity={0.8}>
            <View style={staticStyles.settingRow}>
              <Text style={[staticStyles.settingText, { color: isDarkMode ? "#d1c4e9" : "#333" }]}>
                Notifications
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                trackColor={{ false: "#d1c4e9", true: "#6a0dad" }}
                thumbColor={notificationsEnabled ? "#d1c4e9" : "#6a0dad"}
              />
            </View>
          </TouchableOpacity>

          {/* Language Selection Button */}
          <TouchableOpacity
            style={[dynamicStyles.settingItem, staticStyles.languageButton]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={staticStyles.settingRow}>
              <Text style={[staticStyles.settingText, { color: isDarkMode ? "#fff" : "#fff" }]}>
                {t("language")}: {currentLang === "en" ? "English" : "中文"}
              </Text>
              <MaterialIcons name="language" size={20} color={isDarkMode ? "#fff" : "#fff"} />
            </View>
          </TouchableOpacity>

          {/* Clear Cache Button */}
          <TouchableOpacity
            style={[dynamicStyles.settingItem, staticStyles.clearCacheButton]}
            onPress={clearCache}
            activeOpacity={0.8}
          >
            <View style={staticStyles.settingRow}>
              <Text style={[staticStyles.settingText, { color: isDarkMode ? "#fff" : "#fff" }]}>
                Clear App Cache
              </Text>
              <MaterialIcons name="delete" size={20} color={isDarkMode ? "#fff" : "#fff"} />
            </View>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[dynamicStyles.settingItem, staticStyles.logoutButton]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={staticStyles.settingRow}>
              <Text style={[staticStyles.settingText, { color: isDarkMode ? "#fff" : "#fff" }]}>
                {t("logout")}
              </Text>
              <MaterialIcons name="logout" size={20} color={isDarkMode ? "#fff" : "#fff"} />
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={[staticStyles.versionText, { color: isDarkMode ? "#aaa" : "#666" }]}>
          App Version: {appVersion}
        </Text>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={staticStyles.modalBackground}>
          <View style={[staticStyles.modalContent, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
            <Text style={[staticStyles.modalTitle, { color: isDarkMode ? "#d1c4e9" : "#6a0dad" }]}>
              {t("select_language")}
            </Text>
            <Pressable
              style={[staticStyles.modalButton, { backgroundColor: isDarkMode ? "#4a148c" : "#6a0dad" }]}
              onPress={() => switchLanguage("en")}
            >
              <Text style={staticStyles.modalButtonText}>English</Text>
            </Pressable>
            <Pressable
              style={[staticStyles.modalButton, { backgroundColor: isDarkMode ? "#4a148c" : "#6a0dad" }]}
              onPress={() => switchLanguage("zh")}
            >
              <Text style={staticStyles.modalButtonText}>中文</Text>
            </Pressable>
            <Pressable
              style={[staticStyles.modalCancel, { backgroundColor: isDarkMode ? "#666" : "#ccc" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[staticStyles.modalCancelText, { color: isDarkMode ? "#fff" : "#333" }]}>
                {t("cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsWrapper;
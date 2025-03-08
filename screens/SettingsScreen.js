import React from "react";
import { View, Text, Button } from "react-native";
import { auth } from "../firebaseConfig";

const SettingsScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Settings</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default SettingsScreen;

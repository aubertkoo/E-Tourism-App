import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Account created!");
      navigation.navigate("Login"); // Redirect to login
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button mode="contained" style={styles.button} onPress={handleRegister}>
        Register
      </Button>

      <Button mode="text" onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F1FA",
  },
  logo: {
    width: 150,
    height: 150,
	resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import Logo from 'C:/Users/User/E-Tourism-App/assets/logo.png';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
	  <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Welcome to E-Tourism Sarawak!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
  width: 150,  // Adjust size as needed
  height: 150, // Adjust size as needed
  marginBottom: 20,
  resizeMode: 'contain' 
  },

});
 

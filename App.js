import React, { useState, useEffect } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";

// Import Screens
import HomeScreen from "./screens/HomeScreen";
import AttractionsScreen from "./screens/AttractionsScreen";
import MapScreen from "./screens/MapScreen";
import ItineraryScreen from "./screens/ItineraryScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AttractionDetails from "./screens/AttractionDetails";

// Import i18n for language loading
import { loadLanguage } from "./i18n";

// Import ThemeContext (kept for potential future use)
import { ThemeProvider } from "./ThemeContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigation for Main Screens
function MainTabs({ isDarkMode, setIsDarkMode }) {
  console.log("MainTabs rendering with isDarkMode:", isDarkMode); // Debug rendering
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Attractions":
              iconName = "place";
              break;
            case "Map":
              iconName = "map";
              break;
            case "Itinerary":
              iconName = "event-note";
              break;
            case "Settings":
              iconName = "settings";
              break;
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6a0dad",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Attractions" component={AttractionsScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Itinerary" component={ItineraryScreen} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{ isDarkMode, setIsDarkMode }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === "dark");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadLanguage();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log("Auth state changed:", user ? "User logged in" : "User logged out");
          setUser(user);
          setIsLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("App initialization failed:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9" }}>
        <Text style={{ fontSize: 18, color: "#333" }}>Loading...</Text>
      </View>
    );
  }

  const handleDarkModeToggle = (value) => {
    console.log("Setting dark mode to:", value); // Log the intended change
    setIsDarkMode(value);
  };

  console.log("Theme state in App.js:", { isDarkMode }); // Log current state

  return (
    <ThemeProvider value={{ isDarkMode, setIsDarkMode }}>
      <PaperProvider theme={isDarkMode ? MD3DarkTheme : MD3LightTheme}>
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              <>
                <Stack.Screen
                  name="Main"
                  children={() => <MainTabs isDarkMode={isDarkMode} setIsDarkMode={handleDarkModeToggle} />}
                />
                <Stack.Screen name="Attractions" component={AttractionsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="AttractionDetails" component={AttractionDetails} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeProvider>
  );
}
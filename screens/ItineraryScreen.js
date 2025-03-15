import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import { Button } from "react-native-paper";
import { useTheme } from "../ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ItineraryScreen({ navigation }) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [plans, setPlans] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tripDescription, setTripDescription] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDate, setEditedDate] = useState(new Date());
  const [editedTime, setEditedTime] = useState(new Date());

  const loadItinerary = async () => {
    try {
      const savedPlans = await AsyncStorage.getItem("itinerary");
      if (savedPlans) {
        const parsedPlans = JSON.parse(savedPlans);
        setPlans(parsedPlans);
        console.log("Loaded plans:", parsedPlans);
      } else {
        setPlans([]);
        console.log("No plans found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error loading itinerary:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadItinerary();
    }, [])
  );

  const saveItinerary = async (newPlans) => {
    try {
      await AsyncStorage.setItem("itinerary", JSON.stringify(newPlans));
      console.log("Saved plans:", newPlans);
    } catch (error) {
      console.error("Error saving itinerary:", error);
    }
  };

  const addPlan = () => {
    if (tripDescription.trim() === "") {
      Alert.alert(t("error") || "Error", t("trip_description_required") || "Trip description is required");
      return;
    }

    const formattedDate = date.toDateString();
    const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    const newPlan = {
      id: Date.now().toString(),
      date: formattedDate,
      time: formattedTime,
      description: tripDescription,
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    saveItinerary(updatedPlans);
    setTripDescription("");
    setShowDetailsModal(false);
  };

  const deletePlan = async (id) => {
    const updatedPlans = plans.filter((plan) => plan.id !== id);
    setPlans(updatedPlans);
    await saveItinerary(updatedPlans);
    setSelectedPlan(null);
    Alert.alert(
      t("deleted") || "Deleted",
      t("itinerary_item_removed") || "Itinerary Item Removed"
    );
  };

  const updatePlan = async () => {
    if (!selectedPlan) return;

    const formattedDate = editedDate.toDateString();
    const formattedTime = editedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    const updatedPlans = plans.map((plan) =>
      plan.id === selectedPlan.id
        ? { ...plan, date: formattedDate, time: formattedTime }
        : plan
    );
    setPlans(updatedPlans);
    await saveItinerary(updatedPlans);
    setEditMode(false);
    setSelectedPlan(null);
    Alert.alert(
      t("updated") || "Updated",
      t("itinerary_item_updated") || "The itinerary item has been updated"
    );
  };

  const selectPlanForEdit = (plan) => {
    setSelectedPlan(plan);
    setEditedDate(new Date(plan.date));
    const timeParts = plan.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeParts) {
      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const period = timeParts[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      const parsedTime = new Date();
      parsedTime.setHours(hours, minutes, 0, 0);
      setEditedTime(parsedTime);
    } else {
      setEditedTime(new Date());
    }
    setEditMode(true);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="event-busy" size={50} color={isDarkMode ? "#666" : "#D1B3FF"} />
      <Text style={[styles.emptyText, { color: isDarkMode ? "#AAA" : "#8A4AF3" }]}>
        {t("no_plans") || "No Plans"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? "#1A1A2E" : "#F5EFFF" }]}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <MaterialIcons name="place" size={24} color="#D81B60" style={styles.icon} />
          <Text style={[styles.title, { color: isDarkMode ? "#D1B3FF" : "#6D28D9" }]}>
            {t("my_itinerary") || "My Itinerary"}
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <TouchableOpacity style={styles.button} onPress={() => setShowDetailsModal(true)}>
            <Text style={styles.buttonText}>{t("enter_trip_details") || "Enter Trip Details"}</Text>
          </TouchableOpacity>
        </View>

        {/* Plans List */}
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectPlanForEdit(item)} style={[styles.planItem, { backgroundColor: isDarkMode ? "#2E2E44" : "#EDE9FE" }]}>
              <View style={styles.planContent}>
                <Text style={[styles.planDate, { color: isDarkMode ? "#D1B3FF" : "#D81B60" }]}>
                  📅 {item.date}
                </Text>
                <Text style={[styles.planDate, { color: isDarkMode ? "#D1B3FF" : "#D81B60" }]}>
                  🕒 {item.time}
                </Text>
                <Text style={[styles.planDescription, { color: isDarkMode ? "#FFF" : "#4C1D95" }]}>
                  📍 {item.name ? `${item.name}${item.region ? `, ${item.region}` : ""}` : item.description}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deletePlan(item.id)} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={24} color="#FFF" />
                <Text style={styles.deleteButtonText}>{t("delete") || "Delete"}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
        />

        {/* Details Modal */}
        <Modal visible={showDetailsModal} animationType="slide" transparent={true} onRequestClose={() => setShowDetailsModal(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: isDarkMode ? "#2E2E44" : "#FFF" }]}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? "#D1B3FF" : "#6D28D9" }]}>
                {t("enter_trip_details") || "Enter Trip Details"}
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? "#3A3A52" : "#F5EFFF", color: isDarkMode ? "#FFF" : "#4C1D95" }]}
                placeholder={t("enter_trip") || "Where do you want to go?"}
                placeholderTextColor={isDarkMode ? "#AAA" : "#8A4AF3"}
                value={tripDescription}
                onChangeText={setTripDescription}
                multiline
              />

              <View style={styles.dateTimeContainer}>
                <Text style={[styles.dateText, { color: isDarkMode ? "#D1B3FF" : "#D81B60" }]}>
                  📅 {date.toDateString()}
                </Text>
                <Text style={[styles.dateText, { color: isDarkMode ? "#D1B3FF" : "#D81B60" }]}>
                  🕒 {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                </Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>{t("pick_date") || "Pick a Date"}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.buttonText}>{t("pick_time") || "Pick a Time"}</Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="clock"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) setTime(selectedTime);
                  }}
                />
              )}

              <View style={styles.modalButtons}>
                <Button mode="contained" onPress={() => setShowDetailsModal(false)} style={[styles.closeButton, { marginRight: 5 }]}>
                  {t("cancel") || "Cancel"}
                </Button>
                <Button mode="contained" onPress={addPlan} style={[styles.saveButton, { marginLeft: 5 }]} disabled={!tripDescription}>
                  {t("save") || "Save"}
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Modal */}
        {editMode && selectedPlan && (
          <Modal visible={true} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: isDarkMode ? "#2E2E44" : "#FFF" }]}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? "#D1B3FF" : "#6D28D9" }]}>
                  {t("edit_trip") || "Edit Trip"}
                </Text>
                <Text style={[styles.modalText, { color: isDarkMode ? "#DDD" : "#4C1D95", fontWeight: "500" }]}>
                  {t("current_trip") || "Current Trip"}: 📍 {selectedPlan.name ? `${selectedPlan.name}${selectedPlan.region ? `, ${selectedPlan.region}` : ""}` : selectedPlan.description}
                </Text>
                <View style={styles.dateTimeContainer}>
                  <Text style={[styles.modalText, { color: isDarkMode ? "#D1B3FF" : "#D81B60", fontWeight: "500" }]}>
                    {t("current_date") || "Current Date"}: 📅 {editedDate.toDateString()}
                  </Text>
                  <Text style={[styles.modalText, { color: isDarkMode ? "#D1B3FF" : "#D81B60", fontWeight: "500" }]}>
                    🕒 {editedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.buttonText}>{t("edit_date") || "Edit Date"}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={editedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setEditedDate(selectedDate);
                    }}
                  />
                )}

                <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.buttonText}>{t("edit_time") || "Edit Time"}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={editedTime}
                    mode="time"
                    display="clock"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) setEditedTime(selectedTime);
                    }}
                  />
                )}

                <View style={styles.editModalButtons}>
                  <Button mode="contained" onPress={updatePlan} style={[styles.closeButton, { marginRight: 10 }]}>
                    <Text style={styles.buttonText}>{t("save") || "Save"}</Text>
                  </Button>
                  <Button mode="contained" onPress={() => setEditMode(false)} style={styles.closeButton}>
                    <Text style={styles.buttonText}>{t("cancel") || "Cancel"}</Text>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* View Modal (Trip Details) */}
        {selectedPlan && !editMode && (
          <Modal visible={true} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: isDarkMode ? "#2E2E44" : "#FFF" }]}>
                <Text style={[styles.modalTitle, { color: isDarkMode ? "#D1B3FF" : "#6D28D9" }]}>
                  {t("trip_details") || "Trip Details"}
                </Text>
                <Text style={[styles.modalText, { color: isDarkMode ? "#D1B3FF" : "#D81B60", fontWeight: "500" }]}>
                  {t("date") || "Date"}: 📅 {selectedPlan.date}
                </Text>
                <Text style={[styles.modalText, { color: isDarkMode ? "#D1B3FF" : "#D81B60", fontWeight: "500" }]}>
                  {t("time") || "Time"}: 🕒 {selectedPlan.time}
                </Text>
                <Text style={[styles.modalText, { color: isDarkMode ? "#FFF" : "#4C1D95", fontWeight: "500" }]}>
                  {t("attraction") || "Attraction"}: 📍 {selectedPlan.name ? `${selectedPlan.name}${selectedPlan.region ? `, ${selectedPlan.region}` : ""}` : selectedPlan.description}
                </Text>

                <View style={styles.modalButtons}>
                  <Button mode="contained" onPress={() => setSelectedPlan(null)} style={[styles.closeButton, { flex: 1, marginRight: 5 }]}>
                    <Text style={styles.buttonText}>{t("close") || "Close"}</Text>
                  </Button>
                  <Button mode="contained" onPress={() => deletePlan(selectedPlan.id)} style={[styles.deleteButton, { flex: 1, marginLeft: 5 }]}>
                    <Text style={styles.buttonText}>{t("delete") || "Delete"}</Text>
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F5EFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  inputSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#8A4AF3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  dateTimeContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dateText: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  planItem: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    backgroundColor: "#EDE9FE",
  },
  planContent: {
    flex: 1,
  },
  planDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  planDescription: {
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#D81B60",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 80,
    borderColor: "#D1B3FF",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  editModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  closeButton: {
    backgroundColor: "#8A4AF3",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: "#6D28D9",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#D81B60",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 5,
  },
});
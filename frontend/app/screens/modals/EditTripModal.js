import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { tripsStyles } from "../../styles/TripsStyles";
import { updateTrip } from "../../functions/tripsFunctions";

export default function EditTripModal({ visible, onClose, onSuccess, trip, userId }) {
  const scrollViewRef = useRef(null);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (trip && visible) {
      setDestination(trip.destination || "");

      // Parse start date
      const startParts = trip.startDate.split('T')[0].split('-');
      const parsedStartDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
      setStartDate(parsedStartDate);

      // Parse end date
      const endParts = trip.endDate.split('T')[0].split('-');
      const parsedEndDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));
      setEndDate(parsedEndDate);

      setBudget(trip.budget ? trip.budget.toString() : "");
      setDescription(trip.description || "");
    }
  }, [trip, visible]);

  const formatDateDisplay = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleUpdate = async () => {
    if (!destination.trim()) {
      Alert.alert("Error", "Please enter a destination");
      return;
    }

    if (endDate < startDate) {
      Alert.alert("Error", "End date must be after start date");
      return;
    }

    try {
      const result = await updateTrip(
        trip.tripId,
        destination.trim(),
        formatDateDisplay(startDate),
        formatDateDisplay(endDate),
        parseFloat(budget) || 0,
        description.trim()
      );

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        onSuccess();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update trip");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tripsStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <View style={tripsStyles.modalContent}>
              <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={tripsStyles.modalTitle}>Edit Trip</Text>

            <Text style={tripsStyles.inputLabel}>Destination *</Text>
            <TextInput
              style={tripsStyles.input}
              placeholder="Where are you going?"
              value={destination}
              onChangeText={setDestination}
            />

            <Text style={tripsStyles.inputLabel}>Start Date *</Text>
            <TextInput
              style={tripsStyles.input}
              value={formatDateDisplay(startDate)}
              editable={false}
            />

            <Text style={tripsStyles.inputLabel}>End Date *</Text>
            <TextInput
              style={tripsStyles.input}
              value={formatDateDisplay(endDate)}
              editable={false}
            />

            <Text style={tripsStyles.inputLabel}>Budget</Text>
            <TextInput
              style={tripsStyles.input}
              placeholder="0.00"
              value={budget}
              onChangeText={setBudget}
              keyboardType="decimal-pad"
            />

            <Text style={tripsStyles.inputLabel}>Description</Text>
            <TextInput
              style={[tripsStyles.input, tripsStyles.textArea]}
              placeholder="Add notes about your trip..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />

            <View style={tripsStyles.modalButtons}>
              <TouchableOpacity
                style={[tripsStyles.modalButton, tripsStyles.cancelButton]}
                onPress={onClose}
              >
                <Text style={tripsStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[tripsStyles.modalButton, tripsStyles.submitButton]}
                onPress={handleUpdate}
              >
                <Text style={tripsStyles.modalButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

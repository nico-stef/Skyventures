import React, { useState, useRef } from "react";
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
import { createTrip } from "../../functions/tripsFunctions";

export default function CreateTripModal({ visible, onClose, onSuccess, userId }) {
  const today = new Date();
  const scrollViewRef = useRef(null);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    const today = new Date();
    setDestination("");
    setStartDate(today);
    setEndDate(today);
    setBudget("");
    setDescription("");
  };

  const formatDateDisplay = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCreate = async () => {
    if (!destination.trim()) {
      Alert.alert("Error", "Please enter a destination");
      return;
    }

    if (endDate < startDate) {
      Alert.alert("Error", "End date must be after start date");
      return;
    }

    try {
      const result = await createTrip(
        destination.trim(),
        formatDateDisplay(startDate),
        formatDateDisplay(endDate),
        parseFloat(budget) || 0,
        description.trim()
      );

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        resetForm();
        onSuccess();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create trip");
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
            <Text style={tripsStyles.modalTitle}>Create New Trip</Text>

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
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              >
                <Text style={tripsStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[tripsStyles.modalButton, tripsStyles.submitButton]}
                onPress={handleCreate}
              >
                <Text style={tripsStyles.modalButtonText}>Create</Text>
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

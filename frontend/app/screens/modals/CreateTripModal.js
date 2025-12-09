import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { tripsStyles } from "../../styles/TripsStyles";
import { createTrip } from "../../functions/tripsFunctions";

export default function CreateTripModal({ visible, onClose, onSuccess, userId }) {
  const today = new Date();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const resetForm = () => {
    const today = new Date();
    setDestination("");
    setStartDate(today);
    setEndDate(today);
    setBudget("");
    setDescription("");
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
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
        userId,
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
      <View style={tripsStyles.modalOverlay}>
        <View style={tripsStyles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={tripsStyles.modalTitle}>Create New Trip</Text>

            <Text style={tripsStyles.inputLabel}>Destination *</Text>
            <TextInput
              style={tripsStyles.input}
              placeholder="Where are you going?"
              value={destination}
              onChangeText={setDestination}
            />

            <Text style={tripsStyles.inputLabel}>Start Date *</Text>
            <TouchableOpacity
              style={tripsStyles.timePickerButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={tripsStyles.timePickerText}>
                {formatDateDisplay(startDate)}
              </Text>
            </TouchableOpacity>

            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}

            <Text style={tripsStyles.inputLabel}>End Date *</Text>
            <TouchableOpacity
              style={tripsStyles.timePickerButton}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={tripsStyles.timePickerText}>
                {formatDateDisplay(endDate)}
              </Text>
            </TouchableOpacity>

            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}

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
      </View>
    </Modal>
  );
}

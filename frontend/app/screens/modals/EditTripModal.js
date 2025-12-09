import React, { useState, useEffect } from "react";
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
import { updateTrip } from "../../functions/tripsFunctions";

export default function EditTripModal({ visible, onClose, onSuccess, trip, userId }) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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
      <View style={tripsStyles.modalOverlay}>
        <View style={tripsStyles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={tripsStyles.modalTitle}>Edit Trip</Text>

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
      </View>
    </Modal>
  );
}

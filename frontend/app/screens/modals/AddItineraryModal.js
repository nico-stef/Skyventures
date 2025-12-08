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
import { Picker } from "@react-native-picker/picker";
import { tripsStyles } from "../../styles/TripsStyles";
import { addItineraryItem } from "../../functions/tripsFunctions";

export default function AddItineraryModal({
  visible,
  onClose,
  onSuccess,
  tripId,
  userId,
  trip,
  placeData = null,
}) {
  const [placeName, setPlaceName] = useState("");
  const [dayDate, setDayDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (visible) {
      if (placeData) {
        setPlaceName(placeData.placeName || "");
        setNotes("");
      } else {
        setPlaceName("");
        setNotes("");
      }
      // Set initial date to trip start date
      if (trip) {
        setDayDate(new Date(trip.startDate));
      }
    }
  }, [visible, placeData, trip]);

  const resetForm = () => {
    setPlaceName("");
    setNotes("");
    if (trip) {
      setDayDate(new Date(trip.startDate));
    }
  };

  const handleAdd = async () => {
    if (!placeName.trim()) {
      Alert.alert("Error", "Please enter a place name");
      return;
    }

    const itemData = {
      dayDate: dayDate.toISOString().split('T')[0],
      placeName: placeName.trim(),
      placeId: placeData?.placeId || null,
      placeAddress: placeData?.placeAddress || null,
      placePhoto: placeData?.placePhoto || null,
      placeRating: placeData?.placeRating || null,
      notes: notes.trim(),
      orderIndex: 0,
    };

    try {
      const result = await addItineraryItem(tripId, userId, itemData);
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        resetForm();
        onSuccess();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add activity");
    }
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTripDates = () => {
    if (!trip) return [];
    
    const dates = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  };

  const tripDates = getTripDates();

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
            <Text style={tripsStyles.modalTitle}>Add Activity</Text>

            <Text style={tripsStyles.inputLabel}>Place Name *</Text>
            <TextInput
              style={tripsStyles.input}
              placeholder="Enter place or activity name"
              value={placeName}
              onChangeText={setPlaceName}
              editable={!placeData}
            />

            <Text style={tripsStyles.inputLabel}>Select Day *</Text>
            <View style={tripsStyles.pickerContainer}>
              <Picker
                selectedValue={dayDate.toISOString().split('T')[0]}
                onValueChange={(value) => setDayDate(new Date(value))}
                itemStyle={{ color: '#000000' }}
              >
                {tripDates.map((date, index) => (
                  <Picker.Item
                    key={index}
                    label={formatDateDisplay(date)}
                    value={date.toISOString().split('T')[0]}
                    color="#000000"
                  />
                ))}
              </Picker>
            </View>

            <Text style={tripsStyles.inputLabel}>Notes</Text>
            <TextInput
              style={[tripsStyles.input, tripsStyles.textArea]}
              placeholder="Add any notes or details..."
              value={notes}
              onChangeText={setNotes}
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
                onPress={handleAdd}
              >
                <Text style={tripsStyles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

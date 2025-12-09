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
  ActivityIndicator,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { tripsStyles } from "../../styles/TripsStyles";
import { addItineraryItem } from "../../functions/tripsFunctions";
import { searchPlaces } from "../../functions/googlePlacesFunction";

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
  const [startTime, setStartTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);

  useEffect(() => {
    if (visible) {
      if (placeData) {
        setPlaceName(placeData.placeName || "");
        setSelectedPlace(placeData);
        setManualEntry(false);
        setSearchQuery("");
        setSearchResults([]);
        setNotes("");
      } else {
        setPlaceName("");
        setSelectedPlace(null);
        setManualEntry(false);
        setSearchQuery("");
        setSearchResults([]);
        setNotes("");
      }
      // Set initial date to trip start date
      if (trip) {
        const startParts = trip.startDate.split('T')[0].split('-');
        const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
        setDayDate(startDate);
      }
      // Set default time to 9:00 AM
      const defaultTime = new Date();
      defaultTime.setHours(9, 0, 0, 0);
      setStartTime(defaultTime);
    }
  }, [visible, placeData, trip]);

  const resetForm = () => {
    setPlaceName("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedPlace(null);
    setManualEntry(false);
    setNotes("");
    if (trip) {
      const startParts = trip.startDate.split('T')[0].split('-');
      const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
      setDayDate(startDate);
    }
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);
    setStartTime(defaultTime);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const location = trip?.destination || "";
      const results = await searchPlaces(query, location);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace({
      placeName: place.name,
      placeId: place.place_id,
      placeAddress: place.vicinity || place.formatted_address,
      placePhoto: place.photoUrl,
      placeRating: place.rating,
    });
    setPlaceName(place.name);
    setSearchQuery("");
    setSearchResults([]);
    setManualEntry(false);
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    setSelectedPlace(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDayDate(selectedDate);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleAdd = async () => {
    if (!placeName.trim()) {
      Alert.alert("Error", "Please enter a place name");
      return;
    }

    const timeString = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}:00`;

    // Use local date components instead of UTC
    const year = dayDate.getFullYear();
    const month = (dayDate.getMonth() + 1).toString().padStart(2, '0');
    const day = dayDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    console.log('===== BEFORE CREATING itemData =====');
    console.log('dayDate object:', dayDate);
    console.log('dayDate.getFullYear():', year);
    console.log('dayDate.getMonth():', dayDate.getMonth());
    console.log('dayDate.getDate():', day);
    console.log('dateString:', dateString);
    console.log('startTime object:', startTime);
    console.log('timeString:', timeString);

    const itemData = {
      dayDate: dateString,
      startTime: timeString,
      placeName: placeName.trim(),
      placeId: selectedPlace?.placeId || placeData?.placeId || null,
      placeAddress: selectedPlace?.placeAddress || placeData?.placeAddress || null,
      placePhoto: selectedPlace?.placePhoto || placeData?.placePhoto || null,
      placeRating: selectedPlace?.placeRating || placeData?.placeRating || null,
      notes: notes.trim(),
      orderIndex: 0,
    };

    console.log('===== itemData CREATED =====');
    console.log('itemData:', JSON.stringify(itemData, null, 2));

    try {
      const result = await addItineraryItem(tripId, userId, itemData);
      console.log('Backend response:', result);
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding activity:", error);
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
    const startParts = trip.startDate.split('T')[0].split('-');
    const endParts = trip.endDate.split('T')[0].split('-');

    const start = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
    const end = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));

    console.log('Trip dates - start:', start, 'end:', end);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    console.log('Generated trip dates:', dates);
    console.log('First date:', dates[0]);
    console.log('Last date:', dates[dates.length - 1]);

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

            {/* Place Name Section */}
            <Text style={tripsStyles.inputLabel}>Place Name *</Text>

            {!manualEntry && !placeData && (
              <>
                <TextInput
                  style={tripsStyles.input}
                  placeholder="Search for a place..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                />

                {searching && (
                  <View style={{ padding: 10, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#886ae6" />
                  </View>
                )}

                {searchResults.length > 0 && (
                  <View style={tripsStyles.searchResultsContainer}>
                    <ScrollView
                      style={{ maxHeight: 200 }}
                      nestedScrollEnabled={true}
                    >
                      {searchResults.map((item, index) => (
                        <TouchableOpacity
                          key={item.place_id || index.toString()}
                          style={tripsStyles.searchResultItem}
                          onPress={() => handleSelectPlace(item)}
                        >
                          <Text style={tripsStyles.searchResultName}>
                            {item.name}
                          </Text>
                          {item.vicinity && (
                            <Text style={tripsStyles.searchResultAddress}>
                              {item.vicinity}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <TouchableOpacity
                  style={tripsStyles.manualEntryButton}
                  onPress={handleManualEntry}
                >
                  <Text style={tripsStyles.manualEntryText}>
                    Or enter manually
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {(manualEntry || selectedPlace || placeData) && (
              <TextInput
                style={tripsStyles.input}
                placeholder="Enter place or activity name"
                value={placeName}
                onChangeText={setPlaceName}
                editable={manualEntry || !placeData}
              />
            )}

            {/* Time Picker */}
            <Text style={tripsStyles.inputLabel}>Start Time *</Text>
            <TouchableOpacity
              style={tripsStyles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={tripsStyles.timePickerText}>
                {formatTime(startTime)}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            {/* Day Picker */}
            <Text style={tripsStyles.inputLabel}>Select Day *</Text>
            <TouchableOpacity
              style={tripsStyles.timePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={tripsStyles.timePickerText}>
                {formatDateDisplay(dayDate)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dayDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

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

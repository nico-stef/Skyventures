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
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
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
  const scrollViewRef = useRef(null);
  const [placeName, setPlaceName] = useState("");
  const [dayDate, setDayDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
        const startDateStr = trip.startDate.split(/[T ]/)[0];
        const [year, month, day] = startDateStr.split('-').map(Number);
        const startDate = new Date(year, month - 1, day);
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
      const startDateStr = trip.startDate.split(/[T ]/)[0];
      const [year, month, day] = startDateStr.split('-').map(Number);
      const startDate = new Date(year, month - 1, day);
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDayDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
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
      notes: notes.trim(),
    };

    console.log('===== itemData CREATED =====');
    console.log('itemData:', JSON.stringify(itemData, null, 2));

    try {
      const result = await addItineraryItem(tripId, itemData);
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
    const startDateStr = trip.startDate.split(/[T ]/)[0];
    const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
    const start = new Date(startYear, startMonth - 1, startDay);
    
    const endDateStr = trip.endDate.split(/[T ]/)[0];
    const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
    const end = new Date(endYear, endMonth - 1, endDay);

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tripsStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <View style={tripsStyles.modalContent}>
              <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
              style={tripsStyles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ fontSize: 16, color: '#333', paddingVertical: 2 }}>
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
              style={tripsStyles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ fontSize: 16, color: '#333', paddingVertical: 2 }}>
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
                onPress={handleAdd}
              >
                <Text style={tripsStyles.modalButtonText}>Add</Text>
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

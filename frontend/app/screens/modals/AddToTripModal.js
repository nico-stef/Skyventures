import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { tripsStyles } from "../../styles/TripsStyles";
import { getUserTrips, addItineraryItem } from "../../functions/tripsFunctions";

export default function AddToTripModal({
  visible,
  onClose,
  onSuccess,
  userId,
  placeData,
}) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: select trip, 2: select day

  useEffect(() => {
    if (visible && userId) {
      fetchTrips();
    }
  }, [visible, userId]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const result = await getUserTrips();
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        setTrips(result.trips || []);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateDetailed = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTripDates = (trip) => {
    const dates = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    return dates;
  };

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setStep(2);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);

    // Set default time to 9:00 AM
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);
    const timeString = `${defaultTime.getHours().toString().padStart(2, '0')}:${defaultTime.getMinutes().toString().padStart(2, '0')}:00`;

    const itemData = {
      dayDate: date.toISOString().split('T')[0],
      startTime: timeString,
      placeName: placeData.name,
      placeId: placeData.place_id || null,
      placeAddress: placeData.vicinity || placeData.formatted_address || null,
      notes: '',
    };

    try {
      const result = await addItineraryItem(
        selectedTrip.tripId,
        itemData
      );

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", `Added ${placeData.name} to your trip!`);
        resetModal();
        onSuccess && onSuccess();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add to trip");
    }
  };

  const resetModal = () => {
    setSelectedTrip(null);
    setSelectedDate(null);
    setStep(1);
    onClose();
  };

  const renderTripSelection = () => {
    if (loading) {
      return (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#886ae6" />
        </View>
      );
    }

    if (trips.length === 0) {
      return (
        <View style={tripsStyles.emptyContainer}>
          <Text style={tripsStyles.emptyText}>
            No trips available.{"\n"}Create a trip first!
          </Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.tripId}
            style={tripsStyles.tripSelectItem}
            onPress={() => handleTripSelect(trip)}
          >
            <Text style={tripsStyles.tripSelectName}>{trip.destination}</Text>
            <Text style={tripsStyles.tripSelectDates}>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderDaySelection = () => {
    const tripDates = getTripDates(selectedTrip);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={tripsStyles.backButton}
          onPress={() => setStep(1)}
        >
          <Text style={{ color: '#886ae6', fontSize: 16 }}>
            ← Back to trips
          </Text>
        </TouchableOpacity>

        <Text style={[tripsStyles.inputLabel, { marginTop: 15, marginBottom: 10 }]}>
          Select a day in {selectedTrip.destination}:
        </Text>

        {tripDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={tripsStyles.daySelectItem}
            onPress={() => handleDateSelect(date)}
          >
            <Text style={tripsStyles.daySelectText}>
              Day {index + 1}: {formatDateDetailed(date)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={resetModal}
    >
      <View style={tripsStyles.modalOverlay}>
        <View style={tripsStyles.modalContent}>
          <Text style={tripsStyles.modalTitle}>
            {step === 1 ? "Select a Trip" : "Select a Day"}
          </Text>

          {step === 1 ? renderTripSelection() : renderDaySelection()}

          <TouchableOpacity
            style={[tripsStyles.modalButton, tripsStyles.cancelButton, { marginTop: 20 }]}
            onPress={resetModal}
          >
            <Text style={tripsStyles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

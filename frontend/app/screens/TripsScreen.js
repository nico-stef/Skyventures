import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { tripsStyles } from "../styles/TripsStyles";
import { getUserTrips } from "../functions/tripsFunctions";
import CreateTripModal from "./modals/CreateTripModal";

export default function TripsScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
    };
    getUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchTrips();
      }
    }, [userId])
  );

  const fetchTrips = async () => {
    try {
      const result = await getUserTrips(userId);
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        setTrips(result.trips || []);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load trips");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  const handleTripPress = (trip) => {
    navigation.navigate("TripDetail", { tripId: trip.tripId });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateBudgetPercentage = (spent, budget) => {
    if (budget === 0) return 0;
    return (spent / budget) * 100;
  };

  const renderTripCard = ({ item }) => {
    const budgetPercentage = calculateBudgetPercentage(
      parseFloat(item.totalSpent || 0),
      parseFloat(item.budget || 0)
    );
    const isOverBudget = budgetPercentage > 100;

    return (
      <TouchableOpacity
        style={tripsStyles.tripCard}
        onPress={() => handleTripPress(item)}
        activeOpacity={0.7}
      >
        <Text style={tripsStyles.tripDestination}>{item.destination}</Text>
        <Text style={tripsStyles.tripDates}>
          {formatDate(item.startDate)} - {formatDate(item.endDate)}
        </Text>

        <View style={tripsStyles.tripBudgetContainer}>
          <Text style={tripsStyles.tripBudgetText}>
            Budget: ${parseFloat(item.totalSpent || 0).toFixed(2)} / $
            {parseFloat(item.budget || 0).toFixed(2)}
          </Text>
          <View style={tripsStyles.budgetProgressBar}>
            <View
              style={[
                tripsStyles.budgetProgressFill,
                isOverBudget && tripsStyles.budgetOverFill,
                { width: `${Math.min(budgetPercentage, 100)}%` },
              ]}
            />
          </View>
        </View>

        <View style={tripsStyles.tripStats}>
          <View style={tripsStyles.tripStat}>
            <Text style={tripsStyles.tripStatValue}>
              {item.itineraryCount || 0}
            </Text>
            <Text style={tripsStyles.tripStatLabel}>Activities</Text>
          </View>
          <View style={tripsStyles.tripStat}>
            <Text style={tripsStyles.tripStatValue}>
              {Math.ceil(
                (new Date(item.endDate) - new Date(item.startDate)) /
                  (1000 * 60 * 60 * 24)
              )}
            </Text>
            <Text style={tripsStyles.tripStatLabel}>Days</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={tripsStyles.emptyContainer}>
      <Text style={tripsStyles.emptyText}>
        No trips yet!{"\n"}Tap the + button to create your first trip
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={tripsStyles.container}>
      <View style={tripsStyles.header}>
        <Text style={tripsStyles.headerTitle}>My Trips</Text>
      </View>

      <FlatList
        data={trips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.tripId.toString()}
        contentContainerStyle={trips.length === 0 ? { flex: 1 } : tripsStyles.tripsList}
        ListEmptyComponent={!loading && renderEmptyState()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={tripsStyles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={tripsStyles.fabText}>+</Text>
      </TouchableOpacity>

      <CreateTripModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          fetchTrips();
        }}
        userId={userId}
      />
    </SafeAreaView>
  );
}

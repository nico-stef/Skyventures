import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { tripsStyles } from "../../styles/TripsStyles";
import EditTripModal from "../modals/EditTripModal";

export default function OverviewTab({ trip, userId, onUpdate, onDelete }) {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const formatDate = (dateString) => {
    const dateStr = dateString.split(/[T ]/)[0]; // Handle both 'T' and space
    const [year, month, day] = dateStr.split('-').map(Number);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };

  const calculateDays = () => {
    const startStr = trip.startDate.split(/[T ]/)[0];
    const [startYear, startMonth, startDay] = startStr.split('-').map(Number);
    
    const endStr = trip.endDate.split(/[T ]/)[0];
    const [endYear, endMonth, endDay] = endStr.split('-').map(Number);
    
    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const budgetRemaining = parseFloat(trip.budget || 0) - parseFloat(trip.totalSpent || 0);
  const budgetPercentage = trip.budget > 0 
    ? ((trip.totalSpent / trip.budget) * 100).toFixed(1) 
    : 0;

  return (
    <View>
      <View style={tripsStyles.overviewCard}>
        <Text style={tripsStyles.overviewTitle}>Trip Details</Text>

        <View style={tripsStyles.overviewRow}>
          <Text style={tripsStyles.overviewLabel}>Destination</Text>
          <Text style={tripsStyles.overviewValue}>{trip.destination}</Text>
        </View>

        <View style={tripsStyles.overviewRow}>
          <Text style={tripsStyles.overviewLabel}>Start Date</Text>
          <Text style={tripsStyles.overviewValue}>
            {formatDate(trip.startDate)}
          </Text>
        </View>

        <View style={tripsStyles.overviewRow}>
          <Text style={tripsStyles.overviewLabel}>End Date</Text>
          <Text style={tripsStyles.overviewValue}>
            {formatDate(trip.endDate)}
          </Text>
        </View>

        <View style={tripsStyles.overviewRow}>
          <Text style={tripsStyles.overviewLabel}>Duration</Text>
          <Text style={tripsStyles.overviewValue}>
            {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
          </Text>
        </View>

        {trip.description ? (
          <View style={{ marginTop: 15 }}>
            <Text style={tripsStyles.overviewLabel}>Description</Text>
            <Text style={[tripsStyles.overviewValue, { marginTop: 5 }]}>
              {trip.description}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={tripsStyles.overviewCard}>
        <Text style={tripsStyles.overviewTitle}>Budget Summary</Text>

        <View style={tripsStyles.overviewRow}>
          <Text style={tripsStyles.overviewLabel}>Total Budget</Text>
          <Text style={tripsStyles.overviewValue}>
            ${parseFloat(trip.budget || 0).toFixed(2)}
          </Text>
        </View>

        <View style={tripsStyles.overviewRow}>
          <Text style={tripsStyles.overviewLabel}>Total Spent</Text>
          <Text style={tripsStyles.overviewValue}>
            ${parseFloat(trip.totalSpent || 0).toFixed(2)}
          </Text>
        </View>

        <View style={tripsStyles.overviewRow}>
          <Text style={tripsStyles.overviewLabel}>Remaining</Text>
          <Text
            style={[
              tripsStyles.overviewValue,
              { color: budgetRemaining < 0 ? '#f44336' : '#4CAF50' }
            ]}
          >
            ${budgetRemaining.toFixed(2)}
          </Text>
        </View>

        <View style={[tripsStyles.overviewRow, { marginTop: 10 }]}>
          <Text style={tripsStyles.overviewLabel}>Budget Used</Text>
          <Text
            style={[
              tripsStyles.overviewValue,
              { color: budgetPercentage > 100 ? '#f44336' : '#8B5CF6' }
            ]}
          >
            {budgetPercentage}%
          </Text>
        </View>

        <View style={tripsStyles.budgetProgressBar}>
          <View
            style={[
              tripsStyles.budgetProgressFill,
              budgetPercentage > 100 && tripsStyles.budgetOverFill,
              { width: `${Math.min(budgetPercentage, 100)}%` }
            ]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={tripsStyles.editButton}
        onPress={() => setEditModalVisible(true)}
      >
        <Text style={tripsStyles.editButtonText}>Edit Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tripsStyles.deleteButton}
        onPress={onDelete}
      >
        <Text style={tripsStyles.deleteButtonText}>Delete Trip</Text>
      </TouchableOpacity>

      <EditTripModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSuccess={() => {
          setEditModalVisible(false);
          onUpdate();
        }}
        trip={trip}
        userId={userId}
      />
    </View>
  );
}

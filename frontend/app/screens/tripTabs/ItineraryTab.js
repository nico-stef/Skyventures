import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { tripsStyles } from "../../styles/TripsStyles";
import { deleteItineraryItem, updateItineraryItem } from "../../functions/tripsFunctions";
import AddItineraryModal from "../modals/AddItineraryModal";

export default function ItineraryTab({ tripId, userId, items, trip, onUpdate }) {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const groupItemsByDay = () => {
    const grouped = {};
    items.forEach(item => {
      const dateKey = item.dayDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });
    
    // Sort items within each day by orderIndex
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => a.orderIndex - b.orderIndex);
    });
    
    return grouped;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      "Delete Item",
      "Remove this item from your itinerary?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deleteItineraryItem(tripId, itemId, userId);
              if (result.error) {
                Alert.alert("Error", result.error);
              } else {
                onUpdate();
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete item");
            }
          },
        },
      ]
    );
  };

  const handleMoveItem = async (item, direction) => {
    const dayItems = groupedItems[item.dayDate];
    const currentIndex = dayItems.findIndex(i => i.itemId === item.itemId);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === dayItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapItem = dayItems[newIndex];

    try {
      // Swap order indices
      await updateItineraryItem(tripId, item.itemId, userId, {
        dayDate: item.dayDate,
        placeName: item.placeName,
        notes: item.notes,
        orderIndex: swapItem.orderIndex
      });

      await updateItineraryItem(tripId, swapItem.itemId, userId, {
        dayDate: swapItem.dayDate,
        placeName: swapItem.placeName,
        notes: swapItem.notes,
        orderIndex: item.orderIndex
      });

      onUpdate();
    } catch (error) {
      Alert.alert("Error", "Failed to reorder items");
    }
  };

  const groupedItems = groupItemsByDay();
  const sortedDates = Object.keys(groupedItems).sort();

  if (items.length === 0) {
    return (
      <View>
        <View style={tripsStyles.emptyContainer}>
          <Text style={tripsStyles.emptyText}>
            No activities planned yet.{"\n"}Add your first activity!
          </Text>
        </View>

        <TouchableOpacity
          style={tripsStyles.addItineraryButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={tripsStyles.addItineraryButtonText}>
            + Add Activity
          </Text>
        </TouchableOpacity>

        <AddItineraryModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSuccess={() => {
            setAddModalVisible(false);
            onUpdate();
          }}
          tripId={tripId}
          userId={userId}
          trip={trip}
        />
      </View>
    );
  }

  return (
    <View>
      {sortedDates.map(date => (
        <View key={date} style={tripsStyles.daySection}>
          <Text style={tripsStyles.dayHeader}>{formatDate(date)}</Text>

          {groupedItems[date].map((item, index) => (
            <View key={item.itemId} style={tripsStyles.itineraryItem}>
              <View style={tripsStyles.itineraryItemContent}>
                <Text style={tripsStyles.itineraryItemName}>
                  {item.placeName}
                </Text>
                {item.placeAddress ? (
                  <Text style={tripsStyles.itineraryItemAddress}>
                    {item.placeAddress}
                  </Text>
                ) : null}
                {item.notes ? (
                  <Text style={tripsStyles.itineraryItemAddress}>
                    {item.notes}
                  </Text>
                ) : null}
              </View>

              <View style={tripsStyles.itineraryItemActions}>
                {index > 0 && (
                  <TouchableOpacity
                    style={tripsStyles.actionButton}
                    onPress={() => handleMoveItem(item, 'up')}
                  >
                    <Text style={{ fontSize: 18 }}>↑</Text>
                  </TouchableOpacity>
                )}

                {index < groupedItems[date].length - 1 && (
                  <TouchableOpacity
                    style={tripsStyles.actionButton}
                    onPress={() => handleMoveItem(item, 'down')}
                  >
                    <Text style={{ fontSize: 18 }}>↓</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={tripsStyles.actionButton}
                  onPress={() => handleDeleteItem(item.itemId)}
                >
                  <Text style={{ fontSize: 18, color: '#f44336' }}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity
        style={tripsStyles.addItineraryButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={tripsStyles.addItineraryButtonText}>+ Add Activity</Text>
      </TouchableOpacity>

      <AddItineraryModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={() => {
          setAddModalVisible(false);
          onUpdate();
        }}
        tripId={tripId}
        userId={userId}
        trip={trip}
      />
    </View>
  );
}

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
import { Picker } from "@react-native-picker/picker";
import { tripsStyles } from "../../styles/TripsStyles";
import { addExpense } from "../../functions/tripsFunctions";

const EXPENSE_CATEGORIES = [
  "Accommodation",
  "Transportation",
  "Food & Dining",
  "Activities",
  "Shopping",
  "Other",
];

export default function AddExpenseModal({
  visible,
  onClose,
  onSuccess,
  tripId,
  userId,
}) {
  const [category, setCategory] = useState("Food & Dining");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date());

  const resetForm = () => {
    setCategory("Food & Dining");
    setAmount("");
    setDescription("");
    setExpenseDate(new Date());
  };

  const handleAdd = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const expenseData = {
      category,
      amount: parseFloat(amount),
      description: description.trim(),
      expenseDate: expenseDate.toISOString().split('T')[0],
    };

    try {
      const result = await addExpense(tripId, userId, expenseData);
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        resetForm();
        onSuccess();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add expense");
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
            <Text style={tripsStyles.modalTitle}>Add Expense</Text>

            <Text style={tripsStyles.inputLabel}>Category *</Text>
            <View style={tripsStyles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                itemStyle={{ color: '#000000' }}
              >
                {EXPENSE_CATEGORIES.map((cat, index) => (
                  <Picker.Item key={index} label={cat} value={cat} color="#000000" />
                ))}
              </Picker>
            </View>

            <Text style={tripsStyles.inputLabel}>Amount *</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, marginRight: 5 }}>$</Text>
              <TextInput
                style={[tripsStyles.input, { flex: 1 }]}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <Text style={tripsStyles.inputLabel}>Date *</Text>
            <TextInput
              style={tripsStyles.input}
              placeholder="YYYY-MM-DD"
              value={expenseDate.toISOString().split('T')[0]}
              editable={false}
            />

            <Text style={tripsStyles.inputLabel}>Description</Text>
            <TextInput
              style={tripsStyles.input}
              placeholder="What was this for?"
              value={description}
              onChangeText={setDescription}
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

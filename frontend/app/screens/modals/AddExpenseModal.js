import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
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
  const scrollViewRef = useRef(null);
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

  const formatDateDisplay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
      expenseDate: formatDateDisplay(expenseDate),
    };

    try {
      const result = await addExpense(tripId, expenseData);
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tripsStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <View style={tripsStyles.modalContent}>
              <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
              value={formatDateDisplay(expenseDate)}
              editable={false}
            />

            <Text style={tripsStyles.inputLabel}>Description</Text>
            <TextInput
              style={tripsStyles.input}
              placeholder="What was this for?"
              value={description}
              onChangeText={setDescription}
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

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Feather } from "@expo/vector-icons"

export default function MedicalInfoForm() {
    const { user } = useLocalSearchParams();
  const [medicineName, setMedicineName] = useState("")
  const [cause, setCause] = useState("")
  const [period, setperiod] = useState("")
  const router = useRouter()

  const userData = user
    ? JSON.parse(Array.isArray(user) ? user[0] : user)
    : null;
  let url =
    Platform.OS === "web" ? "http://localhost:3000" : "http://10.7.14.19:3000";
 const handleSubmit = async () => {
  if (!medicineName.trim() || !cause.trim()) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  try {
    const response = await fetch(`${url}/add-medicine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: userData.email, // Replace with the actual user email
        name: medicineName,
        cause: cause,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", "Medical information saved successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert("Error", data.error || "Something went wrong");
    }
  } catch (error) {
    console.error("Error submitting medical info:", error);
    Alert.alert("Error", "Network error. Please try again.");
  }
};

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Upload Medical Information</Text>
        <Text style={styles.subtitle}>Please enter the details below</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Medicine Name</Text>
          <View style={styles.inputContainer}>
            <Feather name="box" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter medicine name"
              value={medicineName}
              onChangeText={setMedicineName}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cause / Reason</Text>
          <View style={styles.inputContainer}>
            <Feather name="file-text" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter cause or reason for medicine"
              value={cause}
              onChangeText={setCause}
              multiline
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Repeat Period</Text>
          <View style={styles.inputContainer}>
            <Feather name="file-text" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="In how many days you repeat this medicine"
              value={period}
              onChangeText={setperiod}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

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
import { useRouter } from "expo-router"
import { Feather } from "@expo/vector-icons"

export default function MedicalInfoForm() {
  const [medicineName, setMedicineName] = useState("")
  const [cause, setCause] = useState("")
  const router = useRouter()

  const handleSubmit = () => {
    if (!medicineName.trim() || !cause.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    // Here you would typically save the data to a database or state management
    Alert.alert("Success", "Medical information saved successfully", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ])
  }

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

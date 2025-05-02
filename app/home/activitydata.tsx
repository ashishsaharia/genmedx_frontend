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

export default function HealthMetricsForm() {
  const [steps, setSteps] = useState("")
  const [bloodPressure, setBloodPressure] = useState("")
  const [sleepHours, setSleepHours] = useState("")
  const router = useRouter()

  const handleSubmit = () => {
    if (!steps.trim() || !bloodPressure.trim() || !sleepHours.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    // Here you would typically save the data to a database or state management
    Alert.alert("Success", "Health metrics saved successfully", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ])
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Daily Health Metrics</Text>
        <Text style={styles.subtitle}>Please enter your health data below</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Steps</Text>
          <View style={styles.inputContainer}>
            <Feather name="activity" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter number of steps"
              value={steps}
              onChangeText={setSteps}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Blood Pressure</Text>
          <View style={styles.inputContainer}>
            <Feather name="heart" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter BP (e.g., 120/80)"
              value={bloodPressure}
              onChangeText={setBloodPressure}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Sleep (hours)</Text>
          <View style={styles.inputContainer}>
            <Feather name="moon" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter sleep duration in hours"
              value={sleepHours}
              onChangeText={setSleepHours}
              keyboardType="decimal-pad"
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
    backgroundColor: "#f53d00",
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
    // backgroundColor:"#f53d00"
  },
})
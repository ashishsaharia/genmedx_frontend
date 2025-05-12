import { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";

export default function UserOnboarding() {
  const { user } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [allergies, setAllergies] = useState("");

  const userData = user
    ? JSON.parse(Array.isArray(user) ? user[0] : user)
    : null;
  let url =
    Platform.OS === "web" ? "http://localhost:3000" : "http://10.7.14.19:3000";

  const router = useRouter();

  const handleSubmit = async () => {
    if (!userData?.email) {
      Alert.alert("Error", "User email not found.");
      return;
    }

    try {
      const response = await fetch(`${url}/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userData.email,
          fullName: name,
          phoneNumber: Number(phoneNumber),
          userAge: age,
          userGender: gender,
          userHeight: Number(height),
          userWeight: Number(weight),
          userMedicalCondition: medicalHistory,
          userAlergies: allergies,
          userEmergencyContact: Number(emergencyContact),
        }),
      });

      // const data = await response.json();

      if(response.ok) {
              router.replace({
                        pathname: "/home/homePage",
                        params: { user },
                      })
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
    // Basic validation
    // if (!name.trim() || !phoneNumber.trim() || !age.trim() || !gender || !height.trim() || !weight.trim()) {
    //   Alert.alert("Error", "Please fill in all required fields")
    //   return
    // }

    // Here you would typically save the data to a database or state management
    // Alert.alert("Success", "Profile created successfully", [
    //   {
    //     text: "Continue",
    // onPress: () => router.push("/home/homePage"); // Navigate to dashboard or home screen
    //   },
    // ])
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Create Your Health Profile</Text>
        <Text style={styles.subtitle}>
          Please provide your information to get started
        </Text>

        {/* Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Full Name <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Feather
              name="user"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Phone Number <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Feather
              name="phone"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Age */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Age <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Feather
              name="calendar"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        {/* Gender Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Gender <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Male" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("Male")}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  gender === "Male" && styles.genderButtonTextActive,
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Female" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("Female")}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  gender === "Female" && styles.genderButtonTextActive,
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "Other" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("Other")}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  gender === "Other" && styles.genderButtonTextActive,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Height */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Height (cm) <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Feather
              name="arrow-up"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your height in cm"
              value={height}
              onChangeText={setHeight}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Weight */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Weight (kg) <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Feather
              name="anchor"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your weight in kg"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Previous Medical Conditions</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="List any previous medical conditions or diseases"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Allergies */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Allergies</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="alert-circle"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="List any allergies you have"
              value={allergies}
              onChangeText={setAllergies}
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Emergency Contact</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="phone-call"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Name and phone number of emergency contact"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.profileButton} onPress={handleSubmit}>
          <LinearGradient
            colors={["#1a73e8", "#0d47a1"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather
              name="user"
              size={22}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Create Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "#E53935",
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
  textAreaContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  textArea: {
    height: 100,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    padding: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    marginHorizontal: 4,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  genderButtonText: {
    color: "#333",
    fontSize: 16,
  },
  genderButtonTextActive: {
    color: "white",
    fontWeight: "600",
  },
  profileButton: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#f53d00",
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

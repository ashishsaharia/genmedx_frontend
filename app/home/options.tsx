import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Link, useRouter, useLocalSearchParams } from "expo-router"
import { Feather } from "@expo/vector-icons"

export default function OptionsScreen() {
  const router = useRouter();

    const { user } = useLocalSearchParams()
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Option</Text>
      <TouchableOpacity
  style={styles.button}
  onPress={() => router.replace({
                  pathname: "/home/medicalInfo",
                  params:  {user},
                })}
>
  <Feather name="file-plus" size={24} color="#4CAF50" style={styles.buttonIcon} />
  <View>
    <Text style={styles.buttonText}>Upload Medical Info</Text>
    <Text style={styles.buttonSubtext}>Add medicine and cause information</Text>
  </View>
  <Feather name="chevron-right" size={24} color="#999" />
</TouchableOpacity>


      <TouchableOpacity style={styles.button}>
        <Feather name="list" size={24} color="#2196F3" style={styles.buttonIcon} />
        <View>
          <Text style={styles.buttonText}>View Medical History</Text>
          <Text style={styles.buttonSubtext}>See your previous records</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  buttonSubtext: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
})

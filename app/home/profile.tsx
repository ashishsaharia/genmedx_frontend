"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Feather } from "@expo/vector-icons"
import * as AuthSession from "expo-auth-session"

export default function ProfileScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [userData, setUserData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  
  const firstName = userData?.name ? userData.name.split(" ")[0] : "User"
  // Mock medical conditions - in a real app, these would come from an API or storage
  const [medicalConditions, setMedicalConditions] = useState([
    { id: 1, name: "Hypertension", severity: "Moderate", dateAdded: "2023-05-15" },
    { id: 2, name: "Type 2 Diabetes", severity: "Mild", dateAdded: "2023-06-22" },
    { id: 3, name: "Asthma", severity: "Mild", dateAdded: "2022-11-03" },
  ])

  useEffect(() => {
    // Get user data from params or storage
    if (params.user) {
      try {
        const parsedUser = JSON.parse(params.user as string)
        setUserData(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    } else {
      // In a real app, you might fetch this from secure storage
      // For now, we'll use placeholder data if not available in params
      setUserData({
        given_name: "John",
        family_name: "Doe",
        email: "john.doe@example.com",
      })
    }
    setLoading(false)
  }, [params.user])

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              // Clear any auth tokens or session data
              await AuthSession.revokeAsync(
                {
                  token: "your-token-here", // Replace with actual token
                },
                {
                  revocationEndpoint: "https://api.asgardeo.io/t/genmedx/oauth2/revoke",
                }
              )
              // Navigate back to login/index page
              router.replace("/")
            } catch (error) {
              console.error("Logout error:", error)
              // Even if revoke fails, we'll still redirect to login
              router.replace("/")
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#071bf7" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.given_name ? userData.given_name[0] : "U"}
                {userData.family_name ? userData.family_name[0] : ""}
              </Text>
            </View>
          </View>
          
          <Text style={styles.userName}>
          {firstName}
          </Text>
          
          <View style={styles.infoCard}>
            <Feather name="mail" size={20} color="#071bf7" style={styles.infoIcon} />
            <Text style={styles.infoText}>{userData.email || "No email provided"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Feather name="phone" size={20} color="#071bf7" style={styles.infoIcon} />
            <Text style={styles.infoText}>{userData.phone_number || "No phone provided"}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          
          {medicalConditions.length > 0 ? (
            medicalConditions.map((condition) => (
              <View key={condition.id} style={styles.conditionCard}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionName}>{condition.name}</Text>
                  <View style={[
                    styles.severityBadge, 
                    condition.severity === "Mild" ? styles.mildBadge : 
                    condition.severity === "Moderate" ? styles.moderateBadge : 
                    styles.severeBadge
                  ]}>
                    <Text style={styles.severityText}>{condition.severity}</Text>
                  </View>
                </View>
                <Text style={styles.conditionDate}>Added: {condition.dateAdded}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="alert-circle" size={24} color="#999" />
              <Text style={styles.emptyStateText}>No medical conditions recorded</Text>
            </View>
          )}

          <TouchableOpacity style={styles.addButton}>
            <Feather name="plus" size={18} color="white" />
            <Text style={styles.addButtonText}>Add Medical Condition</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="user" size={20} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Feather name="chevron-right" size={20} color="#999" style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="bell" size={20} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingText}>Notifications</Text>
            <Feather name="chevron-right" size={20} color="#999" style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Feather name="shield" size={20} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Feather name="chevron-right" size={20} color="#999" style={styles.settingArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="white" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GenmedX v1.0.0</Text>
          <Text style={styles.footerText}>© 2023 GenmedX. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#071bf7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  conditionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#071bf7",
  },
  conditionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  mildBadge: {
    backgroundColor: "#e6f7ed",
  },
  moderateBadge: {
    backgroundColor: "#fff3e0",
  },
  severeBadge: {
    backgroundColor: "#ffebee",
  },
  severityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  conditionDate: {
    fontSize: 14,
    color: "#777",
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#071bf7",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  settingArrow: {
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#f53d00",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
})


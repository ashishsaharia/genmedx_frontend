import { Text, View, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { Button } from "@react-navigation/elements";

export default function Index() {

  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/images/landingPageBackground.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.companyName}>GenmedX</Text>
        </Text>
        <Text style={styles.subtitle}>
          Empower your health journey with innovative AI insights that guide you toward a vibrant, healthier life. Experience the future of personalized wellness.
        </Text>

        <TouchableOpacity style= {styles.exploreButton} onPressOut={() => router.push("/home/homePage")}>
            <Text style={styles.exploreButtonText}>Explore </Text>
            
          </TouchableOpacity>
          {/* <Button >         </Button> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  title: {
    marginTop: -150,
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "3%",
    color: "#071bf7",
    fontFamily: "sans-serif",
  },
  subtitle: {
    minWidth :"70%",  
    fontSize: 18,
    textAlign: "center",
    color: "#34495e",
    marginBottom: 20,
    paddingHorizontal: 10,
    maxWidth: "50%",
    fontFamily: "sans-serif",
  },
  companyName: {
    fontSize: 50,
    color: "#f53d00",
    fontFamily: "sans-serif",
  },
  exploreButton: {
    marginTop: 53,
    backgroundColor: "#071bf7", // Same as title color
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor :"white",
    // shadowColor:"blue"
    // borderColor: "#f53d00", // Same as company name color
  },
  exploreButtonText: {
    fontSize: 18,
    color: "#fff",
    // fontWeight: "bold",
    // textTransform: "uppercase",
  },
});

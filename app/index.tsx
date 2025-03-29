import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { Button } from "@react-navigation/elements";
import { useState, useEffect } from "react";
// import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

let redirectUri = AuthSession.makeRedirectUri({ path: "/home/homePage" });
let CLIENT_SECRET = "w7AnnMlXO8w6JUX1zyBMoXP5A8TKuj2nmhqwM5rsr10a";
let CLIENT_ID = "EEkeq5vwFe2Ue0Ieca5anfXx7JQa";
if (Platform.OS == "android") {
  redirectUri = AuthSession.makeRedirectUri();
  CLIENT_ID = "EEkeq5vwFe2Ue0Ieca5anfXx7JQa";
} else if (Platform.OS == "web") {
  CLIENT_ID = "Mj4BD1X2Rv3reU48BsHuxLV0aLka";
}

export default function Index() {
  const discovery = AuthSession.useAutoDiscovery(
    "https://api.asgardeo.io/t/genmedx/oauth2/token"
  );
  const [tokenResponse, setTokenResponse] = useState({});
  const [decodedIdToken, setDecodedIdToken] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: CLIENT_ID,
      responseType: "code",
      scopes: ["openid", "profile", "email", "phone"],
    },
    discovery
  );

  const getAccessToken = () => {
    if (result?.type == "success") {
      let tempHeader = {};
      const authHeader = "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

      if (Platform.OS == "web") {
        tempHeader = {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        };
      } else if (Platform.OS == "android") {
        tempHeader = {
          "Content-Type": "application/x-www-form-urlencoded",
        };
      }

      fetch("https://api.asgardeo.io/t/genmedx/oauth2/token", {
        method: "POST",
        headers: tempHeader,
        body: `grant_type=authorization_code&code=${result?.params?.code}&redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&code_verifier=${request?.codeVerifier}`,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setTokenResponse(data);
          setDecodedIdToken(jwtDecode(data.id_token));
          console.log(jwtDecode(data.id_token));
          // console.log(data);
          setIsAuthenticated(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    (async function setResult() {
      if (result) {
        if (result.type == "error") {
          Alert.alert(
            "Authentication error",
            result.params.error_description || "something went wrong"
          );
          return;
        }
        if (result.type === "success") {
          try {
            await getAccessToken();
          } catch (err) {
            console.log(err);
          }
        }
      }
    })();
  }, [result]);

  if (isAuthenticated) {
    router.replace({
      pathname: "/home/homePage",
      params: { user: JSON.stringify(decodedIdToken) },
    });
  }

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
          Empower your health journey with innovative AI insights that guide you
          toward a vibrant, healthier life. Experience the future of
          personalized wellness.
        </Text>

        <TouchableOpacity
          style={styles.exploreButton}
          onPressOut={() => promptAsync()}
        >
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
    minWidth: "70%",
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
    borderColor: "white",
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

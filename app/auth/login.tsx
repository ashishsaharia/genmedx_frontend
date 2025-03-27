import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {jwtDecode} from 'jwt-decode';
const qs = require('qs')

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({path:"/home/homePage"});
// console.log(redirectUri);


const CLIENT_ID = "Mj4BD1X2Rv3reU48BsHuxLV0aLka";


export default function App() {
  console.log("the redirect uri is ");
  console.log(redirectUri);

    const discovery = AuthSession.useAutoDiscovery('https://api.asgardeo.io/t/genmedx/oauth2/token');
    console.log(discovery);
    const [tokenResponse, setTokenResponse] = useState({});
    const [decodedIdToken, setDecodedIdToken] = useState({});

    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            redirectUri,
            clientId: CLIENT_ID,
            responseType: "code",
            scopes: ["openid", "profile", "email", "phone"]
        },
        discovery
    );

    const getAccessToken = () => {
      if (result?.type == "success") {
        fetch(
        "https://api.asgardeo.io/t/iamapptesting/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=authorization_code&code=${result?.params?.code}&client_id=${CLIENT_ID}&code_verifier=${request?.codeVerifier}`
          }).then((response) => {
              return response.json();
            }).then((data) => {
              setTokenResponse(data);
              setDecodedIdToken(jwtDecode(data.id_token));
            }).catch((err) => {
              console.log(err);
            });
        }
    }

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
            getAccessToken();
          }
        }
      })();
    }, [result]);


    return (
      <View style={styles.container}>
        <Button title="Login" disabled={!request} onPress={() => promptAsync()} />
        {decodedIdToken && <Text>Welcome {decodedIdToken.given_name || ""}!</Text>}
        {decodedIdToken && <Text>{decodedIdToken.email}</Text>}
        <View style={styles.accessTokenBlock}>
          decodedToken && <Text>Access Token: {tokenResponse.access_token}</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accessTokenBlock: {
        width: 300,
        height: 500,
        overflow: "scroll"
    }
});

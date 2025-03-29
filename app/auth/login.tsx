// import { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
// import * as AuthSession from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';
// import {jwtDecode} from 'jwt-decode';
// import { router } from 'expo-router';

// WebBrowser.maybeCompleteAuthSession();

// let redirectUri = AuthSession.makeRedirectUri({path:"/home/homePage"});
// let CLIENT_SECRET = "w7AnnMlXO8w6JUX1zyBMoXP5A8TKuj2nmhqwM5rsr10a"
// let CLIENT_ID = "EEkeq5vwFe2Ue0Ieca5anfXx7JQa";
// if(Platform.OS == "android")
// {
//   redirectUri = AuthSession.makeRedirectUri();
//   CLIENT_ID = "EEkeq5vwFe2Ue0Ieca5anfXx7JQa"
// }
// else if(Platform.OS == "web")
// {
//   CLIENT_ID = "Mj4BD1X2Rv3reU48BsHuxLV0aLka"
// }


// export default function App() {

//     const discovery = AuthSession.useAutoDiscovery('https://api.asgardeo.io/t/genmedx/oauth2/token');
//     const [tokenResponse, setTokenResponse] = useState({});
//     const [decodedIdToken, setDecodedIdToken] = useState({});
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     const [request, result, promptAsync] = AuthSession.useAuthRequest(
//         {
//             redirectUri,
//             clientId: CLIENT_ID,
//             responseType: "code",
//             scopes: ["openid", "profile", "email", "phone"]
//         },
//         discovery
//     );

//     const getAccessToken = () => {
//       if (result?.type == "success") {

//         let tempHeader = {};
//         const authHeader = "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);


//         if(Platform.OS == "web")
//         {
//           tempHeader = {
//             "Content-Type": "application/x-www-form-urlencoded",
//               "Authorization": authHeader, 
//           }
//         }
//         else if(Platform.OS == "android")
//         {
//           tempHeader = {
//             "Content-Type" : "application/x-www-form-urlencoded",
//           }
//         }

//         fetch(
//         "https://api.asgardeo.io/t/genmedx/oauth2/token",
//           {
//             method: "POST",
//             headers: tempHeader,
//             body: `grant_type=authorization_code&code=${result?.params?.code}&redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&code_verifier=${request?.codeVerifier}`
//           }).then((response) => {
//               return response.json();
//             }).then((data) => {
//               setTokenResponse(data);
//               setDecodedIdToken(jwtDecode(data.id_token));
//               console.log(jwtDecode(data.id_token));
//               // console.log(data);
//               setIsAuthenticated(true);
//             }).catch((err) => {
//               console.log(err);
//             });
//         }
//     }

//     useEffect(() => {
//       (async function setResult() {
//         if (result) {
//           if (result.type == "error") {
//             Alert.alert(
//               "Authentication error",
//               result.params.error_description || "something went wrong"
//             );
//             return;
//           }
//           if (result.type === "success") {
//             try{

//               await getAccessToken();
//             }
//             catch(err)
//             {
//               console.log(err);
//             }
            
//           }
//         }
//       })();
//     }, [result]);
    
//     if(isAuthenticated)
//       {
        
//         router.replace({
//                       pathname: "/home/homePage",
//                       params: { user: JSON.stringify(decodedIdToken) }
//                     });
        
//       }
      

//     return (
//       <View style={styles.container}>
//         <Button title="Login" disabled={!request} onPress={() => promptAsync()} />
        
//       </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     accessTokenBlock: {
//         width: 300,
//         height: 500,
//         overflow: "scroll"
//     }
// });


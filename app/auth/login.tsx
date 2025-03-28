// import { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
// import * as AuthSession from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';
// import {jwtDecode} from 'jwt-decode';
// import { useRouter } from "expo-router";
// import { useLocalSearchParams } from "expo-router";
// // import * as SecureStore from "expo-secure-store";  this was one of the way to store the user golbally.

// let CLIENT_ID = "Mj4BD1X2Rv3reU48BsHuxLV0aLka";
// let CLIENT_SECRET = "w7AnnMlXO8w6JUX1zyBMoXP5A8TKuj2nmhqwM5rsr10a"


// let discoveryUri ;
// if(Platform.OS == "android")
// {
//   // discoveryUri = "https://api.asgardeo.io/t/genmedx/oauth2/token"
//   CLIENT_ID = "EEkeq5vwFe2Ue0Ieca5anfXx7JQa"
//   CLIENT_SECRET = "w7AnnMlXO8w6JUX1zyBMoXP5A8TKuj2nmhqwM5rsr10a"
// }
// else
// { 
//   // discoveryUri = "https://api.asgardeo.io/t/genmedx/oauth2/token"
// }



// // const storeUserData = async (user:any) => {
// //   await SecureStore.setItemAsync("user", JSON.stringify(user));
// // };

// WebBrowser.maybeCompleteAuthSession();

// let redirectUri = AuthSession.makeRedirectUri({path:"/home/homePage"});

// if(Platform.OS =="android" )
// {
//   redirectUri = AuthSession.makeRedirectUri();
// }

// // console.log(redirectUri);



// export default function Login() {
//   const router = useRouter();
//   console.log("the redirect uri is ");
//   console.log(redirectUri);

//     const discovery = AuthSession.useAutoDiscovery('https://api.asgardeo.io/t/genmedx/oauth2/token');
//     console.log(discovery);
//     const [tokenResponse, setTokenResponse] = useState({});
//     const [decodedIdToken, setDecodedIdToken] = useState({});
//     const [isAuthenticated , setIsAuthenticated] = useState(global.authenticated);
//     const [accessToken, setAccessToken] = useState('');

//     const [request, result, promptAsync] = AuthSession.useAuthRequest(
//         {
//             redirectUri,
//             clientId: CLIENT_ID,
//             responseType: "code",
//             scopes: ["openid", "profile","email", 'phone']
//         },
//         discovery
//     );

//     const getAccessToken = async () => {
//       if (result?.type === "success") {
//         try {
//           const authHeader = "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    
//           let tempAccessToken = result.authentication?.accessToken
//           let headerData = {}
//           if(Platform.OS == "web")
//           {
//             headerData = {
//               "Content-Type": "application/x-www-form-urlencoded",
//               "Authorization": authHeader,
//             }
//           }
//           else
//           {
//             headerData = {
//               "Content-Type": "application/x-www-form-urlencoded",
//               "Authorization" : `Bearer ${accessToken}`
//             }
//           }
//           const response = await fetch(
//             "https://api.asgardeo.io/t/genmedx/oauth2/token",
//             {
//               method: "POST",
//               headers: headerData,
//               body: `grant_type=authorization_code&code=${result?.params?.code}&redirect_uri=${redirectUri}&code_verifier=${request?.codeVerifier}&scope=openid profile email phone`
//             }
//           );
    
//           console.log("Fetch request was successful");
    
//           const data = await response.json();
//           console.log(data);
    
//           if (data.error) {
//             throw new Error(data.error_description);
//           }
    
//           setTokenResponse(data);
//           const decodedToken = jwtDecode(data.id_token);
//           setDecodedIdToken(decodedToken);
//           setAccessToken(data.access_token);
//           console.log("the access token is ");
//           console.log(data.access_token);
//           // await storeUserData(decodedToken);
//           console.log("the user info is ");
//           console.log(decodedToken);
          
//           // const access = await fetch("https://api.asgardeo.io/t/genmedx/oauth2/userinfo", {
//           //   method: "GET",
//           //   headers: {
//           //     "Authorization": `Bearer ${data.access_token}`,
//           //     "Content-Type": "application/json",
//           //   },
//           // });
//           // const userInfo = await response.json();
//           // console.log("User Info:", userInfo);




//           router.replace({
//             pathname: "/home/homePage",
//             // params: { user: JSON.stringify(decodedToken) }
//           });
          
//         } catch (err) {
//           console.error("Token exchange failed:", err);
//         }
//       }
//     };
    

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
//             try {
//               await getAccessToken();
//               console.log("got the access token");
//               // global.authenticated = true; 
//             // setIsAuthenticated(true);
              
//             } catch (error) {
//               console.log("cannot get the access token and the error is " + error);
//             }
//           }
//         }
//       })();
//     }, [result]);


//     return (
//       <View style={styles.container}>
//         <Button title="Login" disabled={!request} onPress={() => promptAsync()} />
//         {/* {decodedIdToken && <Text>Welcome {decodedIdToken.given_name || ""}!</Text>}
//         {decodedIdToken && <Text>{decodedIdToken.email}</Text>} */}
//         <View style={styles.accessTokenBlock}>
//           {/* decodedToken && <Text>Access Token: {tokenResponse.access_token}</Text> */}
//         </View>
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















import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {jwtDecode} from 'jwt-decode';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

let redirectUri = AuthSession.makeRedirectUri({path:"/home/homePage"});

let CLIENT_ID = "EEkeq5vwFe2Ue0Ieca5anfXx7JQa";
if(Platform.OS == "android")
{
  redirectUri = AuthSession.makeRedirectUri();
  CLIENT_ID = "EEkeq5vwFe2Ue0Ieca5anfXx7JQa"
}
else if(Platform.OS == "web")
{
  CLIENT_ID = "Mj4BD1X2Rv3reU48BsHuxLV0aLka"
}


export default function App() {

    const discovery = AuthSession.useAutoDiscovery('https://api.asgardeo.io/t/genmedx/oauth2/token');
    const [tokenResponse, setTokenResponse] = useState({});
    const [decodedIdToken, setDecodedIdToken] = useState({});

    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            redirectUri,
            clientId: CLIENT_ID,
            responseType: "code",
            scopes: ["openid", "profile", "email"]
        },
        discovery
    );

    const getAccessToken = () => {
      if (result?.type == "success") {
        fetch(
        "https://api.asgardeo.io/t/genmedx/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=authorization_code&code=${result?.params?.code}&redirect_uri=${redirectUri}&client_id=${CLIENT_ID}&code_verifier=${request?.codeVerifier}`
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
             await getAccessToken();
             router.replace("/home/homePage")
          }
        }
      })();
    }, [result]);


    return (
      <View style={styles.container}>
        <Button title="Login" disabled={!request} onPress={() => promptAsync()} />
        {/* {decodedIdToken && <Text>Welcome {decodedIdToken.given_name || ""}!</Text>}
        {decodedIdToken && <Text>{decodedIdToken.email}</Text>}
        <View style={styles.accessTokenBlock}>
          decodedToken && <Text>Access Token: {tokenResponse.access_token}</Text> */}
        {/* </View> */}
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


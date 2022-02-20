/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import webClientJsonData from '../android/app/google-services.json';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const {height, width} = Dimensions.get('window');

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const innerObject = object => {
  return Object.keys(object).reduce((r, k) => {
    return typeof object[k] === 'object'
      ? innerObject(object[k])
      : ((r[k] = object[k]), r);
  }, {});
};

const onGoogleButtonPress = async props => {
  // Get the users ID token
  // const {idToken} = await GoogleSignin.signIn();
  // // Create a Google credential with the token
  // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // // Sign-in the user with the credential
  // return auth().signInWithCredential(googleCredential);
  // console.log('Props....', props);
  let webClientId = innerObject(webClientJsonData).client_id;
  GoogleSignin.configure({
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ], // [Android] what API you want to access on behalf of the user, default is email and profile
    webClientId: webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const {accessToken, idToken} = await GoogleSignin.getTokens();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential

    console.log('Yeee', userInfo, accessToken, googleCredential);
    props.navigation.navigate('Home');
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('SIGN IN CANCELLED');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('IN PROGRESS');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('PLAY SERVICES NOT AVAILABLE');
    } else {
      console.log('Something went wrong!');
    }
  }
};

const onFacebookButtonPress = async props => {
  // Get the users ID token
  // const {idToken} = await GoogleSignin.signIn();
  // // Create a Google credential with the token
  // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // // Sign-in the user with the credential
  // return auth().signInWithCredential(googleCredential);
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // console.log('Yes...', data);

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );

  // console.log('Yes...2', facebookCredential);

  // // Sign-in the user with the credential
  props.navigation.navigate('Home');
  return auth().signInWithCredential(facebookCredential);
};

const Auth: () => Node = props => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // const onGoogleButtonPress = async () => {
  //   // Get the users ID token
  //   // const {idToken} = await GoogleSignin.signIn();
  //   // // Create a Google credential with the token
  //   // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //   // // Sign-in the user with the credential
  //   // return auth().signInWithCredential(googleCredential);
  // };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            // alignItems: 'center', justifyContent: 'center', height: '100%'
            height: height,
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section> */}
          {/* <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks /> */}
          <Button
            title="Google Sign-In"
            onPress={() => onGoogleButtonPress(props)}
          />

          <View style={{height: 20}} />
          <Button
            title="Facebook Sign-In"
            onPress={
              () => onFacebookButtonPress(props)
              //   (error, result) => {
              //   console.log('uuuuu', error);
              //   console.log('uuuuu2', result);
              //   if (error) {
              //     console.log('login has error: ' + result.error);
              //   } else if (result.isCancelled) {
              //     console.log('login is cancelled.');
              //   } else {
              //     AccessToken.getCurrentAccessToken().then(data => {
              //       console.log(data.accessToken.toString());
              //     });
              //   }
              // }
            }
          />

          {/* <LoginButton
              onLoginFinished={(error, result) => {
                if (error) {
                  console.log('login has error: ' + result.error);
                } else if (result.isCancelled) {
                  console.log('login is cancelled.');
                } else {
                  AccessToken.getCurrentAccessToken().then(data => {
                    console.log(data.accessToken.toString());
                  });
                }
              }}
              onLogoutFinished={() => console.log('logout.')}
            /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    height: 60,
    width: 120,
    backgroundColor: '#C8C8C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Auth;

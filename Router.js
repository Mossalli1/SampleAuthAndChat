import React from 'react';
import Auth from './src/Auth';
import Home from './src/Home';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppColors} from './constants';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: AppColors.primaryColor,
              elevation: 5,
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: AppColors.primaryColor,
              elevation: 5,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    // <View>
    //   <Text>ggg</Text>
    // </View>
  );
};

export default Router;

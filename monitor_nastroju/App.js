import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import EntryScreen from './screens/EntryScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import MeditationScreen from './screens/MeditationScreen';
import GalleryScreen from './screens/GalleryScreen';
import QuoteScreen from './screens/QuoteScreen';
import OptionsScreen from './screens/OptionsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="Meditation" component={MeditationScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="Quote" component={QuoteScreen} />
        <Stack.Screen name="Options" component={OptionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

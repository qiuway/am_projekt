import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import EntryScreen from './src/screens/EntryScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import MeditationScreen from './src/screens/MeditationScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import QuoteScreen from './src/screens/QuoteScreen';
import OptionsScreen from './src/screens/OptionsScreen';
import MeditationSession from './src/screens/MeditationSession';
import RegisterScreen from './src/screens/RegisterScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
      <ThemeProvider>
          <NavigationContainer>
              <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Entry" component={EntryScreen} />
                  <Stack.Screen name="Statistics" component={StatisticsScreen} />
                  <Stack.Screen name="Meditation" component={MeditationScreen} />
                  <Stack.Screen name="Gallery" component={GalleryScreen} />
                  <Stack.Screen name="Quote" component={QuoteScreen} />
                  <Stack.Screen name="Options" component={OptionsScreen} />
                  <Stack.Screen name="MeditationSession" component={MeditationSession} />
              </Stack.Navigator>
          </NavigationContainer>
      </ThemeProvider>
  );
}

import React from 'react';
//import { View, Button, StyleSheet } from 'react-native';
//import colors from '../styles/colors';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons'

import EntryScreen from '../screens/EntryScreen'
import GalleryScreen from '../screens/GalleryScreen'
import MeditationScreen from '../screens/MeditationScreen'
import OptionsScreen from '../screens/OptionsScreen'
import QuoteScreen from '../screens/QuoteScreen'
import StatisticsScreen from '../screens/StatisticsScreen'


const EntryName = 'Wpis';
const GalleryName = 'Galeria';
const MeditationName = 'Medytacja';
const QuoteName = 'Cytat';
const StatisticsName = 'Statystyki';
const OptionsName = 'Opcje';

const Tab = createBottomTabNavigator(); 


export default function HomeScreen({ navigation }) {
  return (
      <Tab.Navigator
        initialRouteName={EntryName}
        screenOptions={({route}) => ({
            headerShown: true,
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let rn = route.name;

                if(rn === EntryName){
                  iconName = focused ? 'book' : 'book-outline'
                } else if (rn === GalleryName){
                  iconName = focused ? 'images' : 'images-outline'
                } else if (rn === MeditationName){
                  iconName = focused ? 'moon' : 'moon-outline'
                } else if (rn === QuoteName){
                  iconName = focused ? 'sparkles' : 'sparkles-outline'
                } else if (rn === StatisticsName){
                  iconName = focused ? 'bar-chart' : 'bar-chart-outline'
                } else if (rn === OptionsName){
                  iconName = focused ? 'settings' : 'settings-outline'
                }

                return <Ionicons name={iconName} size={size} color='#5FA777'/>

            },
            tabBarActiveTintColor: '#5FA777', 
            tabBarInactiveTintColor: 'gray',
        })}>

        <Tab.Screen name={EntryName} component={EntryScreen}/>
        <Tab.Screen name={GalleryName} component={GalleryScreen}/>
        <Tab.Screen name={MeditationName} component={MeditationScreen}/>
        <Tab.Screen name={QuoteName} component={QuoteScreen}/>
        <Tab.Screen name={StatisticsName} component={StatisticsScreen}/>
        <Tab.Screen name={OptionsName} component={OptionsScreen}/>
        

      </Tab.Navigator>

  );
}


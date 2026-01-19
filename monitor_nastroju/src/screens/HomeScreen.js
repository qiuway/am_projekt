import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../ThemeContext';

import EntryScreen from './EntryScreen';
// GalleryScreen usuwamy z Tab.Navigator, ale możesz zostawić import 
// jeśli jest potrzebny w innym miejscu (np. w Stack.Navigator)
import GalleryScreen from './GalleryScreen'; 
import MeditationScreen from './MeditationScreen';
import QuoteScreen from './QuoteScreen';
import StatisticsScreen from './StatisticsScreen';
import OptionsScreen from './OptionsScreen';

const Tab = createBottomTabNavigator();

const EntryName = 'Wpis';
const MeditationName = 'Medytacja';
const QuoteName = 'Cytat';
const StatisticsName = 'Statystyki';
const OptionsName = 'Opcje';

export default function HomeScreen() {
    const { theme } = useContext(ThemeContext);

    return (
        <Tab.Navigator
            initialRouteName={EntryName}
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === EntryName) iconName = focused ? 'book' : 'book-outline';
                    else if (route.name === MeditationName) iconName = focused ? 'moon' : 'moon-outline';
                    else if (route.name === QuoteName) iconName = focused ? 'sparkles' : 'sparkles-outline';
                    else if (route.name === StatisticsName) iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    else if (route.name === OptionsName) iconName = focused ? 'settings' : 'settings-outline';
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.accent,
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    backgroundColor: theme.background,
                },
                headerStyle: {
                    backgroundColor: theme.background,
                },
                headerTintColor: theme.text,
            })}
        >
            <Tab.Screen name={EntryName} component={EntryScreen} />
            {/* Tab.Screen z Galerią został usunięty */}
            <Tab.Screen name={MeditationName} component={MeditationScreen} />
            <Tab.Screen name={QuoteName} component={QuoteScreen} />
            <Tab.Screen name={StatisticsName} component={StatisticsScreen} />
            <Tab.Screen name={OptionsName} component={OptionsScreen} />
        </Tab.Navigator>
    );
}
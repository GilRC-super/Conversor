import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screens } from '../utils';
import { HomeScreen } from '../screens/Home';
import { ConvertScreen } from '../screens/Convert';
import { HistoryScreen } from '../screens/History';
import { RatesScreen } from '../screens/Rates';
import { SettingsScreen } from '../screens/Settings';

const Stack = createNativeStackNavigator();

export function AppNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={screens.home}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3498db',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name={screens.home}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.convert}
        component={ConvertScreen}
        options={{ title: 'Convertir' }}
      />
      <Stack.Screen
        name={screens.history}
        component={HistoryScreen}
        options={{ title: 'Historial' }}
      />
      <Stack.Screen
        name={screens.rates}
        component={RatesScreen}
        options={{ title: 'Tasas' }}
      />
      <Stack.Screen
        name={screens.settings}
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
    </Stack.Navigator>
  );
}
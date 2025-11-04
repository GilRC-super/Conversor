import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screens } from '../utils';
import { HomeScreen } from '../screens/Home';
import { ConvertScreen } from '../screens/Convert';
import { HistoryScreen } from '../screens/History';
import { RatesScreen } from '../screens/Rates';
import { SettingsScreen } from '../screens/Settings';

// Definir los tipos de las rutas
export type RootStackParamList = {
  HomeScreen: undefined;
  ConvertScreen: undefined;
  HistoryScreen: undefined;
  RatesScreen: undefined;
  SettingsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3498db',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ 
          headerShown: false,
          title: 'Inicio'
        }}
      />
      <Stack.Screen
        name="ConvertScreen"
        component={ConvertScreen}
        options={{ 
          title: 'Convertir Divisas',
          headerBackTitle: 'Atrás'
        }}
      />
      <Stack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{ 
          title: 'Historial',
          headerBackTitle: 'Atrás'
        }}
      />
      <Stack.Screen
        name="RatesScreen"
        component={RatesScreen}
        options={{ 
          title: 'Tasas de Cambio',
          headerBackTitle: 'Atrás'
        }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ 
          title: 'Configuración',
          headerBackTitle: 'Atrás'
        }}
      />
    </Stack.Navigator>
  );
}
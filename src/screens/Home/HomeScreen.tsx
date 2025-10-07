import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const options = [
    { id: 1, title: 'Convertir Divisas', screen: 'ConvertScreen', icon: '💱', color: '#3498db' },
    { id: 2, title: 'Historial', screen: 'HistoryScreen', icon: '📊', color: '#9b59b6' },
    { id: 3, title: 'Tasas Actuales', screen: 'RatesScreen', icon: '💹', color: '#e74c3c' },
    { id: 4, title: 'Configuración', screen: 'SettingsScreen', icon: '⚙️', color: '#95a5a6' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💰 Convertidor</Text>
        <Text style={styles.subtitle}>de Divisas</Text>
      </View>
      
      <Text style={styles.instruction}>Selecciona una opción:</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, { borderLeftColor: option.color }]}
            onPress={() => navigation.navigate(option.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={styles.optionText}>{option.title}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#7f8c8d',
    marginTop: -5,
  },
  instruction: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
  },
  icon: {
    fontSize: 32,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    color: '#bdc3c7',
  },
});
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

interface Rate {
  code: string;
  name: string;
  flag: string;
  rate: number;
  change: number;
}

export function RatesScreen() {
  const rates: Rate[] = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.92, change: -0.5 },
    { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧', rate: 0.79, change: 0.3 },
    { code: 'JPY', name: 'Yen Japonés', flag: '🇯🇵', rate: 149.50, change: 1.2 },
    { code: 'MXN', name: 'Peso Mexicano', flag: '🇲🇽', rate: 17.20, change: -0.8 },
    { code: 'CAD', name: 'Dólar Canadiense', flag: '🇨🇦', rate: 1.36, change: 0.1 },
    { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺', rate: 1.52, change: 0.6 },
    { code: 'CHF', name: 'Franco Suizo', flag: '🇨🇭', rate: 0.88, change: -0.2 },
    { code: 'CNY', name: 'Yuan Chino', flag: '🇨🇳', rate: 7.24, change: 0.4 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💹 Tasas de Cambio</Text>
        <Text style={styles.subtitle}>Base: 1 USD</Text>
        <Text style={styles.updated}>Actualizado hace 5 min</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer}>
        {rates.map((rate) => (
          <View key={rate.code} style={styles.rateCard}>
            <View style={styles.rateHeader}>
              <Text style={styles.flag}>{rate.flag}</Text>
              <View style={styles.rateInfo}>
                <Text style={styles.currencyCode}>{rate.code}</Text>
                <Text style={styles.currencyName}>{rate.name}</Text>
              </View>
            </View>
            <View style={styles.rateDetails}>
              <Text style={styles.rateValue}>{rate.rate.toFixed(4)}</Text>
              <View style={[
                styles.changeBadge,
                rate.change >= 0 ? styles.positiveChange : styles.negativeChange
              ]}>
                <Text style={styles.changeText}>
                  {rate.change >= 0 ? '↑' : '↓'} {Math.abs(rate.change)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  updated: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  rateCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  flag: {
    fontSize: 32,
    marginRight: 15,
  },
  rateInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  currencyName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  rateDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  changeBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  positiveChange: {
    backgroundColor: '#d5f4e6',
  },
  negativeChange: {
    backgroundColor: '#fadbd8',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
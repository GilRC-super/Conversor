import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

interface HistoryItem {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  result: string;
}

export function HistoryScreen() {
  const [history] = useState<HistoryItem[]>([
    { id: '1', date: '2025-10-04 14:30', from: 'USD', to: 'EUR', amount: '100', result: '92.00' },
    { id: '2', date: '2025-10-04 12:15', from: 'EUR', to: 'MXN', amount: '50', result: '935.87' },
    { id: '3', date: '2025-10-03 18:45', from: 'GBP', to: 'USD', amount: '200', result: '253.16' },
    { id: '4', date: '2025-10-03 10:20', from: 'MXN', to: 'USD', amount: '1000', result: '58.14' },
    { id: '5', date: '2025-10-02 16:30', from: 'USD', to: 'JPY', amount: '75', result: '11212.50' },
  ]);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>📅 {item.date}</Text>
      </View>
      <View style={styles.conversionRow}>
        <View style={styles.conversionItem}>
          <Text style={styles.amount}>{item.amount}</Text>
          <Text style={styles.currency}>{item.from}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
        <View style={styles.conversionItem}>
          <Text style={styles.result}>{item.result}</Text>
          <Text style={styles.currency}>{item.to}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📊 Historial de Conversiones</Text>
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No hay conversiones recientes</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 20,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  historyCard: {
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
  dateContainer: {
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversionItem: {
    flex: 1,
    alignItems: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  currency: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#3498db',
    marginHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});
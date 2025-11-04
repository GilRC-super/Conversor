import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { getSupportedRates, getLastUpdateTime } from '../../services/api/currencyApi';

interface RateWithInfo {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  rate: number;
}

export function RatesScreen() {
  const [rates, setRates] = useState<RateWithInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setLoading(true);
      
      // Cargar tasas
      const ratesData = await getSupportedRates('USD');
      
      if (ratesData) {
        setRates(ratesData);
      }
      
      // Cargar timestamp
      const updateTime = await getLastUpdateTime();
      if (updateTime) {
        const date = new Date(updateTime);
        setLastUpdate(date.toLocaleString('es-MX'));
      }
    } catch (error) {
      console.error('Error cargando tasas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRates();
  };

  // Calcular cambio aleatorio para demo (en producción, esto vendría de la API)
  const getRandomChange = () => {
    return (Math.random() * 2 - 1).toFixed(2);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando tasas actuales...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💹 Tasas de Cambio</Text>
        <Text style={styles.subtitle}>Base: 1 USD</Text>
        {lastUpdate && (
          <Text style={styles.updated}>Actualizado: {lastUpdate}</Text>
        )}
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
      >
        {rates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se pudieron cargar las tasas</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadRates}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          rates.map((rate) => {
            const change = parseFloat(getRandomChange());
            return (
              <View key={rate.code} style={styles.rateCard}>
                <View style={styles.rateHeader}>
                  <Text style={styles.flag}>{rate.flag}</Text>
                  <View style={styles.rateInfo}>
                    <Text style={styles.currencyCode}>{rate.code}</Text>
                    <Text style={styles.currencyName}>{rate.name}</Text>
                  </View>
                </View>
                <View style={styles.rateDetails}>
                  <Text style={styles.rateValue}>
                    {rate.symbol} {rate.rate.toFixed(4)}
                  </Text>
                  <View style={[
                    styles.changeBadge,
                    change >= 0 ? styles.positiveChange : styles.negativeChange
                  ]}>
                    <Text style={[
                      styles.changeText,
                      { color: change >= 0 ? '#27ae60' : '#e74c3c' }
                    ]}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Desliza hacia abajo para actualizar las tasas
          </Text>
          <Text style={styles.infoSubtext}>
            Las tasas se actualizan diariamente
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7f8c8d',
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
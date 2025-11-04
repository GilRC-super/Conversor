import React, { useState, useEffect } from 'react'; // ← Agregar useEffect
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { getConversions, deleteConversion, clearConversions, Conversion } from '../../services/storage'; // ← NUEVO
import { useFocusEffect } from '@react-navigation/native'; // ← NUEVO

export function HistoryScreen() {
  const [history, setHistory] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ NUEVO: Cargar historial cuando se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    setLoading(true);
    const conversions = await getConversions();
    setHistory(conversions);
    setLoading(false);
  };

  // ✅ NUEVO: Eliminar una conversión
  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar conversión',
      '¿Estás seguro de que quieres eliminar esta conversión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const deleted = await deleteConversion(id);
            if (deleted) {
              loadHistory(); // Recargar lista
            }
          },
        },
      ]
    );
  };

  // ✅ NUEVO: Limpiar todo el historial
  const handleClearAll = () => {
    Alert.alert(
      'Limpiar historial',
      '¿Estás seguro de que quieres eliminar todo el historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            const cleared = await clearConversions();
            if (cleared) {
              loadHistory();
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Conversion }) => (
    <View style={styles.historyCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>
          📅 {new Date(item.date).toLocaleString('es-MX')}
        </Text>
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
        {/* ✅ NUEVO: Botón eliminar */}
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>📊 Historial de Conversiones</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Historial de Conversiones</Text>
        {/* ✅ NUEVO: Botón limpiar todo */}
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpiar Todo</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No hay conversiones recientes</Text>
          <Text style={styles.emptySubtext}>
            Realiza tu primera conversión para verla aquí
          </Text>
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

// Agregar nuevos estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteText: {
    fontSize: 20,
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
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 10,
  },
});
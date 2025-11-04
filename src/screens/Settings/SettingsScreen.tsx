import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, ScrollView, Alert } from 'react-native';
import { getSettings, saveSettings, clearAllData, getStats } from '../../services/storage';

export function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [stats, setStats] = useState({
    totalConversions: 0,
    totalFavorites: 0,
    lastUpdate: null as string | null
  });

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      setNotifications(settings.notifications);
      setDarkMode(settings.darkMode);
      setAutoUpdate(settings.autoUpdate);
      setBaseCurrency(settings.baseCurrency);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await getStats();
      setStats(statistics);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Actualizar configuración cuando cambia un switch
  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);
    const settings = await getSettings();
    settings.notifications = value;
    await saveSettings(settings);
  };

  const handleToggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    const settings = await getSettings();
    settings.darkMode = value;
    await saveSettings(settings);
  };

  const handleToggleAutoUpdate = async (value: boolean) => {
    setAutoUpdate(value);
    const settings = await getSettings();
    settings.autoUpdate = value;
    await saveSettings(settings);
  };

  // Eliminar todos los datos
  const handleClearAllData = () => {
    Alert.alert(
      'Eliminar Todos los Datos',
      '¿Estás seguro? Esto borrará el historial, favoritos y configuraciones.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          style: 'destructive',
          onPress: async () => {
            try {
              const cleared = await clearAllData();
              if (cleared) {
                Alert.alert('Éxito', 'Todos los datos han sido eliminados');
                loadSettings(); // Recargar configuración por defecto
                loadStats();
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar los datos');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>⚙️ Configuración</Text>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>
              📊 Conversiones realizadas: {stats.totalConversions}
            </Text>
            <Text style={styles.statText}>
              ⭐ Monedas favoritas: {stats.totalFavorites}
            </Text>
            {stats.lastUpdate && (
              <Text style={styles.statText}>
                🕐 Última actualización: {new Date(stats.lastUpdate).toLocaleString('es-MX')}
              </Text>
            )}
          </View>
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🔔 Notificaciones</Text>
              <Text style={styles.settingDescription}>
                Recibe alertas de cambios importantes
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#e0e0e0', true: '#3498db' }}
              thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🌙 Modo Oscuro</Text>
              <Text style={styles.settingDescription}>
                Cambia al tema oscuro
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#e0e0e0', true: '#3498db' }}
              thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🔄 Actualización Automática</Text>
              <Text style={styles.settingDescription}>
                Actualizar tasas automáticamente
              </Text>
            </View>
            <Switch
              value={autoUpdate}
              onValueChange={handleToggleAutoUpdate}
              trackColor={{ false: '#e0e0e0', true: '#3498db' }}
              thumbColor={autoUpdate ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Moneda Predeterminada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moneda Predeterminada</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionLabel}>💵 Moneda Base</Text>
            <View style={styles.optionRight}>
              <Text style={styles.optionValue}>{baseCurrency}</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionLabel}>ℹ️ Acerca de</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionLabel}>📄 Términos y Condiciones</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionLabel}>🔒 Privacidad</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Zona de Peligro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Peligro</Text>
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}
          >
            <Text style={styles.dangerButtonText}>🗑️ Eliminar Todos los Datos</Text>
          </TouchableOpacity>
        </View>

        {/* Versión */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
          <Text style={styles.versionSubtext}>Convertidor de Divisas</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e8e8e8',
    textTransform: 'uppercase',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statText: {
    fontSize: 16,
    color: '#2c3e50',
    marginVertical: 5,
    lineHeight: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 16,
    color: '#7f8c8d',
    marginRight: 5,
  },
  arrow: {
    fontSize: 20,
    color: '#bdc3c7',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 50,
  },
  versionText: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 5,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#bdc3c7',
  },
});
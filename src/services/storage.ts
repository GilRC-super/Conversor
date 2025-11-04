import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// TIPOS DE DATOS
// ========================================

export interface Conversion {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: string;
  result: string;
  rate: number;
}

export interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoUpdate: boolean;
  baseCurrency: string;
}

export interface FavoriteCurrency {
  code: string;
  name: string;
}

// ========================================
// KEYS DE ALMACENAMIENTO
// ========================================

const KEYS = {
  CONVERSIONS: '@currency_app:conversions',
  SETTINGS: '@currency_app:settings',
  FAVORITES: '@currency_app:favorites',
  LAST_UPDATE: '@currency_app:last_update',
};

// ========================================
// CONVERSIONES (HISTORIAL)
// ========================================

/**
 * Guardar una nueva conversión en el historial
 */
export const saveConversion = async (conversion: Conversion): Promise<boolean> => {
  try {
    // 1. Obtener conversiones existentes
    const conversions = await getConversions();
    
    // 2. Agregar la nueva conversión al inicio
    const newConversions = [conversion, ...conversions];
    
    // 3. Limitar a las últimas 50 conversiones
    const limitedConversions = newConversions.slice(0, 50);
    
    // 4. Guardar en AsyncStorage
    await AsyncStorage.setItem(
      KEYS.CONVERSIONS,
      JSON.stringify(limitedConversions)
    );
    
    console.log('✅ Conversión guardada:', conversion);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar conversión:', error);
    return false;
  }
};

/**
 * Obtener todas las conversiones del historial
 */
export const getConversions = async (): Promise<Conversion[]> => {
  try {
    const conversions = await AsyncStorage.getItem(KEYS.CONVERSIONS);
    
    if (conversions) {
      return JSON.parse(conversions);
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error al obtener conversiones:', error);
    return [];
  }
};

/**
 * Eliminar una conversión del historial
 */
export const deleteConversion = async (id: string): Promise<boolean> => {
  try {
    const conversions = await getConversions();
    const filtered = conversions.filter(c => c.id !== id);
    
    await AsyncStorage.setItem(
      KEYS.CONVERSIONS,
      JSON.stringify(filtered)
    );
    
    console.log('✅ Conversión eliminada:', id);
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar conversión:', error);
    return false;
  }
};

/**
 * Limpiar todo el historial
 */
export const clearConversions = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(KEYS.CONVERSIONS);
    console.log('✅ Historial limpiado');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar historial:', error);
    return false;
  }
};

// ========================================
// CONFIGURACIÓN
// ========================================

/**
 * Obtener configuración de la app
 */
export const getSettings = async (): Promise<Settings> => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
    
    if (settings) {
      return JSON.parse(settings);
    }
    
    // Configuración por defecto
    return {
      notifications: true,
      darkMode: false,
      autoUpdate: true,
      baseCurrency: 'USD',
    };
  } catch (error) {
    console.error('❌ Error al obtener configuración:', error);
    return {
      notifications: true,
      darkMode: false,
      autoUpdate: true,
      baseCurrency: 'USD',
    };
  }
};

/**
 * Guardar configuración de la app
 */
export const saveSettings = async (settings: Settings): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    console.log('✅ Configuración guardada:', settings);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar configuración:', error);
    return false;
  }
};

// ========================================
// MONEDAS FAVORITAS
// ========================================

/**
 * Obtener monedas favoritas
 */
export const getFavorites = async (): Promise<FavoriteCurrency[]> => {
  try {
    const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
    
    if (favorites) {
      return JSON.parse(favorites);
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error al obtener favoritos:', error);
    return [];
  }
};

/**
 * Agregar moneda a favoritos
 */
export const addFavorite = async (currency: FavoriteCurrency): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    
    // Verificar si ya existe
    const exists = favorites.some(f => f.code === currency.code);
    if (exists) {
      console.log('⚠️ Moneda ya está en favoritos');
      return false;
    }
    
    favorites.push(currency);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    
    console.log('✅ Favorito agregado:', currency);
    return true;
  } catch (error) {
    console.error('❌ Error al agregar favorito:', error);
    return false;
  }
};

/**
 * Eliminar moneda de favoritos
 */
export const removeFavorite = async (code: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter(f => f.code !== code);
    
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(filtered));
    
    console.log('✅ Favorito eliminado:', code);
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar favorito:', error);
    return false;
  }
};

// ========================================
// UTILIDADES
// ========================================

/**
 * Guardar timestamp de última actualización
 */
export const saveLastUpdate = async (): Promise<boolean> => {
  try {
    const timestamp = new Date().toISOString();
    await AsyncStorage.setItem(KEYS.LAST_UPDATE, timestamp);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar timestamp:', error);
    return false;
  }
};

/**
 * Obtener timestamp de última actualización
 */
export const getLastUpdate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.LAST_UPDATE);
  } catch (error) {
    console.error('❌ Error al obtener timestamp:', error);
    return null;
  }
};

/**
 * Limpiar TODA la base de datos
 */
export const clearAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.clear();
    console.log('✅ Base de datos limpiada completamente');
    return true;
  } catch (error) {
    console.error('❌ Error al limpiar base de datos:', error);
    return false;
  }
};

/**
 * Obtener estadísticas de uso
 */
export const getStats = async () => {
  try {
    const conversions = await getConversions();
    const favorites = await getFavorites();
    const lastUpdate = await getLastUpdate();
    
    return {
      totalConversions: conversions.length,
      totalFavorites: favorites.length,
      lastUpdate: lastUpdate,
    };
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return {
      totalConversions: 0,
      totalFavorites: 0,
      lastUpdate: null,
    };
  }
};
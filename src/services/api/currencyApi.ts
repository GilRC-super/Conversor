// ===========================================
// SERVICIO DE API DE TASAS DE CAMBIO
// ===========================================

// CONFIGURA TU API KEY AQUÍ (o usa la versión pública)
const API_KEY = 'c143e0ba079a99af6942fde3'; // Cámbialo por tu API key
const USE_FREE_VERSION = false; // Cambia a false si tienes API key

// URLs de la API
const BASE_URL = USE_FREE_VERSION
  ? 'https://open.exchangerate-api.com/v6/latest'
  : `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

// ===========================================
// TIPOS DE DATOS
// ===========================================

export interface ExchangeRates {
  [currency: string]: number;
}

export interface ApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: ExchangeRates;
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

// ===========================================
// LISTA DE MONEDAS SOPORTADAS
// ===========================================

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dólar Estadounidense', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Yen Japonés', flag: '🇯🇵', symbol: '¥' },
  { code: 'MXN', name: 'Peso Mexicano', flag: '🇲🇽', symbol: '$' },
  { code: 'CAD', name: 'Dólar Canadiense', flag: '🇨🇦', symbol: '$' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺', symbol: '$' },
  { code: 'CHF', name: 'Franco Suizo', flag: '🇨🇭', symbol: 'CHF' },
  { code: 'CNY', name: 'Yuan Chino', flag: '🇨🇳', symbol: '¥' },
  { code: 'INR', name: 'Rupia India', flag: '🇮🇳', symbol: '₹' },
  { code: 'BRL', name: 'Real Brasileño', flag: '🇧🇷', symbol: 'R$' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷', symbol: '$' },
];

// ===========================================
// FUNCIONES DE LA API
// ===========================================

/**
 * Obtener tasas de cambio para una moneda base
 */
export const getExchangeRates = async (baseCurrency: string = 'USD'): Promise<ExchangeRates | null> => {
  try {
    console.log(`🌐 Obteniendo tasas para ${baseCurrency}...`);
    
    const response = await fetch(`${BASE_URL}/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    
    if (data.result === 'success') {
      console.log('✅ Tasas obtenidas correctamente');
      return data.conversion_rates;
    } else {
      console.error('❌ Error en respuesta de API');
      return null;
    }
  } catch (error) {
    console.error('❌ Error al obtener tasas:', error);
    return null;
  }
};

/**
 * Convertir una cantidad de una moneda a otra
 */
export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{ result: number; rate: number } | null> => {
  try {
    const rates = await getExchangeRates(fromCurrency);
    
    if (!rates) {
      return null;
    }
    
    const rate = rates[toCurrency];
    
    if (!rate) {
      console.error(`❌ No se encontró tasa para ${toCurrency}`);
      return null;
    }
    
    const result = amount * rate;
    
    return {
      result: parseFloat(result.toFixed(2)),
      rate: rate,
    };
  } catch (error) {
    console.error('❌ Error al convertir:', error);
    return null;
  }
};

/**
 * Obtener información de una moneda específica
 */
export const getCurrencyInfo = (code: string): Currency | undefined => {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code);
};

/**
 * Obtener múltiples tasas para las monedas soportadas
 */
export const getSupportedRates = async (baseCurrency: string = 'USD') => {
  try {
    const allRates = await getExchangeRates(baseCurrency);
    
    if (!allRates) {
      return null;
    }
    
    // Filtrar solo las monedas que soportamos
    const supportedRates = SUPPORTED_CURRENCIES.map(currency => ({
      ...currency,
      rate: allRates[currency.code] || 0,
    }));
    
    return supportedRates;
  } catch (error) {
    console.error('❌ Error al obtener tasas soportadas:', error);
    return null;
  }
};

/**
 * Verificar si la API está disponible
 */
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/USD`);
    return response.ok;
  } catch (error) {
    console.error('❌ API no disponible:', error);
    return false;
  }
};

/**
 * Obtener timestamp de última actualización
 */
export const getLastUpdateTime = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/USD`);
    const data: ApiResponse = await response.json();
    
    if (data.result === 'success') {
      return data.time_last_update_utc;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error al obtener timestamp:', error);
    return null;
  }
};
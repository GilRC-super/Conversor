import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { saveConversion, Conversion } from '../../services/storage';
import { convertCurrency, SUPPORTED_CURRENCIES, getExchangeRates } from '../../services/api/currencyApi';

export function ConvertScreen() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [ratesLoaded, setRatesLoaded] = useState(false);

  // Cargar tasas al iniciar
  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const rates = await getExchangeRates('USD');
      if (rates) {
        setRatesLoaded(true);
        console.log('✅ Tasas cargadas');
      } else {
        Alert.alert(
          'Sin Conexión',
          'No se pudieron cargar las tasas. Verifica tu conexión a internet.',
          [{ text: 'Reintentar', onPress: loadRates }]
        );
      }
    } catch (error) {
      console.error('Error cargando tasas:', error);
    }
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Ingresa una cantidad válida');
      return;
    }

    setLoading(true);
    
    try {
      const numAmount = parseFloat(amount);
      
      // Llamar a la API para convertir
      const conversionResult = await convertCurrency(numAmount, fromCurrency, toCurrency);
      
      if (conversionResult) {
        const { result: convertedAmount, rate: conversionRate } = conversionResult;
        
        setResult(convertedAmount.toString());
        setRate(conversionRate);

        // Guardar en base de datos
        const conversion: Conversion = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          from: fromCurrency,
          to: toCurrency,
          amount: amount,
          result: convertedAmount.toString(),
          rate: conversionRate,
        };

        await saveConversion(conversion);
        console.log('✅ Conversión guardada');
      } else {
        Alert.alert('Error', 'No se pudo realizar la conversión. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en conversión:', error);
      Alert.alert('Error', 'Ocurrió un error al convertir. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
    setRate(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>💱 Convertir Divisas</Text>
          
          {!ratesLoaded && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>Cargando tasas...</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cantidad a convertir</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              editable={ratesLoaded}
            />
          </View>

          <View style={styles.currencySection}>
            <Text style={styles.label}>De:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {SUPPORTED_CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyButton,
                    fromCurrency === curr.code && styles.selectedCurrency
                  ]}
                  onPress={() => {
                    setFromCurrency(curr.code);
                    setResult(null);
                    setRate(null);
                  }}
                  disabled={!ratesLoaded}
                >
                  <Text style={styles.flag}>{curr.flag}</Text>
                  <Text style={[
                    styles.currencyCode,
                    fromCurrency === curr.code && styles.selectedText
                  ]}>{curr.code}</Text>
                  <Text style={[
                    styles.currencyName,
                    fromCurrency === curr.code && styles.selectedText
                  ]}>{curr.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.swapContainer}>
            <TouchableOpacity 
              style={styles.swapButton} 
              onPress={swapCurrencies}
              disabled={!ratesLoaded}
            >
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.currencySection}>
            <Text style={styles.label}>A:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {SUPPORTED_CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyButton,
                    toCurrency === curr.code && styles.selectedCurrency
                  ]}
                  onPress={() => {
                    setToCurrency(curr.code);
                    setResult(null);
                    setRate(null);
                  }}
                  disabled={!ratesLoaded}
                >
                  <Text style={styles.flag}>{curr.flag}</Text>
                  <Text style={[
                    styles.currencyCode,
                    toCurrency === curr.code && styles.selectedText
                  ]}>{curr.code}</Text>
                  <Text style={[
                    styles.currencyName,
                    toCurrency === curr.code && styles.selectedText
                  ]}>{curr.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity 
            style={[
              styles.convertButton, 
              (!amount || !ratesLoaded || loading) && styles.disabledButton
            ]} 
            onPress={handleConvert}
            disabled={!amount || !ratesLoaded || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.convertButtonText}>Convertir</Text>
            )}
          </TouchableOpacity>

          {result && rate && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Resultado:</Text>
              <Text style={styles.resultAmount}>
                {amount} {fromCurrency}
              </Text>
              <Text style={styles.resultEquals}>=</Text>
              <Text style={styles.resultValue}>
                {result} {toCurrency}
              </Text>
              <Text style={styles.resultRate}>
                Tasa: 1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </Text>
              <Text style={styles.resultTimestamp}>
                ⏱️ Tasas actualizadas en tiempo real
              </Text>
            </View>
          )}
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#7f8c8d',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#3498db',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  currencySection: {
    marginBottom: 20,
  },
  currencyScroll: {
    marginTop: 10,
  },
  currencyButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    minWidth: 100,
  },
  selectedCurrency: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  flag: {
    fontSize: 24,
    marginBottom: 5,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  selectedText: {
    color: 'white',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  swapButton: {
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  swapIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  convertButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  convertButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  resultAmount: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: '600',
  },
  resultEquals: {
    fontSize: 24,
    color: '#7f8c8d',
    marginVertical: 10,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  resultRate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 15,
  },
  resultTimestamp: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
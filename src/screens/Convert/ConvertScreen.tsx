import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export function ConvertScreen() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<string | null>(null);

  const currencies = [
    { code: 'USD', name: 'Dólar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'Libra', flag: '🇬🇧' },
    { code: 'JPY', name: 'Yen', flag: '🇯🇵' },
    { code: 'MXN', name: 'Peso MX', flag: '🇲🇽' },
    { code: 'CAD', name: 'Dólar CA', flag: '🇨🇦' },
  ];
  
  // Tasas de ejemplo (en producción usar API real)
  const rates: { [key: string]: number } = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    MXN: 17.20,
    CAD: 1.36,
  };

  const handleConvert = () => {
    if (amount && fromCurrency && toCurrency) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const amountInUSD = numAmount / rates[fromCurrency];
        const converted = amountInUSD * rates[toCurrency];
        setResult(converted.toFixed(2));
      }
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>💱 Convertir Divisas</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cantidad a convertir</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.currencySection}>
            <Text style={styles.label}>De:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyButton,
                    fromCurrency === curr.code && styles.selectedCurrency
                  ]}
                  onPress={() => setFromCurrency(curr.code)}
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
            <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.currencySection}>
            <Text style={styles.label}>A:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyScroll}>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyButton,
                    toCurrency === curr.code && styles.selectedCurrency
                  ]}
                  onPress={() => setToCurrency(curr.code)}
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
            style={[styles.convertButton, !amount && styles.disabledButton]} 
            onPress={handleConvert}
            disabled={!amount}
          >
            <Text style={styles.convertButtonText}>Convertir</Text>
          </TouchableOpacity>

          {result && (
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
                Tasa: 1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
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
});
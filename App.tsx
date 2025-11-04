import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigation } from './src/navigations';

export default function App() {
  console.log('🚀 App iniciando...'); 
  
  return (
    <NavigationContainer>
      <AppNavigation />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigator from './src/Navigation/StackNavigation';
import ThemeProvider from './src/Contexts/ThemeProvider';
import AlertProvider from './src/Components/Ui/Alert/AlertProvider';
import AlertCard from './src/Components/Ui/Alert/AlertCard';
import { Provider } from 'react-redux';
import ReduxStore from './src/Store/ReduxStore';
import AppStorageProvider from './src/Contexts/AppStorageProvider';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <SafeAreaProvider>
        <ThemeProvider>
          <AppStorageProvider>
            <Provider store={ReduxStore} >
              <AlertProvider>
                <AlertCard />
                <StackNavigator />
              </AlertProvider>
            </Provider>
          </AppStorageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

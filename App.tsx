
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigator from "./src/Navigation/StackNavigation";
import ThemeProvider from "./src/Contexts/ThemeProvider";
import AlertProvider from "./src/Components/Alert/AlertProvider";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}} >
      <SafeAreaProvider>
        <ThemeProvider>
          <AlertProvider>
            <StackNavigator/>
          </AlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
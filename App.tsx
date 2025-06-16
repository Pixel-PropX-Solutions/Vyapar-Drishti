
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigator from "./src/Navigation/StackNavigation";
import ThemeProvider from "./src/Contexts/ThemeProvider";
import AlertProvider from "./src/Components/Alert/AlertProvider";
import AlertCard from "./src/Components/Alert/AlertCard";
import { Provider } from "react-redux";
import ReduxStore from "./src/Store/ReduxStore";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}} >
      <SafeAreaProvider>
        <ThemeProvider>
          <Provider store={ReduxStore} >
            <AlertProvider>
              <AlertCard/>
              <StackNavigator/>
            </AlertProvider>
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
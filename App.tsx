import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigator from "./src/navigation/StackNavigation";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}} >
      <SafeAreaProvider>
        <NavigationContainer>
          <View style={{width: '100%', height: '100%', flex: 1}}>
            <StackNavigator/>
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
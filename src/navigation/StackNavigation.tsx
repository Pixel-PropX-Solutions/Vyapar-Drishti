import { createStackNavigator } from "@react-navigation/stack"
import SplashScreen from "../Screens/SplashScreen";
import LandingScreen from "../Screens/LandingScreen";
import SignUpScreen from "../Screens/SignUpScreen";
import LoginScreen from "../Screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import BottomTabNavigation from "./BottomTabNavigation";
import SafePaddingView from "../Components/SafeAreaView/SafePaddingView";
import { useTheme } from "../Contexts/ThemeProvider";

export type StackParamsList = {
    'splash-screen': undefined,
    'landing-screen': undefined,
    'login-screen': undefined,
    'signup-screen': undefined,
    'tab-navigation': undefined
}

const Stack = createStackNavigator<StackParamsList>();

export default function StackNavigation(): React.JSX.Element {

    const {primaryBackgroundColor: backgroundColor} = useTheme()

    return (
        <NavigationContainer>
            <SafePaddingView style={{width: '100%', height: '100%', flex: 1}}>
                <Stack.Navigator
                    initialRouteName="splash-screen"
                    screenOptions={{headerShown: false, cardStyle: {backgroundColor}}}
                >
                    <Stack.Screen 
                        name="splash-screen" 
                        component={SplashScreen} 
                        options={{
                            animation: "scale_from_center"
                        }}  
                    />

                    <Stack.Screen 
                        name="landing-screen" 
                        component={LandingScreen} 
                        options={{
                            animation: "scale_from_center"
                        }} 
                    />

                    <Stack.Screen name="login-screen" component={LoginScreen} />
                    <Stack.Screen name="signup-screen" component={SignUpScreen} />
                    <Stack.Screen name="tab-navigation" component={BottomTabNavigation} />
                </Stack.Navigator>
            </SafePaddingView>
        </NavigationContainer>
    )
}
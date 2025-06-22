import { createStackNavigator } from "@react-navigation/stack"
import SplashScreen from "../Screens/SplashScreen";
import LandingScreen from "../Screens/LandingScreen";
import SignUpScreen from "../Screens/SignUpScreen";
import LoginScreen from "../Screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigation from "./BottomTabNavigation";
import SafePaddingView from "../Components/SafeAreaView/SafePaddingView";
import { useTheme } from "../Contexts/ThemeProvider";
import SettingScreen from "../Screens/SettingScreen";
import NotificationScreen from "../Screens/NotificationScreen";
import { Dimensions } from "react-native";
import CustomerInfoScreen from "../Screens/TabNavigationScreens/CustomerScreens/CustomerInfoScreen";
import CraeteBillScreen from "../Screens/TabNavigationScreens/BillScreens/CreateBillScreen";
import CompanyProfileScreen from "../Screens/CompanyScreens/CompanyProfileScreen";
import { NavigationRef } from "./NavigationService";

export type StackParamsList = {
    'splash-screen': undefined,
    'landing-screen': undefined,
    'login-screen': undefined,
    'signup-screen': undefined,
    'tab-navigation': undefined,
    'setting-screen': undefined,
    'notification-screen': undefined,
    
    'company-profile-screen': undefined,

    'customer-info-screen': undefined

    'create-bill-screen': {billType: string}
}

const Stack = createStackNavigator<StackParamsList>();

export default function StackNavigation(): React.JSX.Element {

    const {primaryBackgroundColor: backgroundColor} = useTheme()
    const {height, width} = Dimensions.get('screen')

    return (
        <NavigationContainer ref={NavigationRef} >
            <SafePaddingView style={{width, height}}>
                <Stack.Navigator
                    initialRouteName="splash-screen"
                    screenOptions={{headerShown: false, cardStyle: {backgroundColor}}}
                >
                    <Stack.Screen name="login-screen" component={LoginScreen} />
                    <Stack.Screen name="signup-screen" component={SignUpScreen} />
                    <Stack.Screen name="setting-screen" component={SettingScreen} />
                    <Stack.Screen name="notification-screen" component={NotificationScreen} />

                    <Stack.Screen name="company-profile-screen" component={CompanyProfileScreen} />


                    <Stack.Screen name="customer-info-screen" component={CustomerInfoScreen} />
                    <Stack.Screen name="create-bill-screen" component={CraeteBillScreen} />

                    <Stack.Screen name="splash-screen" component={SplashScreen} options={{animation: "scale_from_center"}} />
                    <Stack.Screen name="landing-screen" component={LandingScreen} options={{animation: "scale_from_center"}} />


                    <Stack.Screen name="tab-navigation" component={BottomTabNavigation} options={{animation: 'scale_from_center'}} />
                </Stack.Navigator>
            </SafePaddingView>
        </NavigationContainer>
    )
}
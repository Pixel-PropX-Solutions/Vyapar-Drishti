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
import CustomerInfoScreen from "../Screens/TabNavigationScreens/CustomerScreens/CustomerInfoScreen/CustomerInfoScreen";
import CraeteBillScreen from "../Screens/TabNavigationScreens/BillScreens/CreateBillScreen/CreateBillScreen";
import CompanyProfileScreen from "../Screens/CompanyScreens/ComplanyProfile/CompanyProfileScreen";
import { NavigationRef } from "./NavigationService";
import ProductInfoScreen from "../Screens/TabNavigationScreens/ProductScreens/ProductInfoScreen/ProductInfoScreen";
import { ComponentProps, ElementType } from "react";
import BillInfoScreen from "../Screens/TabNavigationScreens/BillScreens/BillInfoScreen/BillInfoScreen";

export type StackParamsList = {
    'splash-screen': undefined,
    'landing-screen': undefined,
    'login-screen': undefined,
    'signup-screen': undefined,
    'tab-navigation': undefined,
    'setting-screen': undefined,
    'notification-screen': undefined,
    
    'company-profile-screen': undefined,
    'product-info-screen': {productId: string}
    'customer-info-screen': {customerId: string}

    'create-bill-screen': {billType: string, id: string}
    'bill-info-screen': undefined
}

const Stack = createStackNavigator<StackParamsList>();

function withSafeView(Component: ElementType) {
    return (props: ComponentProps<typeof Component>) => (
        <SafePaddingView>
            <Component {...props} />
        </SafePaddingView>
    )
}

export default function StackNavigation(): React.JSX.Element {

    const {primaryBackgroundColor: backgroundColor} = useTheme();

    return (
        <NavigationContainer ref={NavigationRef} >
            <Stack.Navigator
                initialRouteName="splash-screen"
                screenOptions={{headerShown: false, cardStyle: {backgroundColor}}}
            >
                <Stack.Screen name="login-screen" 
                    component={withSafeView(LoginScreen)} 
                />

                <Stack.Screen name="signup-screen" 
                    component={withSafeView(SignUpScreen)} 
                />
                
                <Stack.Screen name="setting-screen" 
                    component={withSafeView(SettingScreen)} 
                />

                <Stack.Screen name="notification-screen" 
                    component={withSafeView(NotificationScreen)} 
                />

                <Stack.Screen name="company-profile-screen" 
                    component={withSafeView(CompanyProfileScreen)} 
                />

                <Stack.Screen name="product-info-screen" 
                    component={withSafeView(ProductInfoScreen)} 
                />

                <Stack.Screen name="customer-info-screen" 
                    component={withSafeView(CustomerInfoScreen)} 
                />

                <Stack.Screen name="create-bill-screen" 
                    component={withSafeView(CraeteBillScreen)} 
                />

                <Stack.Screen name="bill-info-screen" 
                    component={withSafeView(BillInfoScreen)} 
                />

                <Stack.Screen name="splash-screen" 
                    options={{animation: "scale_from_center"}} 
                    component={withSafeView(SplashScreen)} 
                />

                <Stack.Screen name="landing-screen" 
                    options={{animation: "scale_from_center"}} 
                    component={withSafeView(LandingScreen)}
                />

                <Stack.Screen name="tab-navigation" 
                    component={BottomTabNavigation} 
                    options={{animation: 'scale_from_center'}} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
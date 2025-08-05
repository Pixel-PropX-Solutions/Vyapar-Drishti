import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../Screens/SplashScreen';
import LandingScreen from '../Screens/LandingScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import LoginScreen from '../Screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigation from './BottomTabNavigation';
import SafePaddingView from '../Components/Other/SafeAreaView/SafePaddingView';
import { useTheme } from '../Contexts/ThemeProvider';
import SettingScreen from '../Screens/SettingScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import CustomerInfoScreen from '../Screens/TabNavigationScreens/CustomerScreens/CustomerInfoScreen/Screen';
import BillCreateScreen from '../Screens/TabNavigationScreens/BillScreens/BillCreateScreen/Screen';
import CompanyScreen from '../Screens/CompanyScreen/Screen';
import { NavigationRef } from './NavigationService';
import ProductInfoScreen from '../Screens/TabNavigationScreens/ProductScreens/ProductInfoScreen/Screen';
import { ComponentProps, ElementType } from 'react';
import BillInfoScreen from '../Screens/TabNavigationScreens/BillScreens/BillInfoScreen/BillInfoScreen';
import AppUpdateScreen from '../Screens/AppUpdateScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen';
import TransitionCreateScreen from '../Screens/TabNavigationScreens/BillScreens/TransactionCreateScreen/Screen';
import CustomerViewScreen from '../Screens/TabNavigationScreens/CustomerScreens/CustomerViewScreen/Screen';

export type StackParamsList = {
    'splash-screen': undefined,
    'landing-screen': undefined,
    'login-screen': undefined,
    'forgot-password-screen': undefined,
    'signup-screen': undefined,
    'tab-navigation': undefined,
    'setting-screen': undefined,
    'notification-screen': undefined,

    'company-profile-screen': undefined,
    'product-info-screen': { productId: string }

    'create-bill-screen': { type: string, id: string }
    'create-transaction-screen': { type: string, id: string }
    'bill-info-screen': { id: string },

    'customer-info-screen': { id: string },
    'customer-view-screen': { id: string },

    'inventory-screen': undefined

    'app-update-screen': undefined
}

const Stack = createStackNavigator<StackParamsList>();

function withSafeView(Component: ElementType) {
    return (props: ComponentProps<typeof Component>) => (
        <SafePaddingView>
            <Component {...props} />
        </SafePaddingView>
    );
}

export default function StackNavigation(): React.JSX.Element {

    const { primaryBackgroundColor: backgroundColor } = useTheme();

    return (
        <NavigationContainer ref={NavigationRef} >
            <Stack.Navigator
                initialRouteName="splash-screen"
                screenOptions={{ headerShown: false, cardStyle: { backgroundColor } }}
            >
                <Stack.Screen name="splash-screen" component={SplashScreen}
                    options={{ animation: 'scale_from_center' }}
                />

                <Stack.Screen name='app-update-screen' component={AppUpdateScreen}
                    options={{ animation: 'scale_from_center' }}
                />

                <Stack.Screen name="login-screen"
                    component={withSafeView(LoginScreen)}
                />

                <Stack.Screen name="forgot-password-screen"
                    component={withSafeView(ForgotPasswordScreen)}
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
                    component={withSafeView(CompanyScreen)}
                />

                <Stack.Screen name="product-info-screen"
                    component={withSafeView(ProductInfoScreen)}
                />

                <Stack.Screen name="customer-info-screen"
                    component={withSafeView(CustomerInfoScreen)}
                />

                <Stack.Screen name="create-bill-screen"
                    component={withSafeView(BillCreateScreen)}
                />

                <Stack.Screen name="bill-info-screen"
                    options={{ animation: 'scale_from_center' }}
                    component={withSafeView(BillInfoScreen)}
                />

                <Stack.Screen name="landing-screen"
                    options={{ animation: 'fade' }}
                    component={withSafeView(LandingScreen)}
                />

                <Stack.Screen name="create-transaction-screen"
                    component={withSafeView(TransitionCreateScreen)}
                    options={{ animation: 'scale_from_center' }}
                />

                <Stack.Screen name='customer-view-screen'
                    component={CustomerViewScreen}
                />

                <Stack.Screen name="tab-navigation"
                    component={BottomTabNavigation}
                    options={{ animation: 'scale_from_center' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

import { createStackNavigator } from "@react-navigation/stack"

export type StackParamsList = {
    'splash-screen': undefined,
    'landing-screen': undefined,
    'login-screen': undefined,
    'signup-screen': undefined
}

const Stack = createStackNavigator<StackParamsList>();

export default function StackNavigation(): React.JSX.Element {
    return (
        <Stack.Navigator
            initialRouteName="splash-screen"
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name="splash-screen" component={() => <></>} />
            <Stack.Screen name="landing-screen" component={() => <></>} />
            <Stack.Screen name="login-screen" component={() => <></>} />
            <Stack.Screen name="signup-screen" component={() => <></>} />
        </Stack.Navigator>
    )
}
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/TabNavigationScreens/HomeScreens/HomeScreen";
import ProductScreen from "../Screens/TabNavigationScreens/ProductScreens/ProductScreen/Screen";
import CustomerScreen from "../Screens/TabNavigationScreens/CustomerScreens/CustomerScreen";
import SettingScreen from "../Screens/TabNavigationScreens/MenuScreens/MenuScreen";
import FeatherIcons from 'react-native-vector-icons/Feather'
import { useTheme } from "../Contexts/ThemeProvider";
import { View } from "react-native";
import SafeAreaFromBottom from "../Components/Other/SafeAreaView/SafeAreaFromBottom";
import SafeAreaFromTop from "../Components/Other/SafeAreaView/SafeAreaFromTop";
import BillScreen from "../Screens/TabNavigationScreens/BillScreens/BillScreen/Screen";


export type BottomTabParamsList = {
    'home-screen': undefined,
    'product-screen': undefined,
    'customer-screen': undefined,
    'bill-screen': undefined,
    'menu-screen': undefined
}

const Tab = createBottomTabNavigator<BottomTabParamsList>();

export default function BottomTabNavigation(): React.JSX.Element {

    const {primaryColor: color, primaryBackgroundColor: backgroundColor} = useTheme();
    const activeColor = 'rgb(50,150,250)'

    return (
        <View style={{width: '100%', height: '100%'}} >
            <SafeAreaFromTop/>
            
            <Tab.Navigator
                initialRouteName="home-screen"
                screenOptions={{
                    headerShown: false, animation: 'shift', 
                    tabBarStyle: {backgroundColor, maxHeight: 69},
                    tabBarInactiveTintColor: color,
                    tabBarActiveTintColor: activeColor,
                    sceneStyle: {backgroundColor}
                }}

            >
                <Tab.Screen 
                    name="home-screen" 
                    component={HomeScreen} 
                    options={{
                        tabBarLabel: 'Home', 
                        tabBarIcon: ({focused}) => <FeatherIcons name="home" color={focused ? activeColor : color} size={20} />
                    }} 
                />
                <Tab.Screen 
                    name="product-screen" 
                    component={ProductScreen} 
                    options={{
                        tabBarLabel: 'Products',
                        tabBarIcon: ({focused}) => <FeatherIcons name="package" color={focused ? activeColor : color} size={20} />
                    }} 
                />
                <Tab.Screen 
                    name="bill-screen" 
                    component={BillScreen} 
                    options={{
                        tabBarLabel: 'Bills',
                        tabBarIcon: ({focused}) => <FeatherIcons name="file-text" color={focused ? activeColor : color} size={20} />
                    }} 
                />
                <Tab.Screen 
                    name="customer-screen" 
                    component={CustomerScreen} 
                    options={{
                        tabBarLabel: 'Cutomers',
                        tabBarIcon: ({focused}) => <FeatherIcons name="users" color={focused ? activeColor : color} size={20} />,
                        
                    }} 
                />
                <Tab.Screen 
                    name="menu-screen" 
                    component={SettingScreen} 
                    options={{
                        tabBarLabel: 'Menu',
                        tabBarIcon: ({focused}) => <FeatherIcons name="menu" color={focused ? activeColor : color} size={20} />
                    }} 
                />
            </Tab.Navigator>
            
            <SafeAreaFromBottom/>
        </View>
    )
}
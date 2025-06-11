import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { StackParamsList } from "../Navigation/StackNavigation";
import { StackNavigationProp } from "@react-navigation/stack";
import LogoImage from "../Components/Image/LogoImage";
import SafePaddingView from "../Components/SafeAreaView/SafePaddingView";
import TextTheme from "../Components/Text/TextTheme";

export default function SplashScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'splash-screen'>>();

    useEffect(() => {
        const interval = setTimeout(() => {
            navigation.replace('landing-screen');
        }, 1500);

        return () => clearInterval(interval);
    }, [])

    return (
        <SafePaddingView style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}} >
            <LogoImage size={200} />
            <TextTheme style={{fontSize: 28, fontWeight: 900}} >Vyapar Dristy</TextTheme>  
        </SafePaddingView>
    )
}
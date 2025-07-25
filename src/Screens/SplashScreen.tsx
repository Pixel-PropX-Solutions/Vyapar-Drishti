import { useCallback } from "react";
import LogoImage from "../Components/Image/LogoImage";
import { View } from "react-native";
import navigator from "../Navigation/NavigationService";
import { isVersionLower } from "../Utils/functionTools";
import DeviceInfo from "react-native-device-info";
import { APP_VERSION } from "../../env";
import useAuthentication from "../Hooks/useAuthentication";
import { useFocusEffect } from "@react-navigation/native";

export default function SplashScreen(): React.JSX.Element {

    const {navigate} = useAuthentication()

    useFocusEffect(
        useCallback(() => {                
            const timeout = setTimeout(() => {
                if(!isVersionLower(DeviceInfo.getVersion(), APP_VERSION)) {
                    navigate();
                } else {
                    navigator.reset('app-update-screen');
                } 
            }, 1000)

            return () => clearTimeout(timeout);
        }, [])
    )

    return (
        <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'white'}} >
            <LogoImage size={200} />
        </View>
    )
}
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { StackParamsList } from "../Navigation/StackNavigation";
import { StackNavigationProp } from "@react-navigation/stack";
import LogoImage from "../Components/Image/LogoImage";
import TextTheme from "../Components/Text/TextTheme";
import { View } from "react-native";
import { useAppDispatch } from "../Store/ReduxStore";
import { getCurrentUser } from "../Services/user";

export default function SplashScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'splash-screen'>>();
    const dispatch = useAppDispatch();


    

    async function handleNavigation(){

        const navigate = (isValid: boolean) => {
            if(isValid) {
                navigation.replace('tab-navigation');
            } else {
                navigation.replace('landing-screen');
            }
        }

        const oldTime = Date.now();
        
        let res = await dispatch(getCurrentUser()) as { payload: { user?: any } };

        let cuurentTime = Date.now();
       
        if(cuurentTime - oldTime < 1000) {
            setTimeout(() => navigate(Boolean(res.payload?.user)), 1000 - (cuurentTime - oldTime));
        } else {
            navigate(Boolean(res.payload.user));
        }
        
    }

    useEffect(() => {
        handleNavigation();
    }, [])

    return (
        <View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}} >
            <LogoImage size={200} />
            <TextTheme style={{fontSize: 28, fontWeight: 900}} >Vyapar Dristy</TextTheme>  
        </View>
    )
}
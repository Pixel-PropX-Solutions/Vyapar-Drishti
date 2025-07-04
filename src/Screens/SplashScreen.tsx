import { useEffect } from "react";
import LogoImage from "../Components/Image/LogoImage";
import LogoText from "../Components/Image/LogoText";
import TextTheme from "../Components/Text/TextTheme";
import { View } from "react-native";
import { useAppDispatch } from "../Store/ReduxStore";
import { getCurrentUser } from "../Services/user";
import navigator from "../Navigation/NavigationService";

export default function SplashScreen(): React.JSX.Element {

    const dispatch = useAppDispatch();

    async function handleNavigation(){

        const navigate = (isValid: boolean) => {
            if(isValid) {
                navigator.reset('tab-navigation');
            } else {
                navigator.reset('landing-screen');
            }
        }

        const oldTime = Date.now();
        
        let res = await dispatch(getCurrentUser()) as { payload: { user?: any } };

        let cuurentTime = Date.now();
       
        if(cuurentTime - oldTime < 1000) {
            setTimeout(() => navigate(Boolean(res.payload?.user)), Math.max(1000 - (cuurentTime - oldTime), 0));
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
            {/* <TextTheme style={{fontSize: 28, fontWeight: 900}} >Vyapar Dristy</TextTheme>   */}
        </View>
    )
}
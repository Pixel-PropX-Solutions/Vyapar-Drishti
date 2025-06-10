import { View } from "react-native";
import SafePaddingView from "../Components/SafeAreaView/SafePaddingView";
import NormalButton from "../Components/Button/NormalButton";
import TextTheme from "../Components/Text/TextTheme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../Navigation/StackNavigation";

export default function LandingScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'landing-screen'>>()

    return (
        <SafePaddingView style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', paddingInline: 20, backgroundColor: 'black'}}>           
            <View></View>
            
            <View style={{width: '100%', display: 'flex', gap: 6, paddingBottom: 10}}>

                <View style={{marginBottom: 14, paddingLeft: 6}}>
                    <TextTheme style={{fontWeight: 900, fontSize: 20, marginBottom: 4}} >
                        Welcome to Vyapar Drishty
                    </TextTheme>
                    
                    <TextTheme style={{fontWeight: 900}} iSPrimary={false} >
                        Simplify Your GST Billing and Complete GST invoice management with automatic tax calculations.
                    </TextTheme>
                </View>

                <NormalButton 
                    isPrimary={true}
                    text="Get Free Account" 
                    textStyle={{fontWeight: 900, fontSize: 14}} 
                    onPress={() => navigation.navigate('signup-screen')}
                />
                
                <NormalButton 
                    isPrimary={false}
                    text="Already Have Account" 
                    textStyle={{fontWeight: 900, fontSize: 14}} 
                    onPress={() => navigation.navigate('login-screen')}
                />
            </View>
       </SafePaddingView>
    )
}
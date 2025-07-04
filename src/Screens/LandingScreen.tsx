import { View } from "react-native";
import NormalButton from "../Components/Button/NormalButton";
import TextTheme from "../Components/Text/TextTheme";
import LogoImage from "../Components/Image/LogoImage";
import navigator from "../Navigation/NavigationService";

export default function LandingScreen(): React.JSX.Element {

    return (
        <View style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', paddingInline: 20}}>           
            <View style={{position: 'relative', width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20}} >
                <LogoImage size={56} borderRadius={50} />
                <TextTheme style={{fontWeight: 900, fontSize: 32}} >Vyapar Drishti</TextTheme>
            </View>
            
            <View style={{width: '100%', display: 'flex', gap: 6, paddingBottom: 10, maxWidth: 640, alignSelf: 'center'}}>

                <View style={{marginBottom: 14, paddingLeft: 6}}>
                    <TextTheme style={{fontWeight: 900, fontSize: 20, marginBottom: 4}} >
                        Welcome to Vyapar Drishti
                    </TextTheme>
                    
                    <TextTheme style={{fontWeight: 900}} isPrimary={false} >
                        Simplify Your GST Billing and Complete GST invoice management with automatic tax calculations.
                    </TextTheme>
                </View>

                <NormalButton 
                    isPrimary={true}
                    text="Get Free Account" 
                    textStyle={{fontWeight: 900, fontSize: 14}} 
                    onPress={() => navigator.navigate('signup-screen')}
                />
                
                <NormalButton 
                    isPrimary={false}
                    text="Already Have Account" 
                    textStyle={{fontWeight: 900, fontSize: 14}} 
                    onPress={() => navigator.navigate('login-screen')}
                />
            </View>
       </View>
    )
}
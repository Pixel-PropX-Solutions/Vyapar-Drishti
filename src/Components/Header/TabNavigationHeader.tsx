import { View } from "react-native";
import FeatherIcon from "../Icon/FeatherIcon";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../Navigation/StackNavigation";

export default function TabNavigationHeader(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'tab-navigation'>>()

    return (
        <View style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, justifyContent: 'space-between'}} >
            <AnimateButton 
                onPress={() => navigation.navigate('profile-screen')}
                style={{flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 10, paddingRight: 20, borderRadius: 40}}
            >
                <FeatherIcon name="user" size={20} />
                
                <TextTheme style={{fontSize: 16, fontWeight: 700}}>User Name</TextTheme>
            </AnimateButton>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
                <AnimateButton 
                    onPress={() => navigation.navigate('notification-screen')}
                    style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50}} 
                >
                    <FeatherIcon name="bell" size={20} />

                    <View style={{backgroundColor: 'rgb(250,50,50)', width: 8, aspectRatio: 1, borderRadius: 10, position: 'absolute', transform: [{translateX: 5}, {translateY: -5}]}} />
                </AnimateButton>

                <AnimateButton
                    onPress={() => navigation.navigate('setting-screen')} 
                    style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50}} 
                >
                    <FeatherIcon name="settings" size={20} />
                </AnimateButton>
            </View>
        </View>
    )
}
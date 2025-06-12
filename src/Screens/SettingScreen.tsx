import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../Components/Text/TextTheme";
import StackNavigationHeader from "../Components/Header/StackNavigationHeader";
import { Switch, View, ViewStyle } from "react-native";
import AnimateButton from "../Components/Button/AnimateButton";
import { useTheme } from "../Contexts/ThemeProvider";
import FeatherIcon from "../Components/Icon/FeatherIcon";

export default function SettingScreen(): React.JSX.Element {

    const {secondaryBackgroundColor, setTheme, theme} = useTheme()

    return (
        <View style={{width: '100%', height: '100%'}} >
            <StackNavigationHeader title="Settings" />
            <ScrollView style={{width: "100%", paddingInline: 20}} > 

            <Container 
                style={{marginBlock: 14}} 
                backgroundColor={secondaryBackgroundColor}
                onPress={() => setTheme((theme) => theme == 'dark' ? 'light' : 'dark')}
            >
                <View style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View style={{gap: 16, alignItems: 'center', flexDirection: 'row'}}>
                        <FeatherIcon name="moon" size={26} />
                        <TextTheme style={{fontWeight: '900', fontSize: 16, color: 'white'}}>Dark Mode</TextTheme>
                    </View>

                    <Switch 
                        style={{alignSelf: 'flex-end'}} 
                        value={theme == 'dark'} 
                        thumbColor={theme == 'dark' ? 'rgb(50,150,250)' : 'rgb(50,50,50)'}
                        trackColor={{false: 'white', true: 'white'}}
                        onValueChange={(value) => {setTheme(value ? 'dark' : 'light')}} 
                    />
                </View>
            </Container>


            </ScrollView>
        </View>
    )
}


type ContainerProps = {
    children: React.ReactNode,
    backgroundColor?: string,
    style?: ViewStyle,
    onPress?: ()=>void
}

function Container({children, backgroundColor='rgb(25,25,25)', style={}, onPress=()=>{}}: ContainerProps): React.JSX.Element {
    
    return (
        <AnimateButton 
            style={{padding: 20, borderRadius: 20, backgroundColor, width: '100%', overflow: 'hidden', ...style}}
            onPress={onPress}
            bubbleScale={30}
        >
            {children}
        </AnimateButton>
    )
}
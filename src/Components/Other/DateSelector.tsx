import { Pressable, View } from "react-native"
import { useTheme } from "../../Contexts/ThemeProvider"
import AnimateButton from "../Button/AnimateButton"
import FeatherIcon from "../Icon/FeatherIcon"
import TextTheme from "../Text/TextTheme"

export default function DateSelector(): React.JSX.Element {
    
    const {primaryColor: color} = useTheme()
    
    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingInline: 10, height: 40, borderRadius: 40, borderWidth: 2, borderColor: color}} >
            <AnimateButton style={{borderRadius: 20, padding: 4}}>
                <FeatherIcon name="chevron-left" size={20} />
            </AnimateButton>

            <Pressable>
                <TextTheme style={{fontSize: 16, fontWeight: 900}} >Jan, 2025</TextTheme>
            </Pressable>
            
            <AnimateButton style={{borderRadius: 20, padding: 4}}>
                <FeatherIcon name="chevron-right" size={20} />
            </AnimateButton>
        </View>
)
}
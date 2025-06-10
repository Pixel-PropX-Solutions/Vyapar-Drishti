import { Text, TextStyle } from "react-native"
import AnimateButton from "./AnimateButton"
import { useTheme } from "../../Contexts/ThemeProvider"

type Props = {
    text: string,
    isPrimary?: boolean,
    onPress?: () => void,
    textStyle?: TextStyle,
    color?: string,
    backgroundColor?: string,
    height?: number
}

export default function NormalButton({text, isPrimary=true, onPress, color, backgroundColor, textStyle, height=44}: Props){

    const {primaryBackgroundColor, primaryColor} = useTheme();

    color = color ?? primaryBackgroundColor;
    backgroundColor = backgroundColor ?? primaryColor;

    return (
        <AnimateButton 
            onPress={onPress}
            bubbleColor={isPrimary ? color : backgroundColor}
            style={{
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
                paddingInline: 20, height, borderRadius: 12,
                backgroundColor: isPrimary ? backgroundColor : 'transparent',
                borderWidth: isPrimary ? 0 : 2,
                borderColor: isPrimary ? color : backgroundColor
            }}
        >
            <Text style={[textStyle, { color: isPrimary ? color : backgroundColor }]}>
                {text}
            </Text>
        </AnimateButton>
    )   
}

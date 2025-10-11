import { GestureResponderEvent, PressableProps, View, ViewStyle } from "react-native";
import { useTheme } from "../../../Contexts/ThemeProvider";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "./AnimateButton";
import { ReactNode } from "react";
import ShowWhen from "../../Other/ShowWhen";

type Props = PressableProps & {
    title?: string,
    children?: ReactNode,
    isPrimary?: boolean,
    textColor?: string,
    backgroundColor?: string,
    fontSize?: number,
    fullWidth?: boolean,
    height?: number,
    onPress?: (e: GestureResponderEvent) => void
}

export default function RoundedButton({children, title, isPrimary, textColor, backgroundColor, fontSize, fullWidth=false, height=40, style={}, onPress, ...props}: Props): React.JSX.Element {
    
    const {primaryColor, secondaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme();

    textColor ??= (isPrimary ? primaryColor : secondaryColor);
    backgroundColor ??= (isPrimary ? primaryBackgroundColor : secondaryBackgroundColor)

    return (
        <View style={{flexDirection: fullWidth ? 'column' : 'row', width: fullWidth ? '100%' : 'auto'}} >
            <AnimateButton 
                {...props} 
                onPress={onPress} 
                style={{backgroundColor, height, paddingInline: Math.floor(height / 2), borderRadius: height, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...style as object}} 
            >
                <ShowWhen when={!!title} >
                    <TextTheme color={textColor} fontSize={fontSize} fontWeight={600} >{title}</TextTheme>
                </ShowWhen>

                {children}
            </AnimateButton>
        </View>
    )
}
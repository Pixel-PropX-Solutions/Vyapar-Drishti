import { View, ViewStyle } from "react-native";
import { useTheme } from "../../../Contexts/ThemeProvider";

type Props = {
    children?: React.ReactNode
    style?: ViewStyle,
    isPrimary?: boolean,
    backgroundColor?: string,
    useInvertTheme?: boolean
}

export default function BackgroundThemeView({children, style,isPrimary=true, backgroundColor, useInvertTheme=false}: Props): React.JSX.Element {
    
    const {primaryColor, secondaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme()
    
    if(!backgroundColor) {
        if(useInvertTheme){
            backgroundColor = isPrimary ? primaryColor : secondaryColor;
        } else {
            backgroundColor = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;
        }
    }

    return <View style={[style, {backgroundColor}]}>{children}</View>
}

import { View, ViewStyle } from "react-native";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = {
    children?: React.ReactNode
    style?: ViewStyle,
    isPrimary?: boolean,
    backgroundColor?: string
}

export default function BackgroundThemeView({children, style,isPrimary=true, backgroundColor}: Props): React.JSX.Element {
    
    const {primaryBackgroundColor, secondaryBackgroundColor} = useTheme();

    if(!backgroundColor) {
        backgroundColor = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor
    }

    return <View style={[style, {backgroundColor}]}>{children}</View>
}

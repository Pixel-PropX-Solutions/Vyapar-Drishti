import { View, ViewStyle } from "react-native";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = {
    children?: React.ReactNode
    style?: ViewStyle,
    isPrimary?: boolean
}

export default function BackgroundThemeView({children, style,isPrimary=true}: Props): React.JSX.Element {
    
    const {primaryBackgroundColor, secondaryBackgroundColor} = useTheme();

    return <View style={[style, {backgroundColor: isPrimary ? primaryBackgroundColor : secondaryBackgroundColor}]}>{children}</View>
}

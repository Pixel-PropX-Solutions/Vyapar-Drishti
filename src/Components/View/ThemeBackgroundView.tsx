import { View, ViewStyle } from "react-native";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = {
    children: React.ReactNode
    style?: ViewStyle,
    backgroundColor?: string
}

export default function ThemeBackgroundView({children, style, backgroundColor}: Props): React.JSX.Element {
    
    const {primaryBackgroundColor} = useTheme();

    backgroundColor = backgroundColor ?? primaryBackgroundColor;

    return <View style={[style, {backgroundColor}]}>{children}</View>
}
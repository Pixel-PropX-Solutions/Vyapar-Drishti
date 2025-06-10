import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = {
    children: React.ReactNode,
    style?: ViewStyle
}

export default function SafePaddingView({children, style}: Props) {
    
    const {top: paddingTop, bottom: paddingBottom} = useSafeAreaInsets();
    const {primaryBackgroundColor: backgroundColor} = useTheme();

    return (
        <View style={[style, {paddingTop, paddingBottom, backgroundColor}]}>{children}</View>
    )
}
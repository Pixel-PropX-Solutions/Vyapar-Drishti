import { Text, TextProps } from "react-native";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = TextProps & {
    color?: string,
    iSPrimary?: boolean
}

export default function TextTheme({style, children, numberOfLines, color, iSPrimary=true}: Props): React.JSX.Element {

    let {primaryColor, secondaryColor} = useTheme();

    color = color ? color : iSPrimary ? primaryColor : secondaryColor;

    return (
        <Text 
            numberOfLines={numberOfLines}  
            style={[style, { color, opacity: iSPrimary ? 1 : 0.7}]} 
        >
            {children}
        </Text>
    )
}
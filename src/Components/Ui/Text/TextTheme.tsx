/* eslint-disable react-native/no-inline-styles */
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeProvider';


const Fonts = {
    'bold': "Bold",
    'extrabold': "ExtraBold",
    'extralight': "ExtraLight",
    'light': 'Light',
    'medium': "Medium",
    'regular': 'Regilar',
    'semibold': "SemiBold",
    'thin': "Thin"
}

type FontWeight = 'bold' | 'extrabold' | 'extralight' | 'light' | 'medium' | 'regular' | 'semibold' | 'thin'


type Props = TextProps & {
    color?: string,
    isPrimary?: boolean,
    useInvertTheme?: boolean,
    fontWeight?: FontWeight,
    fontSize?: number
}

export default function TextTheme({style, children, numberOfLines, color = '', isPrimary = true, useInvertTheme=false, fontWeight='regular', fontSize=12}: Props): React.JSX.Element {

    let {primaryColor, secondaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme();

    if(!color) {
        if(useInvertTheme) {
            color =  isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;
        } else {
            color =  isPrimary ? primaryColor : secondaryColor;
        }
    }

    return (
        <Text
            numberOfLines={numberOfLines}
            style={[style, { color, opacity: isPrimary ? 1 : 0.7, fontFamily: `Roboto-${Fonts[fontWeight]}`, fontSize}]}
        >
            {children}
        </Text>
    );
}

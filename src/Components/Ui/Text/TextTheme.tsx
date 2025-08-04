/* eslint-disable react-native/no-inline-styles */
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeProvider';


const Fonts = {
    'extrabold': "ExtraBold", '900': "ExtraBold",
    'bold': "Bold", '800': 'Bold',
    'semibold': "SemiBold", '700': "SemiBold",
    'medium': "Medium", '600': 'Medium',
    'regular': 'Regular', '500': "Regular",
    'light': 'Light', '400': 'Light',
    'extralight': "ExtraLight", '300': "ExtraLight",
    'thin': "Thin", '200': 'Thin'
}

type FontWeight = 'bold' | 'extrabold' | 'extralight' | 'light' | 'medium' | 'regular' | 'semibold' | 'thin' | 900 | 800 | 700 | 600 | 500 | 400 | 300 | 200


type Props = TextProps & {
    color?: string,
    isPrimary?: boolean,
    useInvertTheme?: boolean,
    fontWeight?: FontWeight,
    fontSize?: number,
    style?: TextStyle,
    letterSpacing?: number
}

export default function TextTheme({ style, children, numberOfLines, color = '', isPrimary = true, useInvertTheme = false, fontWeight = 'regular', fontSize = 12, letterSpacing = 0 }: Props): React.JSX.Element {

    let { primaryColor, secondaryColor, primaryBackgroundColor, secondaryBackgroundColor } = useTheme();

    if (!color) {
        if (useInvertTheme) {
            color = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;
        } else {
            color = isPrimary ? primaryColor : secondaryColor;
        }
    }

    return (
        <Text
            numberOfLines={numberOfLines}
            style={{ ...(style || {}), color, opacity: isPrimary ? 1 : 0.7, fontFamily: `Roboto-${Fonts[fontWeight] ?? 'Regular'}`, fontSize, letterSpacing }}
        >
            {children}
        </Text>
    );
}

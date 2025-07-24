/* eslint-disable react-native/no-inline-styles */
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeProvider';

type Props = TextProps & {
    color?: string,
    isPrimary?: boolean,
    useInvertTheme?: boolean
}

export default function TextTheme({style, children, numberOfLines, color = '', isPrimary = true, useInvertTheme=false}: Props): React.JSX.Element {

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
            style={[style, { color, opacity: isPrimary ? 1 : 0.7}]}
        >
            {children}
        </Text>
    );
}

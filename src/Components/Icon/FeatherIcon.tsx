import FeatherIcons from 'react-native-vector-icons/Feather';
import { useTheme } from '../../Contexts/ThemeProvider';
import { ViewStyle } from 'react-native';

type Props = {
    name: string,
    size: number,
    color?: string,
    style?: ViewStyle
}

export default function FeatherIcon({name, size, color, style}: Props) {
    const {primaryColor} = useTheme();
    
    color = color ?? primaryColor;

    return <FeatherIcons name={name} size={size} color={color} style={style} />
}
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useTheme } from '../../Contexts/ThemeProvider';

type Props = {
    name: string,
    size: number,
    color?: string,
}

export default function FeatherIcon({name, size, color}: Props) {
    const {primaryColor} = useTheme();
    
    color = color ?? primaryColor;

    return <FeatherIcons name={name} size={size} color={color} />
}
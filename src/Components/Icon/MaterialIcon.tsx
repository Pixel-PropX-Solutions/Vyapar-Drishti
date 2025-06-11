import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../Contexts/ThemeProvider';

type Props = {
    name: string,
    size: number,
    color?: string,
}

export default function MaterialIcon({name, size, color}: Props) {
    const {primaryColor} = useTheme();
    
    color = color ?? primaryColor;

    return <MaterialIcons name={name} size={size} color={color} />
}
/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import TextTheme from '../Text/TextTheme';


export const StatsCard = ({ rgb, label, value }: { rgb: string, label: string, value: string }): React.JSX.Element => (
    <View style={{ backgroundColor: `rgba(${rgb},0.1)`, flex: 1, borderRadius: 12, position: 'relative', overflow: 'hidden' }} >
        <View style={{ width: '100%', position: 'absolute', bottom: 0, left: 0, height: 4, backgroundColor: `rgb(${rgb})` }} />
        <View style={{ padding: 8, width: '100%', alignItems: 'center' }} >
            <TextTheme fontSize={14} fontWeight={900}>{value}</TextTheme>
            <TextTheme isPrimary={false} fontSize={10}>{label}</TextTheme>
        </View>
    </View>
);
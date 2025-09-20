/* eslint-disable react-native/no-inline-styles */
import { ActivityIndicator, View } from 'react-native';
import TextTheme from '../Text/TextTheme';


export const StatsCard = ({ rgb, label, value, loading, valueSize = 14, labelSize = 10 }: { rgb: string, label: string, value: string, loading: boolean, valueSize?: number, labelSize?: number }): React.JSX.Element => (
    <View style={{ backgroundColor: `rgba(${rgb},0.1)`, flex: 1, borderRadius: 12, position: 'relative', overflow: 'hidden' }} >
        {loading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                <ActivityIndicator size="small" color={`rgb(${rgb})`} />
            </View >
        ) : (
            <>
                <View style={{ width: '100%', position: 'absolute', bottom: 0, left: 0, height: 4, backgroundColor: `rgb(${rgb})` }} />
                <View style={{ padding: 8, width: '100%', alignItems: 'center' }} >
                    <TextTheme fontSize={valueSize} fontWeight={900}>{value}</TextTheme>
                    <TextTheme isPrimary={false} fontSize={labelSize}>{label}</TextTheme>
                </View>
            </>
        )}
    </View>
);
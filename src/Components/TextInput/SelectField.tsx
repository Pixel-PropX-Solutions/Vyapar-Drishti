/* eslint-disable react-native/no-inline-styles */

import { View, Text } from 'react-native';
import AnimateButton from '../Button/AnimateButton';
import FeatherIcon from '../Icon/FeatherIcon';
import TextTheme from '../Text/TextTheme';
// import Popover from '../../Other/Popover';



export const SelectField = ({
    icon,
    placeholder,
    value,
    onPress,
    error,

}: {
    icon: string,
    placeholder: string,
    value: string,
    onPress: () => void,
    error?: string
}) => (
    <View style={{ marginBottom: 16 }}>
        <AnimateButton
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: error ? '#ff4444' : 'black',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 12,
                backgroundColor: 'transparent',
            }}
        >
            <FeatherIcon name={icon as any} size={20} color={error ? '#ff4444' : 'black'} />
            <TextTheme style={{
                fontSize: 16,
                fontWeight: '500',
                flex: 1,
                marginLeft: 12,
                color: value ? undefined : '#999',
            }}>
                {value || placeholder}
            </TextTheme>
            <FeatherIcon name="chevron-down" size={20} color={'black'} />
        </AnimateButton>
        {error && (
            <Text style={{ color: '#ff4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>
                {error}
            </Text>
        )}
    </View>
);

/* eslint-disable react-native/no-inline-styles */

import { View, Text, ViewStyle } from 'react-native';
import AnimateButton from '../Button/AnimateButton';
import FeatherIcon from '../../Icon/FeatherIcon';
import TextTheme from '../Text/TextTheme';
import { useTheme } from '../../../Contexts/ThemeProvider';
// import Popover from '../../Other/Popover';



export const SelectField = ({
    icon,
    placeholder,
    value,
    onPress,
    error,
    containerStyle = { marginBottom: 16 },
}: {
    icon?: React.ReactNode,
    placeholder: string,
    value: string,
    containerStyle?: ViewStyle,
    onPress: () => void,
    error?: string
}) => {
    const { primaryColor, primaryBackgroundColor } = useTheme();
    return (
        <View style={containerStyle}>
            <AnimateButton
                onPress={onPress}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: error ? '#ff4444' : primaryColor,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: error ? 'transparent' : primaryBackgroundColor,
                }}
            >
                {icon}
                <TextTheme fontSize={16} fontWeight={500} color={value ? undefined : '#999'} style={{
                    padding: 5,
                    flex: 1,
                    marginLeft: 12
                }}>
                    {value || placeholder}
                </TextTheme>
                <FeatherIcon name="chevron-down" size={20} color={'black'} />
            </AnimateButton>
            {error && (
                <TextTheme color='#ff4444' style={{ marginTop: 4, marginLeft: 4 }}>
                    {error}
                </TextTheme>
            )}
        </View>
    )
};

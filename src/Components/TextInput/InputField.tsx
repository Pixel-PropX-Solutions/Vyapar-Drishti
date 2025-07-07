/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
// import FeatherIcon from '../Icon/FeatherIcon';
import NoralTextInput from './NoralTextInput';
import { useTheme } from '../../Contexts/ThemeProvider';
import Popover from '../Other/Popover';
import FeatherIcon from '../Icon/FeatherIcon';
// import Popover from '../../Other/Popover';


export const InputField = ({
    icon,
    placeholder,
    value,
    info,
    field,
    keyboardType = 'default',
    capitalize = 'none',
    multiline = false,
    autoFocus = false,
    editable = true,
    borderWidth = 1,
    handleChange,
    error,
    // required = false,
}: {
    icon: React.ReactNode,
    placeholder: string,
    info?: string,
    value: string | number | Date | boolean,
    field: string,
    keyboardType?: 'default' | 'number-pad' | 'numeric',
    capitalize?: 'none' | 'sentences' | 'words' | 'characters',
    borderWidth?: number;
    multiline?: boolean,
    autoFocus?: boolean,
    editable?: boolean
    handleChange: (field: string, value: string | boolean | number) => void
    error?: string,
    // required?: boolean,
}) => {
    const { primaryColor, secondaryBackgroundColor } = useTheme();
    return (
        <View style={{ marginBottom: 16 }}>
            <View style={{
                flexDirection: 'row',
                alignItems: multiline ? 'flex-start' : 'center',
                borderWidth: borderWidth,
                borderColor: error ? '#ff4444' : primaryColor,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: multiline ? 12 : 8,
                backgroundColor: editable ? 'transparent' : secondaryBackgroundColor,
                opacity: editable ? 1 : 0.7,
            }}>
                {icon}

                <NoralTextInput
                    placeholder={placeholder}
                    style={{
                        fontSize: 16,
                        fontWeight: '500',
                        flex: 1,
                        marginLeft: 12,
                        minHeight: multiline ? 70 : 30,
                        transform: [{ translateY: multiline ? -10 : 0 }],
                        textAlignVertical: multiline ? 'top' : 'center',
                    }}
                    value={value.toString()}
                    capitalize={capitalize}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    editable={editable}
                    autoFocus={autoFocus}
                    onChange={(e) => handleChange(field, keyboardType === 'number-pad' || keyboardType === 'numeric' ?
                        parseFloat(e.nativeEvent.text) || 0 : e.nativeEvent.text)}
                />

                {/* {info && <Popover
                    label={info}
                    position="top"
                    style={{ padding: 4, borderRadius: 8, paddingHorizontal: 12 }}
                    icon={<FeatherIcon name="info" size={16} color={error ? '#ff4444' : 'black'} />}
                />} */}
            </View>
            {
                error && (
                    <Text style={{ color: '#ff4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>
                        {error}
                    </Text>
                )
            }
        </View>
    );
};

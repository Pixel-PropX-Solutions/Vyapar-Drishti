/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
// import FeatherIcon from '../Icon/FeatherIcon';
import NoralTextInput from './NoralTextInput';
import { useTheme } from '../../../Contexts/ThemeProvider';
import Popover from '../../Other/Popover';
import FeatherIcon from '../../Icon/FeatherIcon';
import AnimateButton from '../Button/AnimateButton';
import TextTheme from '../Text/TextTheme';
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
    secondaryButton = false,
    borderWidth = 1,
    handleChange,
    secondaryButtonAction,
    error,
    type='string',
    // required = false,
    defaultValue
}: {
    icon: React.ReactNode,
    placeholder: string,
    info?: string,
    value?: string | number | Date | boolean,
    field: string,
    keyboardType?: | 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad' | 'url'
    | 'ascii-capable' | 'numbers-and-punctuation' | 'name-phone-pad' | 'twitter' | 'web-search' | 'visible-password';
    capitalize?: 'none' | 'sentences' | 'words' | 'characters',
    borderWidth?: number;
    multiline?: boolean,
    autoFocus?: boolean,
    editable?: boolean,
    secondaryButton?: boolean,
    handleChange: (field: string, value: string | boolean | number) => void;
    secondaryButtonAction?: () => void;
    error?: string,
    type?: 'string' | 'intiger' | 'decimal' | `decimal-${number}`,
    defaultValue?: string
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
                    value={value?.toString()}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    style={{
                        fontSize: 16,
                        fontWeight: '500',
                        flex: 1,
                        marginLeft: 10,
                        minHeight: multiline ? 70 : 30,
                        transform: [{ translateY: multiline ? -10 : 0 }],
                        textAlignVertical: multiline ? 'top' : 'center',
                    }}
                    capitalize={capitalize}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    editable={editable}
                    autoFocus={autoFocus}
                    type={type}
                    onChangeText={(text) => handleChange(field, text)}
                />

                {info && <Popover
                    label={info}
                    position="top"
                    style={{ padding: 4, borderRadius: 8, paddingHorizontal: 12 }}
                    icon={<FeatherIcon name="info" size={20} color={error ? '#ff4444' : ""} />}
                />}

                {secondaryButton && <AnimateButton
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        borderWidth: 1,
                        alignItems: 'center',
                        minWidth: 80,
                        backgroundColor: 'rgb(50,200,150)',
                        borderColor: 'black',
                    }}
                    onPress={secondaryButtonAction}
                >
                    <TextTheme fontSize={14} fontWeight={500}>
                        Fetch Details
                    </TextTheme>
                </AnimateButton>}
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

/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react';
import { TextInputProps, TextStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useTheme } from '../../../Contexts/ThemeProvider';

type Props = TextInputProps & {
    placeholder: string,
    onChangeText?: (val: string) => void,
    style?: TextStyle,
    value?: string,
    color?: string,
    autoFocus?: boolean,
    capitalize?: 'none' | 'sentences' | 'words' | 'characters',
    type?: 'string' | 'intiger' | 'decimal' | `decimal${number}`
}

export default function NoralTextInput({placeholder = '', style = {}, color, onChangeText, capitalize = 'none', autoFocus = false, type='string', ...props}: Props): React.JSX.Element {

    const {primaryColor, secondaryColor} = useTheme();
    const [value, setValue] = useState<string>(props.value ?? '');

    function handleIntiger(text: string) {
        if(text.length > 0 && text[0] === '0') return;

        if('0123456789'.includes(text.at(-1) ?? ''))
            setValue(text);
    }

    function handleDecimal(text: string) {
        if(type.includes('decimal')) {
            let pre = type.replace('decimal', '');

            if('0123456789'.includes(text.at(-1) ?? ''))
                setValue(pre.length === 0 ? text : parseFloat(text).toFixed(parseInt(pre)));
            else if(text.at(-1) === '.' && !value.includes('.'))
                setValue(text);
        }
    }

    useEffect(() => {
        if(onChangeText)
            onChangeText(value)
    }, [value])

    useEffect(() => {
        setValue(props?.value ?? '')
    }, [props.value])

    return (
        <TextInput
            {...props}
            value={value}
            placeholder={placeholder}
            autoCapitalize={capitalize}
            placeholderTextColor={ color ?? secondaryColor}
            style={[{color: color ?? primaryColor, opacity: value ? 1 : 0.6, fontFamily: 'Roboto-Medium', letterSpacing: 0.5}, style]}
            onChangeText={(text) => {
                if(type === 'intiger') return handleIntiger(text);
                if(type === 'decimal') return handleDecimal(text);
                return setValue(text)
            }}
           autoFocus={autoFocus}
        />
    );
}

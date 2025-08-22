/* eslint-disable react-native/no-inline-styles */
import { TextInputProps, View, ViewStyle } from 'react-native';
import TextTheme from '../Text/TextTheme';
import { ReactNode, Ref, useEffect, useRef, useState } from 'react';
import { Text, TextInput } from 'react-native-gesture-handler';
import { useTheme } from '../../../Contexts/ThemeProvider';
import Popover from '../../Other/Popover';
import ShowWhen from '../../Other/ShowWhen';


type Props = TextInputProps & {
    label: string,
    focusColor?: string,
    message?: string,
    messageTextColor?: string,
    checkInputText?: (text: string) => boolean,
    value?: string,
    containerStyle?: ViewStyle,
    useTrim?: boolean,
    icon?: ReactNode,
    infoMessage?: string,
    infoIconSize?: number,
    infoMessageWidth?: number,
    isRequired?: boolean,
    capitalize?: 'none' | 'sentences' | 'words' | 'characters',
    postChild?: ReactNode,
    autoFocus?: boolean,
    valueRefreshDipendency?: any[],
    isNeedValueRefresh?: () => boolean
    type?: 'string' | 'integer' | 'decimal' | `decimal-${number}`
    borderWidth?: number,
}

export default function LabelTextInput({ label, icon, containerStyle, onChangeText, focusColor = 'rgb(50, 150, 250)', messageTextColor = 'rgb(200,50,50)', checkInputText, message, value = '', useTrim = true, infoMessage = '', capitalize = 'none', infoIconSize = 20, infoMessageWidth, isRequired = false, postChild, autoFocus, valueRefreshDipendency, isNeedValueRefresh, type = 'string', borderWidth = 2, ...props }: Props): React.JSX.Element {

    const { primaryColor: color, primaryBackgroundColor: backgroundColor } = useTheme();

    const input = useRef<TextInput>(null);
    const [isFocus, setFocus] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>(value);
    const [isInputTextValid, setInputTextValid] = useState<boolean>(true);

    function handleIntiger(text: string) {
        if (text.length > 0 && text[0] === '0') { return; }

        if ('0123456789'.includes(text.at(-1) ?? '')) {
            setInputText(text);
            if (useTrim) { text = text.trim(); }
            if (onChangeText) { onChangeText(text); }
            if (checkInputText) { setInputTextValid(checkInputText(text)); }
            if (!text) { setInputTextValid(true); }
        }
    }

    function handleDecimal(text: string) {
        if ('0123456789'.includes(text.at(-1) ?? '')) {
            const temp = type.split('-');
            const floatPart = text.split('.')[1] ?? '';
            if (floatPart.length > parseInt(temp[1] ?? '6')) {
                setInputText(
                    parseFloat(text)
                        .toFixed(parseInt(temp[1] ?? '6'))
                );
                if (useTrim) { text = text.trim(); }
                if (onChangeText) { onChangeText(text); }
                if (checkInputText) { setInputTextValid(checkInputText(text)); }
                if (!text) { setInputTextValid(true); }
            } else {
                setInputText(text);
                if (useTrim) { text = text.trim(); }
                if (onChangeText) { onChangeText(text); }
                if (checkInputText) { setInputTextValid(checkInputText(text)); }
                if (!text) { setInputTextValid(true); }
            }
        } else if (text.at(-1) === '.' && !text.slice(0, text.length - 1).includes('.')) {
            setInputText(text);
            if (useTrim) { text = text.trim(); }
            if (onChangeText) { onChangeText(text); }
            if (checkInputText) { setInputTextValid(checkInputText(text)); }
            if (!text) { setInputTextValid(true); }
        }
    }

    function handleOnChangeText(text: string): void {
        if (type === 'integer') { handleIntiger(text); }
        else if (type.startsWith('decimal')) { handleDecimal(text); }
        else {
            setInputText(text);
            if (useTrim) { text = text.trim(); }
            if (onChangeText) { onChangeText(text); }
            if (checkInputText) { setInputTextValid(checkInputText(text)); }
            if (!text) { setInputTextValid(true); }
        }
    }

    useEffect(() => {
        if (isNeedValueRefresh && isNeedValueRefresh()) {
            setInputText(value);
        } else {
            setInputText(value);
        }
    }, [...(valueRefreshDipendency ?? [])]);

    useEffect(() => {
        if (!autoFocus) { return; }

        const timeout = setTimeout(() => {
            input.current?.focus();
        }, 350);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={containerStyle} >
            <View
                style={{
                    borderWidth, paddingInline: 12, borderRadius: 12, position: 'relative',
                    borderColor: isInputTextValid ? isFocus ? focusColor : color : messageTextColor,
                    flexDirection: 'row', alignItems: 'center', gap: 8,
                }}
            >
                <TextTheme
                    style={{ position: 'absolute', left: 16, top: 0, transform: [{ translateY: '-50%' }], backgroundColor, paddingInline: 4, borderRadius: 4 }}
                    color={isInputTextValid ? isFocus ? focusColor : color : messageTextColor}
                >
                    {label}
                    <ShowWhen when={isRequired} >
                        <TextTheme color="rgb(250,50,50)" > *</TextTheme>
                    </ShowWhen>
                </TextTheme>

                {icon ?? null}
                <TextInput
                    {...props}
                    ref={input}
                    value={inputText}
                    autoFocus={false}
                    placeholderTextColor={'rgba(0,0,0,0.4)'}
                    autoCapitalize={capitalize}
                    onChangeText={handleOnChangeText}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={{
                        opacity: inputText ? 1 : 0.7,
                        color, paddingTop: 14, flex: 1,
                    }}
                />

                {postChild ? postChild : null}

                <ShowWhen when={!!infoMessage} >
                    <Popover
                        position="top"
                        label={infoMessage}
                        iconSize={infoIconSize}
                        width={infoMessageWidth}
                    />
                </ShowWhen>
            </View>
            {
                !(isInputTextValid || isFocus) ? (
                    <TextTheme color={messageTextColor} style={{ paddingLeft: 6 }} >
                        {message}
                    </TextTheme>
                ) : null
            }
        </View>
    );
}

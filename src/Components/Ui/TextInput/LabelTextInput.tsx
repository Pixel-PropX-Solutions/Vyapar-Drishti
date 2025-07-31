/* eslint-disable react-native/no-inline-styles */
import { TextInputProps, View, ViewStyle } from 'react-native';
import TextTheme from '../Text/TextTheme';
import { ReactNode, Ref, useState } from 'react';
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
}

export default function LabelTextInput({ label, icon, containerStyle, onChangeText, focusColor = 'rgb(50, 150, 250)', messageTextColor = 'rgb(200,50,50)', checkInputText, message, value = '', useTrim = true, infoMessage = '', capitalize = 'none', infoIconSize = 20, infoMessageWidth, isRequired = false, ...props }: Props): React.JSX.Element {

    const { primaryColor: color, primaryBackgroundColor: backgroundColor } = useTheme();

    const [isFocus, setFocus] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>(value);
    const [isInputTextValid, setInputTextValid] = useState<boolean>(true);

    function handleOnChangeText(text: string): void {
        setInputText(text);
        if (useTrim) { text = text.trim(); }
        if (onChangeText) { onChangeText(text); }
        if (checkInputText) { setInputTextValid(checkInputText(text)); }
        if (!text) { setInputTextValid(true); }
    }

    return (
        <View style={containerStyle} >
            <View
                style={{
                    borderWidth: 2, paddingInline: 12, borderRadius: 12, position: 'relative',
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
                    value={inputText}
                    placeholderTextColor={color}
                    autoCapitalize={capitalize}
                    onChangeText={handleOnChangeText}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={{
                        opacity: inputText ? 1 : 0.7,
                        color, paddingTop: 14, flex: 1,
                    }}
                />

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
                    <TextTheme color={messageTextColor} style={{paddingLeft: 6}} >
                        {message}
                    </TextTheme>
                ) : null
            }
        </View>
    );
}

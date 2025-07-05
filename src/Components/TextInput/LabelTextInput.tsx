import { KeyboardTypeOptions, TextInputProps, View, ViewStyle } from "react-native";
import TextTheme from "../Text/TextTheme";
import { Ref, useState } from "react";
import { Text, TextInput } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeProvider";


type Props = TextInputProps & {
    label: string,
    focusColor?: string,
    message?: string,
    massageTextColor?: string,
    checkInputText?: (text: string) => boolean,
    value?: string,
    containerStyle?: ViewStyle,
    useTrim?: boolean
}

export default function LabelTextInput({label, containerStyle, onChangeText, focusColor='rgb(50, 150, 250)', massageTextColor='rgb(200,50,50)', checkInputText, message, value='', useTrim=true, ...props}: Props): React.JSX.Element {

    const {primaryColor: color, primaryBackgroundColor: backgroundColor} = useTheme();

    const [isFocus, setFocus] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>(value);
    const [isInputTextValid, setInputTextValid] = useState<boolean>(true);

    function handleOnChangeText(text: string): void {
        setInputText(text);
        if(useTrim) text = text.trim();
        if(onChangeText) onChangeText(text);
        if(checkInputText) setInputTextValid(checkInputText(text));
        if(!text) setInputTextValid(true);
    }

    return (
        <View style={containerStyle} >
            <View 
                style={{
                    borderWidth: 2, paddingInline: 12, borderRadius: 12, position: 'relative',
                    borderColor: isInputTextValid ? isFocus ? focusColor : color : massageTextColor,
                }} 
            >
                <TextTheme 
                    style={{position: 'absolute', left: 16, top: 0, transform: [{translateY: '-50%'}], backgroundColor, paddingInline: 4, borderRadius: 4}}
                    color={isInputTextValid ? isFocus ? focusColor : color : massageTextColor}
                >
                    {label}
                </TextTheme>

                <TextInput  
                    {...props}
                    value={inputText}
                    placeholderTextColor={color}
                    onChangeText={handleOnChangeText}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={{
                        opacity: inputText ? 1 : 0.7,   
                        color, paddingTop: 14
                    }}
                />
            </View>
            {
                !(isInputTextValid || isFocus) ? (
                        <Text style={{paddingLeft: 6, fontSize: 12, color: massageTextColor}} >
                            {message}
                        </Text>
                    ) : null
            }
        </View>
    )
}
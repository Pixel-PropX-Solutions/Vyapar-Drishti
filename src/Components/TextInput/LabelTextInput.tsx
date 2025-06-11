import { KeyboardTypeOptions, View } from "react-native";
import TextTheme from "../Text/TextTheme";
import { useState } from "react";
import { Text, TextInput } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeProvider";


type Props = {
    placeholder: string,
    label: string,
    onChangeText?: (text: string) => void,
    focusColor?: string,
    keyboardType?: KeyboardTypeOptions,
    massage?: string,
    massageTextColor?: string,
    checkInputText?: (text: string) => boolean;
}

export default function LabelTextInput({placeholder, label, onChangeText, focusColor='rgb(50, 150, 250)', keyboardType, massageTextColor='rgb(200,50,50)', checkInputText, massage}: Props): React.JSX.Element {

    const {primaryColor: color, primaryBackgroundColor: backgroundColor} = useTheme();

    const [isFocus, setFocus] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>('');
    const [isInputTextValid, setInputTextValid] = useState<boolean>(true);

    function handleOnChangeText(text: string): void {
        setInputText(text);

        if(onChangeText) onChangeText(text);
        if(checkInputText) setInputTextValid(checkInputText(text));
        if(!text) setInputTextValid(true);
    }

    return (
        <View>
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
                    value={inputText}
                    placeholder={placeholder}
                    placeholderTextColor={color}
                    onChangeText={handleOnChangeText}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    keyboardType={keyboardType}
                    style={{
                        opacity: inputText ? 1 : 0.7,   
                        color, paddingTop: 14
                    }}
                />
            </View>
            {
                !(isInputTextValid || isFocus) ? (
                        <Text style={{paddingLeft: 6, fontSize: 12, color: massageTextColor}} >
                            {massage}
                        </Text>
                    ) : null
            }
        </View>
    )
}
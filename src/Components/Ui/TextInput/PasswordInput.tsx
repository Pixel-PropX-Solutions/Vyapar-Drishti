import { Text, TextInputProps, View } from "react-native";
import TextTheme from "../Text/TextTheme";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "../../../Contexts/ThemeProvider";
import AnimateButton from "../Button/AnimateButton";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ShowWhen from "../../Other/ShowWhen";


type Props = TextInputProps & {
    placeholder?: string,
    label?: string,
    onChangeText?: (text: string) => void,
    focusColor?: string,
    message?: string,
    massageTextColor?: string,
    checkInputText?: (text: string) => boolean,
    isRequired?: boolean
}

export default function PasswordInput({placeholder='***********', label='Password', onChangeText, focusColor='rgb(50, 150, 250)', massageTextColor='rgb(200,50,50)', checkInputText, message, isRequired=false, ...props}: Props): React.JSX.Element {

    const {primaryColor: color, primaryBackgroundColor: backgroundColor} = useTheme();

    const [isFocus, setFocus] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>('');
    const [isPasswordVisible, setPasswordVsible] = useState<boolean>(false);
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
                    borderWidth: 2, paddingInline: 12, borderRadius: 12, position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center',
                    borderColor: isInputTextValid ? isFocus ? focusColor : color : massageTextColor,
                }} 
            >
                <TextTheme 
                    style={{position: 'absolute', left: 16, top: 0, transform: [{translateY: '-50%'}], backgroundColor, paddingInline: 4, borderRadius: 4}}
                    color={isInputTextValid ? isFocus ? focusColor : color : massageTextColor}
                >
                    {label}
                    <ShowWhen when={isRequired} >
                        <TextTheme color="rgb(250,50,50)" > *</TextTheme>
                    </ShowWhen>
                </TextTheme>

                <TextInput  
                    {...props}
                    value={inputText}
                    placeholder={placeholder}
                    placeholderTextColor={color}
                    onChangeText={handleOnChangeText}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    style={{
                        opacity: inputText ? 1 : 0.7,
                        color, paddingTop: 14, flex: 1
                    }}
                />

                <AnimateButton 
                    onPress={() => setPasswordVsible((pre) => !pre)}
                    style={{aspectRatio: 1, borderRadius: '50%', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}} 
                >
                    <MaterialIcons name={isPasswordVisible ? "visibility-off" : "visibility"} size={20} color={color} />
                </AnimateButton>
            </View>
            {
                !(isInputTextValid || isFocus) ? (
                        <TextTheme color={massageTextColor} style={{paddingLeft: 6}} >
                            {message}
                        </TextTheme>
                    ) : null
            }
        </View>
    )
}
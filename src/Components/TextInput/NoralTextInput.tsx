import { Dispatch, SetStateAction, useState } from "react";
import { TextStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = {
    placeholder: string,
    onChangeText?: Dispatch<SetStateAction<string>>,
    style?: TextStyle,
    value?: string,
    color?: string
}

export default function NoralTextInput({placeholder='', onChangeText=()=>{}, style={}, value='', color}: Props): React.JSX.Element {

    const {primaryColor, secondaryColor} = useTheme();

    const [text, setText] = useState<string>(value);

    function handleOnChangeText(text: string) {
        setText(() => text);

        if(onChangeText) onChangeText(text);
    }

    return (
        <TextInput
            placeholder={placeholder}
            value={text}
            onChangeText={handleOnChangeText}
            placeholderTextColor={ color ?? secondaryColor}
            style={[{color: color ?? primaryColor, opacity: text ? 1 : 0.6}, style]}
        />
    )
}
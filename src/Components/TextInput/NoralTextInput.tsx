import { Dispatch, SetStateAction, useState } from "react";
import { TextInputProps, TextStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = TextInputProps & {
    placeholder: string,
    onChangeText?: Dispatch<SetStateAction<string>>,
    style?: TextStyle,
    value?: string,
    color?: string,
    capitalize?: 'none' | 'sentences' | 'words' | 'characters',
}

export default function NoralTextInput({placeholder='', style={}, color, onChangeText, capitalize='none', ...props}: Props): React.JSX.Element {

    const {primaryColor, secondaryColor} = useTheme();
    const [value, setValue] = useState<string>(props.value ?? '')

    return (
        <TextInput
            {...props}
            placeholder={placeholder}
            autoCapitalize={capitalize}
            placeholderTextColor={ color ?? secondaryColor}
            style={[{color: color ?? primaryColor, opacity: value ? 1 : 0.6}, style]}
            onChangeText={(text) => {
                setValue(text);
                if(onChangeText) onChangeText(text)
            }}
        />
    )
}
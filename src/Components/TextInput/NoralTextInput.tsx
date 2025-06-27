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
}

export default function NoralTextInput({placeholder='', style={}, value='', color, ...props}: Props): React.JSX.Element {

    const {primaryColor, secondaryColor} = useTheme();

    return (
        <TextInput
            {...props}
            placeholder={placeholder}
            value={value}
            placeholderTextColor={ color ?? secondaryColor}
            style={[{color: color ?? primaryColor, opacity: value ? 1 : 0.6}, style]}
        />
    )
}
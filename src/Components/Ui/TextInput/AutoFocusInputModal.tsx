import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../Contexts/ThemeProvider";
import { ScrollView, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import BottomModal from "../../Modal/BottomModal";
import TextTheme from "../Text/TextTheme";

type Props = TextInputProps & {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    onSet: (text: string) => void,
    label: string,
    placeholder: string,
    autoClose?: boolean,
    children?: ReactNode,
    containerChild?: ReactNode,
    containerStyle?: ViewStyle,
    inputValueFilters?: (newValue: string, oldValue: string) => string,
}

export default function AutoFocusInputModal({ label, placeholder, visible, setVisible, onSet, autoClose=true, children, containerChild, containerStyle, inputValueFilters, ...props }: Props) {

    const { primaryColor, secondaryColor } = useTheme();

    const [value, setValue] = useState<string>(props.defaultValue ?? "");
    const input = useRef<TextInput>(null);


    useEffect(() => {
        if (!visible) { return; }

        setValue(props.defaultValue ?? "");
        setTimeout(() => {
            input.current?.focus();
        }, 250);
    }, [visible]);

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingInline: 20, gap: 16 }}
            actionButtons={[{
                title: 'Set',
                color: 'white',
                backgroundColor: 'rgb(50,200,150)',
                onPress: () => { onSet(value); setVisible(!autoClose); },
            }]}
        >
            <TextTheme fontSize={20} fontWeight={900}>{label}</TextTheme>

            <ScrollView
                keyboardShouldPersistTaps='always'
                contentContainerStyle={{gap: 12, width: '100%'}}
                showsVerticalScrollIndicator={false}
            >
                <View style={containerStyle ? containerStyle : { borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, width: '100%', flexDirection: 'row', alignItems: 'center' }} >
                    <TextInput
                        {...props}
                        ref={input}
                        value={value}
                        placeholder={placeholder}
                        autoFocus={false}
                        placeholderTextColor={secondaryColor}
                        style={[{ fontSize: 16, flex: 1, opacity: !!value ? 1 : 0.8, color: primaryColor  }, props.style]}
                        onChangeText={(val) => {
                            if(!inputValueFilters) {
                                setValue(val)
                            } else {
                                setValue(inputValueFilters(val, value));
                            }
                        }}
                    />   

                    {containerChild}
                </View>

                {
                    children ? 
                        children : 
                    <View style={{ minHeight: 60 }} />
                }
            </ScrollView>
        </BottomModal>
    );
}
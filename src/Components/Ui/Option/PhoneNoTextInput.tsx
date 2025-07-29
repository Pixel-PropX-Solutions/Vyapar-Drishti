/* eslint-disable react-native/no-inline-styles */
import { Pressable, TextInputProps, View } from 'react-native';
import TextTheme from '../Text/TextTheme';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Text, TextInput } from 'react-native-gesture-handler';
import { useTheme } from '../../../Contexts/ThemeProvider';
import ShowWhen from '../../Other/ShowWhen';
import dialCodeData from '../../../Assets/Jsons/dial-code-data.json';
import BottomModal from '../../Modal/BottomModal';
import { capitalize } from '../../../Utils/functionTools';
import FeatherIcon from '../../Icon/FeatherIcon';
import NoralTextInput from '../TextInput/NoralTextInput';
import { FlatList } from 'react-native';
import { SectionRow } from '../../Layouts/View/SectionView';
import { PhoneNumber } from '../../../Utils/types';

export type DialCodeType = {
    code?: string, name?: string, dial_code: string
}


type Props = TextInputProps & {
    label?: string,
    phoneNumber?: PhoneNumber,
    placeholder?: string
    focusColor?: string,
    message?: string,
    messageTextColor?: string,
    isRequired?: boolean,
    checkNumberIsValid?: (text: string) => boolean,
    onChangePhoneNumber: (val: PhoneNumber) => void,

}

export default function PhoneNoTextInput({ label, onChangeText, focusColor = 'rgb(50, 150, 250)', messageTextColor = 'rgb(200,50,50)', checkNumberIsValid, message, phoneNumber, isRequired = false, placeholder = 'XXXXX-97548', onChangePhoneNumber, ...props }: Props): React.JSX.Element {

    const { primaryColor: color, primaryBackgroundColor: backgroundColor } = useTheme();

    const [isFocus, setFocus] = useState<boolean>(false);
    const [number, setNumber] = useState<string>(phoneNumber?.number ?? '');
    const [code, setCode] = useState<string>(phoneNumber?.code ?? '');
    const [isInputTextValid, setInputTextValid] = useState<boolean>(true);

    const [isCodeModalVisible, setCodeModalVisible] = useState<boolean>(false);

    function handleOnChangeText(text: string): void {
        if (!'0123456789'.includes(text.at(-1) ?? '')) { return; }

        setNumber(text);
        text = text.trim();

        if (onChangeText) { onChangeText(text); }

        if (checkNumberIsValid) { setInputTextValid(checkNumberIsValid(text)); }

        if (!text) { setInputTextValid(true); }
    }

    useEffect(() => {
        onChangePhoneNumber({ code, number });
    }, [code, number]);

    return (
        <View>
            <ShowWhen when={!!label?.trim()} >
                <TextTheme isPrimary={false} style={{ marginBottom: 8, paddingLeft: 4, fontSize: 16, fontWeight: 900 }} >
                    {label}
                </TextTheme>
            </ShowWhen>

            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 12 }} >
                <Pressable
                    style={{
                        borderWidth: 2, paddingInline: 12, borderRadius: 12, position: 'relative', flexDirection: 'row', alignItems: 'center', height: 44, minWidth: 80,
                        borderColor: number && !code ? messageTextColor : color,
                    }}

                    onPress={() => { setCodeModalVisible(true); }}
                >
                    <TextTheme
                        color={number && !code ? messageTextColor : color}
                        style={{ position: 'absolute', left: 12, top: 0, transform: [{ translateY: '-50%' }], backgroundColor, paddingInline: 4, borderRadius: 4 }}
                    >
                        {'Code'}
                        <ShowWhen when={isRequired} >
                            <TextTheme color="rgb(250,50,50)" > *</TextTheme>
                        </ShowWhen>
                    </TextTheme>

                    <TextTheme isPrimary={!!code}>
                        {code || '+ 91'}
                    </TextTheme>
                </Pressable>

                <View
                    style={{
                        borderWidth: 2, paddingInline: 12, borderRadius: 12, position: 'relative',
                        borderColor: isInputTextValid ? isFocus ? focusColor : color : messageTextColor,
                        flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1,
                    }}
                >
                    <TextTheme
                        style={{ position: 'absolute', left: 14, top: 0, transform: [{ translateY: '-50%' }], backgroundColor, paddingInline: 4, borderRadius: 4 }}
                        color={isInputTextValid ? isFocus ? focusColor : color : messageTextColor}
                    >
                        {'Phone No'}
                        <ShowWhen when={isRequired} >
                            <TextTheme color="rgb(250,50,50)" > *</TextTheme>
                        </ShowWhen>
                    </TextTheme>

                    <TextInput
                        {...props}
                        value={number}
                        placeholder={placeholder}
                        placeholderTextColor={color}
                        onChangeText={handleOnChangeText}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        keyboardType="number-pad"
                        style={{
                            opacity: number ? 1 : 0.7,
                            color, paddingTop: 14, flex: 1,
                        }}
                    />
                </View>
            </View>
            {
                !(isInputTextValid || isFocus) ? (
                    <Text style={{ paddingLeft: 6, fontSize: 12, color: messageTextColor }} >
                        {message}
                    </Text>
                ) : null
            }

            <DialCodeSelectorModal
                visible={isCodeModalVisible} setVisible={setCodeModalVisible}
                selected={{ dial_code: code }}
                onSelect={({ dial_code }) => { setCode(dial_code); }}
            />
        </View>
    );
}



type DialCodeModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    onSelect: (PhoneNumberCode: DialCodeType) => void,
    selected?: DialCodeType
}

export function DialCodeSelectorModal({ visible, setVisible, onSelect, selected }: DialCodeModalProps): React.JSX.Element {

    const { primaryColor } = useTheme();

    const selected_: DialCodeType | undefined = (
        dialCodeData.find(item => item.dial_code === selected?.dial_code)
    );

    const [data, setData] = useState<DialCodeType[]>(dialCodeData);
    const timeoutId = useRef<NodeJS.Timeout>(undefined);

    function handleDataFilter(inputValue: string): void {
        inputValue = inputValue.trim().toLowerCase();
        clearTimeout(timeoutId.current);
        if (!inputValue) {
            setData(dialCodeData);
            return;
        }

        timeoutId.current = setTimeout(() => {
            setData(dialCodeData.filter(item => (
                item.dial_code.includes(inputValue) ||
                item.name.toLowerCase().startsWith(inputValue) ||
                item.code.toLowerCase().startsWith(inputValue)
            )));
        }, 250);
    }

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingInline: 20, gap: 20 }}
            topMargin={0}
        >
            <TextTheme style={{ fontSize: 20, fontWeight: 900 }} >
                Select Your Country Code
            </TextTheme>

            <ShowWhen when={!!selected?.dial_code} >
                <View style={{ width: '100%', padding: 16, borderRadius: 16, backgroundColor: 'rgba(150, 50, 250, 1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View>
                        <TextTheme color="white" style={{ fontWeight: 400, fontSize: 14 }} >
                            {capitalize(selected_?.name ?? '')} Country
                        </TextTheme>

                        <TextTheme color="white" style={{ fontWeight: 900, fontSize: 16 }} >
                            {selected_?.dial_code}
                        </TextTheme>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                        <FeatherIcon name="check" size={20} color="white" />
                        <TextTheme color="white" style={{ fontWeight: 900 }} >Selected</TextTheme>
                    </View>
                </View>
            </ShowWhen>

            <View
                style={{ borderWidth: 2, borderColor: primaryColor, borderRadius: 100, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 10, paddingRight: 16, gap: 8 }}
            >
                <FeatherIcon name="search" size={20} />

                <NoralTextInput
                    placeholder="Search"
                    style={{ flex: 1 }}
                    onChangeText={handleDataFilter}
                />
            </View>

            <FlatList
                contentContainerStyle={{ gap: 10 }}
                data={data}
                keyboardShouldPersistTaps="always"
                keyExtractor={(item, index) => (
                    item.dial_code + index.toString()
                )}

                renderItem={({ item }) => (
                    <SectionRow
                        style={{ justifyContent: 'space-between' }}
                        onPress={() => {
                            setVisible(false);
                            setData(dialCodeData);
                            if (onSelect) { onSelect(item); }
                        }}
                    >
                        <TextTheme style={{ fontWeight: 900, fontSize: 16 }}>{item.name}</TextTheme>
                        <TextTheme style={{ fontWeight: 600, fontSize: 16 }}>{item.dial_code}</TextTheme>
                    </SectionRow>
                )}
            />

        </BottomModal>
    );
}

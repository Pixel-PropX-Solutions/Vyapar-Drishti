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
    massageTextColor?: string,
    checkNumberIsValid?: (text: string) => boolean,
    onChangePhoneNumber: (val: PhoneNumber) => void,

}

export default function PhoneNoInputField({ label, onChangeText, focusColor = 'rgb(50, 150, 250)', massageTextColor = 'rgb(200,50,50)', checkNumberIsValid, message, phoneNumber, placeholder = 'XXXXX-97548', onChangePhoneNumber, ...props }: Props): React.JSX.Element {

    const { primaryColor: color } = useTheme();

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
                        borderWidth: 1,
                        paddingInline: 12,
                        borderRadius: 12,
                        position: 'relative',
                        borderColor: color,
                        flexDirection: 'row',
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        height: 50,
                        minWidth: 80,
                        marginLeft: 2,
                        gap: 8,
                    }}

                    onPress={() => { setCodeModalVisible(true); }}
                >
                    <FeatherIcon name="phone" size={20} />

                    <TextTheme isPrimary={!!code}>
                        {code || '+91'}
                    </TextTheme>
                </Pressable>

                <View
                    style={{
                        borderWidth: 1,
                        paddingInline: 12,
                        borderRadius: 12,
                        position: 'relative',
                        borderColor: isInputTextValid ? isFocus ? focusColor : color : massageTextColor,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        flex: 1,
                    }}
                >
                    <FeatherIcon name="phone" size={20} />

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
                            color,
                            paddingTop: 14,
                            flex: 1,
                            fontSize: 16,
                            fontWeight: '500',
                            marginLeft: 2,
                            minHeight: 30,
                            textAlignVertical: 'center',
                        }}
                    />
                </View>
            </View>
            {
                !(isInputTextValid || isFocus) ? (
                    <TextTheme fontSize={12} style={{ paddingLeft: 6 }} color={massageTextColor}>
                        {message}
                    </TextTheme>
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
            <TextTheme fontSize={20} fontWeight={900}>
                Select Your Country Code
            </TextTheme>

            <ShowWhen when={!!selected?.dial_code} >
                <View style={{ width: '100%', padding: 16, borderRadius: 16, backgroundColor: 'rgba(150, 50, 250, 1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    <View>
                        <TextTheme color="white" fontWeight={400} fontSize={14}>
                            {capitalize(selected_?.name ?? '')} Country
                        </TextTheme>

                        <TextTheme color="white" fontWeight={900} fontSize={16}>
                            {selected_?.dial_code}
                        </TextTheme>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                        <FeatherIcon name="check" size={20} color="white" />
                        <TextTheme color="white" fontWeight={900}>Selected</TextTheme>
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
                        <TextTheme fontWeight={900} fontSize={16}>{item.name}</TextTheme>
                        <TextTheme fontWeight={600} fontSize={16}>{item.dial_code}</TextTheme>
                    </SectionRow>
                )}
            />

        </BottomModal>
    );
}

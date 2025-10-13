/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import BottomModal from '../BottomModal';
import TextTheme from '../../Ui/Text/TextTheme';
import { ScrollView, View } from 'react-native';
import LabelTextInput from '../../Ui/TextInput/LabelTextInput';
import FeatherIcon from '../../Icon/FeatherIcon';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { useAppDispatch, useUserStore } from '../../../Store/ReduxStore';
import { createCustomer, viewAllCustomers } from '../../../Services/customer';
import { useAlert } from '../../Ui/Alert/AlertProvider';
import AnimateButton from '../../Ui/Button/AnimateButton';
import LoadingModal from '../LoadingModal';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    setPrimaryVisible?: Dispatch<SetStateAction<boolean>>,
}

type FormDataType = {
    bank_account_number: string,
    bank_account_holder: string,
    bank_name: string,
    bank_ifsc: string,
    bank_branch: string,
    opening_balance: string
}

export default function CreateAccountModal({ visible, setVisible, setPrimaryVisible }: Props): React.JSX.Element {
    const dispatch = useAppDispatch();
    const { setAlert } = useAlert();
    const { primaryColor, secondaryBackgroundColor, primaryBackgroundColor, secondaryColor } = useTheme();
    const [loading, setLoading] = useState<boolean>(false);
    const { current_company_id } = useUserStore();
    const data = useRef<FormDataType>({
        bank_account_number: '',
        bank_account_holder: '',
        bank_branch: '',
        bank_ifsc: '',
        bank_name: '',
        opening_balance: '',
    });
    const [balanceType, setBalanceType] = useState<'Debit' | 'Credit'>('Debit');

    const resetForm = () => {
        data.current = { bank_account_number: '', bank_account_holder: '', bank_branch: '', bank_ifsc: '', bank_name: '', opening_balance: '' };
    };

    async function handleCreate() {
        if (!data.current.bank_account_number || !data.current.bank_account_holder || !data.current.bank_name) {
            setAlert({
                type: 'error',
                id: 'create-customer-modal',
                message: 'Account Number, Holder Name and Bank Name are required fields',
            });
            return;
        }
        setLoading(true);
        const formData = new FormData();
        Object.entries(data.current).forEach(([key, value]) => {
            if (value) { formData.append(key, value); }
        });
        formData.append('company_id', current_company_id ?? '');
        formData.append('parent', 'Bank Accounts');
        formData.append('parent_id', 'caea08ac-37fe-4f3b-9577-a6ed78777fa3');
        formData.append('name', `${data.current.bank_name} - ${data.current.bank_account_number}`);
        formData.append('opening_balance', balanceType === 'Debit' ? -Number(data.current.opening_balance) : Number(data.current.opening_balance));

        await dispatch(createCustomer(formData)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                dispatch(viewAllCustomers(current_company_id ?? ''));
                setVisible(false);
                setVisible(false);
                if (setPrimaryVisible) { setPrimaryVisible(false); }
                resetForm();
                setLoading(false);
            }
            setVisible(false);
            resetForm();
            setLoading(false);
            if (setPrimaryVisible) { setPrimaryVisible(false); }
        }).catch(() => {
            setLoading(false);
            setVisible(false);
        });
    }

    useEffect(() => {
        if (visible) { resetForm(); }
    }, [visible]);

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            actionButtons={[{ title: 'Add Account', onPress: handleCreate }]}
        >
            <ScrollView
                style={{ width: '100%' }}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingInline: 20, alignItems: 'center', gap: 32 }}
            >
                <View style={{ gap: 2, alignItems: 'center' }} >
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: secondaryBackgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 12,
                    }}>
                        <FeatherIcon name="credit-card" size={30} color={primaryColor} />
                    </View>
                    <TextTheme fontSize={16} fontWeight={600} style={{ textAlign: 'center' }} >Add a new account</TextTheme>
                    <TextTheme style={{ textAlign: 'center' }} >Fill details to add a new account</TextTheme>
                </View>

                <View style={{ width: '100%', gap: 24 }} >
                    <LabelTextInput
                        useTrim={true}
                        label="Account Number"
                        keyboardType="numeric"
                        placeholder="Enter account name"
                        icon={<FeatherIcon name="hash" size={16} />}
                        onChangeText={val => { data.current.bank_account_number = val; }}
                    />

                    <LabelTextInput
                        useTrim={true}
                        label="Holder Name"
                        capitalize="words"
                        placeholder="Enter account holder name"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={val => { data.current.bank_account_holder = val; }}
                    />

                    <LabelTextInput
                        useTrim={true}
                        label="Bank Name"
                        placeholder="Enter bank name"
                        capitalize="characters"
                        containerStyle={{ flex: 1 }}
                        icon={<FeatherIcon name="credit-card" size={16} />}
                        onChangeText={val => { data.current.bank_name = val; }}
                    />

                    <LabelTextInput
                        useTrim={true}
                        label="Branch Name"
                        capitalize="words"
                        placeholder="Enter Bank branch name"
                        icon={<FeatherIcon name="map-pin" size={16} />}
                        onChangeText={val => { data.current.bank_branch = val; }}
                    />

                    <View style={{ display: 'flex', gap: 2, flexDirection: 'row', width: '100%' }} >
                        <LabelTextInput
                            useTrim={true}
                            label="IFSC Code"
                            placeholder="Enter IFSC code"
                            capitalize="characters"
                            containerStyle={{ flex: 1 }}
                            icon={<FeatherIcon name="key" size={16} />}
                            onChangeText={val => { data.current.bank_ifsc = val; }}
                        />
                        <LabelTextInput
                            useTrim={true}
                            label="Opening Balance"
                            keyboardType="numeric"
                            placeholder="Enter Opening balance"
                            containerStyle={{ flex: 1 }}
                            icon={<FeatherIcon name="dollar" size={16} />}
                            onChangeText={val => { data.current.opening_balance = val; }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }} >
                        <TextTheme fontWeight={700} fontSize={16} >Balance Type:</TextTheme>
                        <AnimateButton
                            onPress={() => { setBalanceType('Debit'); }}
                            bubbleColor={balanceType === 'Debit' ? primaryBackgroundColor : primaryColor}
                            style={{
                                alignItems: 'center', justifyContent: 'center', paddingInline: 14, borderRadius: 40,
                                flexDirection: 'row', gap: 8,
                            }}
                        >
                            <FeatherIcon
                                name={balanceType === 'Debit' ? 'check-circle' : 'circle'}
                                size={16}
                                color={balanceType === 'Debit' ? primaryColor : secondaryColor}
                            />
                            <TextTheme
                                isPrimary={balanceType === 'Debit'}
                                useInvertTheme={balanceType === 'Debit'}
                                fontSize={12}
                                fontWeight={900}
                                color={balanceType === 'Debit' ? primaryColor : secondaryColor}
                            >
                                Debit
                            </TextTheme>
                        </AnimateButton>
                        <AnimateButton
                            onPress={() => { setBalanceType('Credit'); }}
                            bubbleColor={balanceType === 'Credit' ? primaryBackgroundColor : primaryColor}
                            style={{
                                alignItems: 'center', justifyContent: 'center', paddingInline: 14, borderRadius: 40,
                                flexDirection: 'row', gap: 8,
                            }}
                        >
                            <FeatherIcon
                                name={balanceType === 'Credit' ? 'check-circle' : 'circle'}
                                size={16}
                                color={balanceType === 'Credit' ? primaryColor : secondaryColor}
                            />
                            <TextTheme
                                isPrimary={balanceType === 'Credit'}
                                useInvertTheme={balanceType === 'Credit'}
                                fontSize={12}
                                fontWeight={900}
                                color={balanceType === 'Credit' ? primaryColor : secondaryColor}
                            >
                                Credit
                            </TextTheme>
                        </AnimateButton>
                    </View>


                </View>

                <View style={{ minHeight: 10 }} />
            </ScrollView>
            <LoadingModal visible={loading} />
        </BottomModal>
    );
}

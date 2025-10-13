/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import FeatherIcon from '../../Components/Icon/FeatherIcon';
import TextTheme from '../../Components/Ui/Text/TextTheme';
import AnimateButton from '../../Components/Ui/Button/AnimateButton';
import { useTheme } from '../../Contexts/ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import ShowWhen from '../../Components/Other/ShowWhen';
import BackgroundThemeView from '../../Components/Layouts/View/BackgroundThemeView';
import { useContraContext } from './Context';
import { Account1SelectorModal, Account2SelectorModal, ContraNoEditorModal } from './Modals';
import AutoFocusInputModal from '../../Components/Ui/TextInput/AutoFocusInputModal';
import { StackParamsList } from '../../Navigation/StackNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import navigator from '../../Navigation/NavigationService';
import { useAppDispatch, useUserStore } from '../../Store/ReduxStore';
import { CreateInvoiceData } from '../../Utils/types';
import { createInvoice, getInvoiceCounter } from '../../Services/invoice';
import DateSelectorModal from '../../Components/Modal/Selectors/DateSelectorModal';
import { SectionRowWithIcon } from '../../Components/Layouts/View/SectionView';
import MaterialDesignIcon from '../../Components/Icon/MaterialDesignIcon';
import { useAppStorage } from '../../Contexts/AppStorageProvider';

export function Header() {

    const router = useRoute<RouteProp<StackParamsList, 'create-contra-screen'>>();
    const { type } = router.params;
    const { secondaryBackgroundColor } = useTheme();

    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingBlock: 10, paddingHorizontal: 20,
        }} >
            <AnimateButton
                onPress={() => navigator.goBack()}
                style={{ borderWidth: 2, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 44, aspectRatio: 1, borderColor: secondaryBackgroundColor }}
            >
                <FeatherIcon name="arrow-left" size={20} />
            </AnimateButton>

            <View style={{
                borderRadius: 40,
                borderWidth: 2,
                borderColor: secondaryBackgroundColor,
                height: 44,
                paddingInline: 20,
                alignItems: 'center',
                flexDirection: 'row',
                gap: 8,
            }} >
                <FeatherIcon name="book" size={14} />
                <TextTheme fontSize={14} fontWeight={700}>{type}</TextTheme>
            </View>
        </View>
    );
}


export function ContraNoSelector() {

    const { voucherNo, setVoucherNo } = useContraContext();
    const { secondaryBackgroundColor } = useTheme();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();

    useEffect(() => {
        dispatch(getInvoiceCounter({
            company_id: current_company_id || '',
            voucher_type: 'Contra',
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                setVoucherNo(response.payload.current_number);
            }
        }).catch((error) => {
            console.error('Error fetching customers:', error);
        });
    }, [dispatch, current_company_id, setVoucherNo]);

    return (
        <>
            <AnimateButton
                style={{
                    padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', borderColor: secondaryBackgroundColor, gap: 12, alignItems: 'center', backgroundColor: voucherNo ? 'rgba(60, 180, 120, 0.5)' : secondaryBackgroundColor,
                }}
                onPress={() => { setModalVisible(true); }}
            >
                <BackgroundThemeView
                    style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                >
                    <FeatherIcon name="hash" size={16} />
                </BackgroundThemeView>

                <View style={{ flex: 1 }}>
                    <TextTheme fontSize={14} fontWeight={700} style={{ marginBottom: 2 }}>
                        Contra No
                    </TextTheme>
                    <TextTheme isPrimary={false} fontSize={13} fontWeight={500}>
                        {voucherNo || 'Auto-generated'}
                    </TextTheme>
                </View>
            </AnimateButton>
            <ContraNoEditorModal
                visible={isModalVisible}
                setVisible={setModalVisible}
            />
        </>
    );
}



export function DateSelector() {

    const { date: createOn, setDate } = useContraContext();
    const { secondaryBackgroundColor } = useTheme();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <AnimateButton
            style={{
                padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', borderColor: secondaryBackgroundColor, gap: 12, alignItems: 'center',
                backgroundColor: createOn ? 'rgba(60, 180, 120, 0.5)' : secondaryBackgroundColor,
            }}

            bubbleScale={10}
            onPress={() => { setModalVisible(true); }}
        >
            <BackgroundThemeView
                style={{
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                }}
            >
                <FeatherIcon name="calendar" size={16} />
            </BackgroundThemeView>

            <View style={{ flex: 1 }}>
                <TextTheme fontSize={14} fontWeight={900} style={{ marginBottom: 2 }}>
                    Date
                </TextTheme>
                <TextTheme isPrimary={false} fontSize={13} fontWeight={500}>
                    {createOn}
                </TextTheme>
            </View>
        </AnimateButton>

        <DateSelectorModal
            visible={isModalVisible} setVisible={setModalVisible}

            value={(() => {
                const [date, month, year] = createOn.split('/').map(Number);
                return { date, month: month - 1, year };
            })()}

            onSelect={({ year, month, date }) => {
                setDate(`${date.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`);
            }}
        />
    </>);
}

export function Account1Selector() {
    const { account1 } = useContraContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);


    return (<>
        <SectionRowWithIcon
            icon={<FeatherIcon name="credit-card" size={20} />}
            label={account1 ? account1?.name : 'From'}
            text={account1 ? account1?.name ?? 'No Account' : 'Tab to select'}
            backgroundColor={account1 ? 'rgba(60,180,120, 0.5)' : ''}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            onPress={() => { setModalVisible(true); }}
        />
        <Account1SelectorModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}

export function Account2Selector() {
    const { account2 } = useContraContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);


    return (<>
        <SectionRowWithIcon
            icon={<FeatherIcon name="credit-card" size={20} />}
            label={account2 ? account2?.name : 'To'}
            text={account2 ? account2?.name ?? 'No Account' : 'Tab to select'}
            backgroundColor={account2 ? 'rgba(60,180,120, 0.5)' : ''}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            onPress={() => { setModalVisible(true); }}
        />
        <Account2SelectorModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}


export function AmountSection() {
    const { amount, setAmount } = useContraContext();
    const { currency } = useAppStorage();

    const router = useRoute<RouteProp<StackParamsList, 'create-transaction-screen'>>();
    const { type } = router.params;

    const [isModalVisible, setModalVisible] = useState<boolean>(false);


    return (<>
        <SectionRowWithIcon
            icon={<MaterialDesignIcon name={type === 'Receipt' ? 'cash-plus' : 'cash-minus'} size={24} />}
            label={amount ? `${amount} ${currency}` : 'Transferring Amount'}
            text={amount ? amount : 'Tab to enter amount'}
            backgroundColor={amount ? 'rgba(60,180,120, 0.5)' : ''}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            onPress={() => { setModalVisible(true); }}
        />

        <AutoFocusInputModal
            visible={isModalVisible} setVisible={setModalVisible}
            label="Add Amount"
            placeholder="0.00"
            keyboardType="number-pad"
            onSet={setAmount}

            inputValueFilters={(cur, old) => {
                const char = cur.at(-1) ?? '';

                if (cur.length > 1 && cur[0] === '0' && cur[1] === '0') { return old; }
                if (!'0123456789.'.includes(char)) { return old; }
                if (char === '.' && cur.slice(0, -1).includes('.')) { return old; }

                if (cur.length > 1 && cur[0] === '0' && !cur.includes('.')) { return cur.slice(1); }
                return cur;
            }}

            containerChild={<TextTheme fontSize={16} fontWeight={600} >{currency}</TextTheme>}
        />
    </>);
}

export function DescriptionSection() {

    const { narration, setNarration } = useContraContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <AnimateButton onPress={() => { setModalVisible(true); }} style={{ borderRadius: 12 }} >
            <BackgroundThemeView isPrimary={false} style={{ padding: 12 }} >
                <View style={{ flexDirection: 'row', gap: 12 }} >
                    <FeatherIcon size={16} name="align-left" />
                    <TextTheme>Add Notes</TextTheme>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, minHeight: 40 }} >
                    <TextTheme isPrimary={false} fontSize={12} style={{ flex: 1, paddingTop: 4 }} >
                        {narration || 'Notes ....'}
                    </TextTheme>
                </View>

            </BackgroundThemeView>
        </AnimateButton>

        <AutoFocusInputModal
            visible={isModalVisible}
            setVisible={setModalVisible}
            label="Add Note"
            placeholder="Type note that you want to attach"
            multiline={true}
            numberOfLines={5}
            onSet={setNarration}
        />
    </>);
}

export function SaveContra() {
    const dispatch = useAppDispatch();
    const { current_company_id, user } = useUserStore();
    const [loading, setLoading] = useState(false);
    const { account1, account2, date, voucherNo, resetAll, amount } = useContraContext();
    const router = useRoute<RouteProp<StackParamsList, 'create-contra-screen'>>();
    const { type: billType, id: billId } = router.params;
    const currentCompanyDetails = user.company.find((c: any) => c._id === current_company_id);

    const canSave = useMemo(() => {

        return !!current_company_id && !!user && !!voucherNo && !!date && !!amount && !!account1 && !!account2 && Number(amount) > 0;
    }, [account1, account2, current_company_id, user, voucherNo, date, amount]);

    async function handleSave() {
        if (!canSave) { return; }
        setLoading(true);
        const accounting = [
            { ledger: account1?.name || '', ledger_id: account1?.id || '', amount: -Number(amount), vouchar_id: '' },
            { ledger: account2?.name || '', ledger_id: account2?.id || '', amount: Number(amount), vouchar_id: '' },
        ];

        let dataToSend: CreateInvoiceData = {
            company_id: currentCompanyDetails?._id ?? '',
            date: date.split('/').reverse().join('-'),
            voucher_number: voucherNo,
            voucher_type: billType,
            voucher_type_id: billId,
            reference_date: '',
            narration: '',
            place_of_supply: '',
            reference_number: '',
            due_date: '',
            mode_of_transport: '',
            payment_mode: '',
            vehicle_number: '',
            party_name: account1?.name ?? '',
            party_name_id: account1?.id ?? '',
            paid_amount: Number(amount),
            total: Number(amount),
            total_amount: Number(amount),
            discount: 0,
            additional_charge: 0,
            roundoff: 0,
            grand_total: Number(amount),
            items: [],
            accounting: accounting,
        };
        console.log('Data to send:', dataToSend);
        await dispatch(createInvoice(dataToSend)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                navigator.goBack();
                setLoading(false);
                resetAll();
            }
        }).catch((error) => {
            console.error('Error creating invoice:', error);
            setLoading(false);
            resetAll();
        });
    }


    return (
        <ShowWhen when={canSave}>
            <AnimateButton onPress={handleSave}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                        borderRadius: 14,
                        backgroundColor: '#10b981',
                        gap: 8,
                        shadowColor: '#10b981',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <TextTheme fontSize={15} fontWeight={600} color="white">
                        {loading ? 'Transferring...' : 'Transfer Amount'}
                    </TextTheme>
                    <FeatherIcon name="shuffle" size={20} color="white" />
                </View>
            </AnimateButton>
        </ShowWhen>
    );
}


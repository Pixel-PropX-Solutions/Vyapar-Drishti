/* eslint-disable react-native/no-inline-styles */
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { View } from 'react-native';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import navigator from '../../../../Navigation/NavigationService';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import ProgressBar from '../../../../Components/Ui/Animation/ProgressBar';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import { useEffect, useState } from 'react';
import DateSelectorModal from '../../../../Components/Modal/Selectors/DateSelectorModal';
import { useTransactionContext } from './Context';
import { SectionRow, SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import { AccountSelectorModal, AmountModal, CustomerSelectorModal, DescriptionModal } from './Modals';
import { formatNumberForUI, roundToDecimal } from '../../../../Utils/functionTools';
import NormalButton from '../../../../Components/Ui/Button/NormalButton';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import { useAppDispatch, useUserStore } from '../../../../Store/ReduxStore';
import { createInvoice, getInvoiceCounter } from '../../../../Services/invoice';
import { CreateInvoiceData } from '../../../../Utils/types';
import { useAppStorage } from '../../../../Contexts/AppStorageProvider';
import LoadingModal from '../../../../Components/Modal/LoadingModal';



export function Header() {

    const router = useRoute<RouteProp<StackParamsList, 'create-transaction-screen'>>();
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
                <FeatherIcon name="file-text" size={14} />
                <TextTheme fontSize={14} fontWeight={700}>{type}</TextTheme>
            </View>
        </View>
    );
}


export function ProgressBarSection(): React.JSX.Element {

    const { progress } = useTransactionContext();

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <TextTheme fontSize={12} fontWeight={600} isPrimary={false}>
                    Progress
                </TextTheme>
                <TextTheme fontSize={12} fontWeight={600} isPrimary={false}>
                    {Math.round(progress * 100)}%
                </TextTheme>
            </View>
            <ProgressBar progress={progress} />
        </View>
    );
}



export function TransactionNoSelector() {

    const { transactionNo, setTransactionNo } = useTransactionContext();
    const { secondaryBackgroundColor } = useTheme();

    const dispatch = useAppDispatch();
    const router = useRoute<RouteProp<StackParamsList, 'create-transaction-screen'>>();
    const { type: transactionType } = router.params;
    const { current_company_id } = useUserStore();

    useEffect(() => {
        dispatch(getInvoiceCounter({
            company_id: current_company_id || '',
            voucher_type: transactionType,
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                setTransactionNo(response.payload.current_number);
            }
        }).catch((error) => {
            console.error('Error fetching customers:', error);
            // toast.error(error || "An unexpected error occurred. Please try again later.");
        });
    }, [dispatch, current_company_id, transactionType, setTransactionNo]);

    return (
        <AnimateButton style={{
            padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', borderColor: secondaryBackgroundColor, gap: 12, alignItems: 'center', backgroundColor: transactionNo ? 'rgba(60, 180, 120, 0.5)' : secondaryBackgroundColor,
        }}>
            <BackgroundThemeView
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
            >
                <FeatherIcon name="hash" size={16} />
            </BackgroundThemeView>

            <View style={{ flex: 1 }}>
                <TextTheme fontSize={14} fontWeight={700} style={{ marginBottom: 2 }}>
                    Bill No
                </TextTheme>
                <TextTheme isPrimary={false} fontSize={13} fontWeight={500}>
                    {transactionNo || 'Auto-generated'}
                </TextTheme>
            </View>
        </AnimateButton>
    );
}



export function DateSelector() {

    const { createOn, setCreateOn } = useTransactionContext();
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
                setCreateOn(`${date}/${(month + 1).toString().padStart(2, '0')}/${year}`);
            }}
        />
    </>);
}



export function CustomerSelector() {

    const router = useRoute<RouteProp<StackParamsList, 'create-transaction-screen'>>();
    const { type } = router.params;

    const { customer } = useTransactionContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <SectionRowWithIcon
            icon={<FeatherIcon name="user" size={20} />}
            label={customer ? customer?.name : type === 'Receipt' ? 'Receive From' : 'Pay to'}
            text={customer ? customer?.group ?? 'No Group' : 'Tab to select'}
            backgroundColor={customer ? 'rgba(60,180,120, 0.5)' : ''}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            onPress={() => { setModalVisible(true); }}
        />

        <CustomerSelectorModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}



export function AccountSelector() {
    const { account } = useTransactionContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);


    return (<>
        <SectionRowWithIcon
            icon={<FeatherIcon name="credit-card" size={20} />}
            label={account ? account?.name : 'Cash/Bank Account'}
            text={account ? account?.name ?? 'No Account' : 'Tab to select'}
            backgroundColor={account ? 'rgba(60,180,120, 0.5)' : ''}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            onPress={() => { setModalVisible(true); }}
        />
        <AccountSelectorModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}

export function DescriptionSection() {

    const { note } = useTransactionContext();

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
                        {note || 'Notes ....'}
                    </TextTheme>
                </View>

            </BackgroundThemeView>
        </AnimateButton>

        <DescriptionModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}



export function AmountBox() {

    const { amount, customer, transactionNo, createOn, account, resetAllStates } = useTransactionContext();
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { type: billType, id: billId } = router.params;

    const dispatch = useAppDispatch();
    const { currency } = useAppStorage();
    const totalValue = roundToDecimal(Number(amount || '0'), 2);
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user.company.find((c: any) => c._id === current_company_id);

    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isCreating, setCreating] = useState<boolean>(false);

    async function handleTransactionCreation() {
        setCreating(true);
        try {

            let dataToSend: CreateInvoiceData = {
                company_id: currentCompanyDetails?._id ?? '',
                date: createOn.split('/').reverse().join('-'),
                voucher_number: transactionNo,
                voucher_type: billType,
                voucher_type_id: billId,
                reference_date: '',
                narration: '',
                place_of_supply: '',
                reference_number: '',
                due_date: '',
                mode_of_transport: '',
                status: 'Paid',
                vehicle_number: '',
                party_name: customer?.name ?? '',
                party_name_id: customer?.id ?? '',
                items: [],
                accounting: [
                    { amount: billType === 'Payment' ? -totalValue : totalValue, ledger: customer?.name ?? '', ledger_id: customer?.id ?? '', vouchar_id: '' },
                    { amount: billType === 'Payment' ? totalValue : -totalValue, ledger: account?.name ?? '', ledger_id: account?.id ?? '', vouchar_id: '' },
                ],
            };

            dispatch(createInvoice(dataToSend)).then(() => {
                resetAllStates();
                navigator.goBack();
                setCreating(false);
            }).catch((error) => {
                resetAllStates();
                console.error('Error creating transaction:', error);
                setCreating(false);
            });
        } catch (error) {
            setCreating(false);
            console.error('Error creating transaction:', error);
        }
    }

    return (
        <View>
            <BackgroundThemeView
                style={{ padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, gap: 12, borderColor: 'gray', borderWidth: 2, borderBottomWidth: 0 }}
            >

                <SectionRow style={{ flexDirection: 'column' }} onPress={() => { setModalVisible(true); }} >
                    <TextTheme isPrimary={false} fontSize={12} fontWeight={900}>
                        Enter Amount
                    </TextTheme>

                    <TextTheme fontWeight={900} fontSize={20}>
                        {formatNumberForUI(Number(amount || '0'), 10)} {currency}
                    </TextTheme>
                </SectionRow>

                <ShowWhen when={!!(amount && customer && transactionNo && createOn && account)} >
                    <NormalButton
                        text="Add Transaction"
                        isPrimary={true}
                        color="white"
                        backgroundColor="rgb(50,200,150)"
                        isLoading={isCreating}
                        onLoadingText="Creating..."
                        onPress={handleTransactionCreation}
                    />
                </ShowWhen>
            </BackgroundThemeView>

            <AmountModal visible={isModalVisible} setVisible={setModalVisible} />
            <LoadingModal visible={isCreating} />
        </View>
    );
}

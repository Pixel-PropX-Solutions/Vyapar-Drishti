/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import NormalButton from '../../../../Components/Ui/Button/NormalButton';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import { LedgerEntry, useJournalContext } from './Context';
import { JournalNoEditorModal, LedgerSelectorModal } from './Modals';
import AutoFocusInputModal from '../../../../Components/Ui/TextInput/AutoFocusInputModal';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import navigator from '../../../../Navigation/NavigationService';
import { useAppDispatch, useUserStore } from '../../../../Store/ReduxStore';
import { CreateInvoiceData } from '../../../../Utils/types';
import { createInvoice, getInvoiceCounter } from '../../../../Services/invoice';
import { useAppStorage } from '../../../../Contexts/AppStorageProvider';
import DateSelectorModal from '../../../../Components/Modal/Selectors/DateSelectorModal';
import { SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import { ItemSelectorModal } from '../../../../Components/Modal/Selectors/ItemSelectorModal';
import MaterialDesignIcon from '../../../../Components/Icon/MaterialDesignIcon';

export function Header() {

    const router = useRoute<RouteProp<StackParamsList, 'create-journal-screen'>>();
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
                <MaterialDesignIcon name="account-convert-outline" size={14} />
                <TextTheme fontSize={14} fontWeight={700}>{type}</TextTheme>
            </View>
        </View>
    );
}


export function JournalNoSelector() {

    const { voucherNo, setVoucherNo } = useJournalContext();
    const { secondaryBackgroundColor } = useTheme();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();

    useEffect(() => {
        dispatch(getInvoiceCounter({
            company_id: current_company_id || '',
            voucher_type: 'Journal',
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
                        Journal No
                    </TextTheme>
                    <TextTheme isPrimary={false} fontSize={13} fontWeight={500}>
                        {voucherNo || 'Auto-generated'}
                    </TextTheme>
                </View>
            </AnimateButton>
            <JournalNoEditorModal
                visible={isModalVisible}
                setVisible={setModalVisible}
            />
        </>
    );
}



export function DateSelector() {

    const { date: createOn, setDate } = useJournalContext();
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


export function PaymentMode() {

    const { paymentMode, setPaymentMode } = useJournalContext();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <SectionRowWithIcon
            label="Payment Mode"
            onPress={() => { setModalVisible(true); }}
            text={paymentMode || 'Tap to select mode of payment'}
            hasArrow={true}
            icon={<FeatherIcon name="credit-card" size={16} />}
            backgroundColor={paymentMode ? 'rgba(60, 180, 120, 0.5)' : ''}
        />

        <ItemSelectorModal<string>
            visible={isModalVisible}
            setVisible={setModalVisible}
            title="Payment Mode"
            allItems={['By Cash', 'By Card', 'By UPI', 'By Net Banking']}
            onSelect={(val) => { setPaymentMode(val); }}
            keyExtractor={item => item}
            isItemSelected={!!paymentMode}
            SelectedItemContent={
                <TextTheme color="white" >{paymentMode}</TextTheme>
            }
            renderItemContent={(item) => (
                <TextTheme>{item}</TextTheme>
            )}
            filter={() => true}
        />
    </>);
}


export function EntriesSection() {
    const { entries, setEntries } = useJournalContext();

    function addNewEntry() {
        const difference =
            entries.reduce((acc, e) => acc + (e.type === 'To' ? Number(e.amount || 0) : -Number(e.amount || 0)), 0);
        const newEntry = {
            id: '',
            name: '',
            type: difference <= 0 ? 'To' as const : 'From' as const,
            amount: difference === 0 ? '' : Math.abs(difference).toString(),
        };
        setEntries(prev => [...prev, newEntry]);
    }

    return (
        <View style={{ gap: 12 }}>
            {/* Summary Card */}
            <SummaryCards />

            {/* Entries List */}
            <EntriesList />

            {/* Add Button */}
            <NormalButton
                backgroundColor="rgb(50,120,200)" color="white"
                text=" Add Entry"
                icon={<FeatherIcon color="white" name="plus" size={16} />}
                onPress={addNewEntry}
            />

            {/* Empty State */}
            {entries.length === 0 && (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                    <FeatherIcon name="book-open" size={48} color="#cbd5e1" />
                    <TextTheme fontSize={16} isPrimary={false} style={{ marginTop: 12, textAlign: 'center' }}>
                        No entries yet
                    </TextTheme>
                    <TextTheme fontSize={13} isPrimary={false} style={{ marginTop: 4, textAlign: 'center' }}>
                        Tap the button above to add your first entry
                    </TextTheme>
                </View>
            )}


        </View>
    );
}


export function DescriptionSection() {

    const { notes, setNotes } = useJournalContext();

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
                        {notes || 'Notes ....'}
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
            onSet={setNotes}
        />
    </>);
}


export function SaveJournal() {
    const dispatch = useAppDispatch();
    const { current_company_id, user } = useUserStore();
    const [loading, setLoading] = useState(false);
    const { entries, date, voucherNo, resetAll, paymentMode, notes } = useJournalContext();
    const router = useRoute<RouteProp<StackParamsList, 'create-journal-screen'>>();
    const { type: billType, id: billId } = router.params;
    const currentCompanyDetails = user.company.find((c: any) => c._id === current_company_id);

    const canSave = useMemo(() => {
        const isBalanced =
            entries.reduce((acc, e) => acc + (e.type === 'To' ? Number(e.amount || 0) : -Number(e.amount || 0)), 0) === 0;

        return isBalanced && entries.length >= 2 && !!current_company_id && !!user && !!voucherNo && !!date && entries.every(e => e.amount && Number(e.amount) !== 0) && entries.every(e => e.name !== '');
    }, [entries, current_company_id, user, voucherNo, date]);

    async function handleSave() {
        if (!canSave) { return; }
        setLoading(true);
        const accounting = entries.map(e => ({
            amount: e.type === 'To' ? Number(e.amount) : -Number(e.amount),
            ledger: e.name,
            ledger_id: e.id,
            vouchar_id: '',
        }));
        const customer = entries[0];

        // Calculate the total value for the customer from the entries
        const totalValue = entries.reduce((sum, entry) => sum + (entry.name === customer?.name ? Number(entry.amount) : 0), 0);

        let dataToSend: CreateInvoiceData = {
            company_id: currentCompanyDetails?._id ?? '',
            date: date.split('/').reverse().join('-'),
            voucher_number: voucherNo,
            voucher_type: billType,
            voucher_type_id: billId,
            reference_date: '',
            narration: notes,
            place_of_supply: '',
            reference_number: '',
            due_date: '',
            mode_of_transport: '',
            payment_mode: paymentMode,
            vehicle_number: '',
            party_name: customer?.name ?? '',
            party_name_id: customer?.id ?? '',
            paid_amount: Number(totalValue),
            total: Number(totalValue),
            total_amount: Number(totalValue),
            discount: 0,
            additional_charge: 0,
            roundoff: 0,
            grand_total: Number(totalValue),
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
                    <MaterialDesignIcon name="account-convert-outline" size={20} color="white" />
                    <TextTheme fontSize={15} fontWeight={600} color="white">
                        {loading ? 'Saving...' : 'Save Journal Entry'}
                    </TextTheme>
                </View>
            </AnimateButton>
        </ShowWhen>
    );
}

function SummaryCards() {

    const { currency } = useAppStorage();
    const { entries } = useJournalContext();
    const { theme } = useTheme();
    const totalTo = entries.reduce((sum, entry) => {
        return entry.type === 'To' ? sum + (parseFloat(entry.amount) || 0) : sum;
    }, 0);

    const totalFrom = entries.reduce((sum, entry) => {
        return entry.type === 'From' ? sum + (parseFloat(entry.amount) || 0) : sum;
    }, 0);

    const difference = totalTo - totalFrom;
    const isBalanced = Math.abs(difference) < 0.01;


    return <BackgroundThemeView
        style={{
            padding: 16,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: isBalanced ? '#10b981' : '#f59e0b',
        }}
    >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
                <TextTheme fontSize={12} isPrimary={false}>Total Debit</TextTheme>
                <TextTheme fontSize={18} fontWeight={600} color="#ef4444">
                    {currency} {totalTo.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TextTheme>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <TextTheme fontSize={12} isPrimary={false}>Total Credit</TextTheme>
                <TextTheme fontSize={18} fontWeight={600} color="#10b981">
                    {currency} {totalFrom.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TextTheme>
            </View>
        </View>
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }}
        >
            <FeatherIcon
                name={isBalanced ? 'check-circle' : 'alert-circle'}
                size={16}
                color={isBalanced ? '#10b981' : '#f59e0b'}
            />
            <TextTheme
                fontSize={14}
                fontWeight={600}
                color={isBalanced ? '#10b981' : '#f59e0b'}
                style={{ marginLeft: 6 }}
            >
                {isBalanced
                    ? 'Balanced Entry'
                    : `Difference: ${currency} ${Math.abs(difference).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                }
            </TextTheme>
        </View>
    </BackgroundThemeView>;
}

function EntriesList() {
    const { entries, setEntries } = useJournalContext();
    const { theme } = useTheme();
    const [isLedgerModalVisible, setLedgerModalVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);
    const [amount, setAmount] = useState('');
    const { currency } = useAppStorage();

    function updateEntry(index: number, updates: Partial<LedgerEntry>) {
        setEntries(prev => prev.map((entry, i) => (i === index ? { ...entry, ...updates } : entry)));
    }

    function deleteEntry(index: number) {
        setEntries(prev => prev.filter((_, i) => i !== index));
    }

    function openLedgerModal(index: number) {
        setSelectedEntryIndex(index);
        setLedgerModalVisible(true);
    }

    function openAmountModal(index: number, amountValue: string) {
        setAmount(amountValue);
        setSelectedEntryIndex(index);
        setModalVisible(true);
    }

    return <>
        {entries.map((entry, index) => (
            <BackgroundThemeView
                key={index}
                style={{
                    padding: 14,
                    borderRadius: 14,
                    borderLeftWidth: 4,
                    borderLeftColor: entry.type === 'From' ? '#10b981' : '#ef4444',
                }}
            >
                {/* Header Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flex: 1 }}>
                        <TextTheme fontSize={11} isPrimary={false} style={{ marginBottom: 4 }}>
                            Entry #{index + 1}
                        </TextTheme>
                        <AnimateButton onPress={() => openLedgerModal(index)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <FeatherIcon
                                    name={entry.type === 'From' ? 'user-minus' : 'user-plus'}
                                    size={16}
                                    color={entry.name ? undefined : '#94a3b8'}
                                />
                                <TextTheme
                                    fontSize={15}
                                    fontWeight={entry.name ? 600 : 400}
                                    isPrimary={!!entry.name}
                                >
                                    {entry.name || 'Select Account'}
                                </TextTheme>
                                <FeatherIcon name="chevron-down" size={14} color="#94a3b8" />
                            </View>
                        </AnimateButton>
                    </View>
                    <AnimateButton onPress={() => deleteEntry(index)}>
                        <View
                            style={{
                                padding: 8,
                                borderRadius: 8,
                                backgroundColor: theme === 'dark' ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)',
                            }}
                        >
                            <FeatherIcon name="trash-2" size={16} color="#ef4444" />
                        </View>
                    </AnimateButton>
                </View>

                {/* Amount and Type Row */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <AnimateButton
                        onPress={() => openAmountModal(index, entries[index].amount)}
                        style={{ flex: 1 }}
                    >
                        <View
                            style={{
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                borderWidth: 1,
                                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                            }}
                        >
                            <TextTheme fontSize={11} isPrimary={false} style={{ marginBottom: 4 }}>
                                Amount
                            </TextTheme>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextTheme fontSize={18} fontWeight={700}>
                                    {currency} {Number(entry.amount || '0.00').toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </TextTheme>
                            </View>
                        </View>
                    </AnimateButton>

                    <AnimateButton
                        onPress={() => updateEntry(index, { type: entry.type === 'To' ? 'From' : 'To' })}
                    >
                        <View
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                borderRadius: 10,
                                backgroundColor: entry.type === 'From'
                                    ? theme === 'dark' ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)'
                                    : theme === 'dark' ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)',
                                borderWidth: 1.5,
                                borderColor: entry.type === 'From' ? '#10b981' : '#ef4444',
                                minWidth: 80,
                                alignItems: 'center',
                            }}
                        >
                            <TextTheme fontSize={11} color={entry.type === 'From' ? '#10b981' : '#ef4444'}>
                                TYPE
                            </TextTheme>
                            <TextTheme
                                fontSize={14}
                                fontWeight={700}
                                color={entry.type === 'From' ? '#10b981' : '#ef4444'}
                            >
                                {entry.type === 'To' ? 'To' : 'From'}
                            </TextTheme>
                        </View>
                    </AnimateButton>
                </View>
            </BackgroundThemeView>
        ))}
        {/* Modals */}
        <LedgerSelectorModal
            visible={isLedgerModalVisible}
            setVisible={setLedgerModalVisible}
            onSelectLedger={ledger => {
                if (selectedEntryIndex !== null) {
                    updateEntry(selectedEntryIndex, { id: ledger._id, name: ledger.ledger_name });
                }
            }}
        />
        <AutoFocusInputModal
            visible={isModalVisible}
            setVisible={setModalVisible}
            label="Enter Amount"
            placeholder="0.00"
            keyboardType="number-pad"
            onSet={(val) => {
                if (selectedEntryIndex !== null) {
                    updateEntry(selectedEntryIndex, { amount: val });
                }
                setAmount(val);
            }}
            defaultValue={amount}
            inputValueFilters={(cur, old) => {
                const char = cur.at(-1) ?? '';

                if (cur.length > 1 && cur[0] === '0' && cur[1] === '0') { return old; }
                if (!'0123456789.'.includes(char)) { return old; }
                if (char === '.' && cur.slice(0, -1).includes('.')) { return old; }

                if (cur.length > 1 && cur[0] === '0' && !cur.includes('.')) { return cur.slice(1); }
                return cur;
            }}
            containerChild={
                <TextTheme fontSize={16} fontWeight={600}>
                    {currency}
                </TextTheme>
            }
        />
    </>;
}

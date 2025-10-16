/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useCompanyStore, useCustomerStore, useAppDispatch } from '../../../../Store/ReduxStore';
import { getAccountingGroups, viewAllCustomerWithType } from '../../../../Services/customer';
import { View } from 'react-native';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { CustomersList } from '../../../../Utils/types';
import { ItemSelectorModal } from '../../../../Components/Modal/Selectors/ItemSelectorModal';
import LedgerTypeSelectorModal from '../../../../Components/Modal/LedgerTypeSelector';
import CreateCustomerModal from '../../../../Components/Modal/Customer/CreateCustomerModal';
import CreateAccountModal from '../../../../Components/Modal/Customer/CreateAccountModal';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { setCustomerType } from '../../../../Store/Reducers/customerReducer';
import { useJournalContext } from './Context';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { TextInput } from 'react-native-gesture-handler';
import BottomModal from '../../../../Components/Modal/BottomModal';

type LedgerSelectorModalProps = {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    onSelectLedger: (ledger: CustomersList) => void;
};

export function LedgerSelectorModal({ visible, setVisible, onSelectLedger }: LedgerSelectorModalProps) {
    const dispatch = useAppDispatch();
    const { company } = useCompanyStore();
    const { customersList, isAllCustomerFetching, customerType } = useCustomerStore();
    const [isLedgerTypeSelectorModalOpen, setLedgerTypeSelectorModalOpen] = useState<boolean>(false);

    function handleFetching() {
        if (isAllCustomerFetching) { return; }
        dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'All' }));
    }

    useEffect(() => {
        if (visible) {
            dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'All' }));
        }
    }, [company?._id, dispatch, visible]);

    return (
        <>
            <ItemSelectorModal<CustomersList>
                visible={visible}
                setVisible={setVisible}
                title="Select Ledger"
                keyExtractor={item => item._id}
                allItems={customersList.filter((item)=>item.ledger_name !== 'Sales' && item.ledger_name !== 'Purchases')}
                isItemSelected={false}
                filter={item =>
                    item.ledger_name
                        .toLowerCase().includes('asda'.toLowerCase())}
                isFetching={isAllCustomerFetching}
                renderItemContent={item => (
                    <View style={{ flex: 1 }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                            <TextTheme>{item.ledger_name}</TextTheme>
                            <TextTheme isPrimary={false}>
                                {(Math.abs(item?.total_amount ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}{item.total_amount < 0 ? ' DR' : ' CR'}
                            </TextTheme>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                            <TextTheme isPrimary={false}>{item.phone?.code} {item.phone?.number}</TextTheme>
                            <TextTheme isPrimary={false}>{item.parent}</TextTheme>
                        </View>
                    </View>
                )}
                loadItemsBeforeListEnd={handleFetching}
                onSelect={item => {
                    setVisible(false);
                    onSelectLedger(item);
                }}
                actionButtons={[
                    {
                        key: 'create-ledger',
                        title: 'Create New Ledger',
                        onPress: async () => {
                            await dispatch(getAccountingGroups());
                            setLedgerTypeSelectorModalOpen(true);
                        },
                        color: 'white',
                        backgroundColor: 'rgb(50,200,150)',
                        icon: <FeatherIcon name="user-plus" size={16} color="white" />,
                    },
                ]}
            />

            <LedgerTypeSelectorModal
                visible={isLedgerTypeSelectorModalOpen} setVisible={setLedgerTypeSelectorModalOpen}
                setSecondaryVisible={() => {
                }}
            />
            <CreateCustomerModal
                visible={['Debtors', 'Creditors'].includes(customerType?.accounting_group_name ?? '')} setVisible={() => dispatch(setCustomerType(null))}
                setPrimaryVisible={setLedgerTypeSelectorModalOpen}
            />
            <CreateAccountModal
                visible={['Bank Accounts'].includes(customerType?.accounting_group_name ?? '')} setVisible={() => dispatch(setCustomerType(null))}
                setPrimaryVisible={setLedgerTypeSelectorModalOpen}
            />
        </>
    );
}


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function JournalNoEditorModal({ visible, setVisible }: Props) {

    const { voucherNo, setVoucherNo } = useJournalContext();
    const { primaryColor, secondaryColor } = useTheme();

    const [text, setText] = useState<string>(voucherNo);
    const input = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) { setText(voucherNo); }
    }, [voucherNo, visible]);

    useEffect(() => {
        if (!visible) { return; }

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
                onPress: () => { setVoucherNo(text); setVisible(false); },
            }]}
        >
            <TextTheme fontSize={20} fontWeight={900}>Enter Journal No</TextTheme>

            <View style={{ borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, width: '100%', flexDirection: 'row', alignItems: 'center' }} >
                <TextInput
                    ref={input}
                    value={text}
                    placeholder="JOURNAL NO"
                    style={{ fontSize: 16, flex: 1, opacity: text ? 1 : 0.8 }}
                    placeholderTextColor={secondaryColor}
                    multiline={true}
                    keyboardType="default"
                    autoCapitalize="characters"
                    onChangeText={val => {
                        setText(val);
                    }}
                />

            </View>

            <View style={{ minHeight: 10 }} />
        </BottomModal>
    );
}

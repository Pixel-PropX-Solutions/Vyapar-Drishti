/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useCompanyStore, useCustomerStore } from '../../../../Store/ReduxStore';
import { useTransactionContext } from './Context';
import { GetUserLedgers } from '../../../../Utils/types';
import { viewAllCustomer } from '../../../../Services/customer';
import { setCustomers } from '../../../../Store/Reducers/customerReducer';
import { ItemSelectorModal } from '../../../../Components/Modal/Selectors/ItemSelectorModal';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { Keyboard, TextInput, View } from 'react-native';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { CustomerLoadingView } from '../../../../Components/Ui/Card/CustomerCard';
import CustomerTypeSelectorModal from '../../../../Components/Modal/Customer/CustomerTypeSelectorModal';
import CreateCustomerModal from '../../../../Components/Modal/Customer/CreateCustomerModal';
import BottomModal from '../../../../Components/Modal/BottomModal';
import NoralTextInput from '../../../../Components/Ui/TextInput/NoralTextInput';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { useFocusEffect } from '@react-navigation/native';


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}


export function CustomerSelectorModal({ visible, setVisible }: Props) {

    const { company } = useCompanyStore();
    const { setCustomer, customer } = useTransactionContext();
    const { customers, isAllCustomerFetching, pageMeta } = useCustomerStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    function handleProductFetching() {
        if (isAllCustomerFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }

    useEffect(() => {
        if (visible && !isCreateCustomerModalOpen) {
            dispatch(setCustomers([]));
            dispatch(viewAllCustomer({ company_id: company?._id ?? '', type: 'Customers', pageNumber: 1 }));
        }
    }, [isCreateCustomerModalOpen, visible]);

    return (<>
        <ItemSelectorModal<GetUserLedgers>
            visible={visible}
            setVisible={setVisible}
            title="Select Customer"
            keyExtractor={item => item._id}
            isItemSelected={!!customer?.id}
            allItems={customers}

            actionButtons={[
                {
                    key: 'create-customer',
                    title: 'Create New Customer',
                    onPress: () => setCustomerTypeSelectorModalOpen(true),
                    color: 'white',
                    backgroundColor: 'rgb(50,200,150)',
                    icon: <FeatherIcon name="user-plus" size={16} color="white" />,
                },
            ]}

            SelectedItemContent={<View>
                <TextTheme color="white" >{customer?.name}</TextTheme>
                <TextTheme color="white" isPrimary={false} >{customer?.group}</TextTheme>
            </View>}

            renderItemContent={item => (
                <View style={{ flex: 1 }} >
                    <TextTheme>{item.ledger_name}</TextTheme>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                        <TextTheme isPrimary={false} >{item.phone?.code} {item.phone?.number}</TextTheme>
                        <TextTheme isPrimary={false} >{item.parent}</TextTheme>
                    </View>
                </View>
            )}

            filter={(item, val) =>
                item.phone?.number.startsWith(val) ||
                item.phone?.number.endsWith(val) ||
                item.ledger_name.toLowerCase().split(' ').some(word => (
                    word.startsWith(val)
                ))
            }

            onSelect={item => {
                setVisible(false);

                setCustomer(() => ({
                    id: item._id,
                    name: item.ledger_name,
                    group: item.parent,
                }));
            }}

            loadItemsBeforeListEnd={handleProductFetching}

            isFetching={isAllCustomerFetching}

            whenFetchingComponent={<CustomerLoadingView />}

        />

        <CustomerTypeSelectorModal
            visible={isCustomerTypeSelectorModalOpen} setVisible={setCustomerTypeSelectorModalOpen}
            setSecondaryVisible={setCreateCustomerModalOpen}
        />

        <CreateCustomerModal
            visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen}
            setPrimaryVisible={setCustomerTypeSelectorModalOpen}
        />
    </>);
}

export function AccountSelectorModal({ visible, setVisible }: Props) {

    const { company } = useCompanyStore();
    const { account, setAccount } = useTransactionContext();
    const { customers, isAllCustomerFetching, pageMeta } = useCustomerStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    // const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    function handleProductFetching() {
        if (isAllCustomerFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }

    useEffect(() => {
        if (visible && !isCreateCustomerModalOpen) {
            dispatch(setCustomers([]));
            dispatch(viewAllCustomer({ company_id: company?._id ?? '', type: 'Accounts', pageNumber: 1 }));
        }
    }, [isCreateCustomerModalOpen, visible]);


    return (<>
        <ItemSelectorModal<GetUserLedgers>
            visible={visible}
            setVisible={setVisible}
            title="Select Account"
            keyExtractor={item => item._id}
            isItemSelected={!!account?.id}
            allItems={customers}

            // actionButtons={[
            //     {
            //         key: 'create-customer',
            //         title: 'Create New Customer',
            //         onPress: () => setCustomerTypeSelectorModalOpen(true),
            //         color: 'white',
            //         backgroundColor: 'rgb(50,200,150)',
            //         icon: <FeatherIcon name="user-plus" size={16} color="white" />,
            //     },
            // ]}

            SelectedItemContent={<View>
                <TextTheme color="white" >{account?.name}</TextTheme>
                {/* <TextTheme color="white" isPrimary={false} >{customer?.group}</TextTheme> */}
            </View>}

            renderItemContent={item => (
                <View style={{ flex: 1 }} >
                    <TextTheme>{item.ledger_name}</TextTheme>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                        <TextTheme isPrimary={false} >{item.phone?.code} {item.phone?.number}</TextTheme>
                        <TextTheme isPrimary={false} >{item.parent}</TextTheme>
                    </View>
                </View>
            )}

            filter={(item, val) =>
                item.phone?.number.startsWith(val) ||
                item.phone?.number.endsWith(val) ||
                item.ledger_name.toLowerCase().split(' ').some(word => (
                    word.startsWith(val)
                ))
            }

            onSelect={item => {
                setVisible(false);

                setAccount(() => ({
                    id: item._id,
                    name: item.ledger_name,
                }));
            }}

            loadItemsBeforeListEnd={handleProductFetching}

            isFetching={isAllCustomerFetching}

            whenFetchingComponent={<CustomerLoadingView />}

        />

        {/* <CustomerTypeSelectorModal
            visible={isCustomerTypeSelectorModalOpen} setVisible={setCustomerTypeSelectorModalOpen}
            setSecondaryVisible={setCreateCustomerModalOpen}
        />

        <CreateCustomerModal
            visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen}
            setPrimaryVisible={setCustomerTypeSelectorModalOpen}
        /> */}
    </>);
}



export function DescriptionModal({ visible, setVisible }: Props) {

    const { note, setNote } = useTransactionContext();
    const { primaryColor, secondaryColor } = useTheme();

    const [text, setText] = useState<string>(note);
    const input = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) { setText(note); }
    }, [note, visible]);

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
                onPress: () => { setNote(text); setVisible(false); },
            }]}
        >
            <TextTheme fontSize={20} fontWeight={900}>Add Note</TextTheme>

            <View style={{ borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, width: '100%' }} >
                <TextInput
                    ref={input}
                    value={text}
                    onChangeText={val => { setText(val); }}
                    placeholder="Enter your note"
                    style={{ fontSize: 16, opacity: text ? 1 : 0.8 }}
                    multiline={true}
                    placeholderTextColor={secondaryColor}
                />
            </View>

            <View style={{ minHeight: 60 }} />
        </BottomModal>
    );
}



export function AmountModal({ visible, setVisible }: Props) {

    const { amount, setAmount } = useTransactionContext();
    const { primaryColor, secondaryColor } = useTheme();

    const [text, setText] = useState<string>(amount);
    const input = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) { setText(amount); }
    }, [amount, visible]);

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
                onPress: () => { setAmount(text); setVisible(false); },
            }]}
        >
            <TextTheme fontSize={20} fontWeight={900}>Add Amount</TextTheme>

            <View style={{ borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, width: '100%', flexDirection: 'row', alignItems: 'center' }} >
                <TextInput
                    ref={input}
                    value={text}
                    placeholder="0.00"
                    style={{ fontSize: 16, flex: 1, opacity: text ? 1 : 0.8 }}
                    placeholderTextColor={secondaryColor}
                    multiline={true}
                    keyboardType="number-pad"
                    onChangeText={val => {
                        if ('01234567890'.includes(val.at(-1) ?? '')) {
                            setText(val);
                        } else if (val.at(-1) === '.' && !text.includes('.')) {
                            setText(val);
                        }
                    }}
                />

                <TextTheme fontSize={16}>INR</TextTheme>
            </View>

            <View style={{ minHeight: 60 }} />
        </BottomModal>
    );
}

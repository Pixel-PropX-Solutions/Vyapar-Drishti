/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useCompanyStore, useCustomerStore, useAppDispatch } from '../../Store/ReduxStore';
import { viewAllCustomerWithType } from '../../Services/customer';
import { View } from 'react-native';
import TextTheme from '../../Components/Ui/Text/TextTheme';
import { CustomersList } from '../../Utils/types';
import { ItemSelectorModal } from '../../Components/Modal/Selectors/ItemSelectorModal';
import { useContraContext } from './Context';
import { useTheme } from '../../Contexts/ThemeProvider';
import { TextInput } from 'react-native-gesture-handler';
import BottomModal from '../../Components/Modal/BottomModal';
import { CustomerLoadingView } from '../../Components/Ui/Card/CustomerCard';
import FeatherIcon from '../../Components/Icon/FeatherIcon';
import CreateAccountModal from '../../Components/Modal/Customer/CreateAccountModal';


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function ContraNoEditorModal({ visible, setVisible }: Props) {

    const { voucherNo, setVoucherNo } = useContraContext();
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


export function Account1SelectorModal({ visible, setVisible }: Props) {

    const { company } = useCompanyStore();
    const { account1, setAccount1 } = useContraContext();
    const { customersList, isAllCustomerFetching, pageMeta } = useCustomerStore();
    const [isAddingModalOpen, setAddingModalOpen] = useState<boolean>(false);


    const dispatch = useAppDispatch();

    function handleProductFetching() {
        if (isAllCustomerFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Accounts' }));
    }

    useEffect(() => {
        if (visible && !isAddingModalOpen) {
            dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Accounts' }));
        }
    }, [visible, isAddingModalOpen, dispatch, company?._id]);


    return (<>
        <ItemSelectorModal<CustomersList>
            visible={visible}
            setVisible={setVisible}
            title="Select Account"
            keyExtractor={item => item._id}
            isItemSelected={!!account1?.id}
            allItems={customersList}
            SelectedItemContent={<View>
                <TextTheme color="white" >{account1?.name}</TextTheme>
            </View>}
            actionButtons={[
                {
                    key: 'create-customer',
                    title: 'Add New Bank Account',
                    onPress: () => setAddingModalOpen(true),
                    color: 'white',
                    backgroundColor: 'rgb(50,200,150)',
                    icon: <FeatherIcon name="user-plus" size={16} color="white" />,
                },
            ]}
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

            filter={(item, val) =>
                item.phone?.number.startsWith(val) ||
                item.phone?.number.endsWith(val) ||
                item.ledger_name.toLowerCase().split(' ').some(word => (
                    word.startsWith(val)
                ))
            }

            onSelect={item => {
                setVisible(false);

                setAccount1(() => ({
                    id: item._id,
                    name: item.ledger_name,
                }));
            }}

            loadItemsBeforeListEnd={handleProductFetching}

            isFetching={isAllCustomerFetching}

            whenFetchingComponent={<CustomerLoadingView />}

        />
        <CreateAccountModal
            visible={isAddingModalOpen} setVisible={setAddingModalOpen}
        />
    </>);
}


export function Account2SelectorModal({ visible, setVisible }: Props) {

    const { company } = useCompanyStore();
    const { account2, setAccount2 } = useContraContext();
    const { customersList, isAllCustomerFetching, pageMeta } = useCustomerStore();
    const [isAddingModalOpen, setAddingModalOpen] = useState<boolean>(false);


    const dispatch = useAppDispatch();

    function handleProductFetching() {
        if (isAllCustomerFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Accounts' }));
    }

    useEffect(() => {
        if (visible && !isAddingModalOpen) {
            dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Accounts' }));
        }
    }, [visible, isAddingModalOpen, dispatch, company?._id]);


    return (<>
        <ItemSelectorModal<CustomersList>
            visible={visible}
            setVisible={setVisible}
            title="Select Account"
            keyExtractor={item => item._id}
            isItemSelected={!!account2?.id}
            allItems={customersList}
            SelectedItemContent={<View>
                <TextTheme color="white" >{account2?.name}</TextTheme>
            </View>}
            actionButtons={[
                {
                    key: 'create-customer',
                    title: 'Add New Bank Account',
                    onPress: () => setAddingModalOpen(true),
                    color: 'white',
                    backgroundColor: 'rgb(50,200,150)',
                    icon: <FeatherIcon name="user-plus" size={16} color="white" />,
                },
            ]}

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

            filter={(item, val) =>
                item.phone?.number.startsWith(val) ||
                item.phone?.number.endsWith(val) ||
                item.ledger_name.toLowerCase().split(' ').some(word => (
                    word.startsWith(val)
                ))
            }

            onSelect={item => {
                setVisible(false);

                setAccount2(() => ({
                    id: item._id,
                    name: item.ledger_name,
                }));
            }}

            loadItemsBeforeListEnd={handleProductFetching}

            isFetching={isAllCustomerFetching}

            whenFetchingComponent={<CustomerLoadingView />}

        />
        <CreateAccountModal
            visible={isAddingModalOpen} setVisible={setAddingModalOpen}
        />
    </>);
}

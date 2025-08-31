/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useCompanyStore, useCustomerStore } from '../../../../Store/ReduxStore';
import { useTransactionContext } from './Context';
import { CustomersList } from '../../../../Utils/types';
import { viewAllCustomerWithType } from '../../../../Services/customer';
import { ItemSelectorModal } from '../../../../Components/Modal/Selectors/ItemSelectorModal';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { View } from 'react-native';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { CustomerLoadingView } from '../../../../Components/Ui/Card/CustomerCard';
import CustomerTypeSelectorModal from '../../../../Components/Modal/Customer/CustomerTypeSelectorModal';
import CreateCustomerModal from '../../../../Components/Modal/Customer/CreateCustomerModal';


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}


export function CustomerSelectorModal({ visible, setVisible }: Props) {

    const { company } = useCompanyStore();
    const { setCustomer, customer } = useTransactionContext();
    const { isAllCustomerFetching, customersList } = useCustomerStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);
    // const [filterCustomers, setFilterCustomers] = useState<CustomersList[]>([]);
    const dispatch = useAppDispatch();

    function handleProductFetching() {
        if (isAllCustomerFetching) { return; }
        dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Customers' }));
    }

    useEffect(() => {
        if (visible && !isCreateCustomerModalOpen) {
            dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Customers' }));
        }
    }, [company?._id, isCreateCustomerModalOpen, visible]);

    return (<>
        <ItemSelectorModal<CustomersList>
            visible={visible}
            setVisible={setVisible}
            title="Select Customer"
            keyExtractor={item => item._id}
            isItemSelected={!!customer?.id}
            allItems={customersList}

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
                        <TextTheme isPrimary={false}>{item.phone?.code} {item.phone?.number}</TextTheme>
                        <TextTheme isPrimary={false}>{item.parent}</TextTheme>
                    </View>
                </View>
            )}

            filter={(item, val) =>
                item.phone?.number.includes(val.toLowerCase()) ||
                item.phone?.number.includes(val.toLowerCase()) ||
                item.ledger_name.toLowerCase().split(' ').some(word => (
                    word.includes(val.toLowerCase())
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
    const { customersList, isAllCustomerFetching, pageMeta } = useCustomerStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    function handleProductFetching() {
        if (isAllCustomerFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Accounts' }));
    }

    useEffect(() => {
        if (visible && !isCreateCustomerModalOpen) {
            dispatch(viewAllCustomerWithType({ company_id: company?._id ?? '', customerType: 'Accounts' }));
        }
    }, [isCreateCustomerModalOpen, visible]);


    return (<>
        <ItemSelectorModal<CustomersList>
            visible={visible}
            setVisible={setVisible}
            title="Select Account"
            keyExtractor={item => item._id}
            isItemSelected={!!account?.id}
            allItems={customersList}

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

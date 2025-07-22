/* eslint-disable react-native/no-inline-styles */
import TextTheme from '../../Text/TextTheme';
import { useAppDispatch, useCompanyStore, useCustomerStore } from '../../../Store/ReduxStore';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { GetUserLedgers } from '../../../Utils/types';
import { viewAllCustomer } from '../../../Services/customer';
import { useCreateBillContext } from '../../../Screens/TabNavigationScreens/BillScreens/CreateBillScreen/ContextProvider';
import { View } from 'react-native';
import FeatherIcon from '../../Icon/FeatherIcon';
import CustomerTypeSelectorModal from './CustomerTypeSelectorModal';
import CreateCustomerModal from './CreateCustomerModal';
import { ItemSelectorModal } from '../ItemSelectorModal';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    billType: string
}

export default function CustomerSelectorModal({ visible, setVisible, billType }: Props) {


    const { company } = useCompanyStore();
    const { setCustomer, customer } = useCreateBillContext();
    const { customers, isAllCustomerFetching, pageMeta } = useCustomerStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [filterCustomers, setFilterCustomers] = useState<GetUserLedgers[]>([]);


    function handleProductFetching() {
        return new Promise(res => {
            if (isAllCustomerFetching) return res(false)
            if (pageMeta.total <= pageMeta.page * pageMeta.limit) return res(false)
            dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 })).finally(() => {
                res(true)
            });
        })
    }

    useEffect(() => {
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isCreateCustomerModalOpen]);

    useEffect(() => {
        setFilterCustomers(() => customers.filter((ledger) => ledger.parent === 'Creditors' || ledger.parent === 'Debtors'
        ));
    }, [customers]);


    return (<>
        <ItemSelectorModal<GetUserLedgers>
            visible={visible}
            setVisible={setVisible}
            title='Select Customer'
            keyExtractor={item => item._id}
            isItemSelected={!!customer?.id}
            allItems={filterCustomers}

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
                <TextTheme color='white' >{customer?.name}</TextTheme>
                <TextTheme color='white' isPrimary={false} >{customer?.group}</TextTheme>
            </View>}

            renderItemContent={item => (
                <View style={{flex: 1}} >
                    <TextTheme>{item.ledger_name}</TextTheme>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
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
            
        />

        <CustomerTypeSelectorModal 
            visible={isCustomerTypeSelectorModalOpen} setVisible={setCustomerTypeSelectorModalOpen} 
            setSecondaryVisible={setCreateCustomerModalOpen} 
        />
        
        <CreateCustomerModal 
            visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} 
            setPrimaryVisible={setCustomerTypeSelectorModalOpen} 
        />
    </>
    );
}

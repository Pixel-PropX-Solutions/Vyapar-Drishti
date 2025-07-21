/* eslint-disable react-native/no-inline-styles */
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import RoundedPlusButton from '../../../Components/Button/RoundedPlusButton';
import CreateCustomerModal from '../../../Components/Modal/Customer/CreateCustomerModal';
import TabNavigationScreenHeader from '../../../Components/Header/TabNavigationHeader';
import TextTheme from '../../../Components/Text/TextTheme';
import { useAppDispatch, useCompanyStore, useCustomerStore } from '../../../Store/ReduxStore';
import { viewAllCustomer } from '../../../Services/customer';
import CustomerCard, { CustomerLoadingView } from '../../../Components/Card/CustomerCard';
import ShowWhen from '../../../Components/Other/ShowWhen';
import EmptyListView from '../../../Components/View/EmptyListView';
import CustomerTypeSelectorModal from '../../../Components/Modal/Customer/CustomerTypeSelectorModal';
import { GetUserLedgers } from '../../../Utils/types';
import navigator from '../../../Navigation/NavigationService';


export default function CustomerScreen(): React.JSX.Element {
    const dispatch = useAppDispatch();
    const { customers, isAllCustomerFetching } = useCustomerStore();
    const { company } = useCompanyStore();

    const [filterCustomers, setFilterCustomers] = useState<GetUserLedgers[]>([]);

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isCustomerTypeSelectorModalOpen]);

    useEffect(() => {
        setFilterCustomers(() => customers.filter((ledger) => ledger.parent === 'Creditors' || ledger.parent === 'Debtors'
        ));
    }, [customers]);

    return (
        <View style={{ width: '100%', height: '100%' }} >
            <TabNavigationScreenHeader>
                <TextTheme style={{ fontSize: 16, fontWeight: 800 }} >Customers</TextTheme>
            </TabNavigationScreenHeader>

            <FlatList
                ListEmptyComponent={isAllCustomerFetching ? null : <EmptyListView type="customer" />}
                contentContainerStyle={{ marginTop: 12, width: '100%', height: '100%', gap: 20, paddingHorizontal: 20 }}
                data={filterCustomers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    return (
                        <CustomerCard
                            name={item.ledger_name}
                            groupName={item.parent}
                            createOn={item.created_at}
                            onPress={() => { navigator.navigate('customer-info-screen', { customerId: item._id }); }}
                        />
                    );
                }}
                ListFooterComponent={<ShowWhen when={isAllCustomerFetching} >
                    <CustomerLoadingView />
                    <CustomerLoadingView />
                </ShowWhen>}
            />

            <View style={{ position: 'absolute', right: 20, bottom: 20 }} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCustomerTypeSelectorModalOpen(true)} />
            </View>

            <CustomerTypeSelectorModal visible={isCustomerTypeSelectorModalOpen} setVisible={setCustomerTypeSelectorModalOpen} setSecondaryVisible={setCreateCustomerModalOpen} />
            <CreateCustomerModal visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} setPrimaryVisible={setCustomerTypeSelectorModalOpen} />
        </View>
    );
}

/* eslint-disable react-native/no-inline-styles */
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import RoundedPlusButton from '../../../Components/Ui/Button/RoundedPlusButton';
import CreateCustomerModal from '../../../Components/Modal/Customer/CreateCustomerModal';
import { useAppDispatch, useCompanyStore, useCustomerStore } from '../../../Store/ReduxStore';
import { viewAllCustomer } from '../../../Services/customer';
import CustomerCard, { CustomerLoadingView } from '../../../Components/Ui/Card/CustomerCard';
import ShowWhen from '../../../Components/Other/ShowWhen';
import EmptyListView from '../../../Components/Layouts/View/EmptyListView';
import CustomerTypeSelectorModal from '../../../Components/Modal/Customer/CustomerTypeSelectorModal';
import { GetUserLedgers } from '../../../Utils/types';
import navigator from '../../../Navigation/NavigationService';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamsList } from '../../../Navigation/BottomTabNavigation';
import EntityListingHeader from '../../../Components/Layouts/Header/EntityListingHeader';


export default function CustomerScreen(): React.JSX.Element {

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamsList, 'customer-screen'>>();

    const dispatch = useAppDispatch();
    const { customers, isAllCustomerFetching, pageMeta } = useCustomerStore();
    const { company } = useCompanyStore();

    const [filterCustomers, setFilterCustomers] = useState<GetUserLedgers[]>([]);

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    function handleCustomerFetching() {
        if (isAllCustomerFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }

        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }


    useEffect(() => {
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isCustomerTypeSelectorModalOpen]);

    useEffect(() => {
        setFilterCustomers(() => customers.filter((ledger) => ledger.parent === 'Creditors' || ledger.parent === 'Debtors'
        ));
    }, [customers]);

    useEffect(() => {
        const event = navigation.addListener('focus', () => {
            dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: 1 }));
        });

        return event;
    }, []);

    return (
        <View style={{ width: '100%', height: '100%', paddingHorizontal: 20 }} >
            <EntityListingHeader
                title="Customers"
                onPressFilter={() => { }}
                onPressSearch={() => { }}
            />

            <FlatList
                ListEmptyComponent={isAllCustomerFetching ? null : <EmptyListView type="customer" />}
                contentContainerStyle={{ marginTop: 12, width: '100%', height: '100%', gap: 20 }}
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

                ListFooterComponentStyle={{ gap: 20 }}
                ListFooterComponent={<ShowWhen when={isAllCustomerFetching} >
                    {
                        Array.from({
                            length: Math.min(2, pageMeta.total - (customers?.length ?? 0)) + 1,
                        },
                            (_, i) => i
                        ).map(item => (
                            <CustomerLoadingView key={item} />
                        ))
                    }
                </ShowWhen>}

                onScroll={({ nativeEvent }) => {
                    let { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                    let contentOffsetY = contentOffset.y;
                    let totalHeight = contentSize.height;
                    let height = layoutMeasurement.height;

                    if (totalHeight - height < contentOffsetY + 400) {
                        handleCustomerFetching();
                    }
                }}
            />

            <View style={{ position: 'absolute', right: 20, bottom: 20 }} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCustomerTypeSelectorModalOpen(true)} />
            </View>

            <CustomerTypeSelectorModal visible={isCustomerTypeSelectorModalOpen} setVisible={setCustomerTypeSelectorModalOpen} setSecondaryVisible={setCreateCustomerModalOpen} />
            <CreateCustomerModal visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} setPrimaryVisible={setCustomerTypeSelectorModalOpen} />
        </View>
    );
}

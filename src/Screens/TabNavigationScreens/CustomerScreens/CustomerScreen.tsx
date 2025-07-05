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
// import LoadingView from '../../../Components/View/LoadingView';
import ShowWhen from '../../../Components/Other/ShowWhen';
// import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import EmptyListView from '../../../Components/View/EmptyListView';
import BottomModal from '../../../Components/Modal/BottomModal';
import { accountGroups } from '../../../Utils/accountGroups';
import AnimateButton from '../../../Components/Button/AnimateButton';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import { setCustomerType } from '../../../Store/Redusers/customerReduser';
import { useTheme } from '../../../Contexts/ThemeProvider';
import MaterialDesignIcon from '../../../Components/Icon/MaterialDesignIcon';


export default function CustomerScreen(): React.JSX.Element {
    const { primaryColor, primaryBackgroundColor, secondaryBackgroundColor } = useTheme();
    const dispatch = useAppDispatch();
    const { customers, isAllCustomerFetching, customerType } = useCustomerStore();
    const { company } = useCompanyStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isCreateCustomerModalOpen]);

    return (
        <View style={{ width: '100%', height: '100%', paddingHorizontal: 20 }} >
            <TabNavigationScreenHeader>
                <TextTheme style={{ fontSize: 16, fontWeight: 800 }} >Customers</TextTheme>
            </TabNavigationScreenHeader>

            <ShowWhen when={isAllCustomerFetching} >
                <CustomerLoadingView />
                <CustomerLoadingView />
            </ShowWhen>

            <FlatList
                ListEmptyComponent={isAllCustomerFetching ? null : <EmptyListView type="customer" />}
                contentContainerStyle={{ marginTop: 12, width: '100%', height: '100%', gap: 20 }}
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    return (
                        <CustomerCard
                            name={item.ledger_name}
                            groupName={item.parent}
                            createOn={item.created_at}
                        // onPress={() => navigator.navigate('customer-info-screen', {id: item._id})}
                        />
                    );
                }}
            />

            <View style={{ position: 'absolute', right: 20, bottom: 20 }} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCustomerTypeSelectorModalOpen(true)} />
            </View>


            <BottomModal
                visible={isCustomerTypeSelectorModalOpen}
                setVisible={setCustomerTypeSelectorModalOpen}
                style={{ paddingHorizontal: 20, paddingBottom: 40 }}
                onClose={() => {
                    dispatch(setCustomerType(null));
                }}
            >
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <View style={{
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        marginBottom: 16,
                    }} />
                    <TextTheme style={{ fontSize: 24, fontWeight: 'bold' }}>
                        Create New Bill
                    </TextTheme>
                    <TextTheme style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
                        Select the type of bill you want to create
                    </TextTheme>
                </View>

                <View style={{ gap: 10 }}>
                    {accountGroups.filter(group => ['Debtors', 'Creditors'].includes(group.accounting_group_name)).map(group => (
                        <AnimateButton
                            key={group._id}
                            style={{
                                borderRadius: 16,
                                padding: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 16,
                                borderWidth: 1,
                                paddingInline: 16,
                                paddingBlock: 10,
                                borderColor: group.accounting_group_name === customerType?.accounting_group_name ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: group.accounting_group_name === customerType?.accounting_group_name ? `${primaryColor}20` : primaryBackgroundColor,
                            }}
                            onPress={() => {
                                dispatch(setCustomerType(group));
                                setCreateCustomerModalOpen(true);
                                // setCustomerTypeSelectorModalOpen(false);
                            }}
                        >
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: group.accounting_group_name === 'Debtors' ? '#4CAF50' : '#F44336',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <MaterialDesignIcon name={group.accounting_group_name === 'Debtors' ? 'account-multiple-plus-outline' : 'store-plus-outline'} size={24} color="#FFFFFF" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextTheme style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: group.accounting_group_name === customerType?.accounting_group_name ? primaryColor : 'black',
                                }}>
                                    {group.accounting_group_name}
                                </TextTheme>
                                <TextTheme style={{
                                    fontSize: 12,
                                    opacity: 0.7,
                                    marginTop: 2,
                                    color: group.accounting_group_name === customerType?.accounting_group_name ? primaryColor : 'black',
                                }}>
                                    {group.description}
                                </TextTheme>
                            </View>

                            <FeatherIcon name="chevron-right" size={20} />
                        </AnimateButton>
                    ))}
                </View>
            </BottomModal>
            <CreateCustomerModal visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} />
        </View>
    );
}

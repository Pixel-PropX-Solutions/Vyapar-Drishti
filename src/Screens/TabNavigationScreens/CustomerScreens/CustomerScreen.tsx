/* eslint-disable react-native/no-inline-styles */
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import RoundedPlusButton from '../../../Components/Ui/Button/RoundedPlusButton';
import CreateCustomerModal from '../../../Components/Modal/Customer/CreateCustomerModal';
import { useAppDispatch, useCustomerStore, useUserStore } from '../../../Store/ReduxStore';
import { viewAllCustomer } from '../../../Services/customer';
import CustomerCard, { CustomerLoadingView } from '../../../Components/Ui/Card/CustomerCard';
import ShowWhen from '../../../Components/Other/ShowWhen';
import EmptyListView from '../../../Components/Layouts/View/EmptyListView';
import CustomerTypeSelectorModal from '../../../Components/Modal/Customer/CustomerTypeSelectorModal';
// import { GetUserLedgers } from '../../../Utils/types';
import navigator from '../../../Navigation/NavigationService';
import { useFocusEffect } from '@react-navigation/native';
import EntityListingHeader from '../../../Components/Layouts/Header/EntityListingHeader';
import { setCustomers } from '../../../Store/Reducers/customerReducer';
import AnimateButton from '../../../Components/Ui/Button/AnimateButton';
import TextTheme from '../../../Components/Ui/Text/TextTheme';
import BackgroundThemeView from '../../../Components/Layouts/View/BackgroundThemeView';
import CreateAccountModal from '../../../Components/Modal/Customer/CreateAccountModal';
import AuthStore from '../../../Store/AuthStore';
import CustomerContextProvider, { useCustomerContext } from './CustomerViewScreen/Context';


export default function CustomerScreen(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const { customers, isAllCustomerFetching, pageMeta } = useCustomerStore();
    const { filters } = useCustomerContext();
    const { user, current_company_id } = useUserStore();
    const currentCompanyId = current_company_id || AuthStore.getString('current_company_id') || user?.user_settings?.current_company_id || '';
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);
    const [isAccountCreateModalVisible, setAccountCreateModalVisible] = useState<boolean>(false);

    function handleCustomerFetching() {
        if (isAllCustomerFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }

        dispatch(viewAllCustomer({ company_id: current_company_id ?? '', pageNumber: pageMeta.page + 1, type: filters.type }));
    }


    useEffect(() => {
        if (!isCustomerTypeSelectorModalOpen) { dispatch(viewAllCustomer({ company_id: currentCompanyId, pageNumber: 1, type: filters.type, searchQuery })); }
    }, [isCustomerTypeSelectorModalOpen]);

    useFocusEffect(
        useCallback(() => {
            // if (!['Accounts', 'Customers'].includes(type)) { return; }
            dispatch(setCustomers([]));
            dispatch(viewAllCustomer({ company_id: currentCompanyId, pageNumber: 1, type: filters.type, searchQuery }));
        }, [filters.type, searchQuery])
    );

    return (
        <CustomerContextProvider>
            <View style={{ width: '100%', height: '100%', paddingHorizontal: 20 }} >
                <EntityListingHeader
                    title="Customers"
                    onPressNotification={() => { navigator.navigate('notification-screen'); }}
                    searchButtonOpations={{
                        onQueryChange: setSearchQuery
                    }}
                />

                {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>

                {
                    ['Customers', 'Accounts'].map(item => (
                        <AnimateButton key={item}
                            onPress={() => { handleFilter("type", item as 'Accounts' | 'Customers'); }}

                            bubbleColor={filters.type === item ? primaryBackgroundColor : primaryColor}

                            style={{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                                backgroundColor: filters.type === item ? primaryColor : primaryBackgroundColor,
                            }}
                        >
                            <TextTheme
                                isPrimary={filters.type === item}
                                useInvertTheme={filters.type === item}
                                fontSize={12}
                                fontWeight={900}
                            >{item}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </View> */}

                <FlatList
                    ListEmptyComponent={isAllCustomerFetching ? <CustomerLoadingView /> : <EmptyListView type="customer" />}
                    contentContainerStyle={{ gap: 20, paddingBottom: 80, paddingTop: 12 }}
                    data={customers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        return (
                            <CustomerCard
                                item={item}
                                onPress={() => { navigator.navigate('customer-view-screen', { id: item._id }); }}
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
                    <ShowWhen when={filters.type === 'Accounts'}
                        otherwise={
                            <RoundedPlusButton size={60} iconSize={24} onPress={() => setCustomerTypeSelectorModalOpen(true)} />
                        }
                    >
                        <BackgroundThemeView useInvertTheme={true} style={{ overflow: 'hidden', borderRadius: 100 }} >
                            <AnimateButton
                                onPress={() => { setAccountCreateModalVisible(true); }}
                                style={{ paddingInline: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <TextTheme useInvertTheme={true} fontSize={16} >+ Add Account</TextTheme>
                            </AnimateButton>
                        </BackgroundThemeView>
                    </ShowWhen>
                </View>


                <CreateAccountModal visible={isAccountCreateModalVisible} setVisible={setAccountCreateModalVisible} />
                <CustomerTypeSelectorModal visible={isCustomerTypeSelectorModalOpen} setVisible={setCustomerTypeSelectorModalOpen} setSecondaryVisible={setCreateCustomerModalOpen} />
                <CreateCustomerModal visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} setPrimaryVisible={setCustomerTypeSelectorModalOpen} />
            </View>
        </CustomerContextProvider>
    );
}

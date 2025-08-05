/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { FilterRow, InvoiceListing, ProfileSection } from './Components';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import SafeAreaFromTop from '../../../../Components/Other/SafeAreaView/SafeAreaFromTop';
import MonthSelector from '../../../../Components/Ui/Option/MonthSelector';
import LoadinScreen from './LoadingScreen';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import { useCallback, useEffect, useState } from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { SortOrder } from '../../../../Utils/types';
import { useAppDispatch, useUserStore } from '../../../../Store/ReduxStore';
import { getCustomer, getCustomerInvoices } from '../../../../Services/customer';


export default function CustomerViewScreen() {
    const router = useRoute<RouteProp<StackParamsList, 'customer-view-screen'>>();
    const { id: customer_id } = router.params;
    const dispatch = useAppDispatch();
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst || false;

    const [data, setData] = useState({
        searchQuery: '',
        type: 'all',
        page: 1,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        endDate: new Date().toISOString(),
        rowsPerPage: 10,
        sortField: 'date',
        sortOrder: 'asc' as SortOrder,
    });

    const { searchQuery, type, page, startDate, endDate, rowsPerPage, sortField, sortOrder } = data;
    const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);

    const [laoding, setLoading] = useState<boolean>(true);
    const fetchCustomersInvoices = useCallback(async () => {
        dispatch(getCustomerInvoices({
            searchQuery: debouncedQuery,
            company_id: current_company_id || '',
            customer_id: customer_id || '',
            pageNumber: page,
            type,
            limit: rowsPerPage,
            sortField,
            sortOrder,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
        }));
    }, [current_company_id, customer_id, dispatch, endDate, page, rowsPerPage, debouncedQuery, sortField, sortOrder, startDate, type]);

    useEffect(() => {
        if (customer_id) {
            dispatch(getCustomer(customer_id));
        }
    }, [dispatch, customer_id]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchCustomersInvoices().finally(() => setLoading(false));
        }, [fetchCustomersInvoices])
    );

    // Debounce logic: delay setting the debouncedQuery
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Fetch customers when debouncedQuery or other filters change
    useEffect(() => {
        if (debouncedQuery) {
            fetchCustomersInvoices();
        }
    }, [debouncedQuery, page, rowsPerPage, sortField, sortOrder, type, fetchCustomersInvoices]);



    return (
        <View style={{ width: '100%', height: '100%' }} >
            <SafeAreaFromTop />

            <ShowWhen when={!laoding} otherwise={<LoadinScreen />} >
                <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 36, marginBottom: 8 }} >
                    <ProfileSection />
                    {/* <FilterRow /> */}
                </View>

                <BackgroundThemeView isPrimary={false} style={{ width: '100%', borderTopRightRadius: 40, borderTopLeftRadius: 40, padding: 20, flex: 1, gap: 20, paddingBottom: 0 }} >
                    {/* <MonthSelector /> */}
                    <InvoiceListing />

                    <View style={{ minHeight: 40 }} />
                </BackgroundThemeView>
            </ShowWhen>
        </View>
    );
}

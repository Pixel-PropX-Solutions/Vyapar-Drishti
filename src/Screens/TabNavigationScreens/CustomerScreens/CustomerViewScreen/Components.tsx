/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import NormalButton from '../../../../Components/Ui/Button/NormalButton';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { useCallback, useEffect, useState } from 'react';
import navigator from '../../../../Navigation/NavigationService';
import BillCard, { BillLoadingCard } from '../../../../Components/Ui/Card/BillCard';
import { useAppDispatch, useCustomerStore, useUserStore } from '../../../../Store/ReduxStore';
import { FlatList } from 'react-native-gesture-handler';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import { getCustomer, getCustomerInvoices } from '../../../../Services/customer';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { GetCustomerInvoices, SortOrder } from '../../../../Utils/types';
import EmptyListView from '../../../../Components/Layouts/View/EmptyListView';
import usePDFHandler from '../../../../Hooks/usePDFHandler';
import { printGSTInvoices, printInvoices } from '../../../../Services/invoice';
import LoadingModal from '../../../../Components/Modal/LoadingModal';


export function ProfileSection() {
    const { customer, loading } = useCustomerStore();
    const router = useRoute<RouteProp<StackParamsList, 'customer-view-screen'>>();
    const { id: customer_id } = router.params;
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (customer_id) {
            dispatch(getCustomer(customer_id));
        }
    }, [dispatch, customer_id]);

    if (!customer_id) { return <></>; }

    return (
        <View style={{ gap: 16 }} >
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                <AnimateButton
                    style={{ aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { navigator.goBack(); }}
                >
                    <FeatherIcon name="chevron-left" size={20} />
                </AnimateButton>
                <View>
                    <TextTheme fontWeight={900} fontSize={16}>
                        {customer?.ledger_name}
                    </TextTheme>
                    <TextTheme isPrimary={false} fontWeight={500} fontSize={12}>
                        {customer?.parent}
                    </TextTheme>
                </View>
            </View>

            <NormalButton
                text="View full Profile"
                textSize={12} height={36}
                textWeight={600} isPrimary={false}
                onPress={() => { navigator.navigate('customer-info-screen', { id: customer_id }); }}
            />
        </View>
    );
}


export function FilterRow(): React.JSX.Element {

    const { primaryColor, primaryBackgroundColor } = useTheme();

    const [selected, setSelected] = useState('All');

    return (
        <View style={{ gap: 4, width: '100%' }} >
            <ScrollView
                horizontal={true}
                contentContainerStyle={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
                {
                    ['All', 'Sales', 'Purchase', 'Transaction'].map(type => (
                        <AnimateButton key={type}
                            onPress={() => { setSelected(type); }}
                            bubbleColor={type === selected ? primaryBackgroundColor : primaryColor}

                            style={{
                                alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                                backgroundColor: type === selected ? primaryColor : primaryBackgroundColor,
                            }}
                        >
                            <TextTheme
                                isPrimary={type === selected}
                                useInvertTheme={type === selected}
                            >{type}</TextTheme>
                        </AnimateButton>
                    ))
                }
            </ScrollView>
        </View>
    );
}



export function InvoiceListing() {
    const { customerInvoices, isAllCustomerInvoicesFetching, pageMeta } = useCustomerStore();
    const router = useRoute<RouteProp<StackParamsList, 'customer-view-screen'>>();
    const { id: customer_id } = router.params;
    const dispatch = useAppDispatch();
    const { user, current_company_id } = useUserStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === current_company_id);
    const [loading, setLoading] = useState<boolean>(true);
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
    const gst_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_gst;

    const { init, isGenerating, setIsGenerating, PDFViewModal, handleShare } = usePDFHandler();

    const [isPDFModalVisible, setPDFModalVisible] = useState<boolean>(false);

    async function handleInvoice(invoice: GetCustomerInvoices, callback: () => void) {

        if (!['Sales', 'Purchase'].includes(invoice.voucher_type)) { return; }

        try {
            setIsGenerating(true);

            const res = await dispatch((gst_enable ? printGSTInvoices : printInvoices)({
                vouchar_id: invoice.vouchar_id,
                company_id: current_company_id || '',
            }));

            if (res.meta.requestStatus !== 'fulfilled') {
                console.error('Failed to print invoice:', res.payload);
                return;
            }

            const { paginated_data, download_data } = res.payload as { paginated_data: Array<{ html: string, page_number: number }>, download_data: string };

            init({ html: paginated_data.map(item => item.html), downloadHtml: download_data, pdfName: invoice.voucher_number, title: invoice.voucher_number }, callback);
        } catch (e) {
            console.error('Error printing invoice:', e);
        } finally {
            setIsGenerating(false);
        }
    }

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

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchCustomersInvoices().finally(() => setLoading(false));
        }, [fetchCustomersInvoices])
    );

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    function handleCustomerInvoicesFetching() {
        if (isAllCustomerInvoicesFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }

        dispatch(getCustomerInvoices({
            searchQuery: debouncedQuery,
            company_id: current_company_id || '',
            customer_id: customer_id || '',
            pageNumber: page + 1,
            type,
            limit: rowsPerPage,
            sortField,
            sortOrder,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
        }));
    }

    // Fetch customers when debouncedQuery or other filters change
    useEffect(() => {
        if (debouncedQuery) {
            fetchCustomersInvoices();
        }
    }, [debouncedQuery, page, rowsPerPage, sortField, sortOrder, type, fetchCustomersInvoices]);


    return (
        <>
            <FlatList
                ListEmptyComponent={(isAllCustomerInvoicesFetching || loading) ? <BillLoadingCard /> : <EmptyListView type="customer" />}
                contentContainerStyle={{ marginTop: 12, width: '100%', height: '100%', gap: 20 }}
                data={customerInvoices}
                keyExtractor={(item) => item.vouchar_id}
                renderItem={({ item }) => {
                    return (
                        <BillCard
                            key={item.vouchar_id}
                            billNo={item.voucher_number}
                            createOn={item.date}
                            customerName={item.customer}
                            payAmount={1000}
                            totalAmount={item.amount}
                            type={item.voucher_type}
                            onPrint={() => { handleInvoice(item, () => { setPDFModalVisible(true); }); }}
                            onShare={() => { handleInvoice(item, handleShare); }}
                            onPress={() => { navigator.navigate('bill-info-screen', { id: item.vouchar_id }); }}
                        />
                    );
                }}

                ListFooterComponentStyle={{ gap: 20 }}
                ListFooterComponent={<ShowWhen when={isAllCustomerInvoicesFetching || loading} >
                    {
                        Array.from({
                            length: Math.min(2, pageMeta.total - (customerInvoices?.length ?? 0)) + 1,
                        },
                            (_, i) => i
                        ).map(item => (
                            <BillLoadingCard key={item} />
                        ))
                    }
                </ShowWhen>}

                onScroll={({ nativeEvent }) => {
                    let { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                    let contentOffsetY = contentOffset.y;
                    let totalHeight = contentSize.height;
                    let height = layoutMeasurement.height;

                    if (totalHeight - height < contentOffsetY + 400) {
                        handleCustomerInvoicesFetching();
                    }
                }}
            />
            <PDFViewModal visible={isPDFModalVisible} setVisible={setPDFModalVisible} />
            <LoadingModal visible={isGenerating} />
        </>
    );
}

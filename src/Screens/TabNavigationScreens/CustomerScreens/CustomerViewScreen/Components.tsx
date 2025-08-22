/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
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
import { GetCustomerInvoices } from '../../../../Utils/types';
import EmptyListView from '../../../../Components/Layouts/View/EmptyListView';
import usePDFHandler from '../../../../Hooks/usePDFHandler';
import { printTAXInvoices, printInvoices } from '../../../../Services/invoice';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { StatsCard } from '../../../../Components/Ui/Card/StatsCard';
import { useCustomerContext } from './Context';
import { formatLocalDate, formatNumberForUI, getMonthByIndex } from '../../../../Utils/functionTools';

type Date = { month: number, year: number }
export function ProfileSection() {
    const { customer, isAllCustomerFetching } = useCustomerStore();
    const [GREEN, ORANGE, RED, YELLOW, BLUE] = ['50,200,150', '200,150,50', '250,50,50', '200,150,50', '50,150,200'];
    const router = useRoute<RouteProp<StackParamsList, 'customer-view-screen'>>();
    const { id: customer_id } = router.params;
    const dispatch = useAppDispatch();
    const { filters } = useCustomerContext();
    const date: Date = { month: new Date(filters.startDate ?? '').getMonth(), year: new Date(filters.startDate ?? '').getFullYear() };

    const { secondaryBackgroundColor } = useTheme()

    useEffect(() => {
        if (customer_id) {
            dispatch(getCustomer({ customer_id: customer_id, start_date: formatLocalDate(new Date(filters.startDate ?? '')), end_date: formatLocalDate(new Date(filters.endDate ?? '')) })); // Adjusted to match the new API signature
        }
    }, [dispatch, customer_id, filters.startDate, filters.endDate]);

    if (!customer_id) { return <></>; }

    return (
        <View style={{ gap: 16 }} >
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }} >
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                    <AnimateButton
                        style={{ aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: secondaryBackgroundColor }}
                        onPress={() => { navigator.goBack(); }}
                    >
                        <FeatherIcon name="chevron-left" size={20} />
                    </AnimateButton>
                    <View>
                        <TextTheme fontWeight={700} fontSize={16}>
                            {customer?.ledger_name}
                        </TextTheme>
                        <TextTheme isPrimary={false} fontWeight={500} fontSize={12}>
                            {customer?.parent}
                        </TextTheme>
                    </View>
                </View>

                <View style={{ marginRight: 8 }} >
                    <AnimateButton
                        onPress={() => { navigator.navigate('customer-info-screen', { id: customer_id }); }}
                        style={{ width: 40, aspectRatio: 1, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}
                    >
                        <FeatherIcon name="eye" size={16} />
                    </AnimateButton>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }} >
                <StatsCard rgb={(customer?.opening_balance ?? 0) < 0 ? RED : GREEN} label="Opening (All)" value={formatNumberForUI(Math.abs(customer?.opening_balance ?? 0))} />
                <StatsCard rgb={RED} label={`Debit (${getMonthByIndex(date.month)})`} value={formatNumberForUI(Math.abs(customer?.total_debit ?? 0))} />
                <StatsCard rgb={GREEN} label={`Credit (${getMonthByIndex(date.month)})`} value={formatNumberForUI(Math.abs(customer?.total_credit ?? 0))} />
                <StatsCard rgb={(customer?.total_amount ?? 0) < 0 ? RED : GREEN} label="Closing (All)" value={formatNumberForUI(Math.abs(customer?.total_amount ?? 0))} />
            </View>
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
    const router = useRoute<RouteProp<StackParamsList, 'customer-view-screen'>>();
    const { id: customer_id } = router.params;
    const dispatch = useAppDispatch();
    const { filters } = useCustomerContext();
    const { user, current_company_id } = useUserStore();
    const { customerInvoicesPageMeta, customerInvoices, isAllCustomerInvoicesFetching } = useCustomerStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === current_company_id);

    const [debouncedQuery, setDebouncedQuery] = useState<string>(filters.searchQuery);
    const tax_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_tax;

    const { init, isGenerating, setIsGenerating, PDFViewModal, handleShare } = usePDFHandler();

    const [isPDFModalVisible, setPDFModalVisible] = useState<boolean>(false);

    async function handleInvoice(invoice: GetCustomerInvoices, callback: () => void) {

        if (!['Sales', 'Purchase'].includes(invoice.voucher_type)) { return; }

        try {
            setIsGenerating(true);

            const res = await dispatch((tax_enable ? printTAXInvoices : printInvoices)({
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


    function handleCustomerInvoiceFetching() {
        if (isAllCustomerInvoicesFetching) { return; }
        if (customerInvoicesPageMeta.total <= customerInvoicesPageMeta.page * customerInvoicesPageMeta.limit) { return; }
        dispatch(getCustomerInvoices({
            searchQuery: debouncedQuery,
            company_id: current_company_id || '',
            customer_id: customer_id || '',
            type: filters.invoiceType,
            pageNumber: customerInvoicesPageMeta.page + 1,
            sortField: filters.sortBy,
            sortOrder: filters.useAscOrder ? 'asc' : 'desc',
            start_date: formatLocalDate(new Date(filters.startDate ?? '')),
            end_date: formatLocalDate(new Date(filters.endDate ?? '')),
        }));
    }

    useEffect(() => {
        if (customer_id) {
            dispatch(getCustomer({ customer_id: customer_id, start_date: formatLocalDate(new Date(filters.startDate ?? '')), end_date: formatLocalDate(new Date(filters.endDate ?? '')) })); // Adjusted to match the new API signature
        }
    }, [dispatch, customer_id, filters.startDate, filters.endDate]);

    useFocusEffect(
        useCallback(() => {
            dispatch(getCustomerInvoices({
                searchQuery: debouncedQuery,
                company_id: current_company_id || '',
                customer_id: customer_id || '',
                pageNumber: 1,
                type: filters.invoiceType,
                sortField: filters.sortBy,
                sortOrder: filters.useAscOrder ? 'asc' : 'desc',
                start_date: formatLocalDate(new Date(filters.startDate ?? '')),
                end_date: formatLocalDate(new Date(filters.endDate ?? '')),
            }));
        }, [current_company_id, customer_id, debouncedQuery, filters.endDate, filters.invoiceType, filters.sortBy, filters.startDate, filters.useAscOrder])
    );

    // Debounce logic: delay setting the debouncedQuery
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(filters.searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters.searchQuery]);



    return (
        <>
            <FlatList
                ListEmptyComponent={
                    isAllCustomerInvoicesFetching ?
                        <BillLoadingCard /> :
                        <EmptyListView
                            title="No invoices found for this period."
                            text="Try adjusting your filters or adding a new invoice." />
                }
                contentContainerStyle={{ marginTop: 12, width: '100%', gap: 20 }}
                data={customerInvoices}
                keyExtractor={(item) => item.vouchar_id}
                renderItem={({ item }) => {
                    return (
                        <BillCard
                            key={item.vouchar_id}
                            billNo={item.voucher_number}
                            createOn={item.date}
                            customerName={item.customer}
                            payAmount={0}
                            totalAmount={item.amount}
                            type={item.voucher_type}
                            onPrint={() => { handleInvoice(item, () => { setPDFModalVisible(true); }); }}
                            onShare={() => { handleInvoice(item, handleShare); }}
                            onPress={() => { navigator.navigate('bill-info-screen', { id: item.vouchar_id }); }}
                        />
                    );
                }}

                ListFooterComponentStyle={{ gap: 20 }}
                ListFooterComponent={<ShowWhen when={isAllCustomerInvoicesFetching} >
                    {
                        Array.from({
                            length: Math.min(2, customerInvoicesPageMeta.total - (customerInvoices?.length ?? 0)) + 1,
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
                        handleCustomerInvoiceFetching();
                    }
                }}
            />
            <PDFViewModal visible={isPDFModalVisible} setVisible={setPDFModalVisible} />
            <LoadingModal visible={isGenerating} />
        </>
    );
}

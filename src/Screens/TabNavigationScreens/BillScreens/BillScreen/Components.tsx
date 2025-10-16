/* eslint-disable react-native/no-inline-styles */
import { Pressable, View } from 'react-native';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { formatLocalDate, getMonthByIndex } from '../../../../Utils/functionTools';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { useCallback, useState } from 'react';
import { useBillContext } from './Context';
import { BillTypeSelectorModal, DateSelectorModal, FilterModal } from './Modals';
import EntityListingHeader from '../../../../Components/Layouts/Header/EntityListingHeader';
import { FlatList } from 'react-native';
import { RefreshControl } from 'react-native';
import EmptyListView from '../../../../Components/Layouts/View/EmptyListView';
import BillCard, { BillLoadingCard } from '../../../../Components/Ui/Card/BillCard';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import { useAppDispatch, useInvoiceStore, useUserStore } from '../../../../Store/ReduxStore';
import { getTAXInvoicesPDF, getInvoicesPDF, getPaymentPDF, getRecieptPDF, viewAllInvoices } from '../../../../Services/invoice';
import navigator from '../../../../Navigation/NavigationService';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import RoundedPlusButton from '../../../../Components/Ui/Button/RoundedPlusButton';
import { GetAllVouchars } from '../../../../Utils/types';
import { useFocusEffect } from '@react-navigation/native';
import { setInvoice } from '../../../../Store/Reducers/invoiceReducer';
import { useAlert } from '../../../../Components/Ui/Alert/AlertProvider';
import usePDFHandler from '../../../../Hooks/usePDFHandler';


export function Header(): React.JSX.Element {

    const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);

    const { handleFilter } = useBillContext();

    return (
        <View style={{ paddingInline: 20 }} >
            <EntityListingHeader
                title="Bills"
                onPressNotification={() => { navigator.navigate('notification-screen'); }}
                searchButtonOpations={{
                    onQueryChange: (query) => { handleFilter('searchQuery', query); },
                }}
            />

            <FilterModal visible={isFilterModalVisible} setVisible={setFilterModalVisible} />
        </View>
    );
}


const billTypes = [{
    label: 'All',
    value: 'all',
}, {
    label: 'Sales',
    value: 'Sales',
}, {
    label: 'Purchase',
    value: 'Purchase',
}, {
    label: 'Receipt',
    value: 'Receipt',
}, {
    label: 'Payment',
    value: 'Payment',
}];

export function BillTypeFilter(): React.JSX.Element {


    const { primaryColor, primaryBackgroundColor } = useTheme();
    const { filters, handleFilter } = useBillContext();
    const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);

    return (
        <>
            <View style={{ paddingInline: 20, gap: 4, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                <View style={{ gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }} >
                    <TextTheme isPrimary={true} fontSize={14} fontWeight={900} color={primaryColor}>
                        Type
                    </TextTheme>

                    <AnimateButton
                        onPress={() => {
                            setFilterModalVisible(true);
                            return;
                        }}

                        bubbleColor={primaryBackgroundColor}

                        style={{
                            alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                            backgroundColor: primaryColor,
                        }}
                    >
                        <TextTheme
                            isPrimary={true}
                            useInvertTheme={true}
                            fontSize={12}
                            fontWeight={900}
                        >
                            {billTypes.find(item => item.value === filters.billType)?.label || 'All'}
                        </TextTheme>
                    </AnimateButton>

                </View>
                <AnimateButton
                    style={{ height: 28, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 40, paddingInline: 14 }}
                    onPress={() => { handleFilter('useAscOrder', !filters.useAscOrder); }}
                >
                    <TextTheme fontSize={12}>{filters.sortBy.charAt(0).toUpperCase() + filters.sortBy.slice(1)}</TextTheme>
                    <FeatherIcon
                        name={filters.useAscOrder ? 'arrow-up' : 'arrow-down'}
                        size={16}
                    />
                    <TextTheme fontSize={12}>{filters.useAscOrder ? 'Asc' : 'Des'}</TextTheme>
                </AnimateButton>
            </View>
            <FilterModal visible={isFilterModalVisible} setVisible={setFilterModalVisible} />
        </>
    );
}


export function DateSelector() {

    const { primaryColor } = useTheme();
    const { date, setDate, handleFilter } = useBillContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    function incrementMonth(by: number) {
        const nextMonth = (date.month + by + 12) % 12;
        const nextYear = date.year + Math.floor((date.month + by) / 12);
        setDate({ year: nextYear, month: nextMonth });
        handleFilter('startDate', new Date(nextYear, nextMonth, 1).toISOString());
        handleFilter('endDate', new Date(nextYear, nextMonth + 1, 0).toISOString());
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingInline: 10, height: 40, borderRadius: 40, borderWidth: 2, borderColor: primaryColor }} >
            <AnimateButton style={{ borderRadius: 20, padding: 4 }} onPress={() => incrementMonth(-1)}>
                <FeatherIcon name="chevron-left" size={20} />
            </AnimateButton>

            <Pressable onPress={() => { setModalVisible(true); }}>
                <TextTheme fontSize={16} fontWeight={900}>{getMonthByIndex(date.month)}, {date.year}</TextTheme>
            </Pressable>

            <AnimateButton style={{ borderRadius: 20, padding: 4 }} onPress={() => incrementMonth(1)}>
                <FeatherIcon name="chevron-right" size={20} />
            </AnimateButton>

            <DateSelectorModal
                visible={isModalVisible} setVisible={setModalVisible}
            />
        </View>
    );
}


export function BillListing() {

    const dispatch = useAppDispatch();
    const { user, current_company_id } = useUserStore();
    const { invoices, isInvoiceFeaching, pageMeta } = useInvoiceStore();
    const { filters } = useBillContext();
    const { setAlert } = useAlert();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_tax;

    const { init, isGenerating, setIsGenerating, PDFViewModal, handleShare } = usePDFHandler();

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isPDFModalVisible, setPDFModalVisible] = useState<boolean>(false);

    function handleInvoiceFetching() {
        if (isInvoiceFeaching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllInvoices({ company_id: current_company_id ?? '', pageNumber: pageMeta.page + 1, type: filters.billType, sortField: filters.sortBy, sortOrder: filters.useAscOrder ? '1' : '-1', start_date: formatLocalDate(new Date(filters.startDate ?? '')), end_date: formatLocalDate(new Date(filters.endDate ?? '')) }));
    }

    function handleRefresh() {
        if (refreshing) { return; }
        setRefreshing(true);
        dispatch(viewAllInvoices({ company_id: current_company_id ?? '', pageNumber: 1, type: filters.billType, sortField: filters.sortBy, sortOrder: filters.useAscOrder ? '1' : '-1', start_date: formatLocalDate(new Date(filters.startDate ?? '')), end_date: formatLocalDate(new Date(filters.endDate ?? '')) }))
            .finally(() => setRefreshing(false));
    }

    async function handleInvoice(invoice: GetAllVouchars, callback: () => void) {
        try {
            setIsGenerating(true);
            const res = await dispatch(
                (invoice.voucher_type === 'Payment' ? getPaymentPDF :
                    invoice.voucher_type === 'Receipt' ? getRecieptPDF :
                        tax_enable ? getTAXInvoicesPDF : getInvoicesPDF)({
                            vouchar_id: invoice._id,
                            company_id: current_company_id || '',
                        }));

            if ((invoice.voucher_type === 'Payment' ? getPaymentPDF :
                invoice.voucher_type === 'Receipt' ? getRecieptPDF :
                    tax_enable ? getTAXInvoicesPDF : getInvoicesPDF).fulfilled.match(res)) {

                const { filePath } = res.payload as {
                    filePath: string;
                    rawBase64: string;
                };

                if (!filePath) {
                    console.error('No filePath returned from PDF API');
                    setAlert({
                        type: 'error',
                        message: 'Failed to generate PDF. Please try again later.',
                        duration: 1000,
                    });
                    return;
                }
                init(
                    {
                        filePath: filePath,
                        entityNumber: invoice.voucher_number,
                        customer: invoice.party_name,
                        fileName: `${invoice.voucher_number}-vyapar-drishti`,
                        cardTitle: invoice.voucher_type === 'Payment' ? 'View or Share Payment' :
                            invoice.voucher_type === 'Receipt' ? 'View or Share Receipt' : 'View or Share Invoice',
                    },
                    callback
                );
            }
            else {
                console.error('Failed to print invoice:', res.payload);
                setAlert({
                    type: 'error',
                    message: (res.payload as any) || 'Failed to generate PDF. Please try again later.',
                    duration: 1000,
                });
                return;
            }
        } catch (e) {
            console.error('Error printing invoice:', e);
            setAlert({
                type: 'error',
                message: 'An unexpected error occurred. Please try again later.',
                duration: 1000,
            });
        } finally {
            setIsGenerating(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(setInvoice([]));
            dispatch(viewAllInvoices({
                company_id: current_company_id ?? '', pageNumber: 1, type: filters.billType, sortOrder: filters.useAscOrder ? '1' : '-1', searchQuery: filters.searchQuery, sortField: filters.sortBy,
                start_date: formatLocalDate(new Date(filters.startDate ?? '')), end_date: formatLocalDate(new Date(filters.endDate ?? '')),
            }));
        }, [current_company_id, filters.billType, filters.sortBy, filters.useAscOrder, filters.startDate, filters.endDate, filters.searchQuery])
    );

    return (<>
        <FlatList
            data={invoices}
            keyExtractor={(item, index) => item._id + index}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }

            ListEmptyComponent={
                <ShowWhen when={!isInvoiceFeaching} otherwise={<BillLoadingCard />} >
                    <EmptyListView title={`No ${filters.billType === 'all' ? 'bills' : filters.billType} records found.`} text={`Try adjusting your filters or create a new ${filters.billType === 'all' ? 'bill' : filters.billType}.`} />
                </ShowWhen>
            }

            contentContainerStyle={{
                gap: 12,
                paddingBottom: 100,
                flexGrow: 1,
            }}

            renderItem={({ item }) => (
                <BillCard
                    billNo={item.voucher_number}
                    type={item.voucher_type}
                    customerName={item.party_name}
                    createOn={item.date}
                    totalAmount={item.amount}
                    payAmount={item.paid_amount}
                    onPrint={() => {
                        if (['Sales', 'Purchase', 'Receipt', 'Payment'].includes(item.voucher_type)) {
                            handleInvoice(item, () => { setPDFModalVisible(true); });
                        }
                    }}
                    onShare={() => { handleInvoice(item, () => { handleShare(); }); }}
                    onPress={() => { navigator.navigate('bill-info-screen', { id: item._id }); }}
                />
            )}

            ListFooterComponent={
                <ShowWhen when={isInvoiceFeaching}>
                    <View style={{ gap: 12 }}>
                        {
                            Array.from({ length: Math.min(2, pageMeta.total - (invoices?.length ?? 0)) + 1 }, (_, i) => i)
                                .map(item => <BillLoadingCard key={item} />)
                        }
                    </View>
                </ShowWhen>
            }

            onScroll={({ nativeEvent }) => {
                let { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                let contentOffsetY = contentOffset.y;
                let totalHeight = contentSize.height;
                let height = layoutMeasurement.height;

                if (totalHeight - height < contentOffsetY + 400) {
                    handleInvoiceFetching();
                }
            }}
        />

        <PDFViewModal visible={isPDFModalVisible} setVisible={setPDFModalVisible} />
        <LoadingModal visible={isGenerating} />
    </>);
}



export function BillCreateButton() {

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <View style={{ position: 'absolute', right: 20, bottom: 20 }} >
            <RoundedPlusButton
                size={60}
                iconSize={24}
                onPress={() => setModalVisible(true)}
            />

            <BillTypeSelectorModal visible={isModalVisible} setVisible={setModalVisible} />
        </View>
    );
}

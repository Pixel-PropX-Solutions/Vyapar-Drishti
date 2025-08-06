/* eslint-disable react-native/no-inline-styles */
import { Pressable, View } from 'react-native';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { getMonthByIndex } from '../../../../Utils/functionTools';
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
import { printGSTInvoices, printInvoices, viewAllInvoices } from '../../../../Services/invoice';
import navigator from '../../../../Navigation/NavigationService';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import RoundedPlusButton from '../../../../Components/Ui/Button/RoundedPlusButton';
import { GetAllVouchars } from '../../../../Utils/types';
import usePDFHandler from '../../../../Hooks/usePDFHandler';
import { useFocusEffect } from '@react-navigation/native';
import { setInvoice } from '../../../../Store/Reducers/invoiceReducer';



export function Header(): React.JSX.Element {

    const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);

    return (
        <View style={{ paddingInline: 20 }} >
            <EntityListingHeader
                title="Bills"
                onPressNotification={() => { navigator.navigate('notification-screen'); }}
            />

            <FilterModal visible={isFilterModalVisible} setVisible={setFilterModalVisible} />
        </View>
    );
}

export function BillTypeFilter(): React.JSX.Element {


    const { primaryColor, primaryBackgroundColor } = useTheme();
    const { filters, handleFilter } = useBillContext();
    const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingInline: 20 }} >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>

                    {
                        ['Invoices', 'Transactions', 'More'].map(type => (
                            <AnimateButton key={type}
                                onPress={() => {
                                    if (type === 'More') {
                                        setFilterModalVisible(true);
                                        return;
                                    } else {
                                        handleFilter('billType', type as 'all' | 'Sales' | 'Purchase' | 'Transactions' | 'Payment' | 'Receipt' | 'More');
                                    }
                                }}

                                bubbleColor={type === filters.billType ? primaryBackgroundColor : primaryColor}

                                style={{
                                    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                                    backgroundColor: type === filters.billType ? primaryColor : primaryBackgroundColor,
                                }}
                            >
                                <TextTheme
                                    isPrimary={type === filters.billType}
                                    useInvertTheme={type === filters.billType}
                                    fontSize={12}
                                    fontWeight={900}
                                >
                                    {type === 'More' ? <FeatherIcon name="more-horizontal" size={16} /> : type}
                                </TextTheme>
                            </AnimateButton>
                        ))
                    }
                </View>

                <AnimateButton
                    style={{ height: 28, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 40, paddingInline: 14 }}
                    onPress={() => { handleFilter('useAscOrder', !filters.useAscOrder); }}
                >
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
    const { date, setDate } = useBillContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    function incrementMonth(by: number) {
        const nextMonth = (date.month + by + 12) % 12;
        const nextYear = date.year + Math.floor((date.month + by) / 12);
        setDate({ year: nextYear, month: nextMonth });
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
    const currentCompnayDetails = user?.company.find((c: any) => c._id === current_company_id);
    const gst_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_gst;

    const { init, isGenerating, setIsGenerating, PDFViewModal, handleShare } = usePDFHandler();

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isPDFModalVisible, setPDFModalVisible] = useState<boolean>(false);

    function handleInvoiceFetching() {
        if (isInvoiceFeaching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllInvoices({ company_id: current_company_id ?? '', pageNumber: pageMeta.page + 1, type: filters.billType }));
    }

    function handleRefresh() {
        if (refreshing) { return; }
        setRefreshing(true);
        dispatch(viewAllInvoices({ company_id: current_company_id ?? '', pageNumber: 1, type: filters.billType }))
            .finally(() => setRefreshing(false));
    }

    async function handleInvoice(invoice: GetAllVouchars, callback: () => void) {

        if (!['Sales', 'Purchase'].includes(invoice.voucher_type)) { return; }

        try {
            setIsGenerating(true);

            const res = await dispatch((gst_enable ? printGSTInvoices : printInvoices)({
                vouchar_id: invoice._id,
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

    useFocusEffect(
        useCallback(() => {
            dispatch(setInvoice([]))
            dispatch(viewAllInvoices({
                company_id: current_company_id ?? '', pageNumber: 1, type: filters.billType, sortOrder: filters.useAscOrder ? '1' : '-1',
                // start_date: ''
            }));
        }, [filters])
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
                    <EmptyListView type="invoice" />
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
                    createOn={item.created_at.split('T')[0]}
                    totalAmount={item.amount}
                    payAmount={item.amount}
                    onPrint={() => { handleInvoice(item, () => { setPDFModalVisible(true); }); }}
                    onShare={() => { handleInvoice(item, handleShare); }}
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

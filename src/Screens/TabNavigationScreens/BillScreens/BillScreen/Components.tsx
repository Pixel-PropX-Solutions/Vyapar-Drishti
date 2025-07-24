import { Pressable, View } from "react-native";
import AnimateButton from "../../../../Components/Ui/Button/AnimateButton";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import TextTheme from "../../../../Components/Ui/Text/TextTheme";
import { getMonthByIndex } from "../../../../Utils/functionTools";
import { useTheme } from "../../../../Contexts/ThemeProvider";
import {useState } from "react";
import { useBillContext } from "./Context";
import { BillTypeSelectorModal, DateSelectorModal, PDFViewModal } from "./Modals";
import EntityListingHeader from "../../../../Components/Layouts/Header/EntityListingHeader";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
import EmptyListView from "../../../../Components/Layouts/View/EmptyListView";
import BillCard, { BillLoadingCard } from "../../../../Components/Ui/Card/BillCard";
import ShowWhen from "../../../../Components/Other/ShowWhen";
import { useAppDispatch, useCompanyStore, useInvoiceStore, useUserStore } from "../../../../Store/ReduxStore";
import { viewAllInvoices } from "../../../../Services/invoice";
import navigator from "../../../../Navigation/NavigationService";
import { usePDFContext } from "./PDFContext";
import LoadingModal from "../../../../Components/Modal/LoadingModal";
import RoundedPlusButton from "../../../../Components/Ui/Button/RoundedPlusButton";



export function Header(): React.JSX.Element {
    return (
        <View style={{paddingInline: 20}} >
            <EntityListingHeader
                title='Bills'
                onPressFilter={() => {}}
                onPressSearch={() => {}}
            />
        </View>
    )
}

export function BillTypeFilter(): React.JSX.Element {
    
    const {primaryColor, primaryBackgroundColor} = useTheme();

    const [selected, setSelected] = useState<string>('All')

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12, paddingInline: 20}}>
            {
                ['All', 'Sales', 'Purchase'].map(type => (
                    <AnimateButton key={type} 
                        onPress={() => setSelected(type)}
                        bubbleColor={type === selected ? primaryBackgroundColor : primaryColor}
                        
                        style={{
                            alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28, 
                            backgroundColor: type === selected ? primaryColor : primaryBackgroundColor
                        }}
                    >
                        <TextTheme 
                            isPrimary={type === selected}  
                            useInvertTheme={type === selected}
                            style={{fontSize: 12, fontWeight: 900}} 
                        >{type}</TextTheme>
                    </AnimateButton>
                ))
            }
        </View>
    )
}


export function DateSelector() {

    const {primaryColor} = useTheme();
    const {date, setDate} = useBillContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    function incrementMonth(by: number) {
        const nextMonth = (date.month + by + 12) % 12;
        const nextYear = date.year + Math.floor((date.month + by) / 12);
        setDate({year: nextYear, month: nextMonth})
    }

    return (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingInline: 10, height: 40, borderRadius: 40, borderWidth: 2, borderColor: primaryColor}} >
            <AnimateButton style={{borderRadius: 20, padding: 4}} onPress={() => incrementMonth(-1)}>
                <FeatherIcon name="chevron-left" size={20} />
            </AnimateButton>

            <Pressable onPress={() => {setModalVisible(true)}}>
                <TextTheme style={{fontSize: 16, fontWeight: 900}} >{getMonthByIndex(date.month)}, {date.year}</TextTheme>
            </Pressable>
            
            <AnimateButton style={{borderRadius: 20, padding: 4}} onPress={() => incrementMonth(1)}>
                <FeatherIcon name="chevron-right" size={20} />
            </AnimateButton>

            <DateSelectorModal
                visible={isModalVisible} setVisible={setModalVisible}
            />
        </View>
    )
}


export function BillListing() {

    const dispatch = useAppDispatch();
    const {company} = useCompanyStore();
    const { invoices, isInvoiceFeaching, pageMeta } = useInvoiceStore();

    const {handleInvoice, handleShare, isGenerating} = usePDFContext()


    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    
    function handleInvoiceFetching() {
        if (isInvoiceFeaching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllInvoices({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }

    function handleRefresh() {
        if (refreshing) return;
        setRefreshing(true);
        dispatch(viewAllInvoices({ company_id: company?._id ?? '', pageNumber: 1 }))
            .finally(() => setRefreshing(false));
    }

    return (<>
        <FlatList
            data={invoices}
            keyExtractor={(item, index) => item._id + index}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={
                isInvoiceFeaching ? null : (
                    <EmptyListView type="invoice" />
                )
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
                    pendingAmount={0}
                    onPrint={() => { handleInvoice(item, () => {setModalVisible(true)}) }}
                    onShare={() => { handleInvoice(item, handleShare) }}
                    onPress={() => { navigator.navigate('bill-info-screen', { id: item._id }) }}
                />
            )}
            ListFooterComponent={
                <ShowWhen when={isInvoiceFeaching}>
                    <View style={{ gap: 12 }}>
                        {
                            Array.from({ length: Math.min(2, pageMeta.total - (invoices?.length ?? 0)) + 1}, (_, i) => i)
                            .map(item => <BillLoadingCard key={item} /> )
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

        <PDFViewModal visible={isModalVisible} setVisible={setModalVisible} />
        <LoadingModal visible={isGenerating} />
    </>);
}



export function BillCreateButton() {

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <View style={{position: 'absolute', right: 20, bottom: 20}} > 
            <RoundedPlusButton
                size={60}
                iconSize={24}
                onPress={() => setModalVisible(true)}
            />

            <BillTypeSelectorModal visible={isModalVisible} setVisible={setModalVisible} />
        </View>
    )
}
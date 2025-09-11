/* eslint-disable react-native/no-inline-styles */
import { FlatList, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import BackgroundThemeView from '../../Components/Layouts/View/BackgroundThemeView';
import TextTheme from '../../Components/Ui/Text/TextTheme';
import EntityListingHeader from '../../Components/Layouts/Header/EntityListingHeader';
import navigator from '../../Navigation/NavigationService';
import { useTheme } from '../../Contexts/ThemeProvider';
import AnimateButton from '../../Components/Ui/Button/AnimateButton';
import FeatherIcon from '../../Components/Icon/FeatherIcon';
import { formatLocalDate, formatNumberForUI, getMonthByIndex, roundToDecimal } from '../../Utils/functionTools';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useInvoiceStore, useUserStore } from '../../Store/ReduxStore';
import { getTimeline } from '../../Services/invoice';
import ShowWhen from '../../Components/Other/ShowWhen';
import { BillLoadingCard } from '../../Components/Ui/Card/BillCard';
import { useTimelineContext } from './Context';
import { DateSelectorModal } from './Modal';
import EmptyListView from '../../Components/Layouts/View/EmptyListView';

export function Header(): React.JSX.Element {
    const { handleFilter } = useTimelineContext();

    return (
        <EntityListingHeader
            paddingBlock={0}
            title="Timeline"
            onPressNotification={() => { navigator.navigate('notification-screen'); }}
            searchButtonOpations={{
                placeholder: 'Search Product',
                onQueryChange: (query) => { handleFilter('searchQuery', query); },
            }}
            hasBackButton={true}
        />
    );
}

export function TimelineTabel() {
    const { primaryColor } = useTheme();
    const scrollViewRef1 = useRef<FlatList>(null);
    const scrollViewRef2 = useRef<FlatList>(null);
    const isSyncingRef = useRef(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();
    const { timelineData, timelinePageMeta, isTimelineFetching } = useInvoiceStore();
    console.log('timelineData', timelineData);
    const { filter } = useTimelineContext();

    const BLUE = '50,150,250';
    const RED = '250,100,100';
    const GREEN = '50,200,150';

    const syncScroll = (list: 1 | 2, scrollY: number) => {
        if (isSyncingRef.current) { return; } // prevent infinite loop
        isSyncingRef.current = true;

        if (list === 1) {
            scrollViewRef2.current?.scrollToOffset({ offset: scrollY, animated: false });
        } else {
            scrollViewRef1.current?.scrollToOffset({ offset: scrollY, animated: false });
        }

        requestAnimationFrame(() => {
            isSyncingRef.current = false;
        });
    };

    function handleRefresh() {
        if (refreshing) { return; }
        setRefreshing(true);
        dispatch(getTimeline({ company_id: current_company_id ?? '', search: filter.searchQuery, limit: filter.limit ?? 100000, page_no: 1, sortField: filter.sortBy, sortOrder: filter.useAscOrder ? '1' : '-1', startDate: formatLocalDate(new Date(filter.startDate ?? '')), endDate: formatLocalDate(new Date(filter.endDate ?? '')) }))
            .finally(() => setRefreshing(false));
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(getTimeline({
                company_id: current_company_id ?? '', search: filter.searchQuery, limit: filter.limit ?? 100000, page_no: 1, sortField: filter.sortBy, sortOrder: filter.useAscOrder ? '1' : '-1', startDate: formatLocalDate(new Date(filter.startDate ?? '')), endDate: formatLocalDate(new Date(filter.endDate ?? '')),
            }));
        }, [current_company_id, filter.searchQuery, filter.limit, filter.sortBy, filter.useAscOrder, filter.startDate, filter.endDate, timelinePageMeta.page])
    );

    return (
        <BackgroundThemeView style={{ flex: 1, borderWidth: 1, borderColor: primaryColor, borderRadius: 4, width: '100%', overflow: 'scroll', flexDirection: 'row' }}>
            {timelineData.length > 0 && <View>
                <View style={{ flexDirection: 'row', backgroundColor: 'white', zIndex: 1, height: 44 }}>
                    <View style={{ width: 30, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                        <TextTheme fontSize={9} >Sr.</TextTheme>
                    </View>
                    <View style={{ width: 120, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                        <TextTheme fontSize={9} >Name</TextTheme>
                    </View>
                </View>
                <FlatList
                    data={timelineData}
                    ref={scrollViewRef1}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ gap: 0 }}
                    style={{ flex: 1 }}
                    scrollEnabled={true}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    keyExtractor={item => item._id}
                    renderItem={({ item, index }) => (
                        <View key={`${item._id}-item-${index}`} style={{ flexDirection: 'row', backgroundColor: 'white', zIndex: 1 }}>
                            <View style={{ width: 30, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                                <TextTheme fontSize={9} >{index + 1}</TextTheme>
                            </View>
                            <View style={{ width: 120, alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                                <TextTheme fontSize={9} >{item.item.length > 15 ? item.item.slice(0, 16) + '...' : item.item}</TextTheme>
                            </View>
                        </View>
                    )}

                    onScroll={(e) => {
                        const scrollY = e.nativeEvent.contentOffset.y;
                        syncScroll(1, scrollY);
                    }}
                    ListFooterComponent={
                        <ShowWhen when={isTimelineFetching}>
                            <View style={{ gap: 12 }}>
                                {
                                    Array.from({ length: Math.min(2, timelinePageMeta.total - (timelineData?.length ?? 0)) + 1 }, (_, i) => i)
                                        .map(item => <BillLoadingCard key={item} />)
                                }
                            </View>
                        </ShowWhen>
                    }
                />
                <View style={{ flexDirection: 'row', backgroundColor: 'white', zIndex: 1, height: 30 }}>
                    <View style={{ width: 150, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, borderBottomWidth: 1, borderRightWidth: 1, borderTopWidth: 2, borderColor: primaryColor }}>
                        <TextTheme fontSize={12} fontWeight={700} >Totals</TextTheme>
                    </View>
                </View>
            </View>}

            {timelineData.length > 0 && <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={{ flex: 1 }}
            >
                <View>

                    <View style={{ flexDirection: 'row', height: 44 }}>
                        <View style={{ width: 80, height: 44, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                            <TextTheme fontSize={9} >Profit (₹)</TextTheme>
                        </View>

                        <View style={{ width: 80, height: 44, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                            <TextTheme fontSize={9} >Profit (%)</TextTheme>
                        </View>

                        {/* Opening Balance */}
                        <View style={{ height: 44, backgroundColor: `rgba(${BLUE}, 0.8)`, borderRightWidth: 1, borderBottomWidth: 1, borderColor: primaryColor }}>
                            <View style={{ alignItems: 'center', height: 22, justifyContent: 'center', paddingVertical: 4, borderBottomWidth: 1, borderColor: 'white' }}>
                                <TextTheme fontSize={9} color="white">Opening Balance</TextTheme>
                            </View>
                            <View style={{ flexDirection: 'row', height: 22 }}>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">QTY</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">Rate</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}>
                                    <TextTheme fontSize={9} color="white">Value</TextTheme>
                                </View>
                            </View>
                        </View>

                        {/* Purchase */}
                        <View style={{ height: 44, backgroundColor: `rgba(${RED}, 0.8)`, borderRightWidth: 1, borderBottomWidth: 1, borderColor: primaryColor }}>
                            <View style={{ alignItems: 'center', height: 22, justifyContent: 'center', paddingVertical: 4, borderBottomWidth: 1, borderColor: 'white' }}>
                                <TextTheme fontSize={9} color="white">Purchase</TextTheme>
                            </View>
                            <View style={{ flexDirection: 'row', height: 22 }}>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">QTY</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">Rate</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}>
                                    <TextTheme fontSize={9} color="white">Value</TextTheme>
                                </View>
                            </View>
                        </View>

                        {/* Sales */}
                        <View style={{ height: 44, backgroundColor: `rgba(${GREEN}, 0.8)`, borderRightWidth: 1, borderBottomWidth: 1, borderColor: primaryColor }}>
                            <View style={{ height: 22, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderBottomWidth: 1, borderColor: 'white' }}>
                                <TextTheme fontSize={9} color="white">Sales</TextTheme>
                            </View>
                            <View style={{ height: 22, flexDirection: 'row' }}>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">QTY</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">Rate</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}>
                                    <TextTheme fontSize={9} color="white">Value</TextTheme>
                                </View>
                            </View>
                        </View>

                        {/* Current Stock */}
                        <View style={{ height: 44, backgroundColor: `rgba(${BLUE}, 0.8)`, borderBottomWidth: 1, borderColor: primaryColor }}>
                            <View style={{ height: 22, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderBottomWidth: 1, borderColor: 'white' }}>
                                <TextTheme fontSize={9} color="white">Current Stock</TextTheme>
                            </View>
                            <View style={{ height: 22, flexDirection: 'row' }}>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">QTY</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, borderRightWidth: 1, borderColor: 'white' }}>
                                    <TextTheme fontSize={9} color="white">Rate</TextTheme>
                                </View>
                                <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}>
                                    <TextTheme fontSize={9} color="white">Value</TextTheme>
                                </View>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        ref={scrollViewRef2}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        scrollEnabled={true}
                        data={timelineData}
                        keyExtractor={item => item.id}
                        onScroll={(e) => {
                            const scrollY = e.nativeEvent.contentOffset.y;
                            syncScroll(2, scrollY);
                        }}
                        renderItem={({ item, index }) => (
                            <View key={`${item._id}-${index}-details`} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: primaryColor }}>
                                <View style={{ width: 80, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                    <TextTheme fontSize={9} color={item.gross_profit >= 0 ? 'green' : 'red'} >{item.gross_profit}</TextTheme>
                                </View>

                                <View style={{ width: 80, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                    <TextTheme fontSize={9} color={item.profit_percent >= 0 ? 'green' : 'red'}>{item.profit_percent}%</TextTheme>
                                </View>

                                {/* Opening Balance Data */}
                                <View style={{ flexDirection: 'row', backgroundColor: `rgba(${BLUE}, 0.2)`, borderRightWidth: 1, borderColor: primaryColor }}>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.opening_qty}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.opening_rate}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4 }}>
                                        <TextTheme fontSize={9} >{formatNumberForUI(item.opening_val)}</TextTheme>
                                    </View>
                                </View>

                                {/* Purchase Data */}
                                <View style={{ flexDirection: 'row', backgroundColor: `rgba(${RED}, 0.2)`, borderRightWidth: 1, borderColor: primaryColor }}>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.inwards_qty}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.inwards_rate}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4 }}>
                                        <TextTheme fontSize={9} >{formatNumberForUI(item.inwards_val)}</TextTheme>
                                    </View>
                                </View>

                                {/* Sales Data */}
                                <View style={{ flexDirection: 'row', backgroundColor: `rgba(${GREEN}, 0.2)`, borderRightWidth: 1, borderColor: primaryColor }}>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.outwards_qty}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.outwards_rate}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4 }}>
                                        <TextTheme fontSize={9} >{formatNumberForUI(item.outwards_val)}</TextTheme>
                                    </View>
                                </View>

                                {/* Current Stock Data */}
                                <View style={{ flexDirection: 'row', backgroundColor: `rgba(${BLUE}, 0.2)` }}>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.closing_qty}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
                                        <TextTheme fontSize={9} >{item.closing_rate}</TextTheme>
                                    </View>
                                    <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 4 }}>
                                        <TextTheme fontSize={9} >{formatNumberForUI(roundToDecimal(item.closing_val, 2))}</TextTheme>
                                    </View>
                                </View>
                            </View>
                        )}
                        ListFooterComponent={
                            <ShowWhen when={isTimelineFetching}>
                                <View style={{ gap: 12 }}>
                                    {
                                        Array.from({ length: Math.min(2, timelinePageMeta.total - (timelineData?.length ?? 0)) + 1 }, (_, i) => i)
                                            .map(item => <BillLoadingCard key={item} />)
                                    }
                                </View>
                            </ShowWhen>
                        }
                    />
                    <View style={{ flexDirection: 'row', height: 30 }}>
                        <View style={{ width: 80, height: 30, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4, borderTopWidth: 2, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                            <TextTheme fontSize={12} fontWeight={700} >{roundToDecimal(timelinePageMeta.gross_profit, 2)}</TextTheme>
                        </View>

                        <View style={{ width: 80, height: 30, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4, borderTopWidth: 2, borderBottomWidth: 1, borderRightWidth: 1, borderColor: primaryColor }}>
                            <TextTheme fontSize={12} fontWeight={700} >{roundToDecimal(timelinePageMeta.profit_percent, 2)}%</TextTheme>
                        </View>

                        {/* Opening Balance */}
                        <View style={{ height: 30, backgroundColor: `rgba(${BLUE}, 0.8)`, borderRightWidth: 1, borderBottomWidth: 1, borderTopWidth: 2, borderColor: primaryColor }}>

                            <View style={{ flexDirection: 'row', height: 30 }}>

                                <View style={{ width: 180, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4 }}>
                                    <TextTheme fontSize={12} fontWeight={700} color="white">{roundToDecimal(timelinePageMeta.opening_val, 2)}</TextTheme>
                                </View>
                            </View>
                        </View>

                        {/* Purchase */}
                        <View style={{ height: 30, backgroundColor: `rgba(${RED}, 0.8)`, borderRightWidth: 1, borderTopWidth: 2, borderBottomWidth: 1, borderColor: primaryColor }}>

                            <View style={{ flexDirection: 'row', height: 30 }}>

                                <View style={{ width: 180, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4 }}>
                                    <TextTheme fontSize={12} fontWeight={700} color="white">{roundToDecimal(timelinePageMeta.inwards_val, 2)}</TextTheme>
                                </View>
                            </View>
                        </View>

                        {/* Sales */}
                        <View style={{ height: 30, backgroundColor: `rgba(${GREEN}, 0.8)`, borderRightWidth: 1, borderTopWidth: 2, borderBottomWidth: 1, borderColor: primaryColor }}>

                            <View style={{ height: 30, flexDirection: 'row' }}>
                                <View style={{ width: 180, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4 }}>
                                    <TextTheme fontSize={12} fontWeight={700} color="white">{roundToDecimal(timelinePageMeta.outwards_val, 2)}</TextTheme>
                                </View>
                            </View>
                        </View>

                        {/* Current Stock */}
                        <View style={{ height: 30, backgroundColor: `rgba(${BLUE}, 0.8)`, borderBottomWidth: 1, borderTopWidth: 2, borderColor: primaryColor }}>
                            <View style={{ height: 30, flexDirection: 'row' }}>
                                <View style={{ width: 180, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 4 }}>
                                    <TextTheme fontSize={12} fontWeight={700} color="white">{roundToDecimal(timelinePageMeta.closing_val, 2)}</TextTheme>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>}

            <ShowWhen when={!isTimelineFetching && (timelineData.length < 1)}  >
                <EmptyListView title={'No records found.'} text={'Try adjusting your filters or create a new record.'} />
            </ShowWhen>
        </BackgroundThemeView>
    );
}



export function DateSelector() {

    const { primaryColor } = useTheme();
    const { date, setDate, handleFilter } = useTimelineContext();

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

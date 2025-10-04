/* eslint-disable react-native/no-inline-styles */
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import navigator from '../../../../Navigation/NavigationService';
import { useAppDispatch, useCustomerStore, useUserStore } from '../../../../Store/ReduxStore';
import { getCustomer, getCustomerInvoices } from '../../../../Services/customer';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { useCustomerContext } from './Context';
import { formatLocalDate, formatNumberForUI, getMonthByIndex } from '../../../../Utils/functionTools';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import React, { useEffect, useCallback, useState } from 'react';
import { View, ScrollView, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { StatsCard } from '../../../../Components/Ui/Card/StatsCard';

type Date = { month: number, year: number }
// Loading skeleton component
const LoadingSkeleton = () => (
    <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <View style={{
                    aspectRatio: 1,
                    width: 40,
                    borderRadius: 40,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                }} />
                <View style={{ gap: 4 }}>
                    <View style={{
                        width: 120,
                        height: 16,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 4,
                    }} />
                    <View style={{
                        width: 80,
                        height: 12,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 4,
                    }} />
                </View>
            </View>
            <View style={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: 16,
            }} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
            {[1, 2, 3, 4].map((item) => (
                <View key={item} style={{
                    flex: 1,
                    height: 80,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: 12,
                }} />
            ))}
        </View>
    </View>
);

// Error state component
const ErrorState = ({ fetchCustomerData, isRefreshing }: { fetchCustomerData: () => void, isRefreshing: boolean }) => (
    <View style={{
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(250,50,50,0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(250,50,50,0.2)',
    }}>
        <FeatherIcon name="alert-circle" size={24} color="rgb(250,50,50)" />
        <TextTheme fontSize={14} fontWeight={500} style={{ textAlign: 'center', color: 'rgb(250,50,50)' }}>
            Failed to load customer data
        </TextTheme>
        <AnimateButton
            onPress={fetchCustomerData}
            style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: 'rgb(250,50,50)',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
            }}
        >
            {isRefreshing && <ActivityIndicator size="small" color="white" />}
            <TextTheme fontSize={12} fontWeight={600} style={{ color: 'white' }}>
                {isRefreshing ? 'Retrying...' : 'Retry'}
            </TextTheme>
        </AnimateButton>
    </View>
);


export function ProfileSection() {
    const { customer, isCustomerFetching, error } = useCustomerStore();
    const [GREEN, RED] = ['50,200,150', '250,50,50'];
    const router = useRoute<RouteProp<StackParamsList, 'customer-view-screen'>>();
    const { id: customer_id } = router.params;
    const dispatch = useAppDispatch();
    const { filters } = useCustomerContext();

    const date: Date = {
        month: new Date(filters.startDate ?? '').getMonth(),
        year: new Date(filters.startDate ?? '').getFullYear(),
    };

    const { secondaryBackgroundColor, primaryColor } = useTheme();

    const fetchCustomerData = async () => {
        if (customer_id) {
            await dispatch(getCustomer({
                customer_id: customer_id,
                start_date: formatLocalDate(new Date(filters.startDate ?? '')),
                end_date: formatLocalDate(new Date(filters.endDate ?? '')),
            }));
        }
    };

    useEffect(() => {
        dispatch(getCustomer({
            customer_id: customer_id,
            start_date: formatLocalDate(new Date(filters.startDate ?? '')),
            end_date: formatLocalDate(new Date(filters.endDate ?? '')),
        }));
    }, [dispatch, customer_id, filters.startDate, filters.endDate]);

    if (!customer_id) {
        return <></>;
    }



    // Show error state if there's an error and no customer data
    if (error && !customer) {
        return (
            <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <AnimateButton
                        style={{
                            aspectRatio: 1,
                            width: 40,
                            borderRadius: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: secondaryBackgroundColor,
                        }}
                        onPress={() => { navigator.goBack(); }}
                    >
                        <FeatherIcon name="chevron-left" size={20} />
                    </AnimateButton>
                </View>
                <ErrorState fetchCustomerData={fetchCustomerData} isRefreshing={isCustomerFetching} />
            </View>
        );
    }

    if (isCustomerFetching) {
        return <LoadingSkeleton />;
    }

    return (
        <View style={{ gap: 16 }}>
            {/* Header Section */}
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flex: 1 }}>
                    <AnimateButton
                        style={{
                            aspectRatio: 1,
                            width: 40,
                            borderRadius: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: secondaryBackgroundColor,
                        }}
                        onPress={() => { navigator.goBack(); }}
                    >
                        <FeatherIcon name="chevron-left" size={20} color={primaryColor} />
                    </AnimateButton>

                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <TextTheme fontWeight={700} fontSize={16} style={{ flex: 1 }} numberOfLines={1}>
                                {customer?.ledger_name || 'Loading...'}
                            </TextTheme>
                        </View>
                        {customer?.parent && (
                            <TextTheme isPrimary={false} fontWeight={500} fontSize={12} numberOfLines={1}>
                                {customer.parent}
                            </TextTheme>
                        )}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <AnimateButton
                        onPress={() => { navigator.navigate('customer-info-screen', { id: customer_id }); }}
                        style={{
                            width: 40,
                            aspectRatio: 1,
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                        }}
                    >
                        <FeatherIcon name="eye" size={16} color={primaryColor} />
                    </AnimateButton>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                <StatsCard
                    rgb={(customer?.opening_balance ?? 0) < 0 ? RED : GREEN}
                    label="Opening (All)"
                    value={customer ? formatNumberForUI(Math.abs(customer.opening_balance ?? 0)) : '0'}
                    loading={isCustomerFetching}
                />
                <StatsCard
                    rgb={RED}
                    label={`Debit (${getMonthByIndex(date.month)})`}
                    value={customer ? formatNumberForUI(Math.abs(customer.total_debit ?? 0)) : '0'}
                    loading={isCustomerFetching}
                />
                <StatsCard
                    rgb={GREEN}
                    label={`Credit (${getMonthByIndex(date.month)})`}
                    value={customer ? formatNumberForUI(Math.abs(customer.total_credit ?? 0)) : '0'}
                    loading={isCustomerFetching}
                />
                <StatsCard
                    rgb={(customer?.total_amount ?? 0) < 0 ? RED : GREEN}
                    label="Closing (All)"
                    value={customer ? formatNumberForUI(Math.abs(customer.total_amount ?? 0)) : '0'}
                    loading={isCustomerFetching}
                />
            </View>

            {/* Optional: Last Updated Indicator */}
            {customer && !isCustomerFetching && (
                <View style={{ alignItems: 'center', marginTop: 4 }}>
                    <TextTheme
                        fontSize={10}
                        fontWeight={400}
                        isPrimary={false}
                        style={{ opacity: 0.6 }}
                    >
                        Last updated: {new Date().toLocaleTimeString()}
                    </TextTheme>
                </View>
            )}
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


// Skeleton Loader Component for Individual Rows
const InvoiceRowSkeleton = ({ primaryColor }: { primaryColor: string }) => (
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: primaryColor, opacity: 0.7 }}>
        {[30, 60, 70, 80, 60, 70].map((width, index) => (
            <View
                key={index}
                style={{
                    width,
                    height: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 2,
                    paddingHorizontal: 4,
                    borderRightWidth: index < 5 ? 1 : 0,
                    borderColor: primaryColor,
                }}
            >
                <View
                    style={{
                        width: width * 0.6,
                        height: 12,
                        backgroundColor: primaryColor,
                        opacity: 0.2,
                        borderRadius: 2,
                    }}
                />
            </View>
        ))}
    </View>
);

// Table Header Component
const TableHeader = ({ primaryColor }: { primaryColor: string }) => (
    <View style={{ flexDirection: 'row', height: 22, borderBottomWidth: 1, borderColor: primaryColor }}>
        {[
            { width: 30, text: 'Sr.' },
            { width: 60, text: 'Date' },
            { width: 70, text: 'Particulars' },
            { width: 70, text: 'Type' },
            { width: 60, text: 'Bill No.' },
            { width: 80, text: 'Amount' },
        ].map((column, index) => (
            <View
                key={index}
                style={{
                    width: column.width,
                    height: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 2,
                    borderRightWidth: index < 5 ? 1 : 0,
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}10`, // Light background for header
                }}
            >
                <TextTheme fontSize={9} fontWeight={600}>{column.text}</TextTheme>
            </View>
        ))}
    </View>
);

// Enhanced Invoice Row Component
const InvoiceRow = ({ item, index, primaryColor }: { item: any; index: number; primaryColor: string }) => (
    <View
        key={`${item.vouchar_id}-${index}-details`}
        style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: primaryColor,
            backgroundColor: index % 2 === 0 ? 'transparent' : `${primaryColor}05`, // Alternating row colors
        }}
    >
        <View style={{ width: 30, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
            <TextTheme fontSize={9}>{index + 1}</TextTheme>
        </View>
        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
            <TextTheme fontSize={9}>{item.date}</TextTheme>
        </View>
        <View style={{ width: 70, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 2, borderRightWidth: 1, borderColor: primaryColor }}>
            <TextTheme fontSize={9} numberOfLines={2} style={{ textAlign: 'center' }}>{item.customer}</TextTheme>
        </View>
        <View style={{ width: 70, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
            <View style={{
                backgroundColor: ['Receipt', 'Sales'].includes(item.voucher_type) ? '#e8f5e8' : '#fff4e6',
                paddingHorizontal: 4,
                paddingVertical: 1,
                borderRadius: 3,
                borderWidth: 1,
                borderColor: ['Receipt', 'Sales'].includes(item.voucher_type) ? '#4caf50' : '#ff9800',
            }}>
                <TextTheme
                    fontSize={8}
                    color={['Receipt', 'Sales'].includes(item.voucher_type) ? '#2e7d32' : '#f57c00'}
                    fontWeight={600}
                >
                    {item.voucher_type}
                </TextTheme>
            </View>
        </View>
        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 4, borderRightWidth: 1, borderColor: primaryColor }}>
            <TextTheme fontSize={9} fontWeight={600}>{item.voucher_number}</TextTheme>
        </View>
        <View style={{ width: 80, alignItems: 'flex-end', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 4, borderColor: primaryColor }}>
            <TextTheme
                fontSize={9}
                color={item.amount < 0 ? '#d32f2f' : '#2e7d32'}
                fontWeight={700}
                style={{ marginRight: 4 }}
            >
                {Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </TextTheme>
            <TextTheme
                fontSize={7}
                color={item.amount < 0 ? '#d32f2f' : '#2e7d32'}
                fontWeight={500}
                style={{ marginRight: 4 }}
            >
                {item.amount < 0 ? 'DR' : 'CR'}
            </TextTheme>
        </View>
    </View>
);


// Error State Component
const InvoiceListingErrorState = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
        <TextTheme fontSize={14} fontWeight={600} color="#d32f2f" style={{ marginBottom: 8 }}>
            Failed to load invoices
        </TextTheme>
        <TextTheme fontSize={12} style={{ marginBottom: 16, opacity: 0.7, textAlign: 'center' }}>
            Please check your connection and try again later.
        </TextTheme>
    </View>
);

export function InvoiceListing() {
    const router = useRoute<RouteProp<StackParamsList, 'customer-view-screen'>>();
    const { id: customer_id } = router.params;
    const { primaryColor } = useTheme();
    const dispatch = useAppDispatch();
    const { filters } = useCustomerContext();
    const { current_company_id } = useUserStore();
    const { customer, customerInvoices, isAllCustomerInvoicesFetching } = useCustomerStore();

    // Local state for better UX
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchInvoices = useCallback(async () => {
        try {
            setHasError(false);
            await dispatch(getCustomerInvoices({
                searchQuery: filters.searchQuery,
                company_id: current_company_id || '',
                customer_id: customer_id || '',
                pageNumber: 1,
                type: filters.invoiceType,
                sortField: filters.sortBy,
                sortOrder: filters.useAscOrder ? 'asc' : 'desc',
                start_date: formatLocalDate(new Date(filters.startDate ?? '')),
                end_date: formatLocalDate(new Date(filters.endDate ?? '')),
            })).unwrap();
        } catch (error) {
            setHasError(true);
        } finally {
            setIsInitialLoading(false);
        }
    }, [current_company_id, customer_id, filters, dispatch]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchInvoices();
        setIsRefreshing(false);
    }, [fetchInvoices]);

    useEffect(() => {
        if (customer_id) {
            dispatch(getCustomer({
                customer_id: customer_id,
                start_date: formatLocalDate(new Date(filters.startDate ?? '')),
                end_date: formatLocalDate(new Date(filters.endDate ?? '')),
            }));
        }
    }, [dispatch, customer_id, filters.startDate, filters.endDate]);

    useFocusEffect(
        useCallback(() => {
            fetchInvoices();
        }, [fetchInvoices])
    );

    // Show loading state on initial load
    if (isInitialLoading || isAllCustomerInvoicesFetching) {
        return (
            <BackgroundThemeView style={{
                flex: 1,
                borderWidth: 1,
                borderColor: primaryColor,
                borderRadius: 4,
                width: '100%',
                overflow: 'hidden',
            }}>
                <TableHeader primaryColor={primaryColor} />
                <View>
                    {Array.from({ length: 8 }, (_, i) => (
                        <InvoiceRowSkeleton key={i} primaryColor={primaryColor} />
                    ))}
                </View>
            </BackgroundThemeView>
        );
    }

    // Show error state
    if (hasError) {
        return (
            <BackgroundThemeView style={{
                flex: 1,
                borderWidth: 1,
                borderColor: primaryColor,
                borderRadius: 4,
                width: 370,
            }}>
                <InvoiceListingErrorState />
            </BackgroundThemeView>
        );
    }

    return (
        <>
            <BackgroundThemeView style={{
                flex: 1,
                borderWidth: 1,
                borderColor: primaryColor,
                borderRadius: 4,
                  width: '100%',
                overflow: 'hidden',
                flexDirection: 'row',
            }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    style={{ flex: 1 }}
                >
                    <View>
                        <TableHeader primaryColor={primaryColor} />

                        <FlatList
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            scrollEnabled={true}
                            data={customerInvoices}
                            keyExtractor={(item, index) => `${item.vouchar_id}-${item.voucher_number}-${index}`}
                            renderItem={({ item, index }) => (
                                <InvoiceRow
                                    key={`${item.vouchar_id}-${item.voucher_number}-${index}`}
                                    item={item}
                                    index={index}
                                    primaryColor={primaryColor}
                                />
                            )}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={onRefresh}
                                    colors={[primaryColor]}
                                    tintColor={primaryColor}
                                />
                            }
                            ListEmptyComponent={
                                <View style={{ padding: 30, width: 370, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                                    <FeatherIcon name="inbox" size={38} />
                                    <TextTheme fontWeight={900} fontSize={18} style={{ marginTop: 10, marginBottom: 4, textAlign: 'center' }}>
                                        No invoices found for the selected period of time
                                    </TextTheme>
                                    <TextTheme isPrimary={false} fontWeight={800} style={{ textAlign: 'center', opacity: 0.75 }}>
                                        Try changing your date range or search filters
                                    </TextTheme>
                                </View>
                            }
                        />

                        {/* Enhanced Closing Balance Section */}
                        {customer && (
                            <View style={{
                                flexDirection: 'row',
                                height: 35,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderTopWidth: 2,
                                borderBottomWidth: 1,
                                borderTopColor: primaryColor,
                                backgroundColor: `${primaryColor}08`,
                            }}>
                                <View style={{
                                    maxWidth: 280,
                                    minWidth: 'auto',
                                    width: 'auto',
                                    height: 35,
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderBottomWidth: 1,
                                    borderColor: primaryColor,
                                }}>
                                    <TextTheme fontSize={13} fontWeight={700}>
                                        Closing Balance (Yearly)
                                    </TextTheme>
                                </View>

                                <View style={{
                                    minWidth: 120,
                                    maxWidth: 'auto',
                                    height: 35,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderBottomWidth: 1,
                                    borderRightWidth: 1,
                                    borderColor: primaryColor,
                                }}>
                                    <TextTheme
                                        fontSize={12}
                                        fontWeight={700}
                                        color={(customer?.total_amount ?? 0) < 0 ? '#d32f2f' : '#2e7d32'}
                                    >
                                        {(Math.abs(customer?.total_amount ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        {(customer?.total_amount ?? 0) < 0 ? ' DR' : ' CR'}
                                    </TextTheme>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </BackgroundThemeView >
        </>
    );
}

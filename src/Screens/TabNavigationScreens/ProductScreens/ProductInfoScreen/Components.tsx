/* eslint-disable react-native/no-inline-styles */
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import LoadingView from '../../../../Components/Layouts/View/LoadingView';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import SectionView, { SectionRow, SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import DeleteModal from '../../../../Components/Modal/DeleteModal';
import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import navigator from '../../../../Navigation/NavigationService';
import { useAppDispatch, useUserStore, useProductStore } from '../../../../Store/ReduxStore';
import { getProduct, getProductTimeline, deleteProduct, viewProduct } from '../../../../Services/product';
import { formatNumberForUI, formatDate } from '../../../../Utils/functionTools';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { StatsCard } from '../../../../Components/Ui/Card/StatsCard';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import MaterialIcon from '../../../../Components/Icon/MaterialIcon';
import { InfoUpdateModal } from './Modals';


// Enhanced Hero Section with Image and Stock Status
export function Header(): React.JSX.Element {
    const { item } = useProductStore();
    const { secondaryBackgroundColor } = useTheme();
    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);

    const [GREEN, ORANGE, RED, YELLOW, BLUE] = ['50,200,150', '200,150,50', '250,50,50', '200,150,50', '50,150,200'];
    const getStockStatus = () => {
        if (!item) { return { status: 'Loading...', color: '#666', bgColor: '#f5f5f5' }; }
        const status = item?.stock_status ?? '';

        if (status === 'zero' || status === 'negative') { return { status: 'Out of Stock', color: '#d32f2f', bgColor: '#ffebee' }; }
        if (status === 'low') { return { status: 'Low Stock', color: '#ed6c02', bgColor: '#fff3e0' }; }
        return { status: 'In Stock', color: '#2e7d32', bgColor: '#e8f5e9' };
    };

    const stockStatus = getStockStatus();

    // Calculate profit margin
    const calculateProfitMargin = useMemo(() => {
        if (!item) { return '0.00'; }
        const totalPurchaseQty = (item.purchase_qty || 0) + (item.opening_balance || 0);
        const openingValue = (item.opening_balance || 0) * (item.opening_rate || 0);
        const totalPurchaseValueFixed = (item.purchase_value || 0) + openingValue;
        const avgPurchaseRate = totalPurchaseQty > 0
            ? totalPurchaseValueFixed / totalPurchaseQty
            : item.avg_purchase_rate || item.opening_rate || 0;

        const mp = item.sales_value
            ? 100 * ((item.avg_sale_rate - avgPurchaseRate) || 0) / (item.avg_sale_rate || 1)
            : 0;
        return mp.toFixed(2);
    }, [item]);

    const handleEdit = async () => {
        await dispatch(viewProduct({
            company_id: current_company_id ?? '',
            product_id: item?._id ?? '',
        }));
        setIsEditing(true);
    };

    return (
        <>
            <View style={{ gap: 16 }} >
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }} >
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                        <AnimateButton
                            style={{ aspectRatio: 1, width: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: secondaryBackgroundColor }}
                            onPress={() => { navigator.goBack(); }}
                        >
                            <FeatherIcon name="chevron-left" size={20} />
                        </AnimateButton>
                        <View style={{ flexDirection: 'column' }}>
                            <TextTheme fontWeight={700} fontSize={14}>
                                {item?.stock_item_name.length > 22 ? item?.stock_item_name.slice(0, 22) + '...' : item?.stock_item_name}
                            </TextTheme>
                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <TextTheme isPrimary={false} fontWeight={500} fontSize={12}>
                                    {item?.hsn_code ? item?.hsn_code : 'Unit : ' + item?.unit}
                                </TextTheme>
                                <BackgroundThemeView backgroundColor={stockStatus.bgColor} style={{ paddingInline: 15, borderRadius: 40, justifyContent: 'center', borderColor: stockStatus.bgColor, borderWidth: 2 }}>
                                    <TextTheme isPrimary={false} color={stockStatus.color} fontWeight={500} fontSize={12}>
                                        {stockStatus.status}
                                    </TextTheme>
                                </BackgroundThemeView>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        paddingHorizontal: 8,
                    }}>
                        <AnimateButton
                            onPress={() => { handleEdit(); }}
                            style={{ borderRadius: 100, height: 44, paddingInline: 20, borderWidth: 2, gap: 10, justifyContent: 'center', borderColor: 'rgb(50,150,250)', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgb(50,150,250)' }}
                        >
                            <FeatherIcon name="edit-3" size={16} color={'white'} />
                            <TextTheme fontSize={12} fontWeight={900} color="white">Edit</TextTheme>
                        </AnimateButton>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'space-between' }} >
                    <StatsCard rgb={GREEN} label="Sales Rate" valueSize={13} value={item?.sales_qty > 0 ? `${formatNumberForUI(item?.avg_sale_rate || 0)}` : 'No Sale'} />
                    <StatsCard rgb={BLUE} label="Pur. Rate" valueSize={13} value={item?.purchase_qty > 0 ? `${formatNumberForUI(item?.avg_purchase_rate || 0)}` : 'No Purc.'} />
                    <StatsCard rgb={Number(calculateProfitMargin) > 0 ? GREEN : RED} label="Profit %" valueSize={13} value={item?.sales_qty > 0 ? `${calculateProfitMargin} %` : 'No Sale'} />
                    <StatsCard rgb={((item?.current_stock || 0) * (item?.avg_purchase_rate || 0)) > 0 ? GREEN : RED} label="Stock Value" valueSize={13} value={formatNumberForUI(((item?.current_stock || 0) * (item?.avg_purchase_rate || 0)))} />
                </View>
            </View>
            <InfoUpdateModal
                visible={isEditing} setVisible={setIsEditing}
            />
        </>
    );
}


interface HistoryEntry {
    date: string;
    action: string;
    details: string;
    user: string;
    type: 'Purchase' | 'Sales';
}

// Enhanced Activity Timeline
export function ActivityTimelineSection(): React.JSX.Element {
    const { timeline, loading } = useProductStore();

    const timelineData: HistoryEntry[] = useMemo(() => {
        return timeline?.timeline?.map((entry: any) => ({
            date: entry.date,
            action: entry.voucher_type,
            details: entry.voucher_type === 'Purchase'
                ? `Purchased ${entry.quantity} units at ₹ ${entry.rate} each`
                : `Sold ${entry.quantity} units at ₹ ${entry.rate} each`,
            user: entry.party_name,
            type: entry.voucher_type,
        })) || [];
    }, [timeline]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'Purchase':
                return 'add-shopping-cart';
            case 'Sales':
                return 'sell';
            default:
                return 'pulse';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'Purchase':
                return 'rgb(50,150,200)';
            case 'Sales':
                return 'rgb(50,200,150)';
            default:
                return 'rgb(200,150,50)';
        }
    };

    return (
        <SectionView label="Activity Timeline" style={{ margin: 0 }}>
            <ShowWhen when={!loading} otherwise={
                <View style={{ gap: 12 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <View key={i} style={{
                            flexDirection: 'row',
                            backgroundColor: '#f8f9fa',
                            borderColor: '#d5d5d5',
                            padding: 10,
                            borderRadius: 12,
                            borderLeftWidth: 4,
                            alignItems: 'center',
                            gap: 12,
                        }}>
                            <LoadingView width={36} height={36} style={{ borderRadius: 20, marginRight: 12 }} />
                            <View style={{ flex: 1, gap: 4 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <LoadingView width={60} height={16} />
                                    <LoadingView width={80} height={16} />
                                </View>
                                <LoadingView width={200} height={12} />
                            </View>
                        </View>
                    ))}
                </View>
            }>
                {timelineData.length > 0 ? (
                    <View style={{ gap: 16 }}>
                        {timelineData.map((entry, index) => (
                            <View key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#f8f9fa',
                                padding: 10,
                                borderRadius: 12,
                                borderLeftWidth: 4,
                                borderLeftColor: getActivityColor(entry.type),
                            }}>
                                <View style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 20,
                                    backgroundColor: getActivityColor(entry.type),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                }}>
                                    <MaterialIcon
                                        name={getActivityIcon(entry.type)}
                                        size={20}
                                        color="white"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <TextTheme fontSize={12} fontWeight={700}>
                                            {entry.action}
                                        </TextTheme>
                                        <View style={{
                                            backgroundColor: '#e0e0e0',
                                            paddingHorizontal: 8,
                                            paddingVertical: 2,
                                            borderRadius: 8,
                                        }}>
                                            <TextTheme fontSize={10} fontWeight={600}>
                                                {formatDate(entry.date)}
                                            </TextTheme>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <TextTheme fontSize={11} isPrimary={false}>
                                            {entry.details},
                                        </TextTheme>
                                        <TextTheme fontSize={11} isPrimary={false}>
                                            {entry.type === 'Purchase' ? 'Purchased from' : 'Sold to'} {entry.user}
                                        </TextTheme>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 40,
                    }}>
                        <FeatherIcon name="activity" size={48} color="#ccc" />
                        <TextTheme fontSize={14} isPrimary={false} style={{ marginTop: 12, textAlign: 'center' }}>
                            Product activities will appear here once actions are performed.
                        </TextTheme>
                    </View>
                )}
            </ShowWhen>
        </SectionView>
    );
}

// Enhanced Product Details Section
export function ProductDetailsSection(): React.JSX.Element {
    const { item, loading } = useProductStore();
    const [expandedSection, setExpandedSection] = useState<string | 'basic' | 'pricing' | 'description'>('basic');

    const toggleSection = (section: string) => {
        setExpandedSection(prev => (prev === section ? '' : section));
    };


    const getStockStatus = () => {
        if (!item) { return { status: 'Loading...', color: '#666', bgColor: '#f5f5f5' }; }
        const status = item?.stock_status ?? '';

        if (status === 'zero' || status === 'negative') { return { status: 'Out of Stock', color: '#d32f2f', bgColor: '#ffebee' }; }
        if (status === 'low') { return { status: 'Low Stock', color: '#ed6c02', bgColor: '#fff3e0' }; }
        return { status: 'In Stock', color: '#2e7d32', bgColor: '#e8f5e9' };
    };

    const stockStatus = getStockStatus();

    return (
        <SectionView label="Product Information" >
            {/* Basic Information */}
            <TouchableOpacity
                onPress={() => toggleSection('basic')}
                style={{
                    backgroundColor: '#f5f5f5',
                    padding: 8,
                    borderRadius: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TextTheme fontSize={16} fontWeight={700}>Basic Information</TextTheme>
                <FeatherIcon
                    name={expandedSection === 'basic' ? 'chevron-up' : 'chevron-down'}
                    size={20}
                />
            </TouchableOpacity>

            <ShowWhen when={expandedSection === 'basic'}>
                <BackgroundThemeView isPrimary={false} style={{ padding: 8, borderRadius: 8, marginBottom: 8 }}>
                    <View style={{ gap: 12 }}>
                        <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Unit</TextTheme>
                            <TextTheme fontSize={14} isPrimary={false}>
                                {loading ? 'Loading...' : item?.unit || 'Not specified'}
                            </TextTheme>
                        </SectionRow>
                        <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Category</TextTheme>
                            <TextTheme fontSize={14} isPrimary={false}>
                                {loading ? 'Loading...' : item?.category || 'Not specified'}
                            </TextTheme>
                        </SectionRow>
                        <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Group</TextTheme>
                            <TextTheme fontSize={14} isPrimary={false}>
                                {loading ? 'Loading...' : item?.group || 'Not specified'}
                            </TextTheme>
                        </SectionRow>
                        {item?.hsn_code && <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>HSN Code</TextTheme>
                            <TextTheme fontSize={14} isPrimary={false}>
                                {loading ? 'Loading...' : item?.hsn_code || 'Not specified'}
                            </TextTheme>
                        </SectionRow>}
                        {/* <SectionRow backgroundColor="#f8f9fa"  style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Taxability</TextTheme>
                            <TextTheme fontSize={14} isPrimary={false}>
                                {loading ? 'Loading...' : item?.taxability || 'Not specified'}
                            </TextTheme>
                        </SectionRow> */}
                    </View>
                </BackgroundThemeView>
            </ShowWhen>

            {/* Pricing & Inventory */}
            <TouchableOpacity
                onPress={() => toggleSection('pricing')}
                style={{
                    backgroundColor: '#f5f5f5',
                    padding: 8,
                    borderRadius: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TextTheme fontSize={16} fontWeight={700}>Pricing & Inventory</TextTheme>
                <FeatherIcon
                    name={expandedSection === 'pricing' ? 'chevron-up' : 'chevron-down'}
                    size={20}
                />
            </TouchableOpacity>

            <ShowWhen when={expandedSection === 'pricing'}>
                <BackgroundThemeView isPrimary={false} style={{ padding: 8, borderRadius: 8, marginBottom: 8 }}>
                    <View style={{ gap: 12 }}>
                        <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Avg. Purchase Rate</TextTheme>
                            <TextTheme fontSize={14} fontWeight={700} style={{ color: '#1976d2' }}>
                                {loading ? 'Loading...' :
                                    item?.purchase_qty > 0 ? `₹ ${formatNumberForUI(item?.avg_purchase_rate || 0)}` : 'No Purchase Yet'}
                            </TextTheme>
                        </SectionRow>
                        <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Avg. Selling Rate</TextTheme>
                            <TextTheme fontSize={14} fontWeight={700} style={{ color: '#2e7d32' }}>
                                {loading ? 'Loading...' :
                                    item?.sales_qty > 0 ? `₹ ${formatNumberForUI(item?.avg_sale_rate || 0)}` : 'No Sale Yet'}
                            </TextTheme>
                        </SectionRow>
                        <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Current Stock</TextTheme>
                            <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                                <TextTheme fontSize={14} fontWeight={700}>
                                    {loading ? 'Loading...' : `${item?.current_stock || 0} units`}
                                </TextTheme>
                                <View style={{
                                    backgroundColor: stockStatus.bgColor,
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderRadius: 6,
                                    marginLeft: 4,
                                    borderColor: stockStatus.bgColor,
                                }}>
                                    <TextTheme fontSize={10} fontWeight={600} color={stockStatus.color} >
                                        {stockStatus.status}
                                    </TextTheme>
                                </View>
                            </View>
                        </SectionRow>
                        <SectionRow backgroundColor="#f8f9fa" style={{ justifyContent: 'space-between' }}>
                            <TextTheme fontSize={14} fontWeight={600}>Low Stock Alert</TextTheme>
                            <TextTheme fontSize={14} fontWeight={700} style={{ color: '#2e7d32' }}>
                                {loading ? 'Loading...' : `${item?.low_stock_alert || 5} units`}
                            </TextTheme>
                        </SectionRow>
                    </View>
                </BackgroundThemeView>
            </ShowWhen>

            {/* Description */}
            <TouchableOpacity
                onPress={() => toggleSection('description')}
                style={{
                    backgroundColor: '#f5f5f5',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TextTheme fontSize={16} fontWeight={700}>Description & Details</TextTheme>
                <FeatherIcon
                    name={expandedSection === 'description' ? 'chevron-up' : 'chevron-down'}
                    size={20}
                />
            </TouchableOpacity>

            <ShowWhen when={expandedSection === 'description'}>
                <BackgroundThemeView isPrimary={false} style={{ padding: 16, borderRadius: 8, marginBottom: 16 }}>
                    <TextTheme fontSize={14} isPrimary={false} style={{ lineHeight: 20 }}>
                        {loading ? 'Loading...' : item?.description || 'No description available'}
                    </TextTheme>

                    <View style={{ marginTop: 16, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
                        <TextTheme fontSize={12} fontWeight={600} style={{ marginBottom: 4 }}>
                            Product ID
                        </TextTheme>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TextTheme fontSize={12} style={{ fontFamily: 'monospace', flex: 1 }}>
                                {item?._id || 'Loading...'}
                            </TextTheme>
                            <TouchableOpacity onPress={() => {
                                // Copy to clipboard functionality would go here
                                Alert.alert('Copied', 'Product ID copied to clipboard');
                            }}>
                                <FeatherIcon name="copy" size={16} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </BackgroundThemeView>
            </ShowWhen>
        </SectionView>
    );
}

// Main Screen Component
export default function DetailsScreen(): React.JSX.Element {
    const { productId } = navigator.getParams('product-info-screen') ?? {};
    const { current_company_id } = useUserStore();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<'timeline' | 'details'>('timeline');

    useFocusEffect(
        useCallback(() => {
            if (!productId) { return; }

            // Fetch product details
            dispatch(getProduct({
                company_id: current_company_id ?? '',
                product_id: productId,
            }));

            // Fetch timeline
            dispatch(getProductTimeline({
                company_id: current_company_id ?? '',
                product_id: productId,
            }));
        }, [productId, current_company_id, dispatch])
    );

    if (!productId) {
        return <View />;
    }

    return (
        <View style={{ flex: 1 }}>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 0 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Tab Navigation */}
                <View style={{
                    flexDirection: 'row',
                    marginBottom: 16,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 12,
                    padding: 4,
                }}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('timeline')}
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: 8,
                            backgroundColor: activeTab === 'timeline' ? 'white' : 'transparent',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <FeatherIcon
                            name="activity"
                            size={16}
                            color={activeTab === 'timeline' ? '#1976d2' : '#666'}
                        />
                        <TextTheme
                            fontSize={14}
                            fontWeight={600}
                            style={{ color: activeTab === 'timeline' ? '#1976d2' : '#666' }}
                        >
                            Activity History
                        </TextTheme>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('details')}
                        style={{
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: 8,
                            backgroundColor: activeTab === 'details' ? 'white' : 'transparent',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                    >
                        <FeatherIcon
                            name="info"
                            size={16}
                            color={activeTab === 'details' ? '#1976d2' : '#666'}
                        />
                        <TextTheme
                            fontSize={14}
                            fontWeight={600}
                            style={{ color: activeTab === 'details' ? '#1976d2' : '#666' }}
                        >
                            Product Details
                        </TextTheme>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'timeline' ? (
                    <ActivityTimelineSection />
                ) : (
                    <ProductDetailsSection />
                )}
            </ScrollView>
        </View>
    );
}



export function DangerSection() {

    const { item } = useProductStore();
    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    async function handleDelete() {

        // write logic to delete product
        dispatch(deleteProduct({ id: item._id, company_id: current_company_id ?? '' }));
        setModalVisible(false);
        navigator.goBack();
    }

    return (
        <SectionView label="Danger Zone" style={{ gap: 12 }} labelColor="red" >
            <SectionRowWithIcon
                color="white"
                backgroundColor="rgb(255,80,100)"
                label="Delete Product"
                icon={<FeatherIcon name={'alert-triangle'} size={20} color="red" />}
                text={'Once delete then on way to go back'}
                onPress={() => { setModalVisible(true); }}
            />

            <DeleteModal
                visible={isModalVisible} setVisible={setModalVisible}
                handleDelete={handleDelete}
                passkey={item?.stock_item_name ?? 'delete'}
                message="Once you delete the product then no way to go back."
            />
        </SectionView>
    );
}

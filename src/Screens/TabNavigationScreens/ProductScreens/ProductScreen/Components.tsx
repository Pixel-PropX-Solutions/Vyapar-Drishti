/* eslint-disable react-native/no-inline-styles */
import { FlatList, ScrollView, Text, View } from 'react-native';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { useAppDispatch, useProductStore, useUserStore } from '../../../../Store/ReduxStore';
import EmptyListView from '../../../../Components/Layouts/View/EmptyListView';
import ProductCard, { ProductLoadingCard } from '../../../../Components/Ui/Card/ProductCard';
import navigator from '../../../../Navigation/NavigationService';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import { viewAllProducts } from '../../../../Services/product';
import { useCallback, useState } from 'react';
import RoundedPlusButton from '../../../../Components/Ui/Button/RoundedPlusButton';
import CreateProductModal from '../../../../Components/Modal/Product/CreateProductModal';
import EntityListingHeader from '../../../../Components/Layouts/Header/EntityListingHeader';
import { useFocusEffect } from '@react-navigation/native';
import { setProductsData } from '../../../../Store/Reducers/productReducer';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { useProductContext } from './Context';
import { FilterModal } from './Modals';


export function Header(): React.JSX.Element {

    const { handleFilter } = useProductContext();

    return (
        <EntityListingHeader
            paddingBlock={10}
            title="Products"
            onPressNotification={() => { navigator.navigate('notification-screen'); }}
            searchButtonOpations={{
                placeholder: 'Search Product',
                onQueryChange: (query) => { handleFilter('searchQuery', query); },
            }}
        />
    );
}

const Card = ({ rgb, label, value }: { rgb: string, label: string, value: string }): React.JSX.Element => (
    <View style={{ backgroundColor: `rgba(${rgb},0.1)`, flex: 1, borderRadius: 12, position: 'relative', overflow: 'hidden' }} >
        <View style={{ width: '100%', position: 'absolute', bottom: 0, left: 0, height: 4, backgroundColor: `rgb(${rgb})` }} />
        <View style={{ padding: 12, width: '100%' }} >
            <TextTheme fontSize={14} fontWeight={900}>{value}</TextTheme>
            <TextTheme isPrimary={false} fontSize={12}>{label}</TextTheme>
        </View>
    </View>
);


export function SummarySection() {

    const { productsPageMeta } = useProductStore();
    const negativeStock = productsPageMeta.negative_stock ?? 0;
    const positiveStock = productsPageMeta.positive_stock ?? 0;
    const lowStock = productsPageMeta.low_stock ?? 0;

    const [GREEN, ORANGE, RED, YELLOW, BLUE] = ['50,200,150', '200,150,50', '250,50,50', '200,150,50', '50,150,200'];

    return (
        <View style={{ width: '100%', gap: 8 }} >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' }} >
                <Card rgb={RED} label="Neg. Stock" value={`${negativeStock} Items`} />
                <Card rgb={YELLOW} label="Low Stock" value={`${lowStock} Items`} />
                <Card rgb={BLUE} label="Well Stock" value={`${positiveStock} Items`} />
            </View>

            {/* <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%'}} >
                <Card rgb={GREEN} label="Sales Value" value="10,000.00 INR" />
                <Card rgb={ORANGE} label="Purchase Value" value="1,000.00 INR" />
            </View> */}
        </View>
    );
}

const sortValues = [{
    label: 'Default',
    value: 'created_at',
}, {
    label: 'Name',
    value: 'stock_item_name',
}, {
    label: 'Quantity',
    value: 'current_stock',
}, {
    label: 'Unit',
    value: 'unit',
}, {
    label: 'Restock Date',
    value: 'last_restock_date',
}];


export function ItemStatusFilter(): React.JSX.Element {

    const { primaryColor, primaryBackgroundColor } = useTheme();
    const { filters, handleFilter } = useProductContext();
    const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);

    return (
        <>
            <View style={{ gap: 4, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                <View style={{ gap: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }} >
                    <TextTheme isPrimary={true} fontSize={14} fontWeight={900} color={primaryColor}>
                        Sort By
                    </TextTheme>

                    <AnimateButton
                        onPress={() => {
                            setFilterModalVisible(true);
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
                            {sortValues.find(item => item.value === filters.sortBy)?.label || 'Default'}
                        </TextTheme>
                    </AnimateButton>

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


export function SortFilterSection() {

    const { filters, handleFilter } = useProductContext();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBlock: 10 }} >
            <TextTheme isPrimary={false} fontSize={12} fontWeight={900} style={{ paddingLeft: 4 }}>Sort by default</TextTheme>

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
    );
}


export function ProductListing(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();
    const { isProductsFetching, productsData, productsPageMeta } = useProductStore();

    const { filters } = useProductContext();

    function handleProductFetching() {
        if (isProductsFetching) { return; }
        if (productsPageMeta.total <= productsPageMeta.page * productsPageMeta.limit) { return; }
        dispatch(viewAllProducts({ company_id: current_company_id ?? '', searchQuery: filters.searchQuery, pageNumber: productsPageMeta.page + 1, group: filters.group, category: filters.category, sortField: filters.sortBy, sortOrder: filters.useAscOrder ? 'asc' : 'desc' }));
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(setProductsData([]));
            dispatch(viewAllProducts({
                company_id: current_company_id ?? '',
                pageNumber: 1,
                searchQuery: filters.searchQuery
                , group: filters.group, category: filters.category, sortField: filters.sortBy, sortOrder: filters.useAscOrder ? 'asc' : 'desc'
            }));
        }, [filters])
    );

    return (
        <FlatList
            ListEmptyComponent={isProductsFetching ? <ProductLoadingCard isPrimary={true} /> : <EmptyListView type="product" />}
            contentContainerStyle={{ gap: 10, paddingBottom: 80, paddingTop: 12 }}
            data={productsData}
            keyExtractor={(item, index) => `${item._id}${index}`}

            renderItem={({ item }) => (
                <ProductCard
                    item={item}
                    onPress={() => navigator.navigate('product-info-screen', { productId: item._id })}
                />
            )}

            ListFooterComponentStyle={{ gap: 10 }}
            ListFooterComponent={
                <ShowWhen when={isProductsFetching}>
                    {
                        Array.from({
                            length: Math.min(2, productsPageMeta.total - (productsData?.length ?? 0)) + 1,
                        }, (_, i) => i
                        ).map(item => (
                            <ProductLoadingCard key={item} isPrimary={true} />
                        ))
                    }
                </ShowWhen>
            }

            onScroll={({ nativeEvent }) => {
                let { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                let contentOffsetY = contentOffset.y;
                let totalHeight = contentSize.height;
                let height = layoutMeasurement.height;

                if (productsPageMeta.total === productsData?.length) { return; }

                if (totalHeight - height < contentOffsetY + 600) {
                    handleProductFetching();
                }
            }}
        />
    );
}


export function CreateProductButton() {

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <View style={{ position: 'absolute', right: 20, bottom: 20 }} >
            <RoundedPlusButton size={60} iconSize={24} onPress={() => setModalVisible(true)} />

            <CreateProductModal
                visible={isModalVisible} setVisible={setModalVisible}
            />
        </View>
    );
}

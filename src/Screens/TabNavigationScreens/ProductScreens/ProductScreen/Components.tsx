/* eslint-disable react-native/no-inline-styles */
import { FlatList, Text, View } from 'react-native';
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


export function Header(): React.JSX.Element {
    return (
        <EntityListingHeader
            title="Products"
            onPressNotification={() => { navigator.navigate('notification-screen'); }}
        />
    );
}


export function SummaryCard(): React.JSX.Element {

    const { productsPageMeta } = useProductStore();
    console.log('productsPageMeta', productsPageMeta);
    const negativeStock = productsPageMeta.negative_stock ?? 0;
    const positiveStock = productsPageMeta.positive_stock ?? 0;
    const lowStock = productsPageMeta.low_stock ?? 0;


    return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <AnimateButton style={{ paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(250,100,100)' }}>
                <Text style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white' }}>
                    <FeatherIcon name="package" size={20} color="white" />
                    {`  ${negativeStock}`}
                </Text>
                <Text style={{ fontSize: 12, color: 'white' }}>-Ve Stock</Text>
            </AnimateButton>

            <AnimateButton style={{ paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(228, 205, 0)' }}>
                <Text style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white' }}>
                    <FeatherIcon name="box" size={20} color="white" />
                    {`  ${lowStock}`}
                </Text>
                <Text style={{ fontSize: 12, color: 'white' }}>Low Stock</Text>
            </AnimateButton>

            <AnimateButton style={{ paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(50,200,150)' }}>
                <Text style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white' }}>
                    <FeatherIcon name="package" size={20} color="white" />
                    {`  ${positiveStock}`}
                </Text>
                <Text style={{ fontSize: 12, color: 'white' }}>+Ve Stock</Text>
            </AnimateButton>
        </View>
    );
}

export function ProductListing(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();
    const { isProductsFetching, productsData, productsPageMeta } = useProductStore();
    console.log('productsData', productsPageMeta);

    function handleProductFetching() {
        // if (isProductsFetching) { return; }
        if (productsPageMeta.total <= productsPageMeta.page * productsPageMeta.limit) { return; }
        dispatch(viewAllProducts({ company_id: current_company_id ?? '', pageNumber: productsPageMeta.page + 1 }));
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(setProductsData([]));
            dispatch(viewAllProducts({ company_id: current_company_id ?? '', pageNumber: 1 }));
        }, [])
    );

    return (
        <FlatList
            ListEmptyComponent={isProductsFetching ? <ProductLoadingCard /> : <EmptyListView type="product" />}
            contentContainerStyle={{ gap: 20, paddingBottom: 80, paddingTop: 12 }}
            data={productsData}
            keyExtractor={(item) => item._id}

            renderItem={({ item }) => (
                <ProductCard
                    item={item}
                    isPrimary={false}
                    onPress={() => navigator.navigate('product-info-screen', { productId: item._id })}
                />
            )}

            ListFooterComponentStyle={{ gap: 20 }}
            ListFooterComponent={
                <ShowWhen when={isProductsFetching}>
                    {
                        Array.from({
                            length: Math.min(2, productsPageMeta.total - (productsData?.length ?? 0)) + 1,
                        }, (_, i) => i
                        ).map(item => (
                            <ProductLoadingCard key={item} />
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

                if (totalHeight - height < contentOffsetY + 400) {
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

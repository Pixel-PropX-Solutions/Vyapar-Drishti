import { FlatList, Text, View } from "react-native";
import AnimateButton from "../../../../Components/Ui/Button/AnimateButton";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import { useAppDispatch, useCompanyStore, useProductStore } from "../../../../Store/ReduxStore";
import EmptyListView from "../../../../Components/Layouts/View/EmptyListView";
import ProductCard, { ProductLoadingCard } from "../../../../Components/Ui/Card/ProductCard";
import navigator from "../../../../Navigation/NavigationService";
import ShowWhen from "../../../../Components/Other/ShowWhen";
import { viewAllProducts } from "../../../../Services/product";
import { useEffect, useState } from "react";
import RoundedPlusButton from "../../../../Components/Ui/Button/RoundedPlusButton";
import CreateProductModal from "../../../../Components/Modal/Product/CreateProductModal";
import EntityListingHeader from "../../../../Components/Layouts/Header/EntityListingHeader";


export function Header(): React.JSX.Element {
    return (
         <EntityListingHeader
            title='Products'
            onPressFilter={() => {}}
            onPressSearch={() => {}}
        />
    )
}


export function SummaryCard(): React.JSX.Element {

    const {pageMeta} = useProductStore()

    const highStock = pageMeta.total - (pageMeta.low_stock ?? 0);
    const lowStock = pageMeta.low_stock ?? 0;

    return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <AnimateButton style={{ paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(250,100,100)' }}>
                <Text style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white' }}>
                    <FeatherIcon name="package" size={20} color="white" />
                    {`  ${highStock}`}
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
                    {`  ${highStock}`}
                </Text>
                <Text style={{ fontSize: 12, color: 'white' }}>+Ve Stock</Text>
            </AnimateButton>
        </View>
    );
}


export function ProductListing(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const {company} = useCompanyStore();
    const {isProductsFetching, productsData, pageMeta} = useProductStore();

    function handleProductFetching() {
        if (isProductsFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }

    useEffect(() => {
        dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch]);

    return (
        <FlatList
            ListEmptyComponent={isProductsFetching ? null : <EmptyListView type="product" />}
            contentContainerStyle={{ gap: 20, paddingBottom: 80, paddingTop: 12}}
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
                            length: Math.min(2, pageMeta.total - (productsData?.length ?? 0)) + 1}, (_, i) => i
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

                if(pageMeta.total === productsData?.length) return;

                if (totalHeight - height < contentOffsetY + 400) {
                    handleProductFetching();
                }
            }}
        />
    )
}


export function CreateProductButton() {

    const [isModalVisible, setModalVisible] = useState<boolean>(false)

    return (
         <View style={{ position: 'absolute', right: 20, bottom: 20 }} >
            <RoundedPlusButton size={60} iconSize={24} onPress={() => setModalVisible(true)} />
            
            <CreateProductModal
                visible={isModalVisible} setVisible={setModalVisible}
            />
        </View>   
    )
}
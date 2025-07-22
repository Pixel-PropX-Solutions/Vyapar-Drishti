/* eslint-disable react-native/no-inline-styles */
import { FlatList } from 'react-native-gesture-handler';
import TextTheme from '../../../Components/Text/TextTheme';
import ProductCard, { ProductLoadingCard } from '../../../Components/Card/ProductCard';
import { Text, View } from 'react-native';
import AnimateButton from '../../../Components/Button/AnimateButton';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import NormalButton from '../../../Components/Button/NormalButton';
import RoundedPlusButton from '../../../Components/Button/RoundedPlusButton';
import { useEffect, useState } from 'react';
import CreateProductModal from '../../../Components/Modal/Product/CreateProductModal';
import TabNavigationScreenHeader from '../../../Components/Header/TabNavigationHeader';
import { useAppDispatch, useCompanyStore, useProductStore } from '../../../Store/ReduxStore';
import { viewAllProducts } from '../../../Services/product';
import navigator from '../../../Navigation/NavigationService';
import ShowWhen from '../../../Components/Other/ShowWhen';
import EmptyListView from '../../../Components/View/EmptyListView';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamsList } from '../../../Navigation/BottomTabNavigation';


export default function ProductScreen(): React.JSX.Element {

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamsList, 'product-screen'>>()

    const dispatch = useAppDispatch();
    const { company } = useCompanyStore();
    const { productsData, pageMeta, isProductsFetching } = useProductStore();
    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

    function handleProductFetching() {
        if (isProductsFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }

    useEffect(() => {
        dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isCreateModalOpen]);

    useEffect(() => {
        const event = navigation.addListener('focus', () => {
            dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: 1 }));
        });

        return event
    }, [])

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <TabNavigationScreenHeader>
                <TextTheme style={{ fontSize: 16, fontWeight: 800 }}>Products</TextTheme>
            </TabNavigationScreenHeader>

            <View style={{ gap: 24, paddingHorizontal: 20 }}>
                <SummaryCard highStock={pageMeta.total - (pageMeta.low_stock ?? 0)} lowStock={pageMeta.low_stock ?? 0} />
                <ProductFilterView />
            </View>

            <FlatList
                ListEmptyComponent={isProductsFetching ? null : <EmptyListView type="product" />}
                contentContainerStyle={{ gap: 20, paddingBottom: 80, paddingTop: 12, paddingHorizontal: 20 }}
                data={productsData}
                keyExtractor={(item) => item._id}

                renderItem={({ item }) => {
                    return (<ProductCard
                        item={item}
                        isPrimary={false}
                        onPress={() => navigator.navigate('product-info-screen', { productId: item._id })}
                    />);
                }}

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

            <View style={{ position: 'absolute', right: 20, bottom: 20 }} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCreateModalOpen(true)} />
            </View>

            <CreateProductModal
                visible={isCreateModalOpen}
                setVisible={setCreateModalOpen}
            />

        </View>
    );
}


type SummaryCardProps = {
    highStock: number,
    lowStock: number,
}

function SummaryCard({ highStock, lowStock }: SummaryCardProps): React.JSX.Element {

    return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <AnimateButton style={{ paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(250,100,100)' }}>
                <Text style={{ fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white' }}>
                    <FeatherIcon name="package" size={20} color="white" />
                    {`  ${highStock}`}
                </Text>
                <Text style={{ fontSize: 12, color: 'white' }}>-(ve) Stock</Text>
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
                <Text style={{ fontSize: 12, color: 'white' }}>+(ve) Stock</Text>
            </AnimateButton>
        </View>
    );
}



function ProductFilterView(): React.JSX.Element {

    const { pageMeta } = useProductStore();

    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBlock: 8 }} >

            <NormalButton
                text=" Filerts"
                textStyle={{ fontWeight: 800 }}
                icon={<FeatherIcon name="filter" size={16} useInversTheme={true} />}
            />

            <View style={{ alignItems: 'flex-end' }} >
                <TextTheme style={{ fontSize: 12 }} isPrimary={false} >Total Results</TextTheme>
                <TextTheme>
                    <FeatherIcon name="package" size={16} />
                    {' '}
                    {pageMeta.total}
                </TextTheme>
            </View>

        </View>
    );
}

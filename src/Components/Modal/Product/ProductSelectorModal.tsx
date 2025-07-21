/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeProvider';
import AnimateButton from '../../Button/AnimateButton';
import TextTheme from '../../Text/TextTheme';
import NoralTextInput from '../../TextInput/NoralTextInput';
import BottomModal from '../BottomModal';
import ProductCard, { ProductLoadingCard } from '../../Card/ProductCard';
import { FlatList } from 'react-native-gesture-handler';
import { useAppDispatch, useCompanyStore, useProductStore } from '../../../Store/ReduxStore';
import ShowWhen from '../../Other/ShowWhen';
import { useEffect, useState } from 'react';
import { viewAllProducts } from '../../../Services/product';
import { useAlert } from '../../Alert/AlertProvider';
import { useCreateBillContext } from '../../../Screens/TabNavigationScreens/BillScreens/CreateBillScreen/ContextProvider';
import { GetProduct } from '../../../Utils/types';
import EmptyListView from '../../View/EmptyListView';
import CreateProductModal from './CreateProductModal';
import { InputField } from '../../TextInput/InputField';
import MaterialIcon from '../../Icon/MaterialIcon';
import FeatherIcon from '../../Icon/FeatherIcon';

type Props = {
    visible: boolean;
    setVisible: (vis: boolean) => void;
    billType: string
}

export default function ProductSelectorModal({ visible, setVisible, billType }: Props): React.JSX.Element {

    const { setAlert } = useAlert();

    const { primaryColor } = useTheme();
    const { company } = useCompanyStore();
    const { products, setProducts } = useCreateBillContext();
    const { productsData, isProductsFetching, pageMeta } = useProductStore();

    const dispatch = useAppDispatch();

    const [isUnitModalVisible, setUnitModalVisible] = useState<boolean>(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const [filterProducts, setFilterProducts] = useState<GetProduct[]>([]);
    const [data, setData] = useState({
        quantity: '',
        price: '',
        unit: 'Unit',
        productId: '',
        name: '',
        productNo: '',
    });

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    function handleProductFetching() {
        if (isProductsFetching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }

    function handleProduct() {
        if (!data.price || !data.quantity) {
            return setAlert({
                id: 'create-bill-product-selector-modal',
                type: 'error', message: 'please enter all required information !!!',
            });
        }

        setProducts((pro) => [...pro, {
            id: data.productId,
            price: Number(data.price),
            quantity: Number(data.quantity),
            name: data.name,
            productNo: data.productNo,
            unit: data.unit,
        }]);

        setData({
            quantity: '',
            price: '',
            unit: 'Unit',
            productId: '',
            name: '',
            productNo: '',
        });

        setUnitModalVisible(false);
        setVisible(false);
    }

    useEffect(() => {
        dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isCreateModalOpen]);

    useEffect(() => {
        setFilterProducts(() => (
            productsData?.filter(a => (
                products.some(b => b.id === a._id) ? false : (
                    billType.toLowerCase() === 'sales' ? (a.purchase_qty - a.sales_qty) > 0 : true
                )
            ))
        ) ?? []);
    }, [productsData, products, billType]);

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
            style={{ padding: 20, gap: 20 }}
            actionButtons={[{
                key: 'create-product',
                title: 'Create New Product',
                onPress: () => setCreateModalOpen(true),
                color: 'white',
                backgroundColor: 'rgb(50,200,150)',
                icon: <MaterialIcon name="add" size={16} />,
            }]}>
            <TextTheme style={{ fontWeight: 800, fontSize: 16 }} >Select Product</TextTheme>

            <View
                style={{ borderWidth: 2, borderColor: primaryColor, borderRadius: 100, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 10, paddingRight: 16 }}
            >
                <MaterialIcon name="search" size={20} />

                <NoralTextInput
                    placeholder="Search"
                    style={{ flex: 1 }}
                />
            </View>

            <FlatList
                ListEmptyComponent={<EmptyListView type="product" />}
                contentContainerStyle={{ gap: 20, paddingBottom: 80, paddingTop: 12 }}
                data={filterProducts}
                keyExtractor={(item) => item._id}
                keyboardShouldPersistTaps="always"

                renderItem={({ item }) => (
                    <ProductCard
                        unit={item.unit}
                        isPrimary={false}
                        sellQuantity={item.sales_qty}
                        productName={item.stock_item_name}
                        productsNo={item.gst_hsn_code ?? ''}
                        inStock={item.purchase_qty - item.sales_qty}
                        lowStockQuantity={item.low_stock_alert ?? 0}
                        profitValue={item.purchase_value - item.sales_value}
                        onPress={() => {
                            setUnitModalVisible(true);
                            handleInputChange('productId', item._id);
                            handleInputChange('unit', item.unit);
                            handleInputChange('name', item.stock_item_name);
                            handleInputChange('productNo', item.gst_hsn_code ?? '');
                        }}
                    />
                )}

                ListFooterComponentStyle={{ gap: 20 }}
                ListFooterComponent={<ShowWhen when={isProductsFetching}>
                    <ProductLoadingCard />
                    <ProductLoadingCard />
                </ShowWhen>}

                onScroll={({ nativeEvent }) => {
                    let { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                    let contentOffsetY = contentOffset.y;
                    let totalHeight = contentSize.height;
                    let height = layoutMeasurement.height;

                    if (totalHeight - height < contentOffsetY + 400) {
                        handleProductFetching();
                    }
                }}
            />

            <BottomModal
                alertId="create-bill-product-selector-modal"
                visible={isUnitModalVisible} setVisible={setUnitModalVisible}
                style={{ padding: 20, gap: 20 }}
                actionButtons={[{
                    title: '+ Add', onPress: handleProduct, color: 'white',
                    backgroundColor: 'rgb(50,200,150)',
                }]}

            >
                <TextTheme style={{ fontWeight: 800, fontSize: 16 }} >Select Quantity</TextTheme>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }} >
                    <View style={{ flex: 1, paddingRight: 8 }} >
                        <InputField
                            icon={<FeatherIcon name="package" size={20} />}
                            field="quantity"
                            handleChange={handleInputChange}
                            value={data.quantity}
                            placeholder="Quantity"
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }} >
                    <View style={{ flex: 1, paddingRight: 8 }} >
                        <InputField
                            icon={<MaterialIcon name="currency-rupee" size={20} />}
                            field="price"
                            handleChange={handleInputChange}
                            value={data.price}
                            placeholder="Enter rate"
                            keyboardType="number-pad"
                        />
                    </View>

                    <AnimateButton
                        style={{ marginBlock: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, paddingLeft: 8, paddingRight: 20 }}
                    >
                        <TextTheme style={{ fontSize: 14, fontWeight: 900 }}>/ {data.unit ?? 'Unit'}</TextTheme>
                    </AnimateButton>
                </View>
            </BottomModal>
            <CreateProductModal
                visible={isCreateModalOpen}
                setVisible={setCreateModalOpen}
            />
        </BottomModal>
    );
}

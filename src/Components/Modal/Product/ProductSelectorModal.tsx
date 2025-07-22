/* eslint-disable react-native/no-inline-styles */
import { Alert, View } from 'react-native';
import { useTheme } from '../../../Contexts/ThemeProvider';
import AnimateButton from '../../Button/AnimateButton';
import TextTheme from '../../Text/TextTheme';
import NoralTextInput from '../../TextInput/NoralTextInput';
import BottomModal from '../BottomModal';
import ProductCard, { ProductLoadingCard } from '../../Card/ProductCard';
import { FlatList } from 'react-native-gesture-handler';
import { useAppDispatch, useCompanyStore, useProductStore, useUserStore } from '../../../Store/ReduxStore';
import ShowWhen from '../../Other/ShowWhen';
import { useEffect, useState } from 'react';
import { viewAllProducts, viewProductsWithId } from '../../../Services/product';
import { useAlert } from '../../Alert/AlertProvider';
import { useCreateBillContext } from '../../../Screens/TabNavigationScreens/BillScreens/CreateBillScreen/ContextProvider';
import { GetProduct } from '../../../Utils/types';
import EmptyListView from '../../View/EmptyListView';
import CreateProductModal from './CreateProductModal';
import { InputField } from '../../TextInput/InputField';
import MaterialIcon from '../../Icon/MaterialIcon';
import FeatherIcon from '../../Icon/FeatherIcon';
import sliceString from '../../../Utils/sliceString';

type Props = {
    visible: boolean;
    setVisible: (vis: boolean) => void;
    billType: string
}

export default function ProductSelectorModal({ visible, setVisible, billType }: Props): React.JSX.Element {

    const { setAlert } = useAlert();

    const { primaryColor, secondaryBackgroundColor, primaryBackgroundColor } = useTheme();
    const { company } = useCompanyStore();
    const { products, setProducts } = useCreateBillContext();
    const { isProductsFetching, pageMeta } = useProductStore();
    const { user } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const dispatch = useAppDispatch();

    const [isUnitModalVisible, setUnitModalVisible] = useState<boolean>(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [itemsList, setItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);
    const [filterItemsList, setFilterItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);

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
        dispatch(viewProductsWithId(user?.user_settings?.current_company_id || '')).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const products = response.payload;
                setItemsList(
                    products.map((product: any) => ({
                        name: product.stock_item_name,
                        id: product._id,
                        unit: product.unit,
                        gst: product.rate,
                        hsn_code: product.hsn_code || ''
                    }))
                );
            }
            return response;
        }).catch((error) => {
            Alert.alert(error || 'Failed to fetch products');
        });
    }, [dispatch, isCreateModalOpen, user?.user_settings?.current_company_id]);

    useEffect(() => {
        setFilterItemsList(itemsList.filter(item => !(products.some(pro => pro.id === item.id))))
    }, [products, itemsList])

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
                data={filterItemsList}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"

                renderItem={({ item }) => (
                    <AnimateButton
                        style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 16, backgroundColor: secondaryBackgroundColor }}
                        onPress={() => {
                            setUnitModalVisible(true);
                            handleInputChange('productId', item.id);
                            handleInputChange('unit', item.unit);
                            handleInputChange('name', item.name);
                            handleInputChange('productNo', item.hsn_code ?? '');
                        }}
                    >
                        <View style={{ width: '100%' }} >
                            <TextTheme style={{ paddingLeft: 2, fontWeight: 600, fontSize: 16 }} >{sliceString(item.name, 30)}</TextTheme>

                            {item.hsn_code && <TextTheme isPrimary={false} style={{ paddingLeft: 2, fontWeight: 600, fontSize: 12 }} >{item.hsn_code}</TextTheme>}
                        </View>
                        {gst_enable && <View style={{ width: '100%' }} >
                            <TextTheme isPrimary={false} style={{ paddingLeft: 2, fontWeight: 600, fontSize: 12 }} >GST {item.gst} %</TextTheme>
                        </View>}
                    </AnimateButton>
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

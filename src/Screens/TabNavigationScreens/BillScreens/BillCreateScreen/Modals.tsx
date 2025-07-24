import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useBillContext } from "./Context";
import { useTheme } from "../../../../Contexts/ThemeProvider";
import BottomModal from "../../../../Components/Modal/BottomModal";
import TextTheme from "../../../../Components/Text/TextTheme";
import { Alert, FlatList, View } from "react-native";
import { InputField } from "../../../../Components/TextInput/InputField";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import MaterialIcon from "../../../../Components/Icon/MaterialIcon";
import AnimateButton from "../../../../Components/Button/AnimateButton";
import { useAppDispatch, useCompanyStore, useCustomerStore, useProductStore, useUserStore } from "../../../../Store/ReduxStore";
import { GetUserLedgers } from "../../../../Utils/types";
import { viewAllCustomer } from "../../../../Services/customer";
import { ItemSelectorModal } from "../../../../Components/Modal/ItemSelectorModal";
import BackgroundThemeView from "../../../../Components/View/BackgroundThemeView";
import LoadingView from "../../../../Components/View/LoadingView";
import CustomerTypeSelectorModal from "../../../../Components/Modal/Customer/CustomerTypeSelectorModal";
import CreateCustomerModal from "../../../../Components/Modal/Customer/CreateCustomerModal";
import { useAlert } from "../../../../Components/Alert/AlertProvider";
import { viewAllProducts, viewProductsWithId } from "../../../../Services/product";
import NoralTextInput from "../../../../Components/TextInput/NoralTextInput";
import EmptyListView from "../../../../Components/View/EmptyListView";
import { sliceString } from "../../../../Utils/functionTools";
import ShowWhen from "../../../../Components/Other/ShowWhen";
import { ProductLoadingCard } from "../../../../Components/Card/ProductCard";
import CreateProductModal from "../../../../Components/Modal/Product/CreateProductModal";


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}


export function ProductInfoUpdateModal({ visible, setVisible, editProductIndex }: Props & { editProductIndex: number }): React.JSX.Element {

    const { products, setProducts } = useBillContext();
    const { primaryColor } = useTheme();

    const [info, _setInfo] = useState(products[editProductIndex]);

    const setInfo = (field: string, value: string | number | boolean) => {
        _setInfo(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    function handleSave() {
        setVisible(false);
        setProducts(prev => {
            let temp = [...prev];
            temp[editProductIndex] = info;
            return temp;
        });
    }

    useEffect(() => {
        _setInfo(products[editProductIndex]);
    }, [products, editProductIndex]);

    if (products.length === 0 || editProductIndex < 0 || editProductIndex >= products.length) {
        return <></>;
    }

    return (
        <BottomModal
            alertId="create-bill-product-selector-modal"
            visible={visible} setVisible={setVisible}
            style={{ padding: 20, gap: 20 }}
            actionButtons={[{
                title: 'Save', onPress: handleSave, color: 'white',
                backgroundColor: 'rgb(50,200,150)',
            }]}

        >
            <TextTheme style={{ fontWeight: 800, fontSize: 16 }} >Select Quantity</TextTheme>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }} >
                <View style={{ flex: 1, paddingRight: 8 }} >
                    <InputField
                        icon={<FeatherIcon name="package" size={20} />}
                        field="quantity"
                        handleChange={setInfo}
                        value={info?.quantity ?? ''}
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
                        handleChange={setInfo}
                        value={info?.price ?? ''}
                        placeholder="Enter rate"
                        keyboardType="number-pad"
                    />
                </View>

                <AnimateButton
                    style={{ marginBlock: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, paddingLeft: 8, paddingRight: 20 }}
                >
                    <TextTheme style={{ fontSize: 14, fontWeight: 900 }}>/ {'Unit'}</TextTheme>
                </AnimateButton>
            </View>
        </BottomModal>
    );
}




export default function CustomerSelectorModal({ visible, setVisible }: Props) {

    const { company } = useCompanyStore();
    const { setCustomer, customer } = useBillContext();
    const { customers, isAllCustomerFetching, pageMeta } = useCustomerStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [filterCustomers, setFilterCustomers] = useState<GetUserLedgers[]>([]);


    function handleProductFetching() {
        if (isAllCustomerFetching) return;
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) return;
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }))
    }

    useEffect(() => {
        dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isCreateCustomerModalOpen]);

    useEffect(() => {
        setFilterCustomers(() => customers.filter((ledger) => ledger.parent === 'Creditors' || ledger.parent === 'Debtors'
        ));
    }, [customers]);


    return (<>
        <ItemSelectorModal<GetUserLedgers>
            visible={visible}
            setVisible={setVisible}
            title='Select Customer'
            keyExtractor={item => item._id}
            isItemSelected={!!customer?.id}
            allItems={filterCustomers}

            actionButtons={[
                {
                    key: 'create-customer',
                    title: 'Create New Customer',
                    onPress: () => setCustomerTypeSelectorModalOpen(true),
                    color: 'white',
                    backgroundColor: 'rgb(50,200,150)',
                    icon: <FeatherIcon name="user-plus" size={16} color="white" />,
                },
            ]}

            SelectedItemContent={<View>
                <TextTheme color='white' >{customer?.name}</TextTheme>
                <TextTheme color='white' isPrimary={false} >{customer?.group}</TextTheme>
            </View>}

            renderItemContent={item => (
                <View style={{ flex: 1 }} >
                    <TextTheme>{item.ledger_name}</TextTheme>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                        <TextTheme isPrimary={false} >{item.phone?.code} {item.phone?.number}</TextTheme>
                        <TextTheme isPrimary={false} >{item.parent}</TextTheme>
                    </View>
                </View>
            )}

            filter={(item, val) =>
                item.phone?.number.startsWith(val) ||
                item.phone?.number.endsWith(val) ||
                item.ledger_name.toLowerCase().split(' ').some(word => (
                    word.startsWith(val)
                ))
            }

            onSelect={item => {
                setVisible(false);

                setCustomer(() => ({
                    id: item._id,
                    name: item.ledger_name,
                    group: item.parent,
                }));
            }}

            loadItemsBeforeListEnd={handleProductFetching}

            isFetching={isAllCustomerFetching}

            whenFetchingComponent={
                <BackgroundThemeView isPrimary={false} style={{ padding: 12, borderRadius: 16, gap: 4 }} >
                    <LoadingView height={14} width={150} isPrimary={true} />
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >
                        <LoadingView height={12} width={80} isPrimary={true} />
                        <LoadingView height={12} width={60} isPrimary={true} />
                    </View>
                </BackgroundThemeView>
            }

        />

        <CustomerTypeSelectorModal
            visible={isCustomerTypeSelectorModalOpen} setVisible={setCustomerTypeSelectorModalOpen}
            setSecondaryVisible={setCreateCustomerModalOpen}
        />

        <CreateCustomerModal
            visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen}
            setPrimaryVisible={setCustomerTypeSelectorModalOpen}
        />
    </>);
}




export function ProductSelectorModal({ visible, setVisible }: Props): React.JSX.Element {

    const { setAlert } = useAlert();

    const { primaryColor, secondaryBackgroundColor } = useTheme();
    const { company } = useCompanyStore();
    const { products, setProducts } = useBillContext();
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
        hsnCode: '',
        gstRate: ''
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
            hsnCode: data.hsnCode,
            unit: data.unit,
            gstRate: data.gstRate
        }]);

        setData({
            quantity: '',
            price: '',
            unit: 'Unit',
            productId: '',
            name: '',
            hsnCode: '',
            gstRate: ''
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
                            handleInputChange('hsnCode', item.hsn_code ?? '');
                            handleInputChange('gstRate', item.gst)
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

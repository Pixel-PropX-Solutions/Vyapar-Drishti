import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useBillContext } from "./Context";
import { useTheme } from "../../../../Contexts/ThemeProvider";
import BottomModal from "../../../../Components/Modal/BottomModal";
import TextTheme from "../../../../Components/Ui/Text/TextTheme";
import { Alert, FlatList, View } from "react-native";
import { InputField } from "../../../../Components/Ui/TextInput/InputField";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import MaterialIcon from "../../../../Components/Icon/MaterialIcon";
import AnimateButton from "../../../../Components/Ui/Button/AnimateButton";
import { useAppDispatch, useCompanyStore, useCustomerStore, useUserStore } from "../../../../Store/ReduxStore";
import { GetUserLedgers } from "../../../../Utils/types";
import { viewAllCustomer } from "../../../../Services/customer";
import { ItemSelectorModal } from "../../../../Components/Modal/Selectors/ItemSelectorModal";
import BackgroundThemeView from "../../../../Components/Layouts/View/BackgroundThemeView";
import CustomerTypeSelectorModal from "../../../../Components/Modal/Customer/CustomerTypeSelectorModal";
import CreateCustomerModal from "../../../../Components/Modal/Customer/CreateCustomerModal";
import { useAlert } from "../../../../Components/Ui/Alert/AlertProvider";
import { viewProductsWithId } from "../../../../Services/product";
import NoralTextInput from "../../../../Components/Ui/TextInput/NoralTextInput";
import EmptyListView from "../../../../Components/Layouts/View/EmptyListView";
import { sliceString } from "../../../../Utils/functionTools";
import ShowWhen from "../../../../Components/Other/ShowWhen";
import { ProductLoadingCard } from "../../../../Components/Ui/Card/ProductCard";
import CreateProductModal from "../../../../Components/Modal/Product/CreateProductModal";
import { CustomerLoadingView } from "../../../../Components/Ui/Card/CustomerCard";
import ScaleAnimationView from "../../../../Components/Layouts/View/ScaleAnimationView";
import { SectionRowWithIcon } from "../../../../Components/Layouts/View/SectionView";


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
        if(visible && !isCreateCustomerModalOpen)
            dispatch(viewAllCustomer({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [isCreateCustomerModalOpen, visible]);

    useEffect(() => {
        setFilterCustomers(
            customers.filter((ledger) => ledger.parent === 'Creditors' || ledger.parent === 'Debtors')
        );
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
            
            whenFetchingComponent={<CustomerLoadingView/>}
            
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

    const dispatch = useAppDispatch();
    const { primaryColor, secondaryBackgroundColor } = useTheme();
    const { products, setProducts } = useBillContext();
    const { user } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;

    const [isFetching, setIsFetching] = useState(false);
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
        if(!visible && isCreateModalOpen) return;

        setIsFetching(true);
        dispatch(viewProductsWithId(user?.user_settings?.current_company_id || '')).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const products = response.payload;
                setItemsList(
                    products.map((product: any) => ({
                        name: product.stock_item_name,
                        id: product._id,
                        unit: product.unit,
                        gst: product.rate,
                        hsn_code: product.hsn_code || '',
                    }))
                );
            }
            return response;
        }).catch((error) => {
            Alert.alert(error || 'Failed to fetch products');
        }).finally(() => {
            setIsFetching(false);
        });

    }, [dispatch, isCreateModalOpen, user?.user_settings?.current_company_id, visible]);

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
                contentContainerStyle={{ gap: 20, paddingBottom: 80, paddingTop: 12 }}
                data={filterItemsList}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"

                ListEmptyComponent={
                    <ShowWhen when={!isFetching} otherwise={<ProductLoadingCard/>} >
                        <EmptyListView type="product" />
                    </ShowWhen>
                }

                renderItem={({ item }) => (
                    <ScaleAnimationView useRandomDelay={true} >
                        <SectionRowWithIcon
                            label={sliceString(item.name, 30) ?? ''}
                            text={item.hsn_code ?? 'No hsn code'}
                            onPress={() => {
                                setUnitModalVisible(true);
                                setData(pre => ({
                                    ...pre, ...{
                                        productId: item.id, unit: item.unit, name: item.name, 
                                        hsnCode: item.hsn_code ?? '', gstRate: item.gst
                                    }
                                }))
                            }}
                            icon={<TextTheme style={{fontSize: 16, fontWeight: 900}} >{item.name[0].toUpperCase()}</TextTheme>}
            
                        >
                            <ShowWhen when={!!item.gst} >
                                <BackgroundThemeView style={{position: 'absolute', top: -2, right: 10, paddingInline: 8, borderRadius: 8, paddingBottom: 2}} >
                                    <TextTheme isPrimary={false} style={{fontSize: 12}} >
                                        GST {item.gst}%
                                    </TextTheme>
                                </BackgroundThemeView>
                            </ShowWhen>
                        </SectionRowWithIcon>
                    </ScaleAnimationView>
                )}

                ListFooterComponentStyle={{ gap: 20 }}
                ListFooterComponent={<ShowWhen when={isFetching}>
                    <ProductLoadingCard />
                </ShowWhen>}
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

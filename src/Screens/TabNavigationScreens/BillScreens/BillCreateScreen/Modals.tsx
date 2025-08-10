/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useBillContext } from './Context';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import BottomModal from '../../../../Components/Modal/BottomModal';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { Alert, FlatList, View } from 'react-native';
import { InputField } from '../../../../Components/Ui/TextInput/InputField';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import MaterialIcon from '../../../../Components/Icon/MaterialIcon';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { useAppDispatch, useCustomerStore, useUserStore } from '../../../../Store/ReduxStore';
import { CustomersList, GetUserLedgers } from '../../../../Utils/types';
import { viewAllCustomer, viewAllCustomers } from '../../../../Services/customer';
import { ItemSelectorModal } from '../../../../Components/Modal/Selectors/ItemSelectorModal';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import CustomerTypeSelectorModal from '../../../../Components/Modal/Customer/CustomerTypeSelectorModal';
import CreateCustomerModal from '../../../../Components/Modal/Customer/CreateCustomerModal';
import { useAlert } from '../../../../Components/Ui/Alert/AlertProvider';
import { viewProductsWithId } from '../../../../Services/product';
import NoralTextInput from '../../../../Components/Ui/TextInput/NoralTextInput';
import EmptyListView from '../../../../Components/Layouts/View/EmptyListView';
import { sliceString } from '../../../../Utils/functionTools';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import { ProductLoadingCard } from '../../../../Components/Ui/Card/ProductCard';
import CreateProductModal from '../../../../Components/Modal/Product/CreateProductModal';
import { CustomerLoadingView } from '../../../../Components/Ui/Card/CustomerCard';
import ScaleAnimationView from '../../../../Components/Ui/Animation/ScaleAnimationView';
import { SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import { setCustomers } from '../../../../Store/Reducers/customerReducer';
import { MeasurmentUnitsData } from '../../../../Assets/objects-data/measurment-units-data';
import { retry } from '@reduxjs/toolkit/query';
import { TextInput } from 'react-native-gesture-handler';


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
                        value={products[editProductIndex]?.quantity}
                        placeholder="Quantity"
                        keyboardType="number-pad"
                        type='decimal-3'
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }} >
                <View style={{ flex: 1, paddingRight: 8 }} >
                    <InputField
                        icon={<MaterialIcon name="currency-rupee" size={20} />}
                        field="price"
                        handleChange={setInfo}
                        value={products[editProductIndex]?.price}
                        placeholder="Enter rate"
                        keyboardType="number-pad"
                        type='decimal-2'
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




export function CustomerSelectorModal({ visible, setVisible }: Props) {

    const { current_company_id } = useUserStore();
    const { setCustomer, customer } = useBillContext();
    const { isAllCustomerFetching, customersList } = useCustomerStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerTypeSelectorModalOpen, setCustomerTypeSelectorModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [filterCustomers, setFilterCustomers] = useState<CustomersList[]>([]);


    function handleProductFetching() {
        if (isAllCustomerFetching) { return; }
        dispatch(viewAllCustomers(current_company_id ?? ''));
    }

    useEffect(() => {
        if (visible && !isCreateCustomerModalOpen) {
            dispatch(setCustomers([]));
            dispatch(viewAllCustomers(current_company_id ?? ''));
        }
    }, [isCreateCustomerModalOpen, visible]);

    useEffect(() => {
        setFilterCustomers(
            customersList.filter((ledger) => ledger.parent === 'Creditors' || ledger.parent === 'Debtors')
        );
    }, [customersList]);


    return (<>
        <ItemSelectorModal<CustomersList>
            visible={visible}
            setVisible={setVisible}
            title="Select Customer"
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
                <TextTheme color="white" >{customer?.name}</TextTheme>
                <TextTheme color="white" isPrimary={false} >{customer?.group}</TextTheme>
            </View>}

            renderItemContent={item => (
                <View style={{ flex: 1 }} >
                    <TextTheme>{item.ledger_name}</TextTheme>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                        <TextTheme isPrimary={false}>{item.phone?.code} {item.phone?.number}</TextTheme>
                        <TextTheme isPrimary={false}>{item.parent}</TextTheme>
                    </View>
                </View>
            )}

            filter={(item, val) =>
                item.phone?.number.includes(val.toLowerCase()) ||
                item.phone?.number.includes(val.toLowerCase()) ||
                item.ledger_name.toLowerCase().split(' ').some(word => (
                    word.includes(val.toLowerCase())
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

            whenFetchingComponent={<CustomerLoadingView />}

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
    const { primaryColor } = useTheme();
    const { products, setProducts } = useBillContext();
    const { current_company_id } = useUserStore();

    const [isFetching, setIsFetching] = useState(false);
    const [isUnitModalVisible, setUnitModalVisible] = useState<boolean>(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [itemsList, setItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);
    const [filterItemsList, setFilterItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);

    const [data, setData] = useState({
        quantity: '',
        price: '',
        unit: '',
        productId: '',
        name: '',
        hsnCode: '',
        gstRate: '',
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
            gstRate: data.gstRate,
        }]);

        setData({
            quantity: '',
            price: '',
            unit: 'Unit',
            productId: '',
            name: '',
            hsnCode: '',
            gstRate: '',
        });

        setUnitModalVisible(false);
        setVisible(false);
    }

    useEffect(() => {
        if (!visible && isCreateModalOpen) { return; }

        setIsFetching(true);
        setItemsList([]);
        dispatch(viewProductsWithId(current_company_id || '')).then((response) => {
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

    }, [dispatch, isCreateModalOpen, current_company_id, visible]);

    useEffect(() => {
        setFilterItemsList(itemsList.filter(item => !(products.some(pro => pro.id === item.id))));
    }, [products, itemsList]);

    return (
        <>
            <ItemSelectorModal<{ id: string; name: string; unit: string, gst: string, hsn_code: string }>
                title="Select Product"
                visible={visible} setVisible={setVisible}
                closeOnSelect={false}
                allItems={filterItemsList}
                keyExtractor={(item) => item.id}
                isItemSelected={false}

                filter={(item, val) => (
                    item.name.toLowerCase().includes(val) ||
                    item.hsn_code.toLowerCase().includes(val)
                )}

                actionButtons={[{
                    key: 'create-product',
                    title: 'Create New Product',
                    onPress: () => setCreateModalOpen(true),
                    color: 'white',
                    backgroundColor: 'rgb(50,200,150)',
                    icon: <MaterialIcon name="add" size={16} color="white" />,
                }]}

                onSelect={item => {
                    setData(pre => ({
                        ...pre, ...{
                            productId: item.id, unit: item.unit, name: item.name,
                            hsnCode: item.hsn_code ?? '', gstRate: item.gst,
                        },
                    }));

                    setUnitModalVisible(true);
                }}


                renderItemContent={(item) => (
                    <View style={{ flex: 1 }} >
                        <TextTheme fontSize={14} fontWeight={700} >{item.name}</TextTheme>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                            <TextTheme isPrimary={false}>{item.hsn_code || 'No HSN Code'}</TextTheme>
                            {item.gst && <TextTheme isPrimary={false}>{item.gst}%</TextTheme>}
                        </View>
                    </View>
                )}

                isFetching={isFetching}
                whenFetchingComponent={
                    <ProductLoadingCard />
                }
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
                            type='decimal-3'
                            icon={<FeatherIcon name="package" size={20} />}
                            field="quantity"
                            handleChange={handleInputChange}
                            defaultValue={data.quantity}
                            placeholder="Quantity"
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }} >
                    <View style={{ flex: 1, paddingRight: 8 }} >
                        <InputField
                            type='decimal-2'
                            icon={<MaterialIcon name="currency-rupee" size={20} />}
                            field="price"
                            handleChange={handleInputChange}
                            defaultValue={data.price}
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
        </>
    );
}


export function BillNoEditorModal({ visible, setVisible }: Props) {

    const { billNo, setBillNo } = useBillContext();
    const { primaryColor, secondaryColor } = useTheme();

    const [text, setText] = useState<string>(billNo);
    const input = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) { setText(billNo); }
    }, [billNo, visible]);

    useEffect(() => {
        if (!visible) { return; }

        setTimeout(() => {
            input.current?.focus();
        }, 250);
    }, [visible]);

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingInline: 20, gap: 16 }}
            actionButtons={[{
                title: 'Set',
                color: 'white',
                backgroundColor: 'rgb(50,200,150)',
                onPress: () => { setBillNo(text); setVisible(false); },
            }]}
        >
            <TextTheme fontSize={20} fontWeight={900}>Enter Bill No</TextTheme>

            <View style={{ borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, width: '100%', flexDirection: 'row', alignItems: 'center' }} >
                <TextInput
                    ref={input}
                    value={text}
                    placeholder="INVOICE NO"
                    style={{ fontSize: 16, flex: 1, opacity: text ? 1 : 0.8 }}
                    placeholderTextColor={secondaryColor}
                    multiline={true}
                    keyboardType="default"
                    autoCapitalize="characters"
                    onChangeText={val => {
                        setText(val);
                    }}
                />

            </View>

            <View style={{ minHeight: 10 }} />
        </BottomModal>
    );
}

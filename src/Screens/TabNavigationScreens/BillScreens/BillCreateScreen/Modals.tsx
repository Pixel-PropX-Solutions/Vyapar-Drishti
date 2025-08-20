/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Product, useBillContext } from './Context';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import BottomModal from '../../../../Components/Modal/BottomModal';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { Alert, FlatList, ScrollView, View } from 'react-native';
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
import SectionView, { SectionRow, SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import { setCustomers } from '../../../../Store/Reducers/customerReducer';
import { MeasurmentUnitsData } from '../../../../Assets/objects-data/measurment-units-data';
import { retry } from '@reduxjs/toolkit/query';
import { TextInput } from 'react-native-gesture-handler';
import LabelTextInput from '../../../../Components/Ui/TextInput/LabelTextInput';
import AutoFocusInputModal from '../../../../Components/Ui/TextInput/AutoFocusInputModal';
import DateSelectorModal from '../../../../Components/Modal/Selectors/DateSelectorModal';
import { useAppStorage } from '../../../../Contexts/AppStorageProvider';
import { useProduct } from './Hooks';


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}


export function ProductInfoUpdateModal({ visible, setVisible, editProductIndex }: Props & { editProductIndex: number }): React.JSX.Element {

    const {setAlert} = useAlert()
    const { products } = useBillContext();
    const {currency} = useAppStorage()

    const product = useProduct(editProductIndex, visible);

    function handleSave() {
        if(product.data.quantity <= 0 || product.data.rate <= 0) {
            setAlert({
                id: 'create-bill-product-selector-modal',
                type: 'error', message: 'please enter all required information !!!',
            });
            
            return;
        };

        setVisible(false);
        product.update();
    }

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
            <ScrollView 
                contentContainerStyle={{gap: 24}} 
                showsVerticalScrollIndicator={false}
            >
                    <SectionView  
                        label='Fill Details'
                        style={{gap: 14}}
                    >
                        <LabelTextInput
                            label='Quantity'
                            placeholder='Enter Quantity'
                            keyboardType='numeric'
                            value={product.data.quantity.toString()}
                            valueRefreshDipendency={[product.data.item_id, editProductIndex]}
                            checkInputText={(val) => 0 < Number(val)}
                            postChild={<TextTheme>{currency} / {product.data.unit}</TextTheme>}
                            icon={<FeatherIcon name='package' size={16} />}
                            onChangeText={(val) => {product.handleData('quantity', Number(val))}}
                            autoFocus={true}
                        />
                        
                        <LabelTextInput
                            label='Rate'
                            placeholder='Enter per unit rate'
                            keyboardType='numeric'
                            value={product.data.rate.toString()}
                            valueRefreshDipendency={[product.data.item_id, editProductIndex]}
                            checkInputText={(val) => 0 < Number(val)}
                            postChild={<TextTheme>{currency} / {product.data.unit}</TextTheme>}
                            icon={<MaterialIcon name="currency-rupee" size={16} />}
                            onChangeText={(val) => {product.handleData('rate', Number(val))}}
                        />
                        
                        <LabelTextInput
                            label='Discount'
                            placeholder='Enter discount amount'
                            keyboardType='numeric'
                            value={product.data.discount_amount.toString()}
                            checkInputText={(val) => 0 < Number(val)}
                            valueRefreshDipendency={[product.data.item_id, editProductIndex]}
                            postChild={<TextTheme>{currency} / {product.data.unit}</TextTheme>}
                            icon={<MaterialIcon name="currency-rupee" size={16} />}
                            onChangeText={(val) => {product.handleData('discount_amount', Number(val))}}
                        />
                    </SectionView>

                    <SectionView label='Snap Short' style={{gap: 4}} >
                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Sub Total</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.amount} {currency}</TextTheme>
                        </SectionRow>

                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Discount Amount</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.discount_amount} {currency}</TextTheme>
                        </SectionRow>

                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Tax Rate</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.tax_rate} %</TextTheme>
                        </SectionRow>
                        
                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Tax Amount</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.tax_amount} {currency}</TextTheme>
                        </SectionRow>

                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Grand Total</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.total_amount} {currency}</TextTheme>
                        </SectionRow>
                    </SectionView>

                    <View style={{minHeight: 40}} />
                </ScrollView>
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
    const {currency} = useAppStorage()

    const dispatch = useAppDispatch();
    const { current_company_id } = useUserStore();

    const [isFetching, setIsFetching] = useState(false);
    const [isUnitModalVisible, setUnitModalVisible] = useState<boolean>(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [itemsList, setItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);

    const product = useProduct();

    function handleProduct() {
        if (!(product.data.rate > 0 && product.data.quantity > 0 && product.data.discount_amount >= 0)) {
            return setAlert({
                id: 'create-bill-product-selector-modal',
                type: 'error', message: 'please enter valid information !!!',
            });
        }

        product.add();

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

    return (
        <>
            <ItemSelectorModal<{ id: string; name: string; unit: string, gst: string, hsn_code: string }>
                title="Select Product"
                visible={visible} setVisible={setVisible}
                closeOnSelect={false}
                allItems={itemsList}
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
                    product.handleData('item_id', item.id);
                    product.handleData('unit', item.unit);
                    product.handleData('item', item.name);
                    product.handleData('hsn_code', item.hsn_code);
                    product.handleData('tax_rate', Number(item.gst ?? '0'));
                    setUnitModalVisible(true);
                }}


                renderItemContent={(item) => (
                    <View style={{ flex: 1 }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextTheme fontSize={14} fontWeight={700} >{item.name}</TextTheme>
                            <TextTheme fontSize={12} fontWeight={500} isPrimary={false} >{item.unit}</TextTheme>
                        </View>
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
                style={{ padding: 20 }}
                actionButtons={[{
                    title: '+ Add', onPress: handleProduct, color: 'white',
                    backgroundColor: 'rgb(50,200,150)',
                }]}

            >
                <ScrollView contentContainerStyle={{gap: 24}} showsVerticalScrollIndicator={false} >
                    <SectionView  
                        label='Fill Details'
                        style={{gap: 14}}
                    >
                        <LabelTextInput
                            label='Quantity'
                            placeholder='Enter Quantity'
                            keyboardType='numeric'
                            checkInputText={(val) => 0 < Number(val)}
                            postChild={<TextTheme>{product.data.unit}</TextTheme>}
                            icon={<FeatherIcon name='package' size={16} />}
                            onChangeText={(val) => {product.handleData('quantity', Number(val))}}
                            autoFocus={true}
                        />
                        
                        <LabelTextInput
                            label='Rate'
                            placeholder='Enter per unit rate'
                            keyboardType='numeric'
                            checkInputText={(val) => 0 < Number(val)}
                            postChild={<TextTheme>{currency} / {product.data.unit}</TextTheme>}
                            icon={<MaterialIcon name="currency-rupee" size={16} />}
                            onChangeText={(val) => {product.handleData('rate', Number(val))}}
                        />
                        
                        <LabelTextInput
                            label='Discount'
                            placeholder='Enter discount amount'
                            keyboardType='numeric'
                            checkInputText={(val) => 0 < Number(val)}
                            postChild={<TextTheme>{currency} / {product.data.unit}</TextTheme>}
                            icon={<MaterialIcon name="currency-rupee" size={16} />}
                            onChangeText={(val) => {product.handleData('discount_amount', Number(val))}}
                        />
                    </SectionView>

                    <SectionView label='Snap Short' style={{gap: 4}} >
                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Sub Total</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.amount} {currency}</TextTheme>
                        </SectionRow>

                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Discount Amount</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.discount_amount} {currency}</TextTheme>
                        </SectionRow>

                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Tax Rate</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.tax_rate} %</TextTheme>
                        </SectionRow>
                        
                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Tax Amount</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.tax_amount} {currency}</TextTheme>
                        </SectionRow>

                        <SectionRow style={{justifyContent: 'space-between'}}>
                            <TextTheme isPrimary={false} fontWeight={600} >Grand Total</TextTheme>
                            <TextTheme fontWeight={600}>{product.data.total_amount} {currency}</TextTheme>
                        </SectionRow>
                    </SectionView>

                    <View style={{minHeight: 40}} />
                </ScrollView>
            </BottomModal>

            <CreateProductModal
                visible={isCreateModalOpen}
                setVisible={setCreateModalOpen}
            />
        </>
    );
}


export function AdditionDetailModal({visible, setVisible}: Props): React.JSX.Element {

    const {currency} = useAppStorage()
    const {additionalDetails: info, handleAdditionalDetails: handleInfo} = useBillContext();

    const [isVechicleNoModalVisible, setVevhicleNoModalVisible] = useState(false);
    const [isDateModalVisible, setDateModalVisible] = useState(false);
    const [isPayAmountModalVisible, setPayAmountModalVisible] = useState(false);
    const [isTransportModeModalVisible, setTransportModeModalVisible] = useState(false);
    const [isNoteModalVisible, setNoteModalVisible] = useState(false);

    return (
        <BottomModal 
            visible={visible} 
            setVisible={setVisible}
            style={{paddingInline: 20, gap: 20}}
            actionButtons={[{
                title: 'Save', onPress: () => {},
                backgroundColor: 'rgb(50,200,150)',
                color: 'white'
            }]}
        >
            <TextTheme fontSize={16} fontWeight={600} >Fill Addition Details</TextTheme>

            <ScrollView
                contentContainerStyle={{width: '100%', gap: 12}}
                keyboardShouldPersistTaps='always'
            >
                <View style={{flexDirection: 'row', gap: 12, alignItems: 'center', width: '100%', position: 'relative'}} >
                    <View style={{flex: 1}}>
                        <SectionRowWithIcon
                            label='Status'
                            text='bill status'
                            onPress={() => {}}
                            icon={<FeatherIcon name='check-circle' size={16} />}
                        />
                    </View>

                    <View style={{flex: 1}}>
                        <SectionRowWithIcon
                            label='Due Date'
                            onPress={() => {setDateModalVisible(true)}}
                            text={info.dueDate || 'Select due date'}
                            icon={<FeatherIcon name='calendar' size={16} />}
                        />
                    </View>
                </View>

                <SectionRowWithIcon
                    label='Pay Amount'
                    onPress={() => {setPayAmountModalVisible(true)}}
                    text={info.payAmount ? `${info.payAmount} ${currency}` : 'Tap to add pay amount'}
                    hasArrow={true}
                    icon={<FeatherIcon name='dollar-sign' size={16} />}
                />

                <SectionRowWithIcon
                    label='Transport Mode'
                    onPress={() => {setTransportModeModalVisible(true)}}
                    text={info.transportMode || 'Tap to select mode of transport'}
                    hasArrow={true}
                    icon={<FeatherIcon name='truck' size={16} />}
                />
                
                <SectionRowWithIcon
                    label='Vechicle Number'
                    onPress={() => {setVevhicleNoModalVisible(true)}}
                    text={info.vechicleNumber || 'Tap to add vechile number'}
                    hasArrow={true}
                    icon={<FeatherIcon name='hash' size={16} />}
                />

                <AnimateButton onPress={() => { setNoteModalVisible(true); }} style={{ borderRadius: 12 }} >
                    <BackgroundThemeView isPrimary={false} style={{ padding: 12 }} >
                        <View style={{ flexDirection: 'row', gap: 12 }} >
                            <FeatherIcon size={16} name="align-left" />
                            <TextTheme>Add Notes</TextTheme>
                        </View>
        
                        <View style={{ flexDirection: 'row', gap: 12, minHeight: 40 }} >
                            <TextTheme isPrimary={false} fontSize={12} style={{ flex: 1, paddingTop: 4 }} >
                                {info.note || 'Notes ....'}
                            </TextTheme>
                        </View>
                    </BackgroundThemeView>
                </AnimateButton>
            </ScrollView>

            <AutoFocusInputModal 
                label='Vechicle Number'
                defaultValue={info.vechicleNumber ?? ''}
                placeholder='Enter vechicle number'
                visible={isVechicleNoModalVisible} setVisible={setVevhicleNoModalVisible}
                onSet={(val) => {handleInfo('vechicleNumber', val)}}
            />
            
            <AutoFocusInputModal 
                label='Pay Amount'
                placeholder='Enter pay amount'
                defaultValue={info.payAmount}
                visible={isPayAmountModalVisible} setVisible={setPayAmountModalVisible}
                containerChild={<TextTheme fontSize={16} fontWeight={600}>INR</TextTheme>}
                keyboardType='number-pad'
                onSet={(val) => {handleInfo('payAmount', val)}}
                inputValueFilters={(cur, old) => {
                    const char = cur.at(-1) ?? '';

                    if (cur.length > 1 && cur[0] === '0' && cur[1] === '0') return old;
                    if(!'0123456789.'.includes(char)) return old;
                    if(char === '.' && cur.slice(0, -1).includes('.')) return old;

                    if(cur.length > 1 && cur[0] === '0' && !cur.includes('.')) return cur.slice(1);
                    return cur;
                }}
            />

            <DateSelectorModal 
                visible={isDateModalVisible} setVisible={setDateModalVisible}
                onSelect={({year, month, date}) => {
                    handleInfo('dueDate', `${date}/${month.toString().padStart(2, '0')}/${year}`)
                }}
            />

            <ItemSelectorModal<string>
                visible={isTransportModeModalVisible} 
                setVisible={setTransportModeModalVisible}
                
                title='Transport Mode'
                allItems={[]}
                onSelect={(val) => {handleInfo('transportMode', val)}}
                
                keyExtractor={item => item}
                
                isItemSelected={!!info.transportMode}

                SelectedItemContent={
                    <TextTheme color='white' >{info.transportMode}</TextTheme>
                }
                
                
                renderItemContent={(item) => (
                    <TextTheme>{item}</TextTheme>
                )}

                filter={() => true}
            />

            <AutoFocusInputModal 
                visible={isNoteModalVisible} 
                setVisible={setNoteModalVisible}
                label='Add Note'
                placeholder='Type note that you want to attach' 
                defaultValue={info.note}
                multiline={true}
                numberOfLines={10}
                onSet={(val) => {handleInfo('note', val)}}
            />

        </BottomModal>
    )
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

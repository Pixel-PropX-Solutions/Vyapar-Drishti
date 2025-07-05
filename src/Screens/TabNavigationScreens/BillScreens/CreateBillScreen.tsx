/* eslint-disable react-native/no-inline-styles */

import { FlatList, KeyboardAvoidingView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AnimateButton from '../../../Components/Button/AnimateButton';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import { useTheme } from '../../../Contexts/ThemeProvider';
import TextTheme from '../../../Components/Text/TextTheme';
import { Dispatch, SetStateAction, useState } from 'react';
import BackgroundThemeView from '../../../Components/View/BackgroundThemeView';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamsList } from '../../../Navigation/StackNavigation';
import ProductSelectorModal from '../../../Components/Modal/Product/ProductSelectorModal';
import CreateBillScreenProvider, { useCreateBillContext } from '../../../Contexts/CreateBillScreenProvider';
import CustomerSelectorModal from '../../../Components/Modal/Customer/CustomerSelectorModal';
import ShowWhen from '../../../Components/Other/ShowWhen';
import { SectionRow } from '../../../Components/View/SectionView';
import { sliceString } from '../../../Utils/functionTools';
import { useAppStorage } from '../../../Contexts/AppStorageProvider';
import EmptyListView from '../../../Components/View/EmptyListView';
import { CreateInvoiceData } from '../../../Utils/types';
import { useAppDispatch, useCompanyStore, useInvoiceStore } from '../../../Store/ReduxStore';
import { createInvoice } from '../../../Services/invoice';
import navigator from '../../../Navigation/NavigationService';
import LoadingModal from '../../../Components/Modal/LoadingModal';
import MaterialIcon from '../../../Components/Icon/MaterialIcon';


export default function CraeteBillScreen() {
    return <CreateBillScreenProvider>
        <Screen />
    </CreateBillScreenProvider>;
}


function Screen(): React.JSX.Element {

    const dispatch = useAppDispatch();

    const { currency } = useAppStorage();
    const { company } = useCompanyStore();
    const { loading } = useInvoiceStore();
    const { secondaryBackgroundColor } = useTheme();
    const { billNo, setBillNo, createOn, setCreateOn, customer, products, totalValue, resetAllStates, setProducts } = useCreateBillContext();
    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'create-bill-screen'>>();
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();

    const { billType } = router.params;


    const [isCustomerModalVisible, setCustomerModalVisible] = useState<boolean>(false);
    const [isProductModalVisible, setProductModalVisible] = useState<boolean>(false);

    const [isCreating, setIsCreating] = useState<boolean>(false);

    // Enhanced validation
    const isFormValid = customer && products.length > 0 && billNo.trim() !== '';


    async function handleInvoice() {
        if (!isFormValid) { return; }

        setIsCreating(true);

        try {
            let data: CreateInvoiceData = {
                company_id: company?._id ?? '',
                date: createOn,
                voucher_number: billNo,
                voucher_type: billType,
                voucher_type_id: billType,
                reference_date: '',
                narration: '',
                place_of_supply: '',
                reference_number: '',
                items: products.map(pro => ({
                    item_id: pro.id,
                    quantity: pro.quantity,
                    rate: pro.price,
                    vouchar_id: '',
                    item: pro.name,
                    amount: pro.price * pro.quantity,
                })),
                party_name: customer?.name ?? '',
                party_name_id: customer?.id ?? '',
                accounting: [
                    { amount: totalValue, ledger: customer?.name, ledger_id: customer?.id ?? '', vouchar_id: '' },
                    { amount: totalValue, ledger: customer?.name, ledger_id: customer?.id ?? '', vouchar_id: '' },
                ],
            };

            let { payload: res } = await dispatch(createInvoice(data));

            if (res.success) {
                // Success animation
                resetAllStates();
                navigator.goBack();
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
        } finally {
            setIsCreating(false);
        }
    }


    return (
        <View style={{ justifyContent: 'space-between', width: '100%', height: '100%' }} >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                paddingHorizontal: 20,
                paddingBlock: 10,
            }} >
                <AnimateButton
                    onPress={() => navigation.goBack()}
                    style={{
                        borderWidth: 2,
                        borderRadius: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 44,
                        aspectRatio: 1,
                        borderColor: secondaryBackgroundColor,
                    }}
                >
                    <FeatherIcon name="arrow-left" size={20} />
                </AnimateButton>

                <View style={{
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: secondaryBackgroundColor,
                    height: 44,
                    paddingInline: 20,
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 8,
                }} >
                    <FeatherIcon name="file-text" size={14} />
                    <TextTheme style={{ fontSize: 14, fontWeight: 700 }} >{billType}</TextTheme>
                </View>
            </View>

            <ScrollView style={{ paddingInline: 20, paddingBlock: 10 }} contentContainerStyle={{ gap: 24 }} >
                <View style={{ gap: 16 }} >

                    {/* Progress Bar */}
                    <View >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                            <TextTheme style={{ fontSize: 12, fontWeight: '600' }} isPrimary={false}>
                                Progress
                            </TextTheme>
                            <TextTheme style={{ fontSize: 12, fontWeight: '600' }} isPrimary={false}>
                                {Math.round((customer ? 33 : 0) + (products.length > 0 ? 33 : 0) + (billNo ? 34 : 0))}%
                            </TextTheme>
                        </View>
                        <View style={{
                            height: 6,
                            backgroundColor: secondaryBackgroundColor,
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}>
                            <View
                                style={{
                                    height: '100%',
                                    backgroundColor: '#4CAF50',
                                    borderRadius: 3,
                                    width: `${(customer ? 33 : 0) + (products.length > 0 ? 33 : 0) + (billNo ? 34 : 0)}%`,
                                }}
                            />
                        </View>
                    </View>


                    <TextTheme style={{ fontSize: 18, fontWeight: '700' }}>
                        Bill Information
                    </TextTheme>
                    <BillNoAndDateSelector
                        billNo={billNo} setBillNo={setBillNo}
                        createOn={createOn} setCreateOn={setCreateOn}
                    />

                    {/* <TextTheme style={{ fontSize: 18, fontWeight: '700' }}>
                        Customer Details
                    </TextTheme> */}
                    <AnimateButton
                        style={{
                            padding: 8,
                            borderRadius: 12,
                            width: '100%',
                            backgroundColor: customer ? '#4CAF5020' : secondaryBackgroundColor,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        onPress={() => setCustomerModalVisible(true)}
                    >
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                            <BackgroundThemeView
                                style={{
                                    width: 48,
                                    height: 48,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 12,
                                    backgroundColor: '#4CAF50',
                                    marginRight: 12,
                                }}
                            >
                                <FeatherIcon
                                    name="user"
                                    size={20}
                                />
                            </BackgroundThemeView>

                            <View>
                                <TextTheme style={{ fontSize: 16, fontWeight: '700' }}>
                                    {customer?.name || 'Select Customer'}
                                </TextTheme>
                                <ShowWhen when={!!customer?.group}>
                                    <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                        {customer?.group}
                                    </TextTheme>
                                </ShowWhen>
                                {!customer && (
                                    <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                        Tap to select a customer
                                    </TextTheme>
                                )}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {customer && (
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: '#4CAF50',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <FeatherIcon name="check" size={12} color="white" />
                                </View>
                            )}
                            <FeatherIcon name="chevron-right" size={20} />
                        </View>
                    </AnimateButton>

                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextTheme style={{ fontSize: 18, fontWeight: '700' }}>
                            Items ({products.length})
                        </TextTheme>
                        {products.length > 0 && (
                            <TextTheme style={{ fontSize: 14, fontWeight: '600', color: '#4CAF50' }}>
                                {totalValue.toFixed(2)} {currency}
                            </TextTheme>
                        )}
                    </View> */}
                    <AnimateButton
                        onPress={() => setProductModalVisible(true)}
                        style={{ padding: 8, borderRadius: 12, width: '100%', backgroundColor: products.length > 0 ? '#4CAF5020' : secondaryBackgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                            <BackgroundThemeView
                                style={{
                                    width: 48,
                                    height: 48,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 12,
                                    backgroundColor: products.length > 0 ? '#4CAF50' : undefined,
                                    marginRight: 12,
                                }}
                            >
                                <FeatherIcon
                                    name="plus"
                                    size={20}
                                />
                            </BackgroundThemeView>

                            <View>
                                <TextTheme style={{ fontSize: 16, fontWeight: '700' }}>
                                    Add Items
                                </TextTheme>
                                <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                    {products.length > 0 ? `${products.length} item${products.length > 1 ? 's' : ''} added` : 'Tap to add items'}
                                </TextTheme>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* gap: 8 replaced with marginRight on check icon */}
                            {products.length > 0 && (
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: '#4CAF50',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 8,
                                }}>
                                    <FeatherIcon name="check" size={12} color="white" />
                                </View>
                            )}
                            <FeatherIcon name="chevron-right" size={20} />
                        </View>
                    </AnimateButton>
                </View>

                <FlatList
                    scrollEnabled={false}
                    contentContainerStyle={{ gap: 12 }}
                    ListEmptyComponent={<EmptyListView title="No Items Added" text="Add items to the bill" />}

                    ListHeaderComponent={<ShowWhen when={products.length !== 0}>
                        <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }} >Items</TextTheme>
                    </ShowWhen>}

                    data={products}
                    keyExtractor={(item, index) => item.id + index}
                    renderItem={({ item }) => (
                        <SectionRow style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12, position: 'relative' }} >
                            <View>
                                <TextTheme style={{ fontWeight: '700', fontSize: 16 }}>
                                    {sliceString(item.name, 34)}
                                </TextTheme>
                                {item.productNo && (
                                    <TextTheme isPrimary={false} style={{ fontSize: 12, fontWeight: '500' }}>
                                        SKU: {item.productNo}
                                    </TextTheme>
                                )}
                            </View>

                            <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 28 }} >
                                <View style={{ marginRight: 24 }}>
                                    <TextTheme style={{ fontSize: 12, fontWeight: '600', marginBottom: 2 }}>
                                        Quantity
                                    </TextTheme>
                                    <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                        {item.quantity} {item.unit}
                                    </TextTheme>
                                </View>
                                <View style={{ marginRight: 24 }}>
                                    <TextTheme style={{ fontSize: 12, fontWeight: '600', marginBottom: 2 }}>
                                        Unit Price
                                    </TextTheme>
                                    <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                        {item.price.toFixed(2)} {currency}
                                    </TextTheme>
                                </View>
                                <View>
                                    <TextTheme style={{ fontSize: 12, fontWeight: '600', marginBottom: 2 }}>
                                        Total
                                    </TextTheme>
                                    <TextTheme style={{ fontSize: 14, fontWeight: '700', color: '#4CAF50' }}>
                                        {(item.price * item.quantity).toFixed(2)} {currency}
                                    </TextTheme>
                                </View>
                            </View>

                            <View style={{ position: 'absolute', top: -6, right: -6 }} >
                                <AnimateButton
                                    style={{
                                        backgroundColor: 'rgb(250,50,100)',
                                        borderRadius: 8,
                                        paddingInline: 12,
                                        flexDirection: 'row',
                                        gap: 12,
                                        alignItems: 'center',
                                        height: 32,
                                    }}
                                    onPress={() => setProducts(pro => {
                                        let temp = [...pro];
                                        let index = pro.findIndex(e => e.id == item.id);
                                        if (index >= 0) { temp.splice(index, 1); }
                                        return temp;
                                    })}
                                >
                                    <FeatherIcon name="trash-2" size={16} color="white" />
                                </AnimateButton>
                            </View>
                        </SectionRow>
                    )}
                />

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            {(customer && products.length > 0) && (
                <KeyboardAvoidingView behavior="padding" >
                    <AmountBox handleCreateInvoice={handleInvoice} isFormValid={isFormValid} isCreating={isCreating} />
                </KeyboardAvoidingView>
            )}

            <CustomerSelectorModal visible={isCustomerModalVisible} setVisible={setCustomerModalVisible} billType={billType} />
            <ProductSelectorModal visible={isProductModalVisible} setVisible={setProductModalVisible} billType={billType} />
            <LoadingModal visible={loading} />
        </View>
    );
}





type BillNoAndDateSelectorProps = {
    billNo: string,
    setBillNo: Dispatch<SetStateAction<string>>,
    createOn: string
    setCreateOn: Dispatch<SetStateAction<string>>
}

function BillNoAndDateSelector({ billNo, setBillNo, createOn, setCreateOn }: BillNoAndDateSelectorProps): React.JSX.Element {

    const { secondaryBackgroundColor } = useTheme();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }} >
            <AnimateButton style={{
                padding: 8,
                borderRadius: 16,
                flex: 1,
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
                backgroundColor: billNo ? '#4CAF5020' : secondaryBackgroundColor,
            }}>
                <BackgroundThemeView
                    style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        backgroundColor: '#4CAF50',
                    }}
                >
                    <FeatherIcon name="hash" size={16} />
                </BackgroundThemeView>

                <View style={{ flex: 1 }}>
                    <TextTheme style={{ fontSize: 14, fontWeight: '700', marginBottom: 2 }}>
                        Bill No
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{ fontSize: 13, fontWeight: '500' }}>
                        {billNo || 'Auto-generated'}
                    </TextTheme>
                </View>
            </AnimateButton>

            <AnimateButton style={{
                padding: 8,
                borderRadius: 16,
                flex: 1,
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
                backgroundColor: createOn ? '#4CAF5020' : secondaryBackgroundColor,
            }}>
                <BackgroundThemeView
                    style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                    }}
                >
                    <FeatherIcon name="calendar" size={16} />
                </BackgroundThemeView>

                <View style={{ flex: 1 }}>
                    <TextTheme style={{ fontSize: 14, fontWeight: '700', marginBottom: 2 }}>
                        Date
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{ fontSize: 13, fontWeight: '500' }}>
                        {createOn}
                    </TextTheme>
                </View>
            </AnimateButton>
        </View>
    );
}




const AmountBox = ({ handleCreateInvoice, isFormValid, isCreating }: {
    handleCreateInvoice: () => void; isFormValid: boolean;
    isCreating: boolean;
}): React.JSX.Element => {

    const { totalValue, products, customer, billNo } = useCreateBillContext();
    const { currency } = useAppStorage();

    const backgroundColor = '#4CAF50';
    const disabledColor = '#E0E0E0';
    const textColor = isFormValid ? 'white' : '#9E9E9E';

    return (
        <View
            style={{
                backgroundColor: 'white',
                paddingTop: 14,
                paddingBottom: 20,
                paddingHorizontal: 20,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 10,
            }}
        >
            {/* Summary Cards */}
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View
                    style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: `${backgroundColor}20`,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: `${backgroundColor}40`,
                        marginRight: 12,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2, gap: 2 }}>
                        <MaterialIcon name="currency-rupee" size={16} color={backgroundColor} />
                        <TextTheme style={{ fontSize: 12, fontWeight: '600' }} isPrimary={false}>
                            Total Amount
                        </TextTheme>
                    </View>
                    <TextTheme style={{ fontSize: 20, fontWeight: '700', color: backgroundColor }}>
                        {totalValue.toFixed(2)} {currency}
                    </TextTheme>
                </View>

                <View
                    style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: `${backgroundColor}20`,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: `${backgroundColor}40`,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2, gap: 4 }}>
                        <FeatherIcon name="package" size={16} color={backgroundColor} />
                        <TextTheme style={{ fontSize: 12, fontWeight: '600' }} isPrimary={false}>
                            Total Items
                        </TextTheme>
                    </View>
                    <TextTheme style={{ fontSize: 20, fontWeight: '700', color: backgroundColor }}>
                        {products.length}
                    </TextTheme>
                </View>
            </View>

            {/* Create Button */}
            <AnimateButton
                onPress={handleCreateInvoice}
                disabled={!isFormValid || isCreating}
                style={{
                    backgroundColor: isFormValid ? backgroundColor : disabledColor,
                    borderRadius: 16,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // gap: 12, // removed
                    shadowColor: isFormValid ? backgroundColor : 'transparent',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                }}
            >
                {isCreating ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: textColor,
                            borderTopColor: 'transparent',
                            marginRight: 12,
                        }} />
                        <TextTheme style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
                            Creating Bill...
                        </TextTheme>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FeatherIcon name="check" size={20} color={textColor} style={{ marginRight: 12 }} />
                        <TextTheme style={{ fontSize: 16, fontWeight: '700', color: textColor }}>
                            {isFormValid ? 'Create Bill' : 'Complete Required Fields'}
                        </TextTheme>
                    </View>
                )}
            </AnimateButton>

            {/* Validation Messages */}
            {!isFormValid && (
                <View style={{ marginTop: 12, padding: 12, backgroundColor: '#FFF3E0', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#FF9800' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <FeatherIcon name="alert-circle" size={16} color="#FF9800" style={{ marginRight: 8 }} />
                        <TextTheme style={{ fontSize: 14, fontWeight: '600', color: '#FF9800' }}>
                            Required Fields Missing
                        </TextTheme>
                    </View>
                    <View>
                        {!customer && (
                            <TextTheme style={{ fontSize: 12, color: '#FF9800' }}>
                                • Select a customer
                            </TextTheme>
                        )}
                        {products.length === 0 && (
                            <TextTheme style={{ fontSize: 12, color: '#FF9800' }}>
                                • Add at least one item
                            </TextTheme>
                        )}
                        {!billNo.trim() && (
                            <TextTheme style={{ fontSize: 12, color: '#FF9800' }}>
                                • Enter a bill number
                            </TextTheme>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};

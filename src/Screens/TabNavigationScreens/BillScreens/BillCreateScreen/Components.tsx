/* eslint-disable react-native/no-inline-styles */
import { Animated, Pressable, ScrollView, View } from 'react-native';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import navigator from '../../../../Navigation/NavigationService';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { useBillContext } from './Context';
import { SectionRow, SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import DateSelectorModal from '../../../../Components/Modal/Selectors/DateSelectorModal';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import EmptyListView from '../../../../Components/Layouts/View/EmptyListView';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import NormalButton from '../../../../Components/Ui/Button/NormalButton';
import { formatNumberForUI, roundToDecimal, sliceString } from '../../../../Utils/functionTools';
import { useAppStorage } from '../../../../Contexts/AppStorageProvider';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import { CreateInvoiceData, CreateInvoiceWithTAXData } from '../../../../Utils/types';
import { useAppDispatch, useUserStore } from '../../../../Store/ReduxStore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { createInvoice, createInvoiceWithTAX, getInvoiceCounter } from '../../../../Services/invoice';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { ProductInfoUpdateModal, ProductSelectorModal, CustomerSelectorModal, BillNoEditorModal, AdditionDetailModal } from './Modals';
import useBinaryAnimateValue from '../../../../Hooks/useBinaryAnimateValue';
import { useAlert } from '../../../../Components/Ui/Alert/AlertProvider';

export function Header() {

    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { type: billType } = router.params;

    const { secondaryBackgroundColor } = useTheme();

    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingHorizontal: 20, paddingBlock: 10,
        }} >
            <AnimateButton
                onPress={() => navigator.goBack()}
                style={{ borderWidth: 2, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 44, aspectRatio: 1, borderColor: secondaryBackgroundColor }}
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
    );
}



export function ProgressBar(): React.JSX.Element {

    const { secondaryBackgroundColor } = useTheme();
    const { progress } = useBillContext();

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <TextTheme style={{ fontSize: 12, fontWeight: '600' }} isPrimary={false}>
                    Progress
                </TextTheme>
                <TextTheme style={{ fontSize: 12, fontWeight: '600' }} isPrimary={false}>
                    {Math.round(progress * 100)}%
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
                        width: `${progress * 100}%`,
                    }}
                />
            </View>
        </View>
    );
}



export function BillNoSelector() {

    const { billNo, setBillNo } = useBillContext();
    const dispatch = useAppDispatch();
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { type: billType } = router.params;
    const { current_company_id } = useUserStore();
    const { secondaryBackgroundColor } = useTheme();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getInvoiceCounter({
            company_id: current_company_id || '',
            voucher_type: billType,
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                setBillNo(response.payload.current_number);
            }
        }).catch((error) => {
            console.error('Error fetching customers:', error);
            // toast.error(error || "An unexpected error occurred. Please try again later.");
        });
    }, [dispatch, current_company_id, billType]);

    return (
        <>
            <AnimateButton style={{
                padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', borderColor: secondaryBackgroundColor, gap: 12, alignItems: 'center', backgroundColor: billNo ? 'rgba(60, 180, 120, 0.5)' : secondaryBackgroundColor,
            }}
                onPress={() => {
                    if (
                        billType === 'Purchase'
                    ) { setModalVisible(true); }
                }}
            >
                <BackgroundThemeView
                    style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                >
                    <FeatherIcon name="hash" size={16} />
                </BackgroundThemeView>

                <View style={{ flex: 1 }}  >
                    <TextTheme fontSize={13} fontWeight={700}>
                        Bill No
                    </TextTheme>
                    <TextTheme isPrimary={false} fontSize={12} fontWeight={500}>
                        {billNo || 'Auto-generated'}
                    </TextTheme>
                </View>
            </AnimateButton>
            <BillNoEditorModal
                visible={isModalVisible}
                setVisible={setModalVisible}
            />
        </>
    );
}



export function DateSelector() {

    const { createOn, setCreateOn } = useBillContext();
    const { secondaryBackgroundColor } = useTheme();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <AnimateButton
            style={{
                padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', borderColor: secondaryBackgroundColor, gap: 12, alignItems: 'center',
                backgroundColor: createOn ? 'rgba(60, 180, 120, 0.5)' : secondaryBackgroundColor,
            }}

            bubbleScale={10}
            onPress={() => { setModalVisible(true); }}
        >
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
                <TextTheme fontSize={13} fontWeight={700}>
                    Date
                </TextTheme>
                <TextTheme isPrimary={false} fontSize={12} fontWeight={500}>
                    {createOn}
                </TextTheme>
            </View>
        </AnimateButton>

        <DateSelectorModal
            visible={isModalVisible} setVisible={setModalVisible}

            value={(() => {
                const [date, month, year] = createOn.split('/').map(Number);
                console.log('Split', createOn.split('/'));
                return { date, month: month - 1, year };
            })()}

            onSelect={({ year, month, date }) => {
                setCreateOn(`${date.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`);
            }}
        />
    </>);
}



export function CustomerSelector() {

    const { customer } = useBillContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <SectionRowWithIcon
            icon={<FeatherIcon name="user" size={20} />}
            label={customer?.name || 'Select Customer'}
            text={customer ? customer?.group ?? 'No Group' : 'Tab to select a customer'}
            backgroundColor={customer ? 'rgba(60,180,120, 0.5)' : ''}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            onPress={() => { setModalVisible(true); }}
        />

        <CustomerSelectorModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}



export function ProductSelector() {

    const { products } = useBillContext();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <SectionRowWithIcon
            icon={<FeatherIcon name="package" size={20} />}
            label="Add Items"
            text={products.length > 0 ? `${products.length} items added, tap to add more items` : 'Tap to add items'}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            backgroundColor={products.length > 0 ? 'rgba(60,180,120, 0.5)' : ''}
            onPress={() => { setModalVisible(true); }}
        />

        <ProductSelectorModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}


export function AdditionalDetailSelector() {

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (<>
        <SectionRowWithIcon
            icon={<FeatherIcon name="file" size={20} />}
            label={'Additional Details'}
            text={'Tap to add due date, payment_mode and more'}
            hasArrow={true}
            arrowIcon={<FeatherIcon name="chevron-right" size={20} />}
            onPress={() => { setModalVisible(true); }}
        />

        <AdditionDetailModal visible={isModalVisible} setVisible={setModalVisible} />
    </>);
}


export function ProductListing() {

    const { currency } = useAppStorage();
    const { products, setProducts } = useBillContext();
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;


    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const [productIndex, setProductIndex] = useState<number>(-1);

    return (<>
        <FlatList
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
            ListEmptyComponent={<EmptyListView title="No Items Added" text="Add items for the bill" />}

            ListHeaderComponent={<ShowWhen when={products.length !== 0}>
                <TextTheme fontSize={16} fontWeight={800} style={{ marginBottom: 0 }} >Items</TextTheme>
            </ShowWhen>}

            ListFooterComponent={<ShowWhen when={products.length !== 0} >
                <NormalButton
                    backgroundColor="rgb(50,120,200)" color="white"
                    text="+ Add More"
                    icon={<FeatherIcon color="white" name="package" size={16} />}
                    onPress={() => { setModalVisible(true); }}
                />
            </ShowWhen>}

            data={products}
            keyExtractor={(item, index) => `${item.item_id}-${index}`}
            renderItem={({ item, index }) => (
                <SectionRow
                    style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0, position: 'relative' }}
                    onPress={() => {
                        setUpdateModalVisible(true);
                        setProductIndex(index);
                    }}
                >
                    <View>
                        <TextTheme fontSize={15} fontWeight={700}>
                            {sliceString(item.item, 30)}
                        </TextTheme>
                        <TextTheme fontSize={12} fontWeight={500}>
                            {item.hsn_code} ({item.unit})
                        </TextTheme>
                    </View>

                    <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 8 }} >
                        <View >
                            <TextTheme fontSize={12} fontWeight={600} style={{ marginBottom: 1 }}>
                                QTY
                            </TextTheme>
                            <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                {item.quantity}
                            </TextTheme>
                        </View>
                        <TextTheme fontWeight={900} fontSize={16} >
                            *
                        </TextTheme>
                        <View >
                            <TextTheme fontSize={12} fontWeight={600} style={{ marginBottom: 1 }}>
                                Rate
                            </TextTheme>
                            <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                {formatNumberForUI(item.rate)}
                            </TextTheme>
                        </View>
                        <TextTheme fontWeight={900} fontSize={16} >
                            -
                        </TextTheme>
                        <View >
                            <TextTheme fontSize={12} fontWeight={600} style={{ marginBottom: 1 }}>
                                Disc.
                            </TextTheme>
                            <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                {formatNumberForUI(item.discount_amount)}
                            </TextTheme>
                        </View>
                        {tax_enable && <TextTheme fontWeight={900} fontSize={16} >
                            +
                        </TextTheme>}
                        {tax_enable && <View >
                            <TextTheme fontSize={12} fontWeight={600} style={{ marginBottom: 1 }}>
                                Taxes
                            </TextTheme>
                            <TextTheme isPrimary={false} style={{ fontSize: 14, fontWeight: '500' }}>
                                {formatNumberForUI(item.tax_amount)}
                            </TextTheme>
                        </View>}
                        <TextTheme fontWeight={900} fontSize={16} >
                            =
                        </TextTheme>
                        <View>
                            <TextTheme fontSize={12} fontWeight={600} style={{ marginBottom: 1 }}>
                                Total
                            </TextTheme>
                            <TextTheme fontWeight={700} fontSize={14} style={{ color: '#4CAF50' }}>
                                {formatNumberForUI(item.total_amount)} {currency}
                            </TextTheme>
                        </View>
                    </View>

                    <View style={{ position: 'absolute', top: -6, right: -6 }} >
                        <AnimateButton
                            style={{ backgroundColor: 'rgb(250,50,100)', borderRadius: 8, paddingInline: 12, flexDirection: 'row', gap: 12, alignItems: 'center', height: 32 }}
                            onPress={() => {
                                setProducts((prev) => prev.filter((_, i) => i !== index));
                            }}
                        >
                            <FeatherIcon name="trash-2" size={16} color="white" />
                        </AnimateButton>
                    </View>
                </SectionRow>
            )}
        />

        <ProductSelectorModal visible={isModalVisible} setVisible={setModalVisible} />
        <ProductInfoUpdateModal visible={isUpdateModalVisible} setVisible={setUpdateModalVisible} editProductIndex={productIndex} />
    </>);
}



export function AmountBox(): React.JSX.Element {


    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { type: billType, id: billId } = router.params;
    const { setAlert } = useAlert();

    const dispatch = useAppDispatch();
    const { currency } = useAppStorage();
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;
    const { total, total_amount, total_tax, discount, roundoff, grandTotal, additionalDetails, products, progress, createOn, billNo, customer, resetAllStates } = useBillContext();

    const [isCreating, setCreating] = useState<boolean>(false);

    async function handleInvoice() {
        if (isCreating) { return; }// Prevent multiple submissions
        if (products.length === 0) {
            setAlert({
                type: 'warning',
                message: 'Please add at least one product to create the bill.',
            });
            console.warn('No products added');
            return; // Prevent submission if no products are added
        }
        if (!createOn) {
            setAlert({
                type: 'warning',
                message: 'Please select a date to create the bill.',
            });
            console.warn('Create date is not set');
            return; // Prevent submission if create date is not set
        }
        if (!customer) {
            setAlert({
                type: 'warning',
                message: 'Please select a customer to create the bill.',
            });
            console.warn('Customer is not selected');
            return; // Prevent submission if customer is not selected
        }
        if (!billNo) {
            setAlert({
                type: 'warning',
                message: 'Please enter a bill number to create the bill.',
            });
            console.warn('Bill number is not set');
            return; // Prevent submission if bill number is not set
        }


        setCreating(true);

        try {
            if (tax_enable) {
                let dataToSend: CreateInvoiceWithTAXData = {
                    company_id: current_company_id ?? '',
                    date: createOn.split('/').reverse().join('-'),
                    voucher_number: billNo,
                    voucher_type: billType,
                    voucher_type_id: billId,
                    party_name: customer?.name ?? '',
                    party_name_id: customer?.id ?? '',
                    reference_date: '',
                    place_of_supply: '',
                    reference_number: '',
                    due_date: additionalDetails.dueDate.split('/').reverse().join('-'),
                    mode_of_transport: additionalDetails.transportMode,
                    vehicle_number: additionalDetails.vechicleNumber,
                    narration: additionalDetails.note,
                    payment_mode: '',
                    paid_amount: roundToDecimal(Number(additionalDetails.payAmount), 2),
                    total: roundToDecimal(total, 2),
                    total_amount: roundToDecimal(total_amount, 2),
                    discount: roundToDecimal(discount, 2),
                    total_tax: roundToDecimal(total_tax, 2),
                    additional_charge: roundToDecimal(additionalDetails.additional_charge, 2),
                    roundoff: roundToDecimal(roundoff, 2),
                    grand_total: roundToDecimal(grandTotal, 2),
                    items: products.map(pro => ({
                        vouchar_id: '',
                        item: pro.item,
                        item_id: pro.item_id,
                        hsn_code: pro.hsn_code,
                        quantity: pro.quantity,
                        rate: roundToDecimal(pro.rate, 2),
                        amount: roundToDecimal(pro.amount, 2),
                        discount_amount: roundToDecimal(pro.discount_amount, 2),
                        tax_rate: pro.tax_rate,
                        tax_amount: roundToDecimal(pro.tax_amount, 2),
                        total_amount: roundToDecimal(pro.total_amount, 2),
                        godown: '',
                        godown_id: '',
                    })),
                    accounting: [
                        { amount: billType === 'Sales' ? roundToDecimal(-grandTotal, 2) : roundToDecimal(grandTotal, 2), ledger: customer?.name ?? '', ledger_id: customer?.id ?? '', vouchar_id: '' },
                        { amount: billType === 'Sales' ? roundToDecimal(grandTotal, 2) : roundToDecimal(-grandTotal, 2), ledger: billType, ledger_id: billId ?? '', vouchar_id: '' },
                    ],
                };

                console.log('Data to send:', dataToSend);

                dispatch(createInvoiceWithTAX(dataToSend)).then(() => {
                    resetAllStates();
                    navigator.goBack();
                    setCreating(false);
                }).catch((error) => {
                    resetAllStates();
                    console.error('Error creating invoice:', error);
                    setCreating(false);
                });
            }
            else {
                let dataToSend: CreateInvoiceData = {
                    company_id: current_company_id ?? '',
                    date: createOn.split('/').reverse().join('-'),
                    voucher_number: billNo,
                    voucher_type: billType,
                    voucher_type_id: billId,
                    party_name: customer?.name ?? '',
                    party_name_id: customer?.id ?? '',
                    reference_date: '',
                    place_of_supply: '',
                    reference_number: '',
                    due_date: additionalDetails.dueDate.split('/').reverse().join('-'),
                    mode_of_transport: additionalDetails.transportMode,
                    vehicle_number: additionalDetails.vechicleNumber,
                    narration: additionalDetails.note,
                    payment_mode: '',
                    paid_amount: roundToDecimal(Number(additionalDetails.payAmount), 2),
                    total: roundToDecimal(total, 2),
                    total_amount: roundToDecimal(total_amount, 2),
                    discount: roundToDecimal(discount, 2),
                    additional_charge: roundToDecimal(additionalDetails.additional_charge, 2),
                    roundoff: roundToDecimal(roundoff, 2),
                    grand_total: roundToDecimal(grandTotal, 2),
                    items: products.map(pro => ({
                        item: pro.item,
                        item_id: pro.item_id,
                        hsn_code: pro.hsn_code,
                        unit: pro.unit,
                        quantity: pro.quantity,
                        rate: roundToDecimal(pro.rate, 2),
                        amount: roundToDecimal(pro.amount, 2),
                        discount_amount: roundToDecimal(pro.discount_amount, 2),
                        // tax_rate: pro.tax_rate,
                        // tax_amount: pro.tax_amount,
                        total_amount: roundToDecimal(pro.total_amount, 2),
                        vouchar_id: '',
                        godown: '',
                        godown_id: '',
                    })),
                    accounting: [
                        { amount: billType === 'Sales' ? roundToDecimal(-grandTotal, 2) : roundToDecimal(grandTotal, 2), ledger: customer?.name ?? '', ledger_id: customer?.id ?? '', vouchar_id: '' },
                        { amount: billType === 'Sales' ? roundToDecimal(grandTotal, 2) : roundToDecimal(-grandTotal, 2), ledger: billType, ledger_id: billId ?? '', vouchar_id: '' },
                    ],
                };

                dispatch(createInvoice(dataToSend)).then(() => {
                    resetAllStates();
                    navigator.goBack();
                    setCreating(false);
                }).catch((error) => {
                    resetAllStates();
                    console.error('Error creating invoice:', error);
                    setCreating(false);
                });
            }

        } catch (error) {
            setCreating(false);
            console.error('Error creating invoice:', error);
        }
    }

    return (
        <ShowWhen when={Math.floor(progress) === 1 || true} >
            <BackgroundThemeView
                style={{ padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, gap: 12, borderColor: 'gray', borderWidth: 2, borderBottomWidth: 0 }}
            >

                <SectionRow style={{ justifyContent: 'space-between' }} >
                    <View>
                        <TextTheme fontSize={12} fontWeight={900}>
                            Total Bill
                        </TextTheme>

                        <TextTheme fontWeight={900} fontSize={18}>
                            {formatNumberForUI(grandTotal)} {currency}
                        </TextTheme>
                    </View>

                    <View>
                        <TextTheme fontSize={12} fontWeight={900}>
                            Paid Amount
                        </TextTheme>

                        <TextTheme fontWeight={900} fontSize={18}>
                            {formatNumberForUI(additionalDetails.payAmount)} {currency}
                        </TextTheme>
                    </View>

                    <View style={{ alignItems: 'flex-end' }} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme fontWeight={900} fontSize={18}>
                                {products.length}
                            </TextTheme>
                            <FeatherIcon name="package" size={18} />
                        </View>

                        <TextTheme fontSize={12} fontWeight={900}>
                            Total Items
                        </TextTheme>
                    </View>
                </SectionRow>

                <AllAmountsInfo />

                <NormalButton
                    text="Create Bill"
                    isPrimary={true}
                    color="white"
                    backgroundColor="rgb(50,200,150)"
                    isLoading={isCreating}
                    onLoadingText="Creating..."
                    onPress={handleInvoice}
                />
            </BackgroundThemeView>

            <LoadingModal visible={isCreating} />
        </ShowWhen>
    );
}



function AllAmountsInfo() {
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;

    const animate0to1 = useBinaryAnimateValue({ value: 0, duration: 500, useNativeDriver: false });
    const { total, total_tax, discount, roundoff, grandTotal, additionalDetails } = useBillContext();
    const totals = tax_enable ? [
        ['Sub Total', formatNumberForUI(total)],
        ['Total Discount', formatNumberForUI(discount)],
        ['Total Tax', formatNumberForUI(total_tax)],
        ['Additional Charge', formatNumberForUI(additionalDetails.additional_charge)],
        ['Round Off', formatNumberForUI(roundoff)],
        ['Grand Total', formatNumberForUI(grandTotal)],
    ] : [
        ['Sub Total', formatNumberForUI(total)],
        ['Total Discount', formatNumberForUI(discount)],
        ['Additional Charge', formatNumberForUI(additionalDetails.additional_charge)],
        ['Round Off', formatNumberForUI(roundoff)],
        ['Grand Total', formatNumberForUI(grandTotal)],
    ];

    return (
        <BackgroundThemeView isPrimary={false} style={{ padding: 8, borderRadius: 12 }}>
            <Pressable
                onPress={() => { animate0to1.valueRef.current ? animate0to1.animateTo0() : animate0to1.animateTo1(); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}
            >
                <TextTheme fontSize={14} fontWeight={600} style={{ paddingLeft: 4 }} >All Amounts Info</TextTheme>

                <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
                >
                    <TextTheme fontSize={14} fontWeight={600} style={{ paddingLeft: 4 }} >
                        {animate0to1.valueState ? 'Hide' : 'Show'}
                    </TextTheme>

                    <Animated.View style={{
                        transform: [{
                            rotate: animate0to1.value.interpolate({
                                inputRange: [0, 1], outputRange: ['0deg', '180deg'],
                            }),
                        }],
                    }} >
                        <FeatherIcon name="chevron-down" size={14} />
                    </Animated.View>
                </View>
            </Pressable>

            <ScrollView
                contentContainerStyle={{
                    width: '100%', gap: 4, maxHeight: 320,
                    marginTop: animate0to1.valueState || animate0to1.isAnimationRuning.state ? 12 : 0,
                }}
            >
                {
                    totals.map(([field, val]) => (
                        <Animated.View key={field} style={{ opacity: animate0to1.value, display: animate0to1.valueState || animate0to1.isAnimationRuning.state ? 'flex' : 'none' }} >
                            <BackgroundThemeView isPrimary={true} style={{ padding: 8, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }} >
                                <TextTheme isPrimary={false} fontWeight={600} >{field}</TextTheme>
                                <TextTheme fontWeight={600} >{val}</TextTheme>
                            </BackgroundThemeView>
                        </Animated.View>
                    ))
                }
            </ScrollView>
        </BackgroundThemeView>
    );
}

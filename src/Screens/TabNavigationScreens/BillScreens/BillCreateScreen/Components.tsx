/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
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
import { CreateInvoiceData, CreateInvoiceWithGSTData } from '../../../../Utils/types';
import { useAppDispatch, useCompanyStore, useUserStore } from '../../../../Store/ReduxStore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { createInvoice, createInvoiceWithGST, getInvoiceCounter } from '../../../../Services/invoice';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import CustomerSelectorModal, { ProductSelectorModal } from './Modals';

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
    const { user } = useUserStore();
    const { secondaryBackgroundColor } = useTheme();

    useEffect(() => {
        dispatch(getInvoiceCounter({
            company_id: user.user_settings.current_company_id || '',
            voucher_type: billType,
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                setBillNo(response.payload.current_number);
            }
        }
        ).catch((error) => {
            console.error('Error fetching customers:', error);
            // toast.error(error || "An unexpected error occurred. Please try again later.");
        });
    }, [dispatch, user.user_settings.current_company_id, billType]);

    return (
        <AnimateButton style={{
            padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', borderColor: secondaryBackgroundColor, gap: 12, alignItems: 'center', backgroundColor: billNo ? 'rgba(60, 180, 120, 0.5)' : secondaryBackgroundColor,
        }}>
            <BackgroundThemeView
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
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
                <TextTheme style={{ fontSize: 14, fontWeight: '900', marginBottom: 2 }}>
                    Date
                </TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 13, fontWeight: '500' }}>
                    {createOn}
                </TextTheme>
            </View>
        </AnimateButton>

        <DateSelectorModal
            visible={isModalVisible} setVisible={setModalVisible}

            value={(() => {
                const [date, month, year] = createOn.split('/').map(Number);
                return { date, month: month - 1, year };
            })()}

            onSelect={({ year, month, date }) => {
                setCreateOn(`${date}/${(month + 1).toString().padStart(2, '0')}/${year}`);
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



export function ProductListing() {

    const { currency } = useAppStorage();
    const { products, setProducts } = useBillContext();

    return (
        <FlatList
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
            ListEmptyComponent={<EmptyListView title="No Items Added" text="Add items for the bill" />}

            ListHeaderComponent={<ShowWhen when={products.length !== 0}>
                <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }} >Items</TextTheme>
            </ShowWhen>}

            ListFooterComponent={<ShowWhen when={products.length !== 0} >
                <NormalButton
                    backgroundColor="rgb(50,120,200)" color="white"
                    text="+ Add Product"
                    icon={<FeatherIcon color="white" name="package" size={16} />}
                    onPress={() => { }}
                />
            </ShowWhen>}

            data={products}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <SectionRow onPress={() => { }} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12, position: 'relative' }} >
                    <View>
                        <TextTheme style={{ fontWeight: '700', fontSize: 16 }}>
                            {sliceString(item.name, 34)}
                        </TextTheme>
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
                                {formatNumberForUI(item.price)} {currency}
                            </TextTheme>
                        </View>
                        <View>
                            <TextTheme style={{ fontSize: 12, fontWeight: '600', marginBottom: 2 }}>
                                Sub Total
                            </TextTheme>
                            <TextTheme style={{ fontSize: 14, fontWeight: '700', color: '#4CAF50' }}>
                                {formatNumberForUI(item.price * item.quantity)} {currency}
                            </TextTheme>
                        </View>
                    </View>

                    <View style={{ position: 'absolute', top: -6, right: -6 }} >
                        <AnimateButton
                            style={{ backgroundColor: 'rgb(250,50,100)', borderRadius: 8, paddingInline: 12, flexDirection: 'row', gap: 12, alignItems: 'center', height: 32 }}
                            onPress={() => setProducts(pro => {
                                let temp = [...pro];
                                let index = pro.findIndex(e => e.id === item.id);
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
    );
}



export function AmountBox(): React.JSX.Element {


    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { type: billType, id: billId } = router.params;

    const dispatch = useAppDispatch();
    const { currency } = useAppStorage();
    const { user } = useUserStore();
    const currentCompanyDetails = user.company.find((c: any) => c._id === user.user_settings.current_company_id);
    const gst_enabble: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const { company } = useCompanyStore();
    const { totalValue, products, progress, createOn, billNo, customer, resetAllStates } = useBillContext();

    const [isCreating, setCreating] = useState<boolean>(false);

    async function handleInvoice() {

        setCreating(true);

        try {
            if (gst_enabble) {
                let dataToSend: CreateInvoiceWithGSTData = {
                    company_id: company?._id ?? '',
                    date: createOn.split('/').reverse().join('-'),
                    voucher_number: billNo,
                    voucher_type: billType,
                    voucher_type_id: billId,
                    reference_date: '',
                    narration: '',
                    place_of_supply: '',
                    reference_number: '',
                    due_date: '',
                    mode_of_transport: '',
                    status: '',
                    vehicle_number: '',
                    party_name: customer?.name ?? '',
                    party_name_id: customer?.id ?? '',
                    items: products.map(pro => ({
                        vouchar_id: '',
                        item_id: pro.id,
                        quantity: pro.quantity,
                        rate: pro.price,
                        item: pro.name,
                        amount: roundToDecimal(pro.price * pro.quantity, 2),
                        gst_rate: pro.gstRate,
                        gst_amount: roundToDecimal((Number(pro.gstRate) * pro.quantity * pro.price / 100), 2),
                        hsn_code: pro.hsnCode,
                        additional_amount: 0,
                        discount_amount: 0,
                        godown: '',
                        godown_id: '',
                        order_number: '',
                        order_due_date: '',
                    })),
                    accounting: [
                        { amount: billType === 'Sales' ? roundToDecimal(-totalValue, 2) : roundToDecimal(totalValue, 2), ledger: customer?.name ?? '', ledger_id: customer?.id ?? '', vouchar_id: '' },
                        { amount: billType === 'Sales' ? roundToDecimal(totalValue, 2) : roundToDecimal(-totalValue, 2), ledger: billType, ledger_id: billId ?? '', vouchar_id: '' },
                    ],
                };

                console.log('Data to send:', dataToSend);

                dispatch(createInvoiceWithGST(dataToSend)).then(() => {
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
                    company_id: company?._id ?? '',
                    date: createOn.split('/').reverse().join('-'),
                    voucher_number: billNo,
                    voucher_type: billType,
                    voucher_type_id: billId,
                    reference_date: '',
                    narration: '',
                    place_of_supply: '',
                    reference_number: '',
                    due_date: '',
                    mode_of_transport: '',
                    status: '',
                    vehicle_number: '',
                    party_name: customer?.name ?? '',
                    party_name_id: customer?.id ?? '',
                    items: products.map(pro => ({
                        item_id: pro.id,
                        quantity: pro.quantity,
                        rate: pro.price,
                        vouchar_id: '',
                        item: pro.name,
                        amount: roundToDecimal(pro.price * pro.quantity, 2),
                    })),
                    accounting: [
                        { amount: billType === 'Sales' ? roundToDecimal(-totalValue, 2) : roundToDecimal(totalValue, 2), ledger: customer?.name ?? '', ledger_id: customer?.id ?? '', vouchar_id: '' },
                        { amount: billType === 'Sales' ? roundToDecimal(totalValue, 2) : roundToDecimal(-totalValue, 2), ledger: billType, ledger_id: billId ?? '', vouchar_id: '' },
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
        <ShowWhen when={Math.floor(progress) === 1} >
            <BackgroundThemeView
                style={{ padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, gap: 12, borderColor: 'gray', borderWidth: 2, borderBottomWidth: 0 }}
            >

                <SectionRow style={{ justifyContent: 'space-between' }} >
                    <View>
                        <TextTheme style={{ fontSize: 12, fontWeight: 900 }} >
                            Total Bill
                        </TextTheme>

                        <TextTheme style={{ fontWeight: 900, fontSize: 20 }} >
                            {formatNumberForUI(totalValue, 10)} {currency}
                        </TextTheme>
                    </View>

                    <View style={{ alignItems: 'flex-end' }} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme style={{ fontWeight: 900, fontSize: 20 }} >
                                {products.length}
                            </TextTheme>
                            <FeatherIcon name="package" size={20} />
                        </View>

                        <TextTheme style={{ fontSize: 12, fontWeight: 900 }} >
                            Total Items
                        </TextTheme>
                    </View>
                </SectionRow>

                <NormalButton
                    text="Create Bill"
                    isPrimary={true}
                    color="white"
                    backgroundColor="rgb(50,200,150)"
                    textStyle={{ fontWeight: 900 }}
                    isLoading={isCreating}
                    onLoadingText="Creating..."
                    onPress={handleInvoice}
                />
            </BackgroundThemeView>

            <LoadingModal visible={isCreating} />
        </ShowWhen>
    );
}

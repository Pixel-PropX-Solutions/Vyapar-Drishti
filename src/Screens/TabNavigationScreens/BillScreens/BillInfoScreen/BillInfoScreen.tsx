/* eslint-disable react-native/no-inline-styles */
import { Animated, Pressable, ScrollView, View } from 'react-native';
import EntityInfoHeader from '../../../../Components/Layouts/Header/EntityInfoHeader';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import SectionView, { SectionRow } from '../../../../Components/Layouts/View/SectionView';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import NormalButton from '../../../../Components/Ui/Button/NormalButton';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { useAppDispatch, useInvoiceStore, useUserStore } from '../../../../Store/ReduxStore';
import { deleteTAXInvoice, deleteInvoice, getTAXInvoicesPDF, getInvoicesPDF, getPaymentPDF, getRecieptPDF, viewInvoice } from '../../../../Services/invoice';
import { useCallback, useState } from 'react';
import { formatDate, formatNumberForUI } from '../../../../Utils/functionTools';
import usePDFHandler from '../../../../Hooks/usePDFHandler';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import navigator from '../../../../Navigation/NavigationService';
import { useAlert } from '../../../../Components/Ui/Alert/AlertProvider';
import { useAppStorage } from '../../../../Contexts/AppStorageProvider';
import useBinaryAnimateValue from '../../../../Hooks/useBinaryAnimateValue';
import { useTheme } from '../../../../Contexts/ThemeProvider';

export default function BillInfoScreen(): React.JSX.Element {
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { id: invoiceId } = router.params;
    const dispatch = useAppDispatch();
    const { secondaryColor } = useTheme();
    const { currency } = useAppStorage();
    const animate0to1 = useBinaryAnimateValue({ value: 0, duration: 500, useNativeDriver: false });
    const { setAlert } = useAlert();
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;
    const { invoiceData } = useInvoiceStore();

    const [isPDFModalVisible, setPDFModalVisible] = useState<boolean>(false);
    const { init, isGenerating, setIsGenerating, PDFViewModal, handleShare } = usePDFHandler();

    async function handleInvoice(invoice: any, callback: () => void) {

        if (!['Sales', 'Purchase'].includes(invoice.voucher_type)) { return; }

        try {
            setIsGenerating(true);

            const res = await dispatch((invoice.voucher_type === 'Payment' ? getPaymentPDF :
                invoice.voucher_type === 'Receipt' ? getRecieptPDF :
                    tax_enable ? getTAXInvoicesPDF : getInvoicesPDF)({
                        vouchar_id: invoice._id,
                        company_id: current_company_id || '',
                    }));

            if ((invoice.voucher_type === 'Payment' ? getPaymentPDF :
                invoice.voucher_type === 'Receipt' ? getRecieptPDF :
                    tax_enable ? getTAXInvoicesPDF : getInvoicesPDF).fulfilled.match(res)) {

                const { filePath } = res.payload as {
                    filePath: string;
                    rawBase64: string;
                };

                if (!filePath) {
                    console.error('No filePath returned from PDF API');
                    setAlert({
                        type: 'error',
                        message: 'Failed to generate PDF. Please try again later.',
                        duration: 1000,
                    });
                    return;
                }
                init(
                    {
                        filePath: filePath,
                        entityNumber: invoice.voucher_number,
                        customer: invoice.party_name,
                        fileName: `${invoice.voucher_number}-vyapar-drishti`,
                        cardTitle: invoice.voucher_type === 'Payment' ? 'View or Share Payment' :
                            invoice.voucher_type === 'Receipt' ? 'View or Share Receipt' : 'View or Share Invoice',
                    },
                    callback
                );
            }
            else {
                console.error('Failed to print invoice:', res.payload);
                setAlert({
                    type: 'error',
                    message: (res.payload as any) || 'Failed to generate PDF. Please try again later.',
                    duration: 1000,
                });
                return;
            }
        } catch (e) {
            console.error('Error printing invoice:', e);
            setAlert({
                type: 'error',
                message: 'An unexpected error occurred. Please try again later.',
                duration: 1000,
            });
        } finally {
            setIsGenerating(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            dispatch(viewInvoice({ vouchar_id: invoiceId, company_id: current_company_id || '' }));
        }, [])
    );

    const handleDeleteInvoice = (_id: string) => {
        if (tax_enable) {
            dispatch(deleteTAXInvoice({ vouchar_id: _id, company_id: current_company_id || '' })).unwrap().then(() => {
                navigator.goBack();
                setAlert({
                    type: 'success',
                    message: 'Invoice deleted successfully!',
                    duration: 1000,
                });
            }).catch((error) => {
                setAlert({
                    type: 'error',
                    message: error || 'An unexpected error occurred. Please try again later.',
                    duration: 1000,
                });
            });
        } else {
            dispatch(deleteInvoice({ vouchar_id: _id, company_id: current_company_id || '' })).unwrap().then(() => {
                setAlert({
                    type: 'success',
                    message: 'Invoice deleted successfully!',
                    duration: 1000,
                });
                navigator.goBack();
            }).catch((error) => {
                setAlert({
                    type: 'error',
                    message: error || 'An unexpected error occurred. Please try again later.',
                    duration: 1000,
                });
            });
        }
    };

    if (!invoiceData) {
        return (
            <LoadingModal visible={true} />
        );
    }

    const totals = tax_enable ? [
        ['Sub Total', (invoiceData.total).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Total Discount', (invoiceData.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Total Tax', (invoiceData.total_tax).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Additional Charge', (invoiceData.additional_charge).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Round Off', (invoiceData.roundoff).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Grand Total', (invoiceData.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })],
    ] : [
        ['Sub Total', (invoiceData.total).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Total Discount', (invoiceData.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Additional Charge', (invoiceData.additional_charge).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Round Off', (invoiceData.roundoff).toLocaleString(undefined, { minimumFractionDigits: 2 })],
        ['Grand Total', (invoiceData.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })],
    ];

    return (
        <View style={{ gap: 12, height: '100%' }} >
            <View style={{ flex: 1, marginTop: 12 }} >
                <EntityInfoHeader
                    onPressDelete={() => { handleDeleteInvoice(invoiceData._id); }}
                    onPressEdit={() => { navigator.navigate('edit-bill-screen', { id: invoiceData._id, type: invoiceData.voucher_type }); }}
                    invoiceNumber={invoiceData.voucher_number}
                />

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }} >
                    <TextTheme fontSize={22} fontWeight={900} style={{ marginTop: 10 }}>Invoice Details</TextTheme>

                    <SectionView label="Info" labelMargin={4}>
                        <SectionRow style={{ flexDirection: 'column', width: '100%', justifyContent: 'space-between', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <View>
                                    <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Bill number</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{invoiceData?.voucher_number}</TextTheme>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextTheme fontSize={14} fontWeight={900}>{formatDate(invoiceData?.date)}</TextTheme>
                                    <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Billing Date</TextTheme>
                                </View>

                            </View>
                        </SectionRow>
                    </SectionView>

                    <SectionView label="To" labelMargin={4} >
                        <SectionRow >
                            <View style={{ flex: 1, gap: 12 }} >
                                <View  >
                                    <TextTheme fontSize={14} fontWeight={900}>{invoiceData.party_name}</TextTheme>
                                    <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>{invoiceData.party_details.parent}</TextTheme>
                                </View>

                                <View style={{ gap: 4 }}>
                                    {invoiceData.party_details.phone.number && <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }} >
                                        <FeatherIcon isPrimary={false} name="phone" size={12} />
                                        <TextTheme isPrimary={false} fontSize={12}>{invoiceData.party_details.phone.code} {invoiceData.party_details.phone.number}</TextTheme>
                                    </View>}

                                    {invoiceData.party_details.email && <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }} >
                                        <FeatherIcon isPrimary={false} name="mail" size={12} />
                                        <TextTheme isPrimary={false} fontSize={12} fontWeight={900}>{invoiceData.party_details.email}</TextTheme>
                                    </View>}

                                    {(invoiceData.party_details.mailing_address || invoiceData.party_details.mailing_state) && <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }} >
                                        <FeatherIcon isPrimary={false} name="map-pin" size={12} />
                                        <TextTheme isPrimary={false} fontSize={12} fontWeight={900}>{invoiceData.party_details.mailing_address ?? invoiceData.party_details.mailing_state}</TextTheme>
                                    </View>}
                                </View>
                            </View>
                        </SectionRow>
                    </SectionView>

                    <SectionView label="Items" labelMargin={4} style={{ gap: 12 }} >
                        {
                            invoiceData.inventory.map(item => (
                                <BackgroundThemeView key={item._id} isPrimary={false} style={{ padding: 12, borderRadius: 8, gap: 8 }} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                        <View>
                                            <TextTheme fontSize={14} fontWeight={900} style={{ flexWrap: 'wrap' }}>{item.item}</TextTheme>
                                            {tax_enable && <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>{item.hsn_code}</TextTheme>}
                                        </View>

                                        <View style={{ alignItems: 'flex-end' }} >
                                            <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Billed Units</TextTheme>
                                            <TextTheme fontSize={14} fontWeight={900}>{item.quantity} {item.unit ?? ''}</TextTheme>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

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
                                </BackgroundThemeView>
                            ))
                        }
                    </SectionView>

                    <SectionView label="Additional Info" labelMargin={4}>
                        <SectionRow style={{ flexDirection: 'column', width: '100%', justifyContent: 'space-between', alignItems: 'center' }} >
                            <View style={{ width: '100%', gap: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: secondaryColor }}>
                                    <TextTheme isPrimary={false} fontSize={14} fontWeight={900}>Due Date</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{formatDate(invoiceData?.due_date)}</TextTheme>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: secondaryColor }}>
                                    <TextTheme isPrimary={false} fontSize={14} fontWeight={900}>Amount Paid</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{formatNumberForUI(invoiceData?.paid_amount)}</TextTheme>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: secondaryColor }}>
                                    <TextTheme isPrimary={false} fontSize={14} fontWeight={900}>Payment Mode</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{invoiceData?.payment_mode || 'No Payment Mode'}</TextTheme>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: secondaryColor }}>
                                    <TextTheme isPrimary={false} fontSize={14} fontWeight={900}>Transport Mode</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{invoiceData?.mode_of_transport || 'No Transport Mode'}</TextTheme>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: secondaryColor }}>
                                    <TextTheme isPrimary={false} fontSize={14} fontWeight={900}>Vehicle Number</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{invoiceData?.vehicle_number || 'No Vehicle Number'}</TextTheme>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: secondaryColor }}>
                                    <TextTheme isPrimary={false} fontSize={14} fontWeight={900}>Notes</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{invoiceData?.narration || 'No Notes Added'}</TextTheme>
                                </View>

                            </View>
                        </SectionRow>
                    </SectionView>
                </ScrollView>
            </View>

            <BackgroundThemeView isPrimary={false} style={{ padding: 12, borderRadius: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderWidth: 2, gap: 4 }} >
                <BackgroundThemeView style={{ borderRadius: 8, borderWidth: 1, backgroundColor: '#f0f0f0', borderColor: '#d0d0d0' }}>
                    <SectionRow backgroundColor="transparent" style={{ justifyContent: 'space-between' }} >
                        <View>
                            <TextTheme fontSize={12} fontWeight={900}>
                                Total Bill
                            </TextTheme>

                            <TextTheme fontWeight={900} fontSize={18}>
                                {formatNumberForUI(invoiceData.grand_total)} {currency}
                            </TextTheme>
                        </View>

                        <View>
                            <TextTheme fontSize={12} fontWeight={900}>
                                Paid Amount
                            </TextTheme>

                            <TextTheme fontWeight={900} fontSize={18}>
                                {formatNumberForUI(invoiceData.paid_amount)} {currency}
                            </TextTheme>
                        </View>

                        <View style={{ alignItems: 'flex-end' }} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                                <TextTheme fontWeight={900} fontSize={18}>
                                    {invoiceData.inventory.length}
                                </TextTheme>
                                <FeatherIcon name="package" size={18} />
                            </View>

                            <TextTheme fontSize={12} fontWeight={900}>
                                Total Items
                            </TextTheme>
                        </View>
                    </SectionRow>
                </BackgroundThemeView>

                <BackgroundThemeView style={{ borderRadius: 8, borderWidth: 1, padding: 10, backgroundColor: '#f0f0f0', borderColor: '#d0d0d0' }}>
                    <Pressable
                        onPress={() => { animate0to1.valueRef.current ? animate0to1.animateTo0() : animate0to1.animateTo1(); }}
                        style={{
                            flexDirection: 'row', alignItems: 'center', gap: 12,
                            justifyContent: 'space-between',
                        }}
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
                </BackgroundThemeView>


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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }} >
                    <View style={{ flex: 1 }} >
                        <NormalButton
                            text="share"
                            color="white"
                            backgroundColor="rgb(50,150,200)"
                            icon={<FeatherIcon color="white" name="share-2" size={16} />}
                            onPress={() => handleInvoice(invoiceData, handleShare)}
                        />
                    </View>

                    <View style={{ flex: 1 }} >
                        <NormalButton
                            text="Print"
                            color="white"
                            backgroundColor="rgb(50,200,150)"
                            icon={<FeatherIcon color="white" name="printer" size={16} />}
                            onPress={() => { handleInvoice(invoiceData, () => { setPDFModalVisible(true); }); }}
                        />
                    </View>
                </View>
            </BackgroundThemeView>
            <PDFViewModal visible={isPDFModalVisible} setVisible={setPDFModalVisible} />
            <LoadingModal visible={isGenerating} />
        </View >
    );
}

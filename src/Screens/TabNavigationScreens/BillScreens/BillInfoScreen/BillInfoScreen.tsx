/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import EntityInfoHeader from '../../../../Components/Layouts/Header/EntityInfoHeader';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import SectionView, { SectionRow } from '../../../../Components/Layouts/View/SectionView';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import NormalButton from '../../../../Components/Ui/Button/NormalButton';
import { StackParamsList } from '../../../../Navigation/StackNavigation';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { useAppDispatch, useInvoiceStore, useUserStore } from '../../../../Store/ReduxStore';
import { deleteGSTInvoice, deleteInvoice, printGSTInvoices, printInvoices, viewInvoice } from '../../../../Services/invoice';
import { useCallback, useState } from 'react';
import { formatDate, roundToDecimal } from '../../../../Utils/functionTools';
import usePDFHandler from '../../../../Hooks/usePDFHandler';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { GetAllVouchars } from '../../../../Utils/types';
import navigator from '../../../../Navigation/NavigationService';
import { useAlert } from '../../../../Components/Ui/Alert/AlertProvider';

export default function BillInfoScreen(): React.JSX.Element {
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { id: invoiceId } = router.params;
    const dispatch = useAppDispatch();
    const { setAlert } = useAlert();
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst || false;
    const { invoiceData } = useInvoiceStore();
    const [isPDFModalVisible, setPDFModalVisible] = useState<boolean>(false);


    const { init, isGenerating, setIsGenerating, PDFViewModal, handleShare } = usePDFHandler();

    async function handleInvoice(invoice: any, callback: () => void) {

        if (!['Sales', 'Purchase'].includes(invoice.voucher_type)) { return; }

        try {
            setIsGenerating(true);

            const res = await dispatch((gst_enable ? printGSTInvoices : printInvoices)({
                vouchar_id: invoice._id,
                company_id: current_company_id || '',
            }));

            if (res.meta.requestStatus !== 'fulfilled') {
                console.error('Failed to print invoice:', res.payload);
                return;
            }

            const { paginated_data, download_data } = res.payload as { paginated_data: Array<{ html: string, page_number: number }>, download_data: string };

            init({ html: paginated_data.map(item => item.html), downloadHtml: download_data, pdfName: invoice.voucher_number, title: invoice.voucher_number }, callback);
        } catch (e) {
            console.error('Error printing invoice:', e);
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
        if (gst_enable) {
            dispatch(deleteGSTInvoice({ vouchar_id: _id, company_id: current_company_id || '' })).unwrap().then(() => {
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


    return (
        <View style={{ gap: 12, height: '100%' }} >
            <View style={{ flex: 1, marginTop: 12 }} >
                <EntityInfoHeader
                    onPressDelete={() => { handleDeleteInvoice(invoiceData._id); }}
                    onPressEdit={() => { }}
                    invoiceNumber={invoiceData.voucher_number}
                />

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }} >
                    <TextTheme fontSize={22} fontWeight={900} style={{ marginTop: 10 }}>Invoice Details</TextTheme>

                    <SectionView label="Info" labelMargin={4}>
                        <SectionRow style={{ justifyContent: 'space-between' }}>
                            <View>
                                <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Bill number</TextTheme>
                                <TextTheme fontSize={14} fontWeight={900}>{invoiceData?.voucher_number}</TextTheme>
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                                <TextTheme fontSize={14} fontWeight={900}>{formatDate(invoiceData?.date)}</TextTheme>
                                <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Create On</TextTheme>
                            </View>
                        </SectionRow>
                    </SectionView>

                    <SectionView label="To" labelMargin={4} >
                        <SectionRow >
                            <View style={{ flex: 1, gap: 12 }} >
                                <View >
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
                                            <TextTheme fontSize={14} fontWeight={900}>{item.item}</TextTheme>
                                            {item.hsn_code && <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>{item.hsn_code}</TextTheme>}
                                        </View>

                                        <View style={{ alignItems: 'flex-end' }} >
                                            <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Sell quantity</TextTheme>
                                            <TextTheme fontSize={14} fontWeight={900}>{item.quantity} Unit</TextTheme>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                        <View style={{ alignItems: 'flex-start' }} >
                                            <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Item Rate</TextTheme>
                                            <TextTheme fontSize={14} fontWeight={900}>{roundToDecimal(Number(item.rate), 2)} INR</TextTheme>
                                        </View>

                                        {gst_enable && <View style={{ alignItems: 'flex-start' }} >
                                            <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>GST Amount</TextTheme>
                                            <TextTheme fontSize={14} fontWeight={900}>{roundToDecimal(Number(item.gst_amount), 2)} INR</TextTheme>
                                        </View>}

                                        <View style={{ alignItems: 'flex-end' }} >
                                            <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Item Total</TextTheme>
                                            <TextTheme fontSize={14} fontWeight={900}>{roundToDecimal(Number(item.amount), 2)} INR</TextTheme>
                                        </View>
                                    </View>
                                </BackgroundThemeView>
                            ))
                        }
                    </SectionView>
                </ScrollView>
            </View>

            <BackgroundThemeView isPrimary={false} style={{ padding: 12, borderRadius: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderWidth: 2, gap: 4 }} >

                <SectionRow isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={16} fontWeight={900}>Sub Total</TextTheme>
                    <TextTheme fontWeight={900} fontSize={16}>{invoiceData.inventory.reduce((acc, item) => acc + item.amount, 0).toFixed(2)} {'INR'}</TextTheme>
                </SectionRow>

                {gst_enable && <SectionRow isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={16} fontWeight={900}>Tax</TextTheme>
                    <TextTheme fontWeight={900} fontSize={16}>{invoiceData.inventory.reduce((acc, item) => acc + (Number(item?.gst_amount) ?? 0), 0).toFixed(2)} {'INR'}</TextTheme>
                </SectionRow>}

                <SectionRow isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={16} fontWeight={900}>Grand Total</TextTheme>
                    <TextTheme fontWeight={900} fontSize={16}>{Math.abs(invoiceData.accounting_entries.find((acc) => acc.ledger_id === invoiceData.party_name_id)?.amount ?? 0)} {'INR'}</TextTheme>
                </SectionRow>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }} >
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

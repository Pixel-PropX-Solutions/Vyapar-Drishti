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
import { deleteTAXInvoice, deleteInvoice, printTAXInvoices, printInvoices, viewInvoice } from '../../../../Services/invoice';
import { useCallback, useState } from 'react';
import { formatDate, formatNumberForUI, roundToDecimal } from '../../../../Utils/functionTools';
import usePDFHandler from '../../../../Hooks/usePDFHandler';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { GetAllVouchars } from '../../../../Utils/types';
import navigator from '../../../../Navigation/NavigationService';
import { useAlert } from '../../../../Components/Ui/Alert/AlertProvider';
import { useAppStorage } from '../../../../Contexts/AppStorageProvider';

export default function BillInfoScreen(): React.JSX.Element {
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();
    const { id: invoiceId } = router.params;
    const dispatch = useAppDispatch();
    const { currency } = useAppStorage();

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

            const res = await dispatch((tax_enable ? printTAXInvoices : printInvoices)({
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
                        <SectionRow style={{ flexDirection: 'column', width: '100%', justifyContent: 'space-between', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <View>
                                    <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Bill number</TextTheme>
                                    <TextTheme fontSize={14} fontWeight={900}>{invoiceData?.voucher_number}</TextTheme>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextTheme fontSize={14} fontWeight={900}>{formatDate(invoiceData?.date)}</TextTheme>
                                    <TextTheme isPrimary={false} fontSize={10} fontWeight={900}>Create On</TextTheme>
                                </View>

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
                </ScrollView>
            </View>

            <BackgroundThemeView isPrimary={false} style={{ padding: 12, borderRadius: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderWidth: 2, gap: 4 }} >

                <SectionRow paddingVertical={8} isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={12} fontWeight={700}>Sub Total</TextTheme>
                    <TextTheme fontWeight={700} fontSize={12}>{formatNumberForUI(invoiceData.total)} {currency}</TextTheme>
                </SectionRow>

                <SectionRow paddingVertical={8} isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={12} fontWeight={700}>Total Discount</TextTheme>
                    <TextTheme fontWeight={700} fontSize={12}>{formatNumberForUI(invoiceData.discount)} {currency}</TextTheme>
                </SectionRow>

                <SectionRow paddingVertical={8} isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={12} fontWeight={700}>Total</TextTheme>
                    <TextTheme fontWeight={700} fontSize={12}>{formatNumberForUI(invoiceData.total_amount)} {currency}</TextTheme>
                </SectionRow>

                {tax_enable && <SectionRow paddingVertical={8} isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={12} fontWeight={700}>Total Tax</TextTheme>
                    <TextTheme fontWeight={700} fontSize={12}>{formatNumberForUI(invoiceData.total_tax)} {currency}</TextTheme>
                </SectionRow>}

                <SectionRow paddingVertical={8} isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={12} fontWeight={700}>Additional Charges</TextTheme>
                    <TextTheme fontWeight={700} fontSize={12}>{formatNumberForUI(invoiceData.additional_charge)} {currency}</TextTheme>
                </SectionRow>

                <SectionRow paddingVertical={8} isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={12} fontWeight={700}>Round off</TextTheme>
                    <TextTheme fontWeight={700} fontSize={12}>{roundToDecimal(invoiceData.roundoff, 2)} {currency}</TextTheme>
                </SectionRow>
                <SectionRow paddingVertical={8} isPrimary={true} style={{ justifyContent: 'space-between' }} >
                    <TextTheme fontSize={16} fontWeight={900}>Grand Total</TextTheme>
                    <TextTheme fontWeight={900} fontSize={16}>{formatNumberForUI(invoiceData.grand_total)} {currency}</TextTheme>
                </SectionRow>

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

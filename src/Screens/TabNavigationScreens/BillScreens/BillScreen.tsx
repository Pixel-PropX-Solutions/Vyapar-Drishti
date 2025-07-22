/* eslint-disable react-native/no-inline-styles */

import TextTheme from '../../../Components/Text/TextTheme';
import BackgroundThemeView from '../../../Components/View/BackgroundThemeView';
import { View, RefreshControl, Animated, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AnimateButton from '../../../Components/Button/AnimateButton';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import NormalButton from '../../../Components/Button/NormalButton';
import RoundedPlusButton from '../../../Components/Button/RoundedPlusButton';
import { useEffect, useState, useRef } from 'react';
import BottomModal from '../../../Components/Modal/BottomModal';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamsList } from '../../../Navigation/StackNavigation';
import TabNavigationScreenHeader from '../../../Components/Header/TabNavigationHeader';
import EmptyListView from '../../../Components/View/EmptyListView';
import { useAppDispatch, useCompanyStore, useInvoiceStore } from '../../../Store/ReduxStore';
import { printInvoices, viewAllInvoices } from '../../../Services/invoice';
import { FlatList } from 'react-native-gesture-handler';
import BillCard, { BillLoadingCard } from '../../../Components/Card/BillCard';
import ShowWhen from '../../../Components/Other/ShowWhen';
import { ProductLoadingCard } from '../../../Components/Card/ProductCard';
import { GetAllVouchars } from '../../../Utils/types';
// import { useWindowDimensions } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNPrint from 'react-native-print';
import LoadingModal from '../../../Components/Modal/LoadingModal';
import { useTheme } from '../../../Contexts/ThemeProvider';
import PDFRenderer from '../../../Components/View/PDFRenderer';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamsList } from '../../../Navigation/BottomTabNavigation';
import navigator from '../../../Navigation/NavigationService';


const dummyBillsType: { name: string; icon: string; color: string; description: string, id: string }[] = [
    { name: 'Sales', icon: 'trending-up', color: '#4CAF50', description: 'Record sales transactions', id: '34e81b1d-5735-437a-a475-e27265eba005' },
    { name: 'Purchase', icon: 'shopping-cart', color: '#2196F3', description: 'Track purchase expenses', id: 'fe9221db-5990-41a0-976a-3cb4f78aef0f' },
    // { name: 'Payment', icon: 'credit-card', color: '#FF9800', description: 'Log payment records' },
    // { name: 'Receipt', icon: 'download', color: '#9C27B0', description: 'Create receipt vouchers' },
];

const billTypeFilters = ['All', 'Sales', 'Purchase', 'Payment', 'Receipt'];

export default function BillScreen(): React.JSX.Element {
    
    const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamsList, 'bill-screen'>>();

    const dispatch = useAppDispatch();
    const { invoices, isInvoiceFeaching, pageMeta } = useInvoiceStore();
    const { primaryColor, secondaryColor } = useTheme();
    const { company } = useCompanyStore();

    const [isBillTypeSelectorModalVisible, setBillTypeSelectorModalVisible] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
    const [html, setHtml] = useState<boolean>(false);
    const [invoiceId, setInvoiceId] = useState<string>('');
    const [htmlFromAPI, setHtmlFromAPI] = useState<Array<{ html: string, page_number: number }>>([]);
    const [pageNumber, setPageNumber] = useState(1);

    const invoiceInfo = useRef<{invoiceId: string, downloadHtml: string, fullHtml: string}>({
        invoiceId: '', downloadHtml: '', fullHtml: ''
    });

    // const [customerName, setCustomerName] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    // const { width, height } = useWindowDimensions();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // Animation for floating action button
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    function handleInvoiceFetching() {
        if (isInvoiceFeaching) { return; }
        if (pageMeta.total <= pageMeta.page * pageMeta.limit) { return; }
        dispatch(viewAllInvoices({ company_id: company?._id ?? '', pageNumber: pageMeta.page + 1 }));
    }

    function handleRefresh() {
        if (refreshing) return;
        setRefreshing(true);
        dispatch(viewAllInvoices({ company_id: company?._id ?? '', pageNumber: 1 }))
            .then(res => { setRefreshing(false) })
            .finally(() => setRefreshing(false));
    }

    function getFilteredInvoices() {
        let filtered = invoices;

        if (selectedFilter !== 'All') {
            filtered = filtered.filter(invoice => invoice.voucher_type === selectedFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(invoice =>
                invoice.party_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                invoice.voucher_number.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.filter((invoice) => invoice.voucher_type === 'Sales' || invoice.voucher_type === 'Purchase');
    }

    const handleInvoice = (invoice: GetAllVouchars, callback: () => void) => {
        console.log('Print Invoice', invoice);
        
        setIsGenerating(true);
        if (invoice.voucher_type === 'Sales' || invoice.voucher_type === 'Purchase') {
            dispatch(printInvoices({
                vouchar_id: invoice._id,
                company_id: company?._id || '',
            })).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    const payload = response.payload as { paginated_data: Array<{ html: string, page_number: number }>, complete_data: string, download_data: string };
                    console.log('Print Invoice Response:', payload);
                    const paginated_html = payload.paginated_data;
                    const fullHtml2 = payload.complete_data;
                    const download_html = payload.download_data;

                    setHtmlFromAPI(paginated_html);
                    setInvoiceId(invoice.voucher_number);

                    invoiceInfo.current = {invoiceId: invoice.voucher_number, downloadHtml: download_html, fullHtml: fullHtml2};

                    // setCustomerName(invoice?.party_name);

                    if(callback) callback();
                    // setHtml(true);
                } else {
                    console.error('Failed to print invoice:', response.payload);
                }
            }
            ).catch((error) => {
                console.error('Error printing invoice:', error);
            }
            ).finally(()=>{
                setIsGenerating(false);
            })

        }
    };

    const generatePDF = async (): Promise<{ blob: Blob, filePath: string }> => {
        if (!invoiceInfo.current.invoiceId) {
            console.warn('No invoice ID provided for PDF generation');
            return { blob: new Blob(), filePath: '' }; // Return an empty Blob or handle accordingly
        }

        if (!invoiceInfo.current.downloadHtml) {
            console.warn('No HTML content available for PDF generation');
            return { blob: new Blob(), filePath: '' }; // Return an empty Blob or handle accordingly
        }

        try {
            let options = {
                html: invoiceInfo.current.downloadHtml,
                fileName: `${invoiceInfo.current.invoiceId}-vyapar-drishti.pdf`,
                directory: 'Download',
            };

            let file = await RNHTMLtoPDF.convert(options);
            console.log('PDF file generated at:', file.filePath);
            console.log('PDF generated successfully:', file.filePath);
            if (!file || !file.filePath) {
                console.error('PDF generation failed. File path is empty.');
                return { blob: new Blob(), filePath: '' }; // Return an empty Blob or handle accordingly
            }

            if (!file.filePath) {
                console.error('PDF file path is empty. Cannot generate PDF.');
                return { blob: new Blob(), filePath: '' }; // Return an empty Blob or handle accordingly
            }
            return { blob: new Blob(), filePath: file.filePath };
        } catch (error) {
            console.error('Error generating PDF:', error);
            return { blob: new Blob(), filePath: '' };
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        try {
            setIsGenerating(true);
            const { blob, filePath } = await generatePDF();
            if (!blob || !filePath) {
                console.error('PDF generation failed. No blob or file path returned.');
                return;
            }
            console.log('PDF generated successfully:', filePath);
            const downloadDir = Platform.OS === 'android'
                ? RNFS.DownloadDirectoryPath
                : RNFS.DocumentDirectoryPath;

            const destPath = `${downloadDir}/${invoiceId}-vyapar-drishti.pdf`;

            // Copy the generated file to the Downloads folder
            await RNFS.copyFile(filePath, destPath);
            console.log('File copied to:', destPath);

            if (Platform.OS === 'android') {
                ToastAndroid.show('PDF saved to Downloads!', ToastAndroid.LONG);
            } else {
                Alert.alert('Success', 'PDF saved to Files app (Documents)');
            }

        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = async () => {
        if (!invoiceId) {
            console.warn('No invoice ID provided for PDF generation');
            return;
        }

        if (!invoiceInfo.current.fullHtml) {
            console.warn('No HTML content available for PDF generation');
            return;
        }

        try {
            setIsGenerating(true);
            const printContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Invoice ${invoiceId}</title>
                    <style>
                        body { margin: 20px; padding: 20px; font-family: Arial, sans-serif; }
                        @media print {
                            body { margin: 0; padding: 0; }
                            .no-print { display: none !important; }
                        }
                    </style>
                </head>
                <body>
                    ${invoiceInfo.current.fullHtml}
                </body>
            </html>`;
            await RNPrint.print({
                html: printContent,
            });

        } catch (error) {
            console.error('Error generating PDF for printing:', error);
            return;
        } finally {
            setIsGenerating(false);
        }

    };

    const handleShare = async () => {

        if (!invoiceInfo.current.invoiceId) {
            console.warn('No invoice ID provided for PDF generation');
            return; // Return an empty Blob or handle accordingly
        }

        if (!invoiceInfo.current.downloadHtml) {
            console.warn('No HTML content available for PDF generation');
            return; // Return an empty Blob or handle accordingly
        }

        try {
            setIsGenerating(true);
            const { filePath } = await generatePDF();

            await Share.open({
                url: `file://${filePath}`, // IMPORTANT: prefix with file://
                type: 'application/pdf',
                title: 'Share Invoice',
                failOnCancel: false,
            });
            console.log('Share successful:', filePath);
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        dispatch(viewAllInvoices({ company_id: company?._id ?? '', pageNumber: 1 }));
    }, [company?._id, dispatch, isBillTypeSelectorModalVisible]);
    
    const filteredInvoices = getFilteredInvoices();
    
    useEffect(() => {
        const event = navigation.addListener('focus', () => {
            dispatch(viewAllInvoices({ company_id: company?._id ?? '', pageNumber: 1 }));
        });
        
        return event
    }, [])

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <TabNavigationScreenHeader>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <TextTheme style={{ fontWeight: 900, fontSize: 20 }}>Bills</TextTheme>
                    <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)}>
                        <FeatherIcon name="search" size={20} />
                    </TouchableOpacity>
                </View>
            </TabNavigationScreenHeader>

            <BackgroundThemeView
                isPrimary={false}
                style={{
                    width: '100%',
                    height: '100%',
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    borderTopLeftRadius: 36,
                    borderTopRightRadius: 32,
                }}
            >
                {/* Filter Section */}
                <View style={{ marginBottom: 20 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                    }}>
                        <NormalButton
                            text=" Filters"
                            textStyle={{ fontWeight: 800 }}
                            icon={<FeatherIcon name="filter" size={16} useInversTheme={true} />}
                            onPress={() => setIsFilterVisible(!isFilterVisible)}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View>
                                <TextTheme style={{ fontSize: 24, fontWeight: 'bold' }}>
                                    {filteredInvoices.length}
                                </TextTheme>
                            </View>
                            <TouchableOpacity onPress={handleRefresh}>
                                <FeatherIcon name="refresh-cw" size={16} />
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* Filter Pills */}
                    <ShowWhen when={isFilterVisible}>
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 8,
                            marginBottom: 12,
                        }}>
                            {billTypeFilters.map(filter => (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => setSelectedFilter(filter)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 20,
                                        backgroundColor: selectedFilter === filter ? '#007AFF' : 'rgba(255,255,255,0.1)',
                                        borderWidth: 1,
                                        borderColor: selectedFilter === filter ? '#007AFF' : 'rgba(255,255,255,0.3)',
                                    }}
                                >
                                    <TextTheme style={{
                                        fontSize: 12,
                                        fontWeight: selectedFilter === filter ? '700' : '400',
                                        color: selectedFilter === filter ? '#FFFFFF' : undefined,
                                    }}>
                                        {filter}
                                    </TextTheme>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ShowWhen>
                </View>

                {/* Bills List */}
                <FlatList
                    data={filteredInvoices}
                    keyExtractor={(item, index) => item._id + index}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={
                        isInvoiceFeaching ? null : (
                            <EmptyListView
                                type="invoice"
                            // style={{ marginTop: 60 }}
                            />
                        )
                    }
                    contentContainerStyle={{
                        gap: 12,
                        paddingBottom: 100,
                        flexGrow: 1,
                    }}
                    renderItem={({ item }) => (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [
                                    {
                                        translateY: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [30, 0],
                                        }),
                                    },
                                ],
                            }}
                        >
                            <BillCard
                                billNo={item.voucher_number}
                                type={item.voucher_type}
                                customerName={item.party_name}
                                createOn={item.created_at.split('T')[0]}
                                totalAmount={item.amount}
                                payAmount={item.amount}
                                pendingAmount={0}
                                onPrint={() => {handleInvoice(item, () => setHtml(true))}}
                                onShare={() => {handleInvoice(item, handleShare)}}  
                            />
                        </Animated.View>
                    )}
                    ListFooterComponent={
                        <ShowWhen when={isInvoiceFeaching}>
                            <View style={{ gap: 12 }}>
                                 {
                                    Array.from({
                                        length: Math.min(2, pageMeta.total - (invoices?.length ?? 0)) + 1}, 
                                        (_, i) => i
                                    ).map(item => (
                                        <BillLoadingCard key={item} />
                                    ))
                                }
                            </View>
                        </ShowWhen>
                    }
                    onScroll={({ nativeEvent }) => {
                        let { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
                        let contentOffsetY = contentOffset.y;
                        let totalHeight = contentSize.height;
                        let height = layoutMeasurement.height;

                        if (totalHeight - height < contentOffsetY + 400) {
                            handleInvoiceFetching();
                        }
                    }}
                />
            </BackgroundThemeView>

            {/* Enhanced Floating Action Button */}
            <Animated.View
                style={{
                    position: 'absolute',
                    right: 20,
                    bottom: 20,
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }}
            >
                <RoundedPlusButton
                    size={60}
                    iconSize={24}
                    onPress={() => setBillTypeSelectorModalVisible(true)}
                />
            </Animated.View>

            {/* Enhanced Bottom Modal */}
            <BottomModal
                visible={isBillTypeSelectorModalVisible}
                setVisible={setBillTypeSelectorModalVisible}
                backdropColor="rgba(0, 0, 0, 0.5)"
                animationType="slide"
                style={{ paddingHorizontal: 20, paddingBottom: 40 }}
            >
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <View style={{
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        marginBottom: 16,
                    }} />
                    <TextTheme style={{ fontSize: 24, fontWeight: 'bold' }}>
                        Create New Bill
                    </TextTheme>
                    <TextTheme style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
                        Select the type of bill you want to create
                    </TextTheme>
                </View>

                <View style={{ gap: 10 }}>
                    {dummyBillsType.map((billType) => (
                        <AnimateButton
                            key={billType.name}
                            style={{
                                borderRadius: 16,
                                padding: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 16,
                                borderWidth: 1,
                                borderColor: primaryColor,
                            }}
                            onPress={() => {
                                navigator.navigate('create-bill-screen', { billType: billType.name, id: billType.id });
                                setBillTypeSelectorModalVisible(false);
                            }}
                        >
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: billType.color,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FeatherIcon name={billType.icon} size={24} color="#FFFFFF" />
                            </View>

                            <View style={{ flex: 1 }}>
                                <TextTheme style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    {billType.name}
                                </TextTheme>
                                <TextTheme style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                                    {billType.description}
                                </TextTheme>
                            </View>

                            <FeatherIcon name="chevron-right" size={20} />
                        </AnimateButton>
                    ))}
                </View>
            </BottomModal>

            {/* Enhanced PDF View Bottom Modal */}
            <BottomModal
                visible={html}
                setVisible={setHtml}
                style={{ paddingHorizontal: 4, paddingBottom: 30, height: '100%' }}
                actionButtons={[
                    {
                        key: 'download',
                        title: '',
                        onPress: handleDownload,
                        color: 'white',
                        backgroundColor: 'rgb(50,200,150)',
                        icon: <FeatherIcon name="download" size={16} color="white" />,
                    },
                    {
                        key: 'print',
                        title: '',
                        onPress: handlePrint,
                        color: 'white',
                        backgroundColor: 'rgb(50,150,250)',
                        icon: <FeatherIcon name="printer" size={16} color="white" />,
                    },
                    {
                        key: 'share',
                        title: '',
                        onPress: handleShare,
                        color: 'white',
                        backgroundColor: 'rgb(250,150,100)',
                        icon: <FeatherIcon name="share-2" size={16} color="white" />,
                    },
                ]}
            >
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                    <TextTheme style={{ fontSize: 20, fontWeight: 'bold' }}>
                        View or share Bill
                    </TextTheme>
                    <TextTheme style={{ fontSize: 18, opacity: 0.7, marginTop: 4 }}>
                        {invoiceId}
                    </TextTheme>
                </View>

                <View style={{ flex: 1 }}>
                    <PDFRenderer
                        htmlString={htmlFromAPI.find(page => page.page_number === pageNumber)?.html ?? ''}
                    />
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 12, marginTop: 12 }}>
                        <AnimateButton
                            onPress={() => { setPageNumber(prev => Math.max(prev - 1, 1)); }}
                            disabled={pageNumber <= 1}
                            style={{ width: 30, height: 30, display: 'flex', borderColor: primaryColor, alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 1 }}
                        >
                            <FeatherIcon name="arrow-left" size={20} />
                        </AnimateButton>
                        <TextTheme style={{ textAlign: 'center', fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                            Page {pageNumber} of {htmlFromAPI?.length}
                        </TextTheme>
                        <AnimateButton
                            onPress={() => { setPageNumber(prev => Math.min(prev + 1, htmlFromAPI.length)); }}
                            disabled={pageNumber >= htmlFromAPI.length}
                            style={{ width: 30, height: 30, display: 'flex', borderColor: primaryColor, alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 1 }}
                        >
                            <FeatherIcon name="arrow-right" size={20} />
                        </AnimateButton>
                    </View>
                </View>

            </BottomModal>
            <LoadingModal visible={isGenerating} />
        </View>
    );
}

// type SummaryCardProps = {
//     shopeName: string,
//     totalValue: number,
//     payBills: number,
//     pendingBills: number
// }

// function SummaryCard({shopeName, payBills, totalValue, pendingBills}: SummaryCardProps): React.JSX.Element {

//     return (
//         <BackgroundThemeView isPrimary={false} style={{padding: 16, borderRadius: 16, marginBlock: 12, marginHorizontal: 20}}>
//             <TextTheme style={{fontSize: 14, fontWeight: 800}} >{shopeName}</TextTheme>

//             <TextTheme style={{fontSize: 20, fontWeight: 900, marginBlock: 6}}>
//                 {getCurrency()} {totalValue}
//             </TextTheme>

//             <View style={{display: 'flex', alignItems: 'center', justifyContent: "center", flexDirection: 'row', gap: 8, marginTop: 12}}>
//                 <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(50,200,150)'}}>
//                     <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
//                         <FeatherIcon name="file-text" size={20} color="white" />
//                         {`  ${payBills}`}
//                     </Text>
//                     <Text style={{fontSize: 12, color: 'white'}}>Pay Bills</Text>
//                 </AnimateButton>

//                 <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(250,150,100)'}}>
//                     <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
//                         <FeatherIcon name="file" size={20} color="white" />
//                         {`  ${pendingBills}`}
//                     </Text>
//                     <Text style={{fontSize: 12, color: 'white'}}>Pending Bills</Text>
//                 </AnimateButton>
//             </View>
//         </BackgroundThemeView>
//     )
// }

import { createContext, ReactNode, useContext, useRef, useState } from "react"
import { GetAllVouchars } from "../../../../Utils/types";
import { printGSTInvoices, printInvoices } from "../../../../Services/invoice";
import { useAppDispatch, useCompanyStore, useUserStore } from "../../../../Store/ReduxStore";
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNPrint from 'react-native-print';
import { Alert, Platform, ToastAndroid } from "react-native";

type PDFContextType = {
    handleInvoice: (invoice: GetAllVouchars, callback: () => void) => void,
    handleDownload: () => void,
    handlePrint: () => void,
    handleShare: () => void,
    htmlFromApi: Array<{ html: string, page_number: number }>,
    invoiceId: string,
    isGenerating: boolean
}


const fn = () => {}

const PDFContext = createContext<PDFContextType>({
    handleInvoice: fn, 
    handleDownload: fn,
    handlePrint: fn,
    handleShare: fn,
    htmlFromApi: [],
    invoiceId: '',
    isGenerating: false
});


export default function PDFContextProvider({children}: {children: ReactNode}): React.JSX.Element {

    const dispatch = useAppDispatch();
    const { company } = useCompanyStore();
    const { user } = useUserStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_gst;

    const [invoiceId, setInvoiceId] = useState<string>('');
    const [htmlFromApi, setHtmlFromApi] = useState<Array<{ html: string, page_number: number }>>([]);

    const invoiceInfo = useRef<{ invoiceId: string, downloadHtml: string, fullHtml: string }>({
        invoiceId: '', downloadHtml: '', fullHtml: ''
    });

    const [isGenerating, setIsGenerating] = useState(false);


    const handleInvoice = (invoice: GetAllVouchars, callback: () => void) => {
        console.log('Print Invoice', invoice);

        setIsGenerating(true);
        if (invoice.voucher_type === 'Sales' || invoice.voucher_type === 'Purchase') {
            if (gst_enable) {
                dispatch(printGSTInvoices({
                    vouchar_id: invoice._id,
                    company_id: company?._id || '',
                })).then((response) => {
                    if (response.meta.requestStatus === 'fulfilled') {
                        const payload = response.payload as { paginated_data: Array<{ html: string, page_number: number }>, complete_data: string, download_data: string };
                        console.log('Print GST Invoice Response:', payload);
                        const paginated_html = payload.paginated_data;
                        const fullHtml2 = payload.complete_data;
                        const download_html = payload.download_data;

                        setHtmlFromApi(paginated_html);
                        setInvoiceId(invoice.voucher_number);

                        invoiceInfo.current = { invoiceId: invoice.voucher_number, downloadHtml: download_html, fullHtml: fullHtml2 };

                        // setCustomerName(invoice?.party_name);

                        if (callback) callback();
                        // setHtml(true);
                    } else {
                        console.error('Failed to print invoice:', response.payload);
                    }
                }
                ).catch((error) => {
                    console.error('Error printing invoice:', error);
                }
                ).finally(() => {
                    setIsGenerating(false);
                })
            }
            else {
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

                        setHtmlFromApi(paginated_html);
                        setInvoiceId(invoice.voucher_number);

                        invoiceInfo.current = { invoiceId: invoice.voucher_number, downloadHtml: download_html, fullHtml: fullHtml2 };

                        // setCustomerName(invoice?.party_name);

                        if (callback) callback();
                        // setHtml(true);
                    } else {
                        console.error('Failed to print GST invoice:', response.payload);
                    }
                }
                ).catch((error) => {
                    console.error('Error printing invoice:', error);
                }
                ).finally(() => {
                    setIsGenerating(false);
                })
            }

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
                fileName: `${invoiceInfo.current.invoiceId}-vyapar-drishti`,
                directory: 'Download',
                width: 595.28,
                height: 841.89,
                base64: true,
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

        if (!invoiceInfo.current.downloadHtml) {
            console.warn('No HTML content available for PDF generation');
            return;
        }

        try {
            setIsGenerating(true);
            const printContent = invoiceInfo.current.downloadHtml;
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

    const states = {
        handleInvoice,
        handleDownload, 
        handlePrint,
        handleShare,
        htmlFromApi,
        invoiceId,
        isGenerating
    }

    return <PDFContext value={states} children={children} />
}



export function usePDFContext() {
    return useContext(PDFContext);
}
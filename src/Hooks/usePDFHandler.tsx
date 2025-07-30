import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNPrint from 'react-native-print';
import { Alert, Platform, ToastAndroid, View } from "react-native";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import BottomModal from '../Components/Modal/BottomModal';
import TextTheme from '../Components/Ui/Text/TextTheme';
import PDFRenderer from '../Components/Layouts/View/PDFRenderer';
import AnimateButton from '../Components/Ui/Button/AnimateButton';
import { useTheme } from '../Contexts/ThemeProvider';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import ShowWhen from '../Components/Other/ShowWhen';
import useStateRef from './useStateRef';

type InitProps = {
    html: string[],
    downloadHtml: string,
    pdfName: string,
    title?: string
}

type PDFModalProps = { visible: boolean; setVisible: Dispatch<SetStateAction<boolean>> }

type RetrunType = {
    init: (props: InitProps, callback?: () => void) => void
    isGenerating: boolean,
    setIsGenerating: Dispatch<SetStateAction<boolean>>,
    handleDownload: () => void,
    handleShare: () => void,
    handlePrint: () => void,
    PDFViewModal: ({ visible, setVisible }: PDFModalProps) => React.JSX.Element,
}

export default function usePDFHandler(): RetrunType {

    const { primaryColor } = useTheme()

    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [data, setData, setDataRef] = useStateRef<InitProps>({ html: [], downloadHtml: '', pdfName: '', title: '' })
    const isReady = useRef<boolean>(false);


    function init(props: InitProps, callback?: () => void) {
        setData(props);
        if (callback) callback()
    }



    const generatePDF = async (): Promise<{ blob: Blob, filePath: string }> => {
        try {
            if (!isReady.current) throw new Error('pdf genrator is not ready !!!');

            setIsGenerating(true)
            let options = {
                html: setDataRef.current.downloadHtml,
                fileName: setDataRef.current.pdfName,
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
        if (!isReady.current) return;
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

            const destPath = `${downloadDir}/${setDataRef.current.pdfName}.pdf`;

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
        if (!isReady.current) return;
        try {
            setIsGenerating(true);
            const printContent = setDataRef.current.downloadHtml;
            await RNPrint.print({
                html: printContent,
            });

        } catch (error) {
            console.error('Error generating PDF for printing:', error);
        } finally {
            setIsGenerating(false);
        }
    };



    const handleShare = async () => {
        if (!isReady.current) return;
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


    function PDFViewModal({ visible, setVisible }: PDFModalProps): React.JSX.Element {

        const [pageNo, setPageNo] = useState<number>(0);

        return (
            <ShowWhen when={data.html.length > 0} >
                <BottomModal visible={visible} setVisible={setVisible} 
                    actionContainerContent={
                        [
                            { onPress: handleDownload, backgroundColor: 'rgb(50,200,150)', icon: "download"},
                            { onPress: handlePrint, backgroundColor: 'rgb(50,150,250)', icon: "printer"},
                            { onPress: handleShare, backgroundColor: 'rgb(250,150,100)', icon: "share-2"},
                        ].map(item => (
                            <AnimateButton 
                                key={item.icon} onPress={item.onPress} 
                                style={{aspectRatio: 1, width: 40, borderWidth: 2, borderColor: primaryColor, borderRadius: 40, backgroundColor: item.backgroundColor, alignItems: 'center', justifyContent: 'center'}} 
                            >
                                <FeatherIcon name={item.icon} size={16} color='white' />
                            </AnimateButton>
                        ))
                    }
                >
                    <View style={{ alignItems: 'center', marginBottom: 14 }}>
                        <TextTheme fontSize={20} fontWeight={'bold'}>
                            View or share Bill
                        </TextTheme>

                        <ShowWhen when={!!data.title} >
                            <TextTheme style={{ fontSize: 18, opacity: 0.7, marginTop: 4 }}>
                                {data.title}
                            </TextTheme>
                        </ShowWhen>
                    </View>

                    <View style={{ height: '90%'}}>
                        <PDFRenderer
                            htmlString={data.html[pageNo]}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 12, marginTop: 12 }}>
                            <AnimateButton
                                onPress={() => { setPageNo((pageNo - 1 + data.html.length) % data.html.length); }}
                                style={{ width: 30, height: 30, borderColor: primaryColor, alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 1 }}
                            >
                                <FeatherIcon name="arrow-left" size={20} />
                            </AnimateButton>

                            <TextTheme style={{ textAlign: 'center', marginTop: 4 }}>
                                Page {pageNo + 1} of {data.html.length}
                            </TextTheme>

                            <AnimateButton
                                onPress={() => { setPageNo((pageNo + 1 + data.html.length) % data.html.length); }}
                                style={{ width: 30, height: 30, borderColor: primaryColor, alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 1 }}
                            >
                                <FeatherIcon name="arrow-right" size={20} />
                            </AnimateButton>
                        </View>
                    </View>
                </BottomModal>
            </ShowWhen>
        )
    }


    
    useEffect(() => {
        isReady.current = (
            data.html.length > 0 &&
            data.downloadHtml !== '' &&
            data.pdfName !== ''
        )
    }, [data])

    return {
        isGenerating, setIsGenerating,
        handleDownload,
        handlePrint,
        handleShare,
        PDFViewModal,
        init
    }
}
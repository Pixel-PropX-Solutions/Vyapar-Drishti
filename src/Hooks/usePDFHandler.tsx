/* eslint-disable react-native/no-inline-styles */
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNPrint from 'react-native-print';
import { Alert, Platform, ToastAndroid, View } from 'react-native';
import { Dispatch, SetStateAction, useState } from 'react';
import BottomModal from '../Components/Modal/BottomModal';
import TextTheme from '../Components/Ui/Text/TextTheme';
import AnimateButton from '../Components/Ui/Button/AnimateButton';
import { useTheme } from '../Contexts/ThemeProvider';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import ShowWhen from '../Components/Other/ShowWhen';
import useStateRef from './useStateRef';
import Pdf from 'react-native-pdf';
import React from 'react';

type InitProps = {
    filePath: string | undefined,
    fileName: string,
    entityNumber: string,
    customer?: string
    cardTitle?: string
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

    const { primaryColor } = useTheme();

    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [data, setData] = useStateRef<InitProps>({ filePath: undefined, fileName: '', entityNumber: '', customer: '', cardTitle: 'View or Share Bill' });


    function init(props: InitProps, callback?: () => void) {
        setData(props);
        if (callback) { callback(); }
    }


    const handleDownload = async () => {
        if (!data.filePath) { return; }
        try {
            setIsGenerating(true);

            const downloadDir = Platform.OS === 'android'
                ? RNFS.DownloadDirectoryPath
                : RNFS.DocumentDirectoryPath;

            const destPath = `${downloadDir}/${data.fileName}.pdf`;

            await RNFS.copyFile(data.filePath, destPath);
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
        if (!data.filePath) { return; }
        try {
            setIsGenerating(true);
            if (!data.filePath) { return; }
            const printContent = data.filePath;
            await RNPrint.print({
                filePath: printContent,
            });

        } catch (error) {
            console.error('Error generating PDF for printing:', error);
        } finally {
            setIsGenerating(false);
        }
    };



    const handleShare = async () => {
        if (!data.filePath) { return; }
        try {
            setIsGenerating(true);
            if (!data.filePath) { return; }
            await Share.open({
                url: `file://${data.filePath}`,
                type: 'application/pdf',
                filename: `${data.fileName}.pdf`,
                title: 'Share Invoice',
                failOnCancel: false,
            });
            console.log('Share successful');
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    function PDFViewModal({ visible, setVisible }: PDFModalProps): React.JSX.Element {
        const [isLoading, setIsLoading] = useState(false);
        const [pdfError, setPDFError] = useState<string | null>(null);
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(0);

        return (
            <BottomModal
                visible={visible && data.filePath !== undefined}
                setVisible={setVisible}
                actionContainerContent={
                    [
                        { onPress: handleDownload, backgroundColor: 'rgb(50,200,150)', icon: 'download' },
                        { onPress: handlePrint, backgroundColor: 'rgb(50,150,250)', icon: 'printer' },
                        { onPress: handleShare, backgroundColor: 'rgb(250,150,100)', icon: 'share-2' },
                    ].map(item => (
                        <AnimateButton
                            key={item.icon}
                            onPress={item.onPress}
                            disabled={isLoading || pdfError !== null}
                            style={{
                                aspectRatio: 1,
                                width: 40,
                                borderWidth: 2,
                                borderColor: primaryColor,
                                borderRadius: 40,
                                backgroundColor: (isLoading || pdfError !== null) ? 'rgb(172, 172, 172)' : item.backgroundColor,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 1,
                            }}
                        >
                            <FeatherIcon name={item.icon} size={16} color="white" />
                        </AnimateButton>
                    ))
                }
            >
                {/* Header Section */}
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <TextTheme fontSize={20} fontWeight={'bold'}>
                        {data.cardTitle}
                    </TextTheme>

                    <ShowWhen when={!!data.entityNumber}>
                        <TextTheme style={{ fontSize: 18, opacity: 0.7, marginTop: 4 }}>
                            {data.entityNumber} - {data.customer}
                        </TextTheme>
                    </ShowWhen>

                    {/* Page Counter */}
                    <ShowWhen when={!isLoading && pdfError === null && totalPages > 0}>
                        <View style={{
                            marginTop: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: 16,
                        }}>
                            <TextTheme style={{ fontSize: 14, opacity: 0.8 }}>
                                Page {currentPage} of {totalPages}
                            </TextTheme>
                        </View>
                    </ShowWhen>
                </View>

                {/* PDF Content Area */}
                <View style={{ height: '85%', position: 'relative' }}>

                    {/* Error State */}
                    <ShowWhen when={pdfError !== null}>
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 20,
                        }}>
                            <FeatherIcon name="alert-triangle" size={48} color="#ff6b6b" />
                            <TextTheme style={{
                                marginTop: 16,
                                fontSize: 18,
                                fontWeight: '600',
                                textAlign: 'center',
                                color: '#ff6b6b',
                            }}>
                                Failed to Load PDF
                            </TextTheme>
                            <TextTheme style={{
                                marginTop: 8,
                                fontSize: 14,
                                opacity: 0.7,
                                textAlign: 'center',
                                lineHeight: 20,
                            }}>
                                {pdfError}
                            </TextTheme>

                            <AnimateButton
                                style={{
                                    marginTop: 20,
                                    paddingHorizontal: 24,
                                    paddingVertical: 12,
                                    backgroundColor: 'black',
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <TextTheme fontSize={16} fontWeight={600} color="white">
                                    Close Viewer and try again.
                                </TextTheme>
                            </AnimateButton>
                        </View>
                    </ShowWhen>

                    {/* PDF Viewer */}
                    <ShowWhen when={!pdfError}>
                        <Pdf
                            source={{
                                uri: `file://${data.filePath}`,
                            }}
                            style={{
                                flex: 1,
                                opacity: isLoading ? 0 : 1,
                            }}
                            enableDoubleTapZoom
                            enablePaging
                            scrollEnabled
                            scale={1}
                            fitPolicy={0}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            onError={(error) => {
                                console.log('PDF load error:', error);
                                setPDFError('Failed to load PDF. Please try again.');
                                setIsLoading(false);
                            }}
                            onLoadProgress={(progress) => console.log('PDF load progress:', progress)}
                            onPageChanged={(page: number, numberOfPages: number) => {
                                console.log(`Current page: ${page}, Total pages: ${numberOfPages}`);
                                setCurrentPage(page);
                                setTotalPages(numberOfPages);
                            }}
                            onLoadComplete={(numberOfPages, path) => {
                                console.log(`PDF loaded with ${numberOfPages} pages. Path: ${path}`);
                                setTotalPages(numberOfPages);
                                setIsLoading(false);
                                setPDFError(null);
                            }}
                        />
                    </ShowWhen>

                    {/* Floating Page Navigation (Optional Enhancement) */}
                    <ShowWhen when={pdfError === null && totalPages > 1}>
                        <View style={{
                            position: 'absolute',
                            bottom: 20,
                            right: 20,
                            flexDirection: 'row',
                            backgroundColor: 'black',
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            alignItems: 'center',
                        }}>
                            <TextTheme fontSize={12} color="white">
                                {currentPage}/{totalPages}
                            </TextTheme>
                        </View>
                    </ShowWhen>
                </View>
            </BottomModal>
        );
    }

    return {
        isGenerating, setIsGenerating,
        handleDownload,
        handlePrint,
        handleShare,
        PDFViewModal,
        init,
    };
}

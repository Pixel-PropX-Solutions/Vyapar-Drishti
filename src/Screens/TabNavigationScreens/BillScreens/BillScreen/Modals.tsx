import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useBillContext } from "./Context";
import { ItemSelectorModal } from "../../../../Components/Modal/ItemSelectorModal";
import TextTheme from "../../../../Components/Text/TextTheme";
import { getMonthByIndex } from "../../../../Utils/functionTools";
import BottomModal from "../../../../Components/Modal/BottomModal";
import { View } from "react-native";
import PDFRenderer from "../../../../Components/View/PDFRenderer";
import AnimateButton from "../../../../Components/Button/AnimateButton";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import { usePDFContext } from "./PDFContext";
import { useTheme } from "../../../../Contexts/ThemeProvider";
import navigator from "../../../../Navigation/NavigationService";

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function DateSelectorModal({visible, setVisible}: Props): React.JSX.Element {

    const {date, setDate} = useBillContext()

    type Date = {year: number, month: number}

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const years: number[] = Array.from({length: 20}, (_, i) => currentYear - i);

    const data: Date[] =  useMemo(() => {
        let data: Date[] = [];
        for(let year of years) {
            for(let month=11; month>=0; month--) {
                if(currentMonth >= month || currentYear > year)
                    data.push({year, month})
            }
        }
        return data;
    }, [])
   
    return (
        <ItemSelectorModal<Date>
            allItems={data}
            title="Select Year"
            isItemSelected={!!date.year}
            visible={visible} setVisible={setVisible}
            onSelect={item => {setDate(item)}}
            keyExtractor={item => (item.year * 100 + item.month).toString()}
            SelectedItemContent={
                <TextTheme style={{fontWeight: 900}} >{getMonthByIndex(date.month)} {date.year}</TextTheme>
            }

            renderItemContent={item => (<>
                <TextTheme isPrimary={item.year === date.year && item.month == date.month} style={{fontSize: 20, fontWeight: 900}} >
                    {getMonthByIndex(item.month)} 
                </TextTheme>
                <TextTheme isPrimary={item.year === date.year && item.month == date.month} style={{fontSize: 20, fontWeight: 900}} >
                    {item.year}
                </TextTheme>
            </>)}

            filter={(item, val) => (
                item.year.toString().startsWith(val) || 
                item.year.toString().endsWith(val) || 
                getMonthByIndex(date.month).toLowerCase().startsWith(val)
            )}
        />
    )
}


export function PDFViewModal({visible, setVisible}: Props) {

    const {primaryColor} = useTheme();
    const {handleDownload, handlePrint, handleShare, invoiceId, htmlFromApi} = usePDFContext();

    const [pageNumber, setPageNumber] = useState<number>(1);

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
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
                    htmlString={htmlFromApi.find(page => page.page_number === pageNumber)?.html ?? ''}
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
                        Page {pageNumber} of {htmlFromApi?.length}
                    </TextTheme>
                    <AnimateButton
                        onPress={() => { setPageNumber(prev => Math.min(prev + 1, htmlFromApi.length)); }}
                        disabled={pageNumber >= htmlFromApi.length}
                        style={{ width: 30, height: 30, display: 'flex', borderColor: primaryColor, alignItems: 'center', justifyContent: 'center', borderRadius: 50, borderWidth: 1 }}
                    >
                        <FeatherIcon name="arrow-right" size={20} />
                    </AnimateButton>
                </View>
            </View>

        </BottomModal>
    )
}



const dummyBillsType: { name: string; icon: string; color: string; description: string, id: string }[] = [
    { name: 'Sales', icon: 'trending-up', color: '#4CAF50', description: 'Record sales transactions', id: '34e81b1d-5735-437a-a475-e27265eba005' },
    { name: 'Purchase', icon: 'shopping-cart', color: '#2196F3', description: 'Track purchase expenses', id: 'fe9221db-5990-41a0-976a-3cb4f78aef0f' },
];

export function BillTypeSelectorModal({visible, setVisible}: Props) {

    const {primaryColor} = useTheme();

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
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
                            navigator.navigate('create-bill-screen', { type: billType.name, id: billType.id });
                            setVisible(false);
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
    )
}
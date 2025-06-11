import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../Components/Text/TextTheme";
import BackgroundThemeView from "../../Components/View/BackgroundThemeView";
import { Text, View } from "react-native";
import FeatherIcon from "../../Components/Icon/FeatherIcon";
import AnimateButton from "../../Components/Button/AnimateButton";
import { useTheme } from "../../Contexts/ThemeProvider";
import { Pressable } from "react-native";
import AnimatePingBall from "../../Components/View/AnimatePingBall";
import { getMounthName } from "../../Functions/TimeOpration/timeByIndex";
import ShowWhen from "../../Components/Other/ShowWhen";
import { toCapital } from "../../Functions/StringOpations";

export default function HomeScreen(): React.JSX.Element {

    const {primaryColor: color} = useTheme();

    const dummyBillData: BillListRowProps[] = [
        {
            id: "BL001",
            date: 10,
            month: 5, // May
            year: 2024,
            payAmount: 1500.75,
            totalAmount: 2000.50,
            billNo: "INV-2024-001",
            customerName: "Alice Wonderland",
        },
        {
            id: "BL002",
            date: 22,
            month: 4, // April
            year: 2024,
            payAmount: "500", // Example with string payAmount
            totalAmount: 750.20,
            billNo: "INV-2024-002",
            customerName: "Bob The Builder",
        },
        {
            id: "BL003",
            date: 5,
            month: 6, // June
            year: 2024,
            payAmount: 300.00,
            totalAmount: "300.00", // Example with string totalAmount
            billNo: "INV-2024-003",
            customerName: "Charlie Chaplin",
        },
        {
            id: "BL004",
            date: 1,
            month: 1, // January
            year: 2024,
            payAmount: 1000,
            totalAmount: 1000,
            billNo: "INV-2024-004",
            customerName: "Diana Prince",
        },
        {
            id: "BL005",
            date: 15,
            month: 3, // March
            year: 2024,
            payAmount: 250.50,
            totalAmount: 1200.00,
            billNo: "INV-2024-005",
            customerName: "Ethan Hunt",
        },
    ];

    return (
        <ScrollView style={{marginTop: 12, width: '100%', height: '100%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', maxWidth: 500, paddingInline: 20}}>
                <TopMoneyInfoCard type='revenue' amount={'0.00'} />
                <TopMoneyInfoCard type='panding' amount={'0.00'} />
            </View>

            <AvgInvoiceCard 
                avgAmount={'0.00'} 
                totalBills={dummyBillData.length} 
                totalCustomers={0} 
                totalPropducts={0} 
            />

            <BackgroundThemeView isPrimary={false} style={{width: '100%', height: '100%', padding: 20, borderTopLeftRadius: 36, borderTopRightRadius: 36, marginTop: 24}} >

                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingInline: 10, height: 40, borderRadius: 40, borderWidth: 2, borderColor: color}} >
                    <AnimateButton style={{borderRadius: 20, padding: 4}}>
                        <FeatherIcon name="chevron-left" size={20} />
                    </AnimateButton>

                    <Pressable>
                        <TextTheme style={{fontSize: 16, fontWeight: 900}} >Jan, 2025</TextTheme>
                    </Pressable>
                    
                    <AnimateButton style={{borderRadius: 20, padding: 4}}>
                        <FeatherIcon name="chevron-right" size={20} />
                    </AnimateButton>
                </View>

                <View style={{marginBlock: 20}} >
                    {
                        dummyBillData.map(bill => (
                            <BillListRow
                                key={bill.id}
                                id={bill.id}
                                date={bill.date} month={bill.month} year={bill.year}
                                customerName={bill.customerName}
                                totalAmount={bill.totalAmount}
                                payAmount={bill.payAmount}
                                billNo={bill.billNo}
                            />
                        ))
                    }
                </View>

                <View style={{minHeight: 80}} />
            </BackgroundThemeView>
        </ScrollView>
    )
}


type TopMoneyInfoCardProps = {
    type: 'revenue' | 'panding',
    amount: string | number
}

function TopMoneyInfoCard({type, amount}: TopMoneyInfoCardProps): React.JSX.Element {

    const {icon, backgroundColor, title} = {
        'revenue': {icon: 'download', backgroundColor: 'rgb(50,200,150)', title: 'Revenue'},
        'panding': {icon: 'clock', backgroundColor: 'rgb(100,150,250)', title: 'Panding'}
    }[type];

    return (
        <View style={{flex: 1, backgroundColor, maxWidth: 200, padding: 16, borderRadius: 16, gap: 12}}>
            <View style={{flexDirection: "row", gap: 12, alignItems: 'center'}}>
                <FeatherIcon name={icon} size={24} color="white" />
                <Text style={{fontSize: 16, fontWeight: 700, color: 'white'}} >{title}</Text>
            </View>

            <Text style={{fontSize: 24, fontWeight: 900, color: 'white'}}>
                {amount ?? '0.00'}
                <Text style={{fontWeight: 500}} >{' INR'}</Text>
            </Text>
        </View>
    )   
}


type AvgInvoiceCardProps = {
    avgAmount: number | string,
    totalBills: number,
    totalCustomers: number,
    totalPropducts: number
}

function AvgInvoiceCard({avgAmount, totalBills, totalCustomers, totalPropducts}: AvgInvoiceCardProps): React.JSX.Element {

    const {primaryBackgroundColor: backgroundColor} = useTheme()

    return (
        <BackgroundThemeView isPrimary={false} style={{padding: 16, borderRadius: 16, marginBlock: 12, marginInline: 20,}}>
            <TextTheme style={{fontSize: 14, fontWeight: 800}} >INVOICE AVG</TextTheme>
            
            <TextTheme style={{fontSize: 20, fontWeight: 900, marginBlock: 6}}>
                INR {avgAmount}
            </TextTheme>
            
            <View style={{display: 'flex', alignItems: 'center', justifyContent: "center", flexDirection: 'row', gap: 8, marginTop: 12}}>
                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor}}>
                    <TextTheme style={{fontSize: 18, fontWeight: 900, marginTop: 4}}>
                        <FeatherIcon name="file-text" size={20} />
                        {`  ${totalBills}`}
                    </TextTheme>
                    <TextTheme iSPrimary={false} style={{fontSize: 10}}>Total Bill</TextTheme>
                </AnimateButton>

                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor}}>
                    <TextTheme style={{fontSize: 18, fontWeight: 900, marginTop: 4}}>
                        <FeatherIcon name="users" size={20} />
                        {`  ${totalCustomers}`}
                    </TextTheme>
                    <TextTheme iSPrimary={false} style={{fontSize: 10}}>Total Customer</TextTheme>
                </AnimateButton>
                
                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor}}>
                    <TextTheme style={{fontSize: 18, fontWeight: 900, marginTop: 4}}>
                        <FeatherIcon name="package" size={20} />
                        {`  ${totalPropducts}`}
                    </TextTheme>
                    <TextTheme iSPrimary={false} style={{fontSize: 10}}>Total Product</TextTheme>
                </AnimateButton>
            </View>
        </BackgroundThemeView>
    )
}


type BillListRowProps = {
    id: string,
    date: number, month: number, year: number,
    payAmount: number | string,
    totalAmount: number | string,
    billNo: string,
    customerName: string
}

function BillListRow({id, date, month, year, totalAmount, payAmount, billNo, customerName}: BillListRowProps): React.JSX.Element {

    const status: 'paid' | 'panding' = totalAmount === payAmount ? 'paid' : 'panding';
    const statusColor = status === 'paid' ? 'rgb(50,200,150)' : 'rgb(250,150,50)';
    const pandingAmount = Number(totalAmount) - Number(payAmount);

    return (
        <View style={{gap: 6, marginBlock: 12}}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingInline: 8}} >
                <TextTheme style={{fontSize: 20, fontWeight: 900}} >{getMounthName(month)} {date}</TextTheme>
                <TextTheme style={{fontWeight: 900, fontSize: 16}} >{payAmount ?? '0.00'} INR</TextTheme>
            </View>

            <BackgroundThemeView style={{padding: 16, borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 8}} >
                <View style={{flexDirection: 'row', justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%'}}>
                    <View style={{backgroundColor: statusColor, paddingInline: 12, borderRadius: 10, paddingBlock: 8, position: 'relative'}} >
                        <Text style={{color: 'white', fontWeight: 900}} >{toCapital(status)}</Text>
                        
                        <ShowWhen when={status === 'panding'} >
                            <BackgroundThemeView style={{position: 'absolute', top: 2, right: 2, width: 20, aspectRatio: 1, borderRadius: 20, transform: [{translateX: '50%'}, {translateY: '-50%'}], display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
                                <AnimatePingBall size={12} backgroundColor="rgb(250,150,50)" />
                            </BackgroundThemeView>
                        </ShowWhen>
                    </View>

                    <View style={{alignItems: 'flex-end'}} >
                        <TextTheme style={{fontSize: 12}} iSPrimary={false} >#{billNo}</TextTheme>
                        <TextTheme style={{fontSize: 12}} iSPrimary={false} >{date} {getMounthName(month)} {year}</TextTheme>
                    </View>
                </View>

                <TextTheme style={{paddingLeft: 2, fontWeight: 600}} >{customerName}</TextTheme>

                <View style={{display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-between', width: '100%', alignItems: 'center'}} >
                    <View style={{flexDirection: 'row', gap: 32}}>
                        <View>
                            <TextTheme style={{fontSize: 12}} >Total</TextTheme>
                            <TextTheme style={{fontSize: 12}} >{totalAmount ?? '0.00'} INR</TextTheme>
                        </View>

                        <View>
                            <TextTheme style={{fontSize: 12}} >Panding</TextTheme>
                            <TextTheme style={{fontSize: 12}} >{pandingAmount ?? '0.00'} INR</TextTheme>
                        </View>
                    </View>

                    <AnimateButton style={{padding: 8, borderRadius: 20}}>
                        <FeatherIcon name="printer" size={20} />
                    </AnimateButton>
                </View>
            </BackgroundThemeView>
        </View>
    )
}
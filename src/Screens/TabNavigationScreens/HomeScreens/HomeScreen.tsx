import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../../Components/Text/TextTheme";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import { Text, View } from "react-native";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import AnimateButton from "../../../Components/Button/AnimateButton";
import { useTheme } from "../../../Contexts/ThemeProvider";
import { Pressable } from "react-native";
import BillCard, { BillCardProps } from "../../../Components/Card/BillCard";
import DateSelector from "../../../Components/Other/DateSelector";

export default function HomeScreen(): React.JSX.Element {

    const {primaryColor: color} = useTheme();

    const dummyBillData: BillCardProps[] = [
        {
            id: "BL001",
            date: 10,
            month: 5, // May
            year: 2024,
            payAmount: 1500.75,
            totalAmount: 2000.50,
            billNo: "INV-2024-001",
            customerName: "Alice Wonderland",
            pandingAmount: 0
        },
        {
            id: "BL002",
            date: 22,
            month: 4, // April
            year: 2024,
            payAmount: 500, // Example with string payAmount
            totalAmount: 750.20,
            billNo: "INV-2024-002",
            customerName: "Bob The Builder",
            pandingAmount: 0
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
            pandingAmount: 0
        },
    ];

    return (
        <ScrollView style={{marginTop: 12, width: '100%', height: '100%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', maxWidth: 500, paddingInline: 20}}>
                <TopMoneyInfoCard type='revenue' amount={0} />
                <TopMoneyInfoCard type='panding' amount={0} />
            </View>

            <AvgInvoiceCard 
                avgAmount={0} 
                totalBills={dummyBillData.length} 
                totalCustomers={0} 
                totalPropducts={0} 
            />

            <BackgroundThemeView isPrimary={false} style={{width: '100%', height: '100%', padding: 20, borderTopLeftRadius: 36, borderTopRightRadius: 36, marginTop: 24}} >

                <TextTheme style={{textAlign: 'center', fontSize: 16, marginBottom: 12, fontWeight: 900}} >Panding Bills</TextTheme>

                <DateSelector/>

                <View style={{marginBlock: 20}} >
                    {
                        dummyBillData.map(bill => (
                            <BillCard
                                key={bill.id}
                                id={bill.id}
                                date={bill.date} month={bill.month} year={bill.year}
                                customerName={bill.customerName}
                                totalAmount={bill.totalAmount}
                                payAmount={bill.payAmount}
                                billNo={bill.billNo}
                                pandingAmount={bill.totalAmount - bill.payAmount}
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
    amount:  number
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
    avgAmount: number,
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
                    <TextTheme isPrimary={false} style={{fontSize: 10}}>Total Bill</TextTheme>
                </AnimateButton>

                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor}}>
                    <TextTheme style={{fontSize: 18, fontWeight: 900, marginTop: 4}}>
                        <FeatherIcon name="users" size={20} />
                        {`  ${totalCustomers}`}
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 10}}>Total Customer</TextTheme>
                </AnimateButton>
                
                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor}}>
                    <TextTheme style={{fontSize: 18, fontWeight: 900, marginTop: 4}}>
                        <FeatherIcon name="package" size={20} />
                        {`  ${totalPropducts}`}
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 10}}>Total Product</TextTheme>
                </AnimateButton>
            </View>
        </BackgroundThemeView>
    )
}

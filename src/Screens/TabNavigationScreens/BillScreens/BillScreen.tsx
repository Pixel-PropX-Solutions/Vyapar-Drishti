import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../../Components/Text/TextTheme";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import { Text, View } from "react-native";
import AnimateButton from "../../../Components/Button/AnimateButton";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import NormalButton from "../../../Components/Button/NormalButton";
import BillCard, { BillCardProps } from "../../../Components/Card/BillCard";

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

export default function BillScreen(): React.JSX.Element {
    return (
        <ScrollView style={{marginTop: 12, width: '100%', height: '100%'}}>

            <SummaryCard
                shopeName="Gen-I Store"
                totalValue={18000}
                payBills={10}
                pandingBills={2}
            />

            <BackgroundThemeView  isPrimary={false} style={{width: '100%', height: '100%', padding: 20, borderTopLeftRadius: 36, borderTopRightRadius: 32, marginTop: 24, gap: 20}} >
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBlock: 8}} >
                    <NormalButton 
                        text=" Filerts" 
                        textStyle={{fontWeight: 800}}
                        icon={<FeatherIcon name="filter" size={16} useInversTheme={true} />}
                    />

                    <View style={{alignItems: 'flex-end'}} >
                        <TextTheme style={{fontSize: 12}} iSPrimary={false} >Total Results</TextTheme>
                        <TextTheme>
                            <FeatherIcon name="file-text" size={16} />
                            {' '}
                            12
                        </TextTheme>
                    </View> 
                </View>

                <View style={{gap: 12}} >
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
                            />
                        ))
                    }
                </View>

                <View style={{minHeight: 80}} />
            </BackgroundThemeView>
        </ScrollView>
    )
}


type SummaryCardProps = {
    shopeName: string,
    totalValue: number,
    payBills: number,
    pandingBills: number
}

function SummaryCard({shopeName, payBills, totalValue, pandingBills}: SummaryCardProps): React.JSX.Element {

    return (
        <BackgroundThemeView isPrimary={false} style={{padding: 16, borderRadius: 16, marginBlock: 12, marginHorizontal: 20}}>
            <TextTheme style={{fontSize: 14, fontWeight: 800}} >{shopeName}</TextTheme>
            
            <TextTheme style={{fontSize: 20, fontWeight: 900, marginBlock: 6}}>
                INR {totalValue}
            </TextTheme>
            
            <View style={{display: 'flex', alignItems: 'center', justifyContent: "center", flexDirection: 'row', gap: 8, marginTop: 12}}>
                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(50,200,150)'}}>
                    <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
                        <FeatherIcon name="file-text" size={20} color="white" />
                        {`  ${payBills}`}
                    </Text>
                    <Text style={{fontSize: 12, color: 'white'}}>Pay Bills</Text>
                </AnimateButton>

                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(250,150,100)'}}>
                    <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
                        <FeatherIcon name="file" size={20} color="white" />
                        {`  ${pandingBills}`}
                    </Text>
                    <Text style={{fontSize: 12, color: 'white'}}>Panding Bills</Text>
                </AnimateButton>
            </View>
        </BackgroundThemeView>
    )
}

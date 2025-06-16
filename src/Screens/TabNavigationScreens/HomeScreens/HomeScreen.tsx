import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../../Components/Text/TextTheme";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import { View } from "react-native";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import AnimateButton from "../../../Components/Button/AnimateButton";
import { useTheme } from "../../../Contexts/ThemeProvider";
import BillCard, { BillCardProps } from "../../../Components/Card/BillCard";
import DateSelector from "../../../Components/Other/DateSelector";
import FontAwesome6Icon from "../../../Components/Icon/FontAwesome6Icon";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../../Navigation/StackNavigation";
import HomeScreenHeader from "../../../Components/Header/HomeScreenHeader";

export default function HomeScreen(): React.JSX.Element {

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

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'tab-navigation'>>();

    return (
        <View style={{width: '100%', height: '100%'}} >
            <HomeScreenHeader/>
            <ScrollView style={{marginTop: 12, width: '100%', height: '100%'}} contentContainerStyle={{gap: 20}}>

                <View style={{paddingInline: 20, gap: 32}} >
                    
                    <View style={{gap: 12}} >
                        <TextTheme style={{fontSize: 16, fontWeight: 800}} >This Month</TextTheme>
                        <View style={{flexDirection: 'row', gap: 12}}>
                            <View style={{padding: 12, borderRadius: 12, flex: 1, backgroundColor: 'rgb(50,200,150)'}}>
                                <TextTheme color="white" isPrimary={false} style={{fontWeight: 900}} >Pay Amount</TextTheme>
                                <TextTheme color="white">0.00 INR</TextTheme>
                            </View>

                            <View style={{padding: 12, borderRadius: 12, flex: 1, backgroundColor: 'rgb(50,150,250)'}}>
                                <TextTheme color="white" isPrimary={false} style={{fontWeight: 900}} >Panding Amount</TextTheme>
                                <TextTheme color="white">0.00 INR</TextTheme>
                            </View>
                        </View>
                    </View>

                    <View style={{gap: 12}} >
                        <TextTheme style={{fontSize: 16, fontWeight: 800}} >Quick Access</TextTheme>
                        <View style={{gap: 12}} >
                            <View style={{flexDirection: 'row', gap: 12}}>
                                <QuickAccessBox 
                                    label="Sells" 
                                    text="Add new sells" 
                                    icon={<FeatherIcon name="trending-up" size={16} />} 
                                    onPress={() => {}}
                                />
                                <QuickAccessBox 
                                    label="Purchase" 
                                    text="Add purchase" 
                                    icon={<FontAwesome6Icon name="coins" size={16} />} 
                                    onPress={() => {}}
                                />
                            </View>

                            <View style={{flexDirection: 'row', gap: 12}}>
                                <QuickAccessBox 
                                    label="Customer" 
                                    text="Add Customer" 
                                    icon={<FeatherIcon name="users" size={16} />} 
                                    onPress={() => {}}
                                />
                                <QuickAccessBox 
                                    label="Share" 
                                    text="Share app with friends" 
                                    icon={<FeatherIcon name="share" size={16} />} 
                                    onPress={() => {}}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                
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
        </View>
    )
}


type QuickAccessBoxProps = {
    icon: React.ReactNode, text: string, label: string, onPress: () => void
}

function QuickAccessBox({icon, text, label, onPress}: QuickAccessBoxProps): React.JSX.Element {

    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme()

    return (
        <AnimateButton 
            onPress={onPress} 
            style={{height: 60, borderRadius: 8, alignItems: 'center', flex: 1, flexDirection: 'row', backgroundColor: secondaryBackgroundColor, padding: 12, gap: 8}} 
        >
            <View style={{backgroundColor: primaryBackgroundColor, borderRadius: 8, overflow: 'hidden', width: 40, aspectRatio: 1, alignItems: 'center', justifyContent: 'center'}} >
                {icon}
            </View>
            <View style={{flex: 1}} >
                <TextTheme style={{fontSize: 14}} >{label}</TextTheme>
                <TextTheme isPrimary={false} style={{fontSize: 11}} numberOfLines={2} >{text}</TextTheme>
            </View>
        </AnimateButton>
    )
}
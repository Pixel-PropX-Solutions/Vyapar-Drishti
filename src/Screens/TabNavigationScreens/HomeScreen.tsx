import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../Components/Text/TextTheme";
import BackgroundThemeView from "../../Components/View/BackgroundThemeView";
import { Text, View } from "react-native";
import FeatherIcon from "../../Components/Icon/FeatherIcon";
import AnimateButton from "../../Components/Button/AnimateButton";
import { useTheme } from "../../Contexts/ThemeProvider";

export default function HomeScreen(): React.JSX.Element {

    return (
        <ScrollView style={{paddingInline: 20, marginTop: 12, width: '100%', height: '100%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', maxWidth: 500}}>
                <TopMoneyInfoCard type='revenue' amount={'0.00'} />
                <TopMoneyInfoCard type='panding' amount={'0.00'} />
            </View>

            <AvgInvoiceCard 
                avgAmount={'0.00'} 
                totalBills={0} 
                totalCustomers={0} 
                totalPropducts={0} 
            />
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
        <BackgroundThemeView isPrimary={false} style={{padding: 16, borderRadius: 16, marginBlock: 12}}>
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
import { View } from "react-native";
import TextTheme from "../Text/TextTheme";
import { getMounthName } from "../../Functions/TimeOpration/timeByIndex";
import BackgroundThemeView from "../View/BackgroundThemeView";
import { toCapital } from "../../Functions/StringOpations";
import { Text } from "react-native";
import ShowWhen from "../Other/ShowWhen";
import AnimatePingBall from "../View/AnimatePingBall";
import AnimateButton from "../Button/AnimateButton";
import FeatherIcon from "../Icon/FeatherIcon";

export type BillCardProps = {
    id: string,
    date: number, month: number, year: number,
    payAmount: number | string,
    totalAmount: number | string,
    billNo: string,
    customerName: string
}

export default function BillCard({id, date, month, year, totalAmount, payAmount, billNo, customerName}: BillCardProps): React.JSX.Element {

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
                        <TextTheme style={{fontSize: 12}} isPrimary={false} >#{billNo}</TextTheme>
                        <TextTheme style={{fontSize: 12}} isPrimary={false} >{date} {getMounthName(month)} {year}</TextTheme>
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
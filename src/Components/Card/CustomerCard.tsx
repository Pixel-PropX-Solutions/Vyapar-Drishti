import { View } from "react-native";
import TextTheme from "../Text/TextTheme";
import FeatherIcon from "../Icon/FeatherIcon";
import { useTheme } from "../../Contexts/ThemeProvider";
import AnimateButton from "../Button/AnimateButton";
import numberToString from "../../Functions/Numbers/numberToString";


export type CustomerCardProps = {
    id: string,
    name: string,
    phoneNumber: string,
    createOn: string,
    onPress?: () => void,
    totalAmount: number,
    payAmount: number,
    pandingAmount: number
}

export default function CustomerCard({name, phoneNumber, createOn, onPress=()=>{}, totalAmount=0, pandingAmount=0, payAmount=0}: CustomerCardProps): React.JSX.Element {

    const {secondaryBackgroundColor: backgroundColor} = useTheme();

    return (
        <AnimateButton 
            style={{padding: 16, borderRadius: 16, backgroundColor}} bubbleScale={30} 
            onPress={onPress}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}} >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <View style={{borderRadius: 50, aspectRatio: 1, width: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(50,150,250,0.4)', backgroundColor: 'rgb(50,150,250)'}} >
                        <TextTheme color="white" style={{fontSize: 18, fontWeight: 900}} >{name[0]}</TextTheme>
                    </View>
                    
                    <TextTheme style={{fontSize: 18, fontWeight: 900}} >{name}</TextTheme>
                </View>
                
                <View style={{alignItems: 'flex-end'}} >
                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >{phoneNumber}</TextTheme>
                        <FeatherIcon isPrimary={false} name="phone" size={12} />
                    </View>

                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >{createOn}</TextTheme>
                        <FeatherIcon isPrimary={false} name="calendar" size={12} />
                    </View>
                </View>
            </View>

            <View style={{flexDirection: 'row', gap: 32, marginTop: 12,}}>
                <View>
                    <TextTheme isPrimary={false} style={{fontSize: 12}} >Total</TextTheme>
                    <TextTheme style={{fontSize: 12}} >{numberToString(totalAmount)} INR</TextTheme>
                </View>

                <View>
                    <TextTheme isPrimary={false} style={{fontSize: 12}} >Pay</TextTheme>
                    <TextTheme style={{fontSize: 12}} >{numberToString(payAmount)} INR</TextTheme>
                </View>

                <View>
                    <TextTheme isPrimary={false} style={{fontSize: 12}} >Panding</TextTheme>
                    <TextTheme style={{fontSize: 12}} >{numberToString(pandingAmount)} INR</TextTheme>
                </View>
            </View>
        </AnimateButton>
    )
}
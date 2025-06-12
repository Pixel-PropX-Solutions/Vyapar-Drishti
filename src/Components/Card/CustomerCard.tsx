import { View } from "react-native";
import TextTheme from "../Text/TextTheme";
import FeatherIcon from "../Icon/FeatherIcon";
import { useTheme } from "../../Contexts/ThemeProvider";
import AnimateButton from "../Button/AnimateButton";
import FontAwesome6Icon from "../Icon/FontAwesome6Icon";


export type CustomerCardProps = {
    id: string,
    name: string,
    wokeIn: string,
    phoneNumber: string,
    mail: string,
    address: string,
    createOn: string
}

export default function CustomerCard({name, wokeIn, phoneNumber, mail, address, createOn}: CustomerCardProps): React.JSX.Element {

    const {secondaryBackgroundColor: backgroundColor} = useTheme();

    return (
        <AnimateButton style={{padding: 16, borderRadius: 16, backgroundColor}} bubbleScale={30} >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
                <View>
                    <TextTheme style={{fontSize: 18, fontWeight: 900}} >{name}</TextTheme>
                </View>
                
                <View style={{alignItems: 'flex-end'}} >
                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >{phoneNumber}</TextTheme>
                        <FeatherIcon isPrimary={false} name="phone" size={12} />
                    </View>

                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >{mail}</TextTheme>
                        <FeatherIcon isPrimary={false} name="mail" size={12} />
                    </View>
                </View>
            </View>

            <View style={{marginTop: 16, flexDirection: 'row', gap: 8}}>
                <FontAwesome6Icon name="building" size={12} />
                <TextTheme>{wokeIn}</TextTheme>
            </View>
            <TextTheme isPrimary={false} style={{fontSize: 12}} >{address}</TextTheme>
            <TextTheme isPrimary={false} style={{fontSize: 12}} >Customer Since {createOn}</TextTheme>
        </AnimateButton>
    )
}
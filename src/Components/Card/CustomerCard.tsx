import { View } from "react-native";
import TextTheme from "../Text/TextTheme";
import FeatherIcon from "../Icon/FeatherIcon";
import { useTheme } from "../../Contexts/ThemeProvider";
import AnimateButton from "../Button/AnimateButton";
import numberToString from "../../Functions/Numbers/numberToString";
import ShowWhen from "../Other/ShowWhen";


type CustomerCardProps = {
    id: string,
    name: string,
    groupName: string,
    createOn: string,
    phoneNo?: string,
    onPress?: () => void,
}

export default function CustomerCard({name, groupName, createOn, phoneNo='', onPress=()=>{}, id}: CustomerCardProps): React.JSX.Element {

    const {secondaryBackgroundColor: backgroundColor} = useTheme();

    return (
        <AnimateButton 
            style={{padding: 12, borderRadius: 16, backgroundColor}} bubbleScale={30} 
            onPress={onPress}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}} >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <View style={{borderRadius: 50, aspectRatio: 1, width: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(50,150,250,0.4)', backgroundColor: 'rgb(50,150,250)'}} >
                        <TextTheme color="white" style={{fontSize: 18, fontWeight: 900}} >{name[0]}</TextTheme>
                    </View>
                    
                    <View>
                        <TextTheme style={{fontSize: 18, fontWeight: 900}} >{name}</TextTheme>
                        <TextTheme style={{fontSize: 12}} >{groupName}</TextTheme>
                    </View>
                </View>
                
                <View style={{alignItems: 'flex-end'}} >
                    <ShowWhen when={phoneNo !== ''} >
                        <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                            <TextTheme isPrimary={false} style={{fontSize: 12}} >{phoneNo}</TextTheme>
                            <FeatherIcon isPrimary={false} name="phone" size={12} />
                        </View>
                    </ShowWhen>

                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >{createOn.split('T')[0]}</TextTheme>
                        <FeatherIcon isPrimary={false} name="calendar" size={12} />
                    </View>
                </View>
            </View>
        </AnimateButton>
    )
}


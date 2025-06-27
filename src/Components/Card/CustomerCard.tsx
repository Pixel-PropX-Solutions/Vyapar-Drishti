import { View } from "react-native";
import TextTheme from "../Text/TextTheme";
import FeatherIcon from "../Icon/FeatherIcon";
import { useTheme } from "../../Contexts/ThemeProvider";
import AnimateButton from "../Button/AnimateButton";
import numberToString from "../../Functions/Numbers/numberToString";
import ShowWhen from "../Other/ShowWhen";
import LoadingView from "../View/LoadingView";
import BackgroundThemeView from "../View/BackgroundThemeView";


type CustomerCardProps = {
    name: string,
    groupName: string,
    createOn: string,
    phoneNo?: string,
    onPress?: () => void,
    backgroundColor?: string,
    color?: string
}

export default function CustomerCard({name, groupName, createOn, phoneNo='', onPress=()=>{}, backgroundColor='', color=''}: CustomerCardProps): React.JSX.Element {

    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme();
    backgroundColor = backgroundColor || secondaryBackgroundColor;

    return (
        <AnimateButton 
            style={{padding: 12, borderRadius: 16, backgroundColor}} bubbleScale={30} 
            onPress={onPress}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}} >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <View style={{borderRadius: 50, aspectRatio: 1, width: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: primaryBackgroundColor, backgroundColor}} >
                        <TextTheme style={{fontSize: 18, fontWeight: 900}} color={color} >{name[0]}</TextTheme>
                    </View>
                    
                    <View>
                        <TextTheme color={color} style={{fontSize: 18, fontWeight: 900}} >{name}</TextTheme>
                        <TextTheme color={color} style={{fontSize: 12}} >{groupName}</TextTheme>
                    </View>
                </View>
                
                <View style={{alignItems: 'flex-end'}} >
                    <ShowWhen when={phoneNo !== ''} >
                        <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                            <TextTheme color={color} isPrimary={false} style={{fontSize: 12}} >{phoneNo}</TextTheme>
                            <FeatherIcon color={color} isPrimary={false} name="phone" size={12} />
                        </View>
                    </ShowWhen>

                    <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                        <TextTheme color={color} isPrimary={false} style={{fontSize: 12}} >{createOn.split('T')[0]}</TextTheme>
                        <FeatherIcon color={color} isPrimary={false} name="calendar" size={12} />
                    </View>
                </View>
            </View>
        </AnimateButton>
    )
}




export function CustomerLoadingView(): React.JSX.Element{
    return (
        <LoadingView style={{width: '100%', maxWidth: 460, justifyContent: 'space-between', padding: 12, borderRadius: 16, alignItems: 'flex-start', marginBlock: 10}} scale={1}  >
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}} >
                <LoadingView width={44} height={44} borderRadius={36} isPrimary={true} />
                <View>
                    <LoadingView width={120} height={20} borderRadius={12} isPrimary={true} />
                    <LoadingView width={80} height={16} borderRadius={8} isPrimary={true} style={{marginTop: 4}} />
                </View>
            </View>
        </LoadingView>
    )
}
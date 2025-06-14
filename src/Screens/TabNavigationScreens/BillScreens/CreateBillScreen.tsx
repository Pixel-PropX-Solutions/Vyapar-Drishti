import { KeyboardAvoidingView, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AnimateButton from "../../../Components/Button/AnimateButton";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import { useTheme } from "../../../Contexts/ThemeProvider";
import TextTheme from "../../../Components/Text/TextTheme";
import { Dispatch, SetStateAction, useState } from "react";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import { getMounthName } from "../../../Functions/TimeOpration/timeByIndex";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../../Navigation/StackNavigation";
import NoralTextInput from "../../../Components/TextInput/NoralTextInput";

export default function CraeteBillScreen(): React.JSX.Element {

    const {secondaryBackgroundColor, primaryBackgroundColor, primaryColor} = useTheme();
    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'create-bill-screen'>>();
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();

    const {billType} = router.params;

    const time = new Date()

    const [billtype, setBillType] = useState<'sell' | 'purchase'>('sell');
    const [billNo, setBillNo] = useState<string>('#INV-2025-000');
    const [creteOn, setCreateOn] = useState<{date: number, month: number, year: number}>({
        date: time.getDate(), month: time.getMonth(), year: time.getFullYear()
    })

    return (
        <View style={{justifyContent: 'space-between', width: '100%', height: '100%'}} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingHorizontal: 20, paddingBlock: 10}} >  
                <AnimateButton 
                    onPress={() => navigation.goBack()}
                    style={{borderWidth: 2, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 44, aspectRatio: 1, borderColor: secondaryBackgroundColor}} 
                >
                    <FeatherIcon name="plus" size={20} style={{transform: 'rotate(45deg)'}} />
                </AnimateButton>
                
                <View style={{borderRadius: 40, borderWidth: 2, borderColor: secondaryBackgroundColor, height: 44, paddingInline: 20, alignItems: 'center', flexDirection: 'row', gap: 8}} >
                    <FeatherIcon name="file-text" size={14}/>
                    <TextTheme style={{fontSize: 14, fontWeight: 900}} >{billType}</TextTheme>
                </View>
            </View>

            <ScrollView style={{paddingInline: 20, paddingBlock: 10}} contentContainerStyle={{gap: 24}} >
                <View style={{gap: 16}} >
                    <BillNoAndDateSelector
                        billNo={billNo} setBillNo={setBillNo}
                        createOn={creteOn} setCreateOn={setCreateOn}
                    />

                    <AnimateButton style={{padding: 8, borderRadius: 12, width: '100%', backgroundColor: secondaryBackgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
                        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                            <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                                <FeatherIcon name="user" size={16} />
                            </BackgroundThemeView>

                            <View>
                                <TextTheme style={{fontSize: 16, fontWeight: 800}} >Select Customer</TextTheme>
                            </View>
                        </View>

                        <FeatherIcon name="arrow-right" size={20} style={{paddingRight: 10}} />
                    </AnimateButton>
                    
                    <AnimateButton style={{padding: 8, borderRadius: 12, width: '100%', backgroundColor: secondaryBackgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
                        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                            <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                                <FeatherIcon name="package" size={16} />
                            </BackgroundThemeView>

                            <View>
                                <TextTheme style={{fontSize: 16, fontWeight: 800}} >+ Add Products</TextTheme>
                            </View>
                        </View>

                        <FeatherIcon name="arrow-right" size={20} style={{paddingRight: 10}} />
                    </AnimateButton>
                </View>

                <BackgroundThemeView isPrimary={false} style={{padding: 12, borderRadius: 8}} >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                        <AnimateButton style={{padding: 12, borderRadius: 8, flex: 1, backgroundColor: primaryBackgroundColor}}>
                            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                                <FeatherIcon name="package" size={20} />
                                <TextTheme>25</TextTheme>
                            </View>
                            <TextTheme style={{fontSize: 10}} isPrimary={false} >Total Products</TextTheme>
                        </AnimateButton>

                        <AnimateButton style={{padding: 12, borderRadius: 8, flex: 1, backgroundColor: primaryBackgroundColor}}>
                            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                                <FeatherIcon name="download" size={20} />
                                <TextTheme>0.00 INR</TextTheme>
                            </View>
                            <TextTheme style={{fontSize: 10}} isPrimary={false} >Total Amount</TextTheme>
                        </AnimateButton>
                    </View>
                </BackgroundThemeView>

                <View style={{minHeight: 40}} />
            </ScrollView>
            
            <KeyboardAvoidingView behavior="padding" >
                <AmountBox/>
            </KeyboardAvoidingView>
        </View>
    )
}





type BillNoAndDateSelectorProps = {
    billNo: string,
    setBillNo: Dispatch<SetStateAction<string>>,
    createOn: {date: number, month: number, year: number}
    setCreateOn: Dispatch<SetStateAction<{date: number, month: number, year: number}>>
}

function BillNoAndDateSelector({billNo, setBillNo, createOn, setCreateOn}: BillNoAndDateSelectorProps): React.JSX.Element {

    const {secondaryBackgroundColor} = useTheme();

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16}} >
            <AnimateButton style={{padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: secondaryBackgroundColor}}>
                <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                    <FeatherIcon name="hash" size={16} />
                </BackgroundThemeView>

                <View>
                    <TextTheme style={{fontSize: 14, fontWeight: 800}} >Bill No</TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 800}} >{billNo}</TextTheme>
                </View>
            </AnimateButton>

            <AnimateButton style={{padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: secondaryBackgroundColor}}>
                <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                    <FeatherIcon name="calendar" size={16} />
                </BackgroundThemeView>

                <View>
                    <TextTheme style={{fontSize: 14, fontWeight: 800}} >Create On</TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 800}} >
                        {`${createOn.date} ${getMounthName(createOn.month)} ${createOn.year}`}
                    </TextTheme>
                </View>
            </AnimateButton>
        </View>
    )
}




function AmountBox(): React.JSX.Element {

    const [paddingBottom, setPaddingBottom] = useState<number>(20);

    const color = 'white';
    const secondaryColor = 'rgba(125,125,125,0.5)';
    const backgroundColor = 'rgb(50,200,150)';

    return (
        <View 
            style={{
                paddingTop: 20 ,borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 4, borderColor: secondaryColor, borderBottomWidth: 0, gap: 20, paddingBottom, backgroundColor
            }}
        >
            <View style={{gap: 16, paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12}} >
                    <View>
                        <TextTheme color={color}  style={{fontSize: 16, fontWeight: 900}} >TOTAL AMOUNT</TextTheme>
                        <TextTheme color={color} isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >0.00 INR</TextTheme>
                    </View>

                    <View style={{alignItems: 'flex-end'}} >
                        <TextTheme color={color} isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >PRODUCTS</TextTheme>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                            <TextTheme color={color} style={{fontSize: 16, fontWeight: 900}} >0</TextTheme>
                            <FeatherIcon name="package" size={16} color={color} />
                        </View>
                    </View>
                </View>

                <View style={{alignItems: 'center'}} >
                    <TextTheme color={color} style={{fontSize: 16, fontWeight: 900}} >Enter Pay Amount</TextTheme>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}} >
                        <NoralTextInput 
                            color={color}
                            keyboardType="number-pad"
                            placeholder="0.00" 
                            style={{fontSize: 24, fontWeight: 900, padding: 0, margin: 0}}  
                            onFocus={() => setPaddingBottom(44)}
                            onBlur={() => setPaddingBottom(20)}
                        />
                        <TextTheme color={color} style={{fontSize: 24, fontWeight: 900}} >INR</TextTheme>
                    </View>
                </View>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end', position: 'relative', alignItems: 'center'}} >
                <View style={{position: 'absolute', width: '100%', flex: 1, borderWidth: 2, borderColor: secondaryColor, height: 0}} />
                
                <AnimateButton style={{paddingHorizontal: 20, height: 44, borderRadius: 44, justifyContent: 'center', borderColor: secondaryColor, marginRight: 20, borderWidth: 3, backgroundColor}} >
                    <TextTheme color={color} style={{fontWeight: 900}} >Create</TextTheme>
                </AnimateButton>
            </View>
        </View>
    )
}
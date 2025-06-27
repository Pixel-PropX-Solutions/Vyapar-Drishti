import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../../Components/Text/TextTheme";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import { Text, View } from "react-native";
import AnimateButton from "../../../Components/Button/AnimateButton";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import NormalButton from "../../../Components/Button/NormalButton";
import BillCard, { BillCardProps } from "../../../Components/Card/BillCard";
import RoundedPlusButton from "../../../Components/Button/RoundedPlusButton";
import { useState } from "react";
import BottomModal from "../../../Components/Modal/BottomModal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../../Navigation/StackNavigation";
import TabNavigationScreenHeader from "../../../Components/Header/TabNavigationHeader";
import { getCurrency } from "../../../Store/AppSettingStore";



const dummayBillsType: string[] = [
    "Sales Bill",
    "Purchase Bill"
]

export default function BillScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'tab-navigation'>>();

    const [isBillTypeSelectorModalVisible, setBillTypeSelectorModalVisible] = useState<boolean>(false);

    return (
        <View style={{width: '100%', height: '100%'}}>
            <TabNavigationScreenHeader>
                <TextTheme style={{fontWeight: 900, fontSize: 20}} >Bill Screen</TextTheme>
            </TabNavigationScreenHeader>
            

            <BackgroundThemeView  isPrimary={false} style={{width: '100%', height: '100%', padding: 20, borderTopLeftRadius: 36, borderTopRightRadius: 32, gap: 20}} >
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBlock: 8}} >
                    <NormalButton 
                        text=" Filerts" 
                        textStyle={{fontWeight: 800}}
                        icon={<FeatherIcon name="filter" size={16} useInversTheme={true} />}
                    />

                    <View style={{alignItems: 'flex-end'}} >
                        <TextTheme style={{fontSize: 12}} isPrimary={false} >Total Results</TextTheme>
                        <TextTheme>
                            <FeatherIcon name="file-text" size={16} />
                            {' '}
                            12
                        </TextTheme>
                    </View> 
                </View>

                

                <View style={{minHeight: 80}} />
            </BackgroundThemeView>

            <View style={{position: 'absolute', right: 20, bottom: 20}} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setBillTypeSelectorModalVisible(true)} />
            </View>

            <BottomModal  
                visible={isBillTypeSelectorModalVisible} setVisible={setBillTypeSelectorModalVisible}
                style={{paddingHorizontal: 20, gap: 12}}   
            >
                <TextTheme style={{fontSize: 20, fontWeight: 900, marginBottom: 20}} >Select Bill Type</TextTheme>

                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12}} >
                    {
                        dummayBillsType.map(billType => (
                            <AnimateButton 
                                key={billType} 
                                style={{
                                    borderWidth: 2, borderRadius: 100, paddingInline: 16, borderColor: 'gray', paddingBlock: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
                                }}
                                onPress={() => {
                                    navigation.navigate('create-bill-screen', {billType})
                                    setBillTypeSelectorModalVisible(false);
                                }}
                            >
                                <TextTheme style={{fontWeight: 900, fontSize: 14}} >{billType}</TextTheme>
                                <FeatherIcon name="arrow-right" size={14} />
                            </AnimateButton>
                        ))
                    }
                </View>

                <View style={{minHeight: 32}} />
            </BottomModal>

        </View>
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
                {getCurrency()} {totalValue}
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

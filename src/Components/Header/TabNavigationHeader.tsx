import { View } from "react-native";
import FeatherIcon from "../Icon/FeatherIcon";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../Navigation/StackNavigation";
import BottomModal from "../Modal/BottomModal";
import { useState } from "react";
import { SectionRowWithIcon } from "../View/SectionView";
import LogoImage from "../Image/LogoImage";
import { ScrollView } from "react-native-gesture-handler";
import BackgroundThemeView from "../View/BackgroundThemeView";


type CompanyInfoType = {holderName: string, companyName: string};

const CompanyData: CompanyInfoType[] = [
    {holderName: 'Sumit', companyName: "Tech Solution Inc"},
    {holderName: 'John Wick', companyName: "Global Inovation LLC"},
]

export default function TabNavigationHeader(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'tab-navigation'>>();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    
    const [companyInfo, setCompanyInfo] = useState<CompanyInfoType>(CompanyData[0]);

    function handleSwitch(info: CompanyInfoType) {
        setCompanyInfo(info);
        setModalVisible(false);
    }

    return (
        <View style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, justifyContent: 'space-between'}} >
            <AnimateButton 
                onPress={() => setModalVisible(true)}
                style={{flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 10, paddingRight: 20, borderRadius: 40}}
            >
                <BackgroundThemeView isPrimary={false} style={{width: 40, borderRadius: 12, aspectRatio: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}} >
                    <LogoImage size={44} />
                </BackgroundThemeView>
                
                <View>
                    <TextTheme style={{fontSize: 16, fontWeight: 700}}>{companyInfo.holderName}</TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 700}}>{companyInfo.companyName}</TextTheme>
                </View>
            </AnimateButton>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
                <AnimateButton 
                    onPress={() => navigation.navigate('notification-screen')}
                    style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50}} 
                >
                    <FeatherIcon name="bell" size={20} />

                    <View style={{backgroundColor: 'rgb(250,50,50)', width: 8, aspectRatio: 1, borderRadius: 10, position: 'absolute', transform: [{translateX: 5}, {translateY: -5}]}} />
                </AnimateButton>

                <AnimateButton
                    onPress={() => navigation.navigate('setting-screen')} 
                    style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50}} 
                >
                    <FeatherIcon name="settings" size={20} />
                </AnimateButton>
            </View>

            <BottomModal
                visible={isModalVisible} setVisible={setModalVisible}
                style={{paddingInline: 20, gap: 20}}
            >
                <TextTheme style={{fontSize: 16, fontWeight: 900}} >Select Company</TextTheme>

                <ScrollView contentContainerStyle={{gap: 16}} >

                    {
                        CompanyData.map(info => (
                            <SectionRowWithIcon
                                label={info.holderName}
                                text={info.companyName}
                                icon={<LogoImage size={44}/>}
                                onPress={() => handleSwitch(info)}
                                backgroundColor={companyInfo.holderName == info.holderName ? 'rgb(50,150,250)' : ''}
                                color={companyInfo.holderName == info.holderName ? 'white' : ''}
                            />
                        ))
                    }
                                
                </ScrollView>
            </BottomModal>
        </View>
    )
}
import { View } from "react-native";
import FeatherIcon from "../Icon/FeatherIcon";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../Navigation/StackNavigation";
import BottomModal from "../Modal/BottomModal";
import { useEffect, useState } from "react";
import { SectionRowWithIcon } from "../View/SectionView";
import LogoImage from "../Image/LogoImage";
import { ScrollView } from "react-native-gesture-handler";
import BackgroundThemeView from "../View/BackgroundThemeView";
import { GetCompany } from "../../Utils/Types";
import { createCompany, getAllCompanies, getCurrentCompant } from "../../Services/company";
import NoralTextInput from "../TextInput/NoralTextInput";
import { useTheme } from "../../Contexts/ThemeProvider";
import FontAwesome6Icon from "../Icon/FontAwesome6Icon";
import arrayToFormData from "../../Utils/arrayToFormData";
import { useAlert } from "../Alert/AlertProvider";



export default function TabNavigationHeader(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'tab-navigation'>>();

    const [isCompanySwitchModalVisible, setCompanySwitchModalVisible] = useState<boolean>(false);
    const [isCompanyCreateModalVisible, setCompanyCreateMdoalVisible] = useState<boolean>(false);

    const [companyData, setCompanyData] = useState<GetCompany[] | []>([]);
    const [currentCompany, setCurrentCompany] = useState<GetCompany>();


    useEffect(() => {
        getAllCompanies().then(({data}) => {
            setCompanyData(data)
        })        

        getCurrentCompant().then(({data}) => {
            setCurrentCompany(data);
        })

    }, [])

    return (
        <View style={{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, justifyContent: 'space-between'}} >
            <AnimateButton 
                onPress={() => setCompanySwitchModalVisible(true)}
                style={{flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 10, paddingRight: 20, borderRadius: 40}}
            >
                <BackgroundThemeView isPrimary={false} style={{width: 40, borderRadius: 12, aspectRatio: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}} >
                    <LogoImage size={44} />
                </BackgroundThemeView>
                
                <View>
                    <TextTheme style={{fontSize: 16, fontWeight: 700}}>{currentCompany?.name}</TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 700}}>{currentCompany?.email}</TextTheme>
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
                visible={isCompanySwitchModalVisible} setVisible={setCompanySwitchModalVisible}
                style={{paddingInline: 20, gap: 20}}
                actionButtons={[{
                    title: '+ Add New', onPress: ()=>{
                        setCompanyCreateMdoalVisible(true);
                    }
                }]}
            >
                <TextTheme style={{fontSize: 16, fontWeight: 900}} >Select Company</TextTheme>

                <ScrollView contentContainerStyle={{gap: 16}} >

                    {
                        companyData.map(({_id, name, email}) => (
                            <SectionRowWithIcon
                                key={_id}
                                label={name}
                                text={email}
                                icon={<LogoImage size={44}/>}
                                onPress={() => {}}
                                backgroundColor={_id == currentCompany?._id ? 'rgb(50,150,250)' : ''}
                                color={_id == currentCompany?._id ? 'white' : ''}
                            />
                        ))
                    }
                                
                </ScrollView>
            </BottomModal>

            <CompanyCreateModal
                visible={isCompanyCreateModalVisible}
                setVisible={setCompanyCreateMdoalVisible}
                onCreate={()=>{
                    getAllCompanies().then(({data}) => {
                        setCompanyData(data)
                    })  
                }}
            />

        </View>
    )
}


type CompanyCreateModalType = {
    visible: boolean, 
    setVisible: (vis: boolean) => void, 
    onCreate: () => void
}

function CompanyCreateModal({visible, setVisible, onCreate}: CompanyCreateModalType) {

    const {primaryColor} = useTheme();
    const {setAlert} = useAlert();

    const [name, setName] = useState<string>('');
    const [mail, setMail] = useState<string>('');

    async function onPress(){
        if(!(name && mail)) return setAlert({
            type: 'error', massage: 'all field are require to create new company', id: 'company-create-modal'
        });

        let from = arrayToFormData([['name', name], ['email', mail]]);
        
        let {status} = await createCompany(from)

        if(status) onCreate();
        else setAlert({
            type: 'error', massage: 'Internal server error'
        })
    }

    return (
        <BottomModal
            alertId='company-create-modal'
            visible={visible} setVisible={setVisible}
            style={{paddingInline: 20}}
            actionButtons={[{title: 'Create', onPress}]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 900, marginBottom: 12}} >Create Company</TextTheme>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FontAwesome6Icon name="building" size={28} />
                <NoralTextInput
                    placeholder="Company Name"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                    onChangeText={setName}
                />
            </View>
            
            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="mail" size={28} />
                <NoralTextInput
                    placeholder="Mail Id"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                    onChangeText={setMail}
                />
            </View>
            
            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
import { View } from "react-native";
import FeatherIcon from "../Icon/FeatherIcon";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import BottomModal from "../Modal/BottomModal";
import { useEffect, useState } from "react";
import { SectionRowWithIcon } from "../View/SectionView";
import LogoImage from "../Image/LogoImage";
import { ScrollView } from "react-native-gesture-handler";
import BackgroundThemeView from "../View/BackgroundThemeView";
import { createCompany, getAllCompanies, getCompany, setCompany } from "../../Services/company";
import NoralTextInput from "../TextInput/NoralTextInput";
import { useTheme } from "../../Contexts/ThemeProvider";
import FontAwesome6Icon from "../Icon/FontAwesome6Icon";
import arrayToFormData from "../../Utils/arrayToFormData";
import { useAlert } from "../Alert/AlertProvider";
import { useAppDispatch, useCompanyStore } from "../../Store/ReduxStore";
import navigator from "../../Navigation/NavigationService";
import LoadingView from "../View/LoadingView";
import ShowWhen from "../Other/ShowWhen";
import { setIsCompanyFetching } from "../../Store/Redusers/companyReduser";

export default function HomeScreenHeader(): React.JSX.Element {

    const [isCompanySwitchModalVisible, setCompanySwitchModalVisible] = useState<boolean>(false);
    const [isCompanyCreateModalVisible, setCompanyCreateModalVisible] = useState<boolean>(false);


    const { company, companies, isCompanyFetching } = useCompanyStore();
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getCompany());
        dispatch(getAllCompanies());
    }, [])

    return (
        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, justifyContent: 'space-between' }} >
            <AnimateButton
                onPress={() => setCompanySwitchModalVisible(true)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 10, paddingRight: 20, borderRadius: 40 }}
            >
                <ShowWhen 
                    when={!isCompanyFetching} 
                    otherwise={<LoadingView width={44} height={44} />}
                >
                    <BackgroundThemeView isPrimary={false} style={{ width: 40, borderRadius: 12, aspectRatio: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }} >
                        <LogoImage size={44} />
                    </BackgroundThemeView>
                </ShowWhen>

                <View>
                    <ShowWhen 
                        when={!isCompanyFetching} 
                        otherwise={<>
                            <LoadingView height={12} width={50} style={{marginBottom: 4}} />
                            <LoadingView height={12} width={80} />
                        </>}
                    >
                        <TextTheme numberOfLines={1} style={{ fontSize: 16, fontWeight: 700 }}>
                            {company?.name}
                        </TextTheme>
                        <TextTheme numberOfLines={1} isPrimary={false} style={{ fontSize: 12, fontWeight: 700 }}>
                            {company?.email}
                        </TextTheme>
                    </ShowWhen>
                </View>
            </AnimateButton>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <AnimateButton
                    onPress={() => navigator.navigate('notification-screen')}
                    style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                >
                    <FeatherIcon name="bell" size={20} />

                    <View style={{ backgroundColor: 'rgb(250,50,50)', width: 8, aspectRatio: 1, borderRadius: 10, position: 'absolute', transform: [{ translateX: 5 }, { translateY: -5 }] }} />
                </AnimateButton>

                <AnimateButton
                    onPress={() => navigator.navigate('setting-screen')}
                    style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                >
                    <FeatherIcon name="settings" size={20} />
                </AnimateButton>
            </View>

            <BottomModal
                visible={isCompanySwitchModalVisible} setVisible={setCompanySwitchModalVisible}
                style={{ paddingInline: 20, gap: 20 }}
                actionButtons={companies.length >= 2 ? undefined : [{
                    title: '+ Add New', onPress: () => {
                        setCompanyCreateModalVisible(true);
                    }
                }]}
            >
                <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Select Company</TextTheme>

                <ScrollView contentContainerStyle={{ gap: 16 }} >

                    {
                        companies.map(({ _id, name, email }) => (
                            <SectionRowWithIcon
                                key={_id}
                                label={name}
                                text={email}
                                icon={<LogoImage size={44} />}
                                backgroundColor={_id == company?._id ? 'rgb(50,150,250)' : ''}
                                color={_id == company?._id ? 'white' : ''}
                                onPress={() => { 
                                    if(_id == company?._id) return setCompanySwitchModalVisible(false);
                                    
                                    dispatch(setIsCompanyFetching(true));
                                    dispatch(setCompany(_id)).then(_ => dispatch(getCompany()));
                                    setCompanySwitchModalVisible(false);
                                }}
                            />
                        ))
                    }

                </ScrollView>
            </BottomModal>

            <CompanyCreateModal
                visible={isCompanyCreateModalVisible}
                setVisible={setCompanyCreateModalVisible}
            />

        </View>
    )
}


type CompanyCreateModalType = {
    visible: boolean,
    setVisible: (vis: boolean) => void
}

function CompanyCreateModal({ visible, setVisible }: CompanyCreateModalType) {

    const { primaryColor } = useTheme();
    const { setAlert } = useAlert();
    const dispatch = useAppDispatch();
    const {companies, isCompaniesFetching} = useCompanyStore()

    const [name, setName] = useState<string>('');
    const [mail, setMail] = useState<string>('');

    async function onPress() {
        if (!(name && mail)) return setAlert({
            type: 'error', massage: 'all field are require to create new company', id: 'company-create-modal'
        });

        let from = arrayToFormData([['name', name.trim()], ['email', mail.trim()]]);
        
        await dispatch(createCompany(from));
        const {payload: res} = await dispatch(getAllCompanies());

        if((res?.companies ?? []).length === 1){
            dispatch(setIsCompanyFetching(true));
            dispatch(setCompany(res.companies[0]._id)).then(_ => dispatch(getCompany()));
        }

        setVisible(false);
    }

    return (
        <BottomModal
            alertId='company-create-modal'
            visible={isCompaniesFetching ? visible : companies.length === 0 ? true : visible} setVisible={setVisible}
            closeOnBack={companies.length !== 0}
            style={{ paddingInline: 20 }}
            actionButtons={[{ title: 'Create', onPress }]}
        >
            <TextTheme style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }} >Create Company</TextTheme>

            <View style={{ marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12 }} >
                <FontAwesome6Icon name="building" size={28} />
                <NoralTextInput
                    placeholder="Company Name"
                    style={{ fontSize: 24, fontWeight: 900, flex: 1 }}
                    onChangeText={setName}
                    autoCapitalize="sentences"
                />
            </View>

            <View style={{ marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12 }} >
                <FeatherIcon name="mail" size={28} />
                <NoralTextInput
                    placeholder="Mail Id"
                    style={{ fontSize: 24, fontWeight: 900, flex: 1 }}
                    onChangeText={setMail}
                    autoCapitalize="none"
                />
            </View>

            <View style={{ minHeight: 40 }} />
        </BottomModal>
    )
}
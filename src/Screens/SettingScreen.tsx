import { ScrollView } from "react-native-gesture-handler";
import StackNavigationHeader from "../Components/Header/StackNavigationHeader";
import { View, ViewStyle } from "react-native";
import AnimateButton from "../Components/Button/AnimateButton";
import { useTheme } from "../Contexts/ThemeProvider";
import FeatherIcon from "../Components/Icon/FeatherIcon";
import SectionView, { SectionRowWithIcon } from "../Components/View/SectionView";
import TextTheme from "../Components/Text/TextTheme";
import navigator from "../Navigation/NavigationService";
import AuthStore from "../Store/AuthStore";

export default function SettingScreen(): React.JSX.Element {

    const {setTheme, theme} = useTheme();

    return (
        <View style={{width: '100%', height: '100%'}} >
            <StackNavigationHeader title="Settings" />

            <ScrollView style={{width: "100%", paddingInline: 20}} contentContainerStyle={{gap: 24}} > 
               
                <SectionView label="App Prefernces" style={{gap: 12}} >
                    <SectionRowWithIcon
                        label="Theme"
                        icon={<FeatherIcon name={theme == 'dark' ? "moon" : 'sun'} size={20} />}
                        text={`Click for trun on ${theme == 'dark' ? 'light' : 'dark'} mode.`}
                        onPress={() => setTheme((pre) => pre == 'light' ? 'dark' : 'light')}
                    />
                   
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Notification"
                        text="Manage your Notification"
                        icon={<FeatherIcon name="bell" size={20}/>}
                        onPress={() => {}}
                    />

                    <SectionRowWithIcon
                        label="Currency"
                        icon={<FeatherIcon name={"dollar-sign"} size={20} />}
                        text={"Customize currency"}
                        onPress={() => {}}
                    >
                        <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                            <TextTheme style={{fontWeight: 900, fontSize: 16}} >INR</TextTheme>
                            <FeatherIcon name="chevron-right" size={20} />
                        </View>
                    </SectionRowWithIcon>
                </SectionView>
               
                
                
                <SectionView label="Bill Setting" style={{gap: 12}} >
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Bill Templates"
                        icon={<FeatherIcon name={"file-text"} size={20} />}
                        text={"Customize bill templates"}
                        onPress={() => {}}
                    />
                    
                    <SectionRowWithIcon
                        label="Bill Prefix"
                        icon={<FeatherIcon name={"hash"} size={20} />}
                        text={"Customize your bill Prefix"}
                        onPress={() => {}}
                    >
                        <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                            <TextTheme style={{fontWeight: 900, fontSize: 16}} >#INV-001</TextTheme>
                            <FeatherIcon name="chevron-right" size={20} />
                        </View>
                    </SectionRowWithIcon>
                </SectionView>

                <SectionView label="Bussiness Details" style={{gap: 12}} >
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Business Profile"
                        icon={<FeatherIcon name={"user"} size={20} />}
                        text={"Update your business profile information"}
                        onPress={() => navigator.navigate('company-profile-screen')}
                    />

                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Group & Types"
                        icon={<FeatherIcon name={"inbox"} size={20} />}
                        text={"Manage your all groups and types"}
                        onPress={() => {}}
                    />
                </SectionView>
                
                <SectionView label="Help & Other" style={{gap: 12}} >
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Help Center"
                        icon={<FeatherIcon name={"help-circle"} size={20} />}
                        text={"Access help documentation"}
                        onPress={() => {}}
                    />
                    
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Privacy Policy"
                        icon={<FeatherIcon name={"file-minus"} size={20} />}
                        text={"View privacy policy"}
                        onPress={() => {}}
                    />
                    
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Github"
                        icon={<FeatherIcon name={"github"} size={20} />}
                        text={"https://github.com/Mustak24/Vyapar-Drishti"}
                        onPress={() => {}}
                    />
                    
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Logout"
                        icon={<FeatherIcon name={"log-out"} size={20} color="white" />}
                        text={"to log out from your account"}
                        backgroundColor="rgb(50,150,250)"
                        iconContainerColor="rgb(120,200,250)"
                        color="white"
                        onPress={() => {
                            AuthStore.clearAll();
                            navigator.replace('landing-screen');
                        }}
                    />
                </SectionView>

                <SectionView label="Danger Zone" style={{gap: 12}} labelColor="red" >
                    <SectionRowWithIcon
                        color="white"
                        backgroundColor="rgb(255,80,100)"
                        label="Delete Data"
                        icon={<FeatherIcon name={"alert-triangle"} size={20} color="red" />}
                        text={"Remove all information"}
                        onPress={() => {}}
                    />
                    
                    <SectionRowWithIcon
                        color="white"
                        backgroundColor="rgb(255,50,80)"
                        label="Delete Account"
                        icon={<FeatherIcon name={"alert-circle"} size={20} color="red" />}
                        text={"Delete account from database"}
                        onPress={() => {}}
                    />
                </SectionView>


                <View style={{minHeight: 40}} />
            </ScrollView>
        </View>
    )
}


type ContainerProps = {
    children: React.ReactNode,
    backgroundColor?: string,
    style?: ViewStyle,
    onPress?: ()=>void
}

function Container({children, backgroundColor='rgb(25,25,25)', style={}, onPress=()=>{}}: ContainerProps): React.JSX.Element {
    
    return (
        <AnimateButton 
            style={{padding: 20, borderRadius: 20, backgroundColor, width: '100%', overflow: 'hidden', ...style}}
            onPress={onPress}
            bubbleScale={30}
        >
            {children}
        </AnimateButton>
    )
}
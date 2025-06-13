import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../Components/Text/TextTheme";
import StackNavigationHeader from "../Components/Header/StackNavigationHeader";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SectionView, { SectionArrowRow, SectionRow } from "../Components/View/SectionView";
import FeatherIcon from "../Components/Icon/FeatherIcon";
import LogoImage from "../Components/Image/LogoImage";
import NormalButton from "../Components/Button/NormalButton";

export default function ProfileScreen(): React.JSX.Element {
    return (
        <View style={{width: '100%', height: '100%'}}>
            <StackNavigationHeader title="Profile" />
            
            <ScrollView style={{paddingHorizontal: 20, width: '100%', height: '100%'}} contentContainerStyle={{gap: 28}} scrollEnabled={true}>

                <View style={{ alignItems: 'center', padding: 16, width: '100%' }}>
                    <LogoImage size={100} borderRadius={100} />
                    <TextTheme style={{ fontSize: 22, fontWeight: 'bold' }} >Ethan Carter</TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 16}} >ethan.carter@email.com</TextTheme>
                </View>

                <SectionView label="Account" >
                    <SectionArrowRow 
                        icon={<FeatherIcon name="info" size={24} />}
                        text="Persnol Information" 
                        onPress={() => {}} 
                    />
                </SectionView>
                
                <SectionView label="Contact" style={{gap: 8}} >
                    <SectionRow onPress={() => {}} style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{fontSize: 16, fontWeight: 900}} >Phone</TextTheme>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}} >
                            <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >xxxxx-xxxx</TextTheme>
                            <FeatherIcon isPrimary={false} name="phone" size={16} />
                        </View>
                    </SectionRow>

                    <SectionRow onPress={() => {}} style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{fontSize: 16, fontWeight: 900}} >Email</TextTheme>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}} >
                            <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >ethan.carter@email.com</TextTheme>
                            <FeatherIcon isPrimary={false} name="mail" size={16} />
                        </View>
                    </SectionRow>
                </SectionView>
                
                <SectionView label="Address" style={{gap: 8}} >
                    <SectionRow onPress={() => {}} style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{fontSize: 16, fontWeight: 900}} >State</TextTheme>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}} >
                            <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >Rajasthan</TextTheme>
                            <FeatherIcon isPrimary={false} name="map" size={16} />
                        </View>
                    </SectionRow>

                    <SectionRow onPress={() => {}} style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{fontSize: 16, fontWeight: 900}} >City</TextTheme>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}} >
                            <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >Udaipur</TextTheme>
                            <FeatherIcon isPrimary={false} name="home" size={16} />
                        </View>
                    </SectionRow>
                    
                    <SectionRow onPress={() => {}} style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{fontSize: 16, fontWeight: 900}} >Pin Code</TextTheme>

                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}} >
                            <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >313324</TextTheme>
                            <FeatherIcon isPrimary={false} name="map-pin" size={16} />
                        </View>
                    </SectionRow>
                </SectionView>
                
                <NormalButton isPrimary={false} text="Logout" textStyle={{fontWeight: 900}} /> 

                <View style={{minHeight: 40}} />
            </ScrollView>
        </View>
    )
}


// Section Component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={{ paddingTop: 16 }}>
    <TextTheme
      style={{
        color: '#121416',
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginBottom: 8,
      }}
    >
      {title}
    </TextTheme>
    {children}
  </View>
);

// Row Component
const Row: React.FC<{
  label: string;
  value?: string;
  hasArrow?: boolean;
}> = ({ label, value, hasArrow = false }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      minHeight: 56,
      justifyContent: 'space-between',
    }}
  >
    <TextTheme
      numberOfLines={1}
      style={{
        flex: 1,
        fontSize: 16,
        color: '#121416',
      }}
    >
      {label}
    </TextTheme>
    {hasArrow ? (
      <Icon name="chevron-right" size={24} color="#121416" />
    ) : (
      <TextTheme style={{ color: '#121416', fontSize: 16 }}>{value}</TextTheme>
    )}
  </View>
);

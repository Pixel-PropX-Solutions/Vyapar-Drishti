import { View } from "react-native";
import StackNavigationHeader from "../../Components/Header/StackNavigationHeader";
import { ScrollView } from "react-native-gesture-handler";
import SectionView from "../../Components/View/SectionView";
import LabelTextInput from "../../Components/TextInput/LabelTextInput";
import NormalButton from "../../Components/Button/NormalButton";

export default function CreateCompanyScreen(): React.JSX.Element {
    return (
        <View style={{width: '100%', height: '100%'}} >
            <StackNavigationHeader title="Create new company" />

            <ScrollView style={{paddingInline: 20}} contentContainerStyle={{gap: 24}} >
                <SectionView label="Company Details" style={{gap: 20}} >
                    <LabelTextInput 
                        label="Company Name"
                        placeholder="Enter Company Name"
                    />

                    <LabelTextInput 
                        label="Website URL"
                        placeholder="https://companyname.com"
                    />
                </SectionView>
                
                <SectionView label="Contact Information" style={{gap: 20}} >
                    <LabelTextInput 
                        label="Company Email"
                        placeholder="contact@companyname.com"
                    />
                    
                    <View style={{flexDirection: 'row', gap: 12}} >
                        <LabelTextInput 
                            label="Country Code"
                            placeholder="e.g. +91, +1"
                            containerStyle={{width: 120}}
                        />
                    
                        <LabelTextInput 
                            containerStyle={{flex: 1}}
                            label="Phone Number"
                            placeholder="xxxxx-xxxxx"
                        />
                    </View>

                    <LabelTextInput 
                        label="Maling Name"
                        placeholder="e.g. Technology, Menufacturing"
                    />
                    
                    <LabelTextInput 
                        label="Street Address"
                        placeholder="Apt, Suite or Building"
                    />

                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}} >
                        <LabelTextInput 
                            label="Country"
                            placeholder="e.g. United State, India"
                            containerStyle={{flex: 1}}
                        />
                        
                        <LabelTextInput 
                            label="Post Code"
                            placeholder="e.g. 12345, A1B, 2C3"
                            style={{width: 120}}
                        />
                    </View>
                </SectionView>

                <NormalButton text="Create" onPress={() => {}} />
            </ScrollView>
        </View>
    )
}
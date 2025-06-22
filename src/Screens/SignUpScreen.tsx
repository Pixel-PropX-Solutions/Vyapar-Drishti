import { Pressable, View } from "react-native";
import SafePaddingView from "../Components/SafeAreaView/SafePaddingView";
import TextTheme from "../Components/Text/TextTheme";
import LabelTextInput from "../Components/TextInput/LabelTextInput";
import LogoImage from "../Components/Image/LogoImage";
import NormalButton from "../Components/Button/NormalButton";
import { ScrollView, Text } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../Navigation/StackNavigation";
import { useState } from "react";
import { isValidEmail, isValidMobileNumber } from "../Functions/StringOpations/pattenMaching";
import { useAppDispatch, useUserStore } from "../Store/ReduxStore";
import { register } from "../Services/user";

export default function SignUpScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'signup-screen'>>();
    const dispatch = useAppDispatch();
    const {loading, isAuthenticated} = useUserStore();


    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('91'); 
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    async function handleSignUp() {
        if(!(firstName && lastName && email && code && phoneNumber)) {
            console.log('Please fill all fields');
            return;
        }

        let data = {name: {first: firstName, last: lastName}, email, phone: {code, number: phoneNumber}};
        
        await dispatch(register(data));
        
        if(isAuthenticated){
            navigation.replace('tab-navigation');
        } else {
            console.log('Registration failed, please try again');
        }
    }

    return (
        <ScrollView 
            style={{width: '100%', height: '100%', paddingInline: 20}} contentContainerStyle={{alignItems: 'center'}} 
            keyboardShouldPersistTaps='handled'    
        >
            <View style={{display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40}} >
                <LogoImage size={100} borderRadius={50} />
                <TextTheme style={{fontWeight: 900, fontSize: 24}} >Vyapar Drishti</TextTheme>

                <TextTheme style={{fontSize: 16, fontWeight: 900, marginTop: 24}} >
                    Sign Up for new free Account
                </TextTheme>
            </View>

            <View style={{display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20}}>
                <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12}} >
                    <View style={{flex: 1}}>
                        <LabelTextInput 
                            label="First Name" 
                            placeholder="John" 
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View style={{flex: 1}}>
                        <LabelTextInput 
                            label="Last Name" 
                            placeholder="Wick" 
                            onChangeText={setLastName}
                        />
                    </View>
                </View>
                
                <LabelTextInput 
                    label="Email" 
                    placeholder="john@gmail.com" 
                    keyboardType="email-address" 
                    checkInputText={isValidEmail}
                    massage="Enter mail was invalid !!!"
                    onChangeText={setEmail}
                />

                <View style={{flexDirection: 'row', gap: 12}} >
                    <LabelTextInput
                        value={code} 
                        label="Code" 
                        placeholder="e.g. +91, +1" 
                        keyboardType="phone-pad" 
                        onChangeText={setCode}
                        containerStyle={{width: 100}}
                    />

                    <LabelTextInput 
                        label="Phone Number" 
                        placeholder="e.g. 12344567890" 
                        keyboardType="phone-pad" 
                        checkInputText={isValidMobileNumber}
                        massage="Phone number only content digits"
                        onChangeText={setPhoneNumber}
                        containerStyle={{flex: 1}}
                    />

                </View>
                {/* <View>
                    <PasswordInput  
                        checkInputText={(pass) => pass.length >= 8}
                        massage="Password lenght is too short"
                        onChangeText={setPassword}
                        />
                    <TextTheme style={{paddingLeft: 4, paddingTop: 8}}>Forgot Password</TextTheme>
                </View> */}
                
                <View style={{display: 'flex'}} >
                    <NormalButton 
                        text="Sign Up" 
                        textStyle={{fontWeight: 900, fontSize: 16,}} 
                        onPress={handleSignUp}
                        isLoading={loading} 
                        onLoadingText="Wait..."
                    /> 
                    
                    <Pressable onPress={() => {navigation.replace('login-screen'); console.log(navigation)}} >
                        <TextTheme style={{paddingLeft: 4, paddingTop: 12, textAlign: 'center'}}>
                            Already have Account?
                            <Text style={{color: 'rgb(50,150,250)', fontWeight: 900, paddingLeft: 8}}>
                                {' Login'}
                            </Text>
                        </TextTheme>
                    </Pressable>  
                </View>
            </View>
        </ScrollView>    
    )
}
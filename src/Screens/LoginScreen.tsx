import { Pressable, View } from "react-native";
import SafePaddingView from "../Components/SafeAreaView/SafePaddingView";
import TextTheme from "../Components/Text/TextTheme";
import LabelTextInput from "../Components/TextInput/LabelTextInput";
import LogoImage from "../Components/Image/LogoImage";
import NormalButton from "../Components/Button/NormalButton";
import PasswordInput from "../Components/TextInput/PasswordInput";
import { ScrollView, Text } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../Navigation/StackNavigation";
import { isValidEmail } from "../Functions/StringOpations/pattenMaching";
import { useState } from "react";

export default function SignUpScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'login-screen'>>();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <ScrollView style={{width: '100%', height: '100%', paddingInline: 20}} contentContainerStyle={{alignItems: 'center'}} >
            <View style={{display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40}} >
                <LogoImage size={100} borderRadius={50} />
                <TextTheme style={{fontWeight: 900, fontSize: 24}} >Vyapar Drishti</TextTheme>

                <TextTheme style={{fontSize: 16, fontWeight: 900, marginTop: 24}} >
                    Log in to your User Account
                </TextTheme>
            </View>

            <View style={{display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20}}>
                <LabelTextInput 
                    label="Email" 
                    placeholder="john@gmail.com" 
                    checkInputText={isValidEmail} 
                    massage="Invalid Email Address" 
                    onChangeText={setEmail}
                />

                <View>
                    <PasswordInput 
                        checkInputText={(text) => text.length >= 8} 
                        massage="Password length is too short" 
                        onChangeText={setPassword}
                    />

                    <TextTheme style={{paddingLeft: 4, paddingTop: 8}}>
                        Forgot Password
                    </TextTheme>
                </View>
                
                <View style={{display: 'flex'}} >
                    <NormalButton text="Login" textStyle={{fontWeight: 900, fontSize: 16}} /> 
                    
                    <Pressable onPress={() => {navigation.replace('signup-screen'); console.log(navigation)}} >
                        <TextTheme style={{paddingLeft: 4, paddingTop: 12, textAlign: 'center'}}>
                            Create new Account?
                            <Text style={{color: 'rgb(50,150,250)', fontWeight: 900, paddingLeft: 8}}>
                                {' Sign Up'}
                            </Text>
                        </TextTheme>
                    </Pressable>  
                </View>
            </View>
        </ScrollView>
    )
}
import { Pressable, View } from "react-native";
import TextTheme from "../Components/Ui/Text/TextTheme";
import LabelTextInput from "../Components/Ui/TextInput/LabelTextInput";
import LogoImage from "../Components/Image/LogoImage";
import NormalButton from "../Components/Ui/Button/NormalButton";
import { ScrollView, Text } from "react-native-gesture-handler";
import { useRef, useState } from "react";
import { isValidEmail } from "../Functions/StringOpations/pattenMaching";
import { useAppDispatch, useUserStore } from "../Store/ReduxStore";
import { getCurrentUser, register } from "../Services/user";
import navigator from "../Navigation/NavigationService";
import { getCompany } from "../Services/company";
import PhoneNoTextInput from "../Components/Ui/Option/PhoneNoTextInput";
import { PhoneNumber } from "../Utils/types";

export default function SignUpScreen(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const { loading } = useUserStore();


    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const phone = useRef<PhoneNumber>({ code: '', number: "" })

    async function handleSignUp() {
        if (!(firstName && lastName && email && phone.current.code && phone.current.number)) {
            console.log('Please fill all fields');
            return;
        }

        const data = { name: { first: firstName, last: lastName }, email, phone: phone.current };

        await dispatch(register(data)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                dispatch((getCurrentUser()));
                dispatch(getCompany());
                navigator.reset('tab-navigation');

                phone.current = { code: '', number: '' }
            } else {
                console.log('Registration failed:', response);
            }
        });
    }

    return (
        <ScrollView
            style={{ width: '100%', height: '100%', paddingInline: 20 }} contentContainerStyle={{ alignItems: 'center' }}
            keyboardShouldPersistTaps='handled'
        >
            <View style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40 }} >
                <LogoImage size={100} borderRadius={50} />
                <TextTheme style={{ fontWeight: 900, fontSize: 24 }} >Vyapar Drishti</TextTheme>

                <TextTheme style={{ fontSize: 16, fontWeight: 900, marginTop: 24 }} >
                    Sign Up for new free Account
                </TextTheme>
            </View>

            <View style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20 }}>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12 }} >
                    <View style={{ flex: 1 }}>
                        <LabelTextInput
                            label="First Name"
                            placeholder="John"
                            onChangeText={setFirstName}
                            useTrim={true}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <LabelTextInput
                            label="Last Name"
                            placeholder="Wick"
                            onChangeText={setLastName}
                            useTrim={true}
                            autoCapitalize="words"
                        />
                    </View>
                </View>

                <LabelTextInput
                    label="Email"
                    placeholder="john@gmail.com"
                    keyboardType="email-address"
                    checkInputText={isValidEmail}
                    message="Enter mail was invalid !!!"
                    onChangeText={setEmail}
                    useTrim={true}
                    autoCapitalize="none"
                />

                <PhoneNoTextInput
                    onChangePhoneNumber={(phoneNo) => { phone.current = phoneNo }}
                />
                
                {/* <View>
                    <PasswordInput  
                        checkInputText={(pass) => pass.length >= 8}
                        message="Password lenght is too short"
                        onChangeText={setPassword}
                        />
                    <TextTheme style={{paddingLeft: 4, paddingTop: 8}}>Forgot Password</TextTheme>
                </View> */}

                <View style={{ display: 'flex' }} >
                    <NormalButton
                        text="Sign Up"
                        textStyle={{ fontWeight: 900, fontSize: 16, }}
                        onPress={handleSignUp}
                        isLoading={loading}
                        onLoadingText="Wait..."
                    />

                    <Pressable onPress={() => { navigator.replace('login-screen'); }} >
                        <TextTheme style={{ paddingLeft: 4, paddingTop: 12, textAlign: 'center' }}>
                            Already have Account?
                            <Text style={{ color: 'rgb(50,150,250)', fontWeight: 900, paddingLeft: 8 }}>
                                {' Login'}
                            </Text>
                        </TextTheme>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}
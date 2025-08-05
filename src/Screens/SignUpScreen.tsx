/* eslint-disable react-native/no-inline-styles */
import { KeyboardAvoidingView, Linking, Pressable, View } from 'react-native';
import TextTheme from '../Components/Ui/Text/TextTheme';
import LabelTextInput from '../Components/Ui/TextInput/LabelTextInput';
import LogoImage from '../Components/Image/LogoImage';
import NormalButton from '../Components/Ui/Button/NormalButton';
import { ScrollView, Text } from 'react-native-gesture-handler';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { isValidEmail } from '../Functions/StringOpations/pattenMaching';
import { useAppDispatch, useUserStore } from '../Store/ReduxStore';
import { getCurrentUser, register } from '../Services/user';
import navigator from '../Navigation/NavigationService';
import PhoneNoTextInput from '../Components/Ui/Option/PhoneNoTextInput';
import { PhoneNumber } from '../Utils/types';
import { useAlert } from '../Components/Ui/Alert/AlertProvider';
import PasswordInput from '../Components/Ui/TextInput/PasswordInput';
import { isValidMobileNumber } from '../Utils/functionTools';
import LoadingModal from '../Components/Modal/LoadingModal';
import CenterModal from '../Components/Modal/CenterModal';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import { getCompany } from '../Services/company';

export default function SignUpScreen(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const { loading } = useUserStore();
    const { setAlert } = useAlert();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const data = useRef<{ name: { first: string, last: string }, email: string, phone: PhoneNumber, password: string }>({ name: { first: '', last: '' }, email: '', phone: { code: '', number: '' }, password: '' });

    async function handleSignUp() {
        const info = data.current;

        if (
            info.name.first.length < 3 || !isValidEmail(info.email) ||
            info.password.length < 8 || !info.phone.code ||
            !isValidMobileNumber(info.phone.number)
        ) { return; }


        await dispatch(register(info)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {

                setAlert({
                    message: 'You have successfully registered. Please check your email for verification.',
                    type: 'success',
                });
                dispatch(getCurrentUser());
                dispatch(getCompany());
                setTimeout(() => {
                    navigator.reset('tab-navigation');
                }, 4000);
                data.current.phone = { code: '', number: '' };
            } else {
                setAlert({
                    message: 'Registration failed. Please try again.',
                    type: 'error',
                });
                console.log('Registration failed:', response);
            }
        });
    }

    return (
        <KeyboardAvoidingView behavior="padding" >
            <ScrollView
                style={{ width: '100%', height: '100%', paddingInline: 20 }} contentContainerStyle={{ alignItems: 'center' }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40 }} >
                    <LogoImage size={100} borderRadius={50} />
                    <TextTheme fontWeight={900} fontSize={24} >Vyapar Drishti</TextTheme>

                    <TextTheme fontWeight={900} fontSize={16} style={{ marginTop: 24 }} >
                        Sign Up for new free Account
                    </TextTheme>
                </View>

                <View style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20 }}>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12 }} >
                        <View style={{ flex: 1 }}>
                            <LabelTextInput
                                label="First Name"
                                placeholder="John"
                                onChangeText={val => { data.current.name.first = val; }}
                                useTrim={true}
                                isRequired={true}
                                message="first name have min 3 char"
                                checkInputText={val => val.length > 2}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <LabelTextInput
                                label="Last Name"
                                placeholder="Wick"
                                onChangeText={val => { data.current.name.last = val; }}
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
                        onChangeText={val => { data.current.email = val; }}
                        useTrim={true}
                        isRequired={true}
                        autoCapitalize="none"
                    />

                    <PhoneNoTextInput
                        onChangePhoneNumber={val => { data.current.phone = val; }}
                        checkNumberIsValid={val => isValidMobileNumber(val) && val.length === 10}
                        isRequired={true}
                    />

                    <View>
                        <PasswordInput
                            checkInputText={(pass) => pass.length >= 8}
                            message="Password lenght is too short"
                            onChangeText={val => { data.current.password = val; }}
                            isRequired={true}
                        />
                    </View>

                    <View style={{ display: 'flex' }} >
                        <NormalButton
                            text="Sign Up"
                            onPress={handleSignUp}
                            isLoading={loading}
                            onLoadingText="Wait..."
                        />

                        <Pressable onPress={() => {
                            navigator.replace('login-screen');
                        }} >
                            <TextTheme style={{ paddingLeft: 4, paddingTop: 12, textAlign: 'center' }}>
                                Already have Account?
                                <Text style={{ color: 'rgb(50,150,250)', fontWeight: 900, paddingLeft: 8 }}>
                                    {' Login'}
                                </Text>
                            </TextTheme>
                        </Pressable>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }} >
                        <TextTheme>By creating an account, you agree to our</TextTheme>

                        <TextTheme color="rgb(50,150,200)" isPrimary={false} style={{ textDecorationLine: 'underline' }} >
                            Terms of Service
                        </TextTheme>

                        <TextTheme>and</TextTheme>

                        <TextTheme color="rgb(50,150,200)" isPrimary={false} style={{ textDecorationLine: 'underline' }} >
                            privacy policy
                        </TextTheme>
                    </View>
                </View>
            </ScrollView>

            <LoadingModal visible={loading} />
            <SignUpModal visible={isModalVisible} setVisible={setModalVisible} />
        </KeyboardAvoidingView>
    );
}


function SignUpModal({ visible, setVisible }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>> }): React.JSX.Element {

    async function handleVerification() {
        const url = 'googlegmail://inbox';
        const supported = await Linking.canOpenURL(url);

        setVisible(false);

        if (supported) {
            Linking.openURL(url);
        } else {
            Linking.openURL('https://mail.google.com/');
        }
    }

    return (
        <CenterModal visible={visible} setVisible={setVisible} hasCloseButton={false} closeOnBack={false}
            actionButtons={[
                { title: 'Back to Login', onPress: () => { setVisible(false); navigator.replace('login-screen'); }, isPrimary: false },
                { title: 'Verify Account', onPress: handleVerification },
            ]}
        >
            <View style={{ alignItems: 'center', width: '100%', justifyContent: 'center', paddingBlock: 20 }} >
                <FeatherIcon name="check-circle" color="rgb(50,200,150)" size={60} style={{ marginBottom: 20 }} />

                <TextTheme fontSize={28} fontWeight={800} >Account Created</TextTheme>

                <TextTheme isPrimary={false} style={{ textAlign: 'center', marginBlock: 12 }} >
                    We've sent a mail to verify account. Please check your inbox and spam folder and follow the instructions to verify your account.
                </TextTheme>
            </View>
        </CenterModal>
    );
}

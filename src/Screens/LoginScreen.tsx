/* eslint-disable react-native/no-inline-styles */
import { Pressable, View } from 'react-native';
import TextTheme from '../Components/Ui/Text/TextTheme';
import LabelTextInput from '../Components/Ui/TextInput/LabelTextInput';
import LogoImage from '../Components/Image/LogoImage';
import NormalButton from '../Components/Ui/Button/NormalButton';
import PasswordInput from '../Components/Ui/TextInput/PasswordInput';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { loginUser } from '../Services/user';
import { useAlert } from '../Components/Ui/Alert/AlertProvider';
import { useAppDispatch, useUserStore } from '../Store/ReduxStore';
import navigator from '../Navigation/NavigationService';
import LoadingModal from '../Components/Modal/LoadingModal';

export default function LoginScreen(): React.JSX.Element {
    const { setAlert } = useAlert();
    const { loading } = useUserStore();
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    // Form validation
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(username.trim());
        const isPasswordValid = password.length >= 6;
        setIsFormValid(isEmailValid && isPasswordValid);
    }, [username, password]);

    async function handleLogin() {
        if (!username.trim() || !password.trim()) {
            return setAlert({
                type: 'error',
                message: 'Please fill in all required fields.',
            });
        }

        if (!isFormValid) {
            return setAlert({
                type: 'error',
                message: 'Please enter a valid email and password (minimum 6 characters).',
            });
        }

        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('password', password);

        dispatch(loginUser(formData))
            .unwrap()
            .then((res) => {
                if (res && res?.accessToken) {
                    setAlert({
                        type: 'success',
                        message: 'Login successful! Welcome back.',
                    });
                    return navigator.reset('tab-navigation');
                }
            })
            .catch((err) => {
                return setAlert({
                    type: 'error',
                    message: err || 'Invalid credentials. Please try again.',
                });
            });
    }



    return (

        <>
            <ScrollView
                style={{ width: '100%', height: '100%', paddingInline: 20 }} contentContainerStyle={{ alignItems: 'center' }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40 }} >
                    <LogoImage size={100} borderRadius={50} />
                    <TextTheme fontWeight={900} fontSize={24} >Vyapar Drishti</TextTheme>

                    <TextTheme fontWeight={900} fontSize={16} style={{ marginTop: 24 }} >
                        Log in to your User Account
                    </TextTheme>
                </View>

                <View style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20 }}>
                    <LabelTextInput
                        label="Email"
                        placeholder="Enter your email"
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        useTrim={true}
                        keyboardType="email-address"
                    />

                    <View>
                        <PasswordInput
                            // message="Password length is too short"
                            autoCapitalize="none"
                            onChangeText={setPassword}
                            onSubmitEditing={handleLogin}
                        />
                    </View>

                    <View style={{ display: 'flex' }} >
                        <NormalButton
                            isLoading={loading}
                            onLoadingText="Wait..."
                            text="Login"
                            onPress={handleLogin}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, paddingRight: 8, paddingTop: 12, justifyContent: 'center' }} >
                            <TextTheme>Can't remember password?</TextTheme>
                            <Pressable onPress={() => { navigator.navigate('forgot-password-screen'); }} >
                                <TextTheme color="rgb(50,150,250)" isPrimary={false}>
                                    Reset password
                                </TextTheme>
                            </Pressable>
                        </View>
                        <Pressable onPress={() => { navigator.replace('signup-screen'); }} >
                            <TextTheme style={{ paddingLeft: 4, paddingTop: 12, textAlign: 'center' }}>
                                Create new Account?
                                <TextTheme fontWeight={900} color="rgb(50,150,250)" style={{ paddingLeft: 8, textDecorationLine: 'underline' }}>
                                    {' Sign Up'}
                                </TextTheme>
                            </TextTheme>
                        </Pressable>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }} >
                    <TextTheme>By signing in, you agree to our</TextTheme>

                    <TextTheme color="rgb(50,150,200)" isPrimary={false} style={{ textDecorationLine: 'underline' }} >
                        Terms of Service
                    </TextTheme>

                    <TextTheme>and</TextTheme>

                    <TextTheme color="rgb(50,150,200)" isPrimary={false} style={{ textDecorationLine: 'underline' }} >
                        Privacy Policy
                    </TextTheme>
                </View>
            </ScrollView>
            <LoadingModal visible={loading} />
        </>
    );
}

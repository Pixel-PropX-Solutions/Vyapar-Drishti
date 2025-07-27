/* eslint-disable react-native/no-inline-styles */
import { Pressable, TouchableWithoutFeedback, View } from 'react-native';
import TextTheme from '../Components/Ui/Text/TextTheme';
import LabelTextInput from '../Components/Ui/TextInput/LabelTextInput';
import LogoImage from '../Components/Image/LogoImage';
import NormalButton from '../Components/Ui/Button/NormalButton';
import PasswordInput from '../Components/Ui/TextInput/PasswordInput';
import { ScrollView, Text } from 'react-native-gesture-handler';
import { useState } from 'react';
import { loginUser } from '../Services/user';
import { useAlert } from '../Components/Ui/Alert/AlertProvider';
import { useAppDispatch, useUserStore } from '../Store/ReduxStore';
import navigator from '../Navigation/NavigationService';

export default function LoginScreen(): React.JSX.Element {

    const { setAlert } = useAlert();

    const { loading } = useUserStore();
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function handleLogin() {

        if (!(username && password)) {return setAlert({ type: 'error', message: 'all filds are required.' });}

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        let { payload: res } = await dispatch(loginUser(formData));

        if (res && res?.accessToken) {
            return navigator.reset('tab-navigation');
        } else {
            return setAlert({ type: 'error', message: 'invalid information' });
        }
    }



    return (

        <ScrollView
            style={{ width: '100%', height: '100%', paddingInline: 20 }} contentContainerStyle={{ alignItems: 'center' }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40 }} >
                <LogoImage size={100} borderRadius={50} />
                <TextTheme style={{ fontWeight: 900, fontSize: 24 }} >Vyapar Drishti</TextTheme>

                <TextTheme style={{ fontSize: 16, fontWeight: 900, marginTop: 24 }} >
                    Log in to your User Account
                </TextTheme>
            </View>

            <View style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20 }}>
                <LabelTextInput
                    label="Email"
                    placeholder="john_wick24@mail.com"
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    useTrim={true}
                />

                <View>
                    <PasswordInput
                        message="Password length is too short"
                        autoCapitalize="none"
                        onChangeText={setPassword}
                        onSubmitEditing={handleLogin}
                    />

                    <Pressable onPress={() => { navigator.navigate('forgot-password-screen') }} >
                        <Text style={{ color: 'rgb(50,150,250)', paddingLeft: 8, paddingTop: 8 }}>
                            Forgot Password
                        </Text>
                    </Pressable>
                </View>

                <View style={{ display: 'flex' }} >
                    <NormalButton
                        isLoading={loading}
                        onLoadingText="Wait..."
                        text="Login"
                        textStyle={{ fontWeight: 900, fontSize: 16 }}
                        onPress={handleLogin}
                    />

                    <Pressable onPress={() => { navigator.replace('signup-screen'); }} >
                        <TextTheme style={{ paddingLeft: 4, paddingTop: 12, textAlign: 'center' }}>
                            Create new Account?
                            <Text style={{ color: 'rgb(50,150,250)', fontWeight: 900, paddingLeft: 8 }}>
                                {' Sign Up'}
                            </Text>
                        </TextTheme>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

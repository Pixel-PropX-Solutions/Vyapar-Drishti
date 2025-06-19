import { Keyboard, Pressable, View } from "react-native";
import TextTheme from "../Components/Text/TextTheme";
import LabelTextInput from "../Components/TextInput/LabelTextInput";
import LogoImage from "../Components/Image/LogoImage";
import NormalButton from "../Components/Button/NormalButton";
import PasswordInput from "../Components/TextInput/PasswordInput";
import { ScrollView, Text, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../Navigation/StackNavigation";
import { useState } from "react";
import { loginUser } from "../Services/user";
import { useAlert } from "../Components/Alert/AlertProvider";
import { useAppDispatch, useUserStore } from "../Store/ReduxStore";

export default function SignUpScreen(): React.JSX.Element {

    const {setAlert} = useAlert();
    
    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'login-screen'>>();
    const {loading, isAuthenticated} = useUserStore();
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function handleLogin(){

        if(!(username && password)) return setAlert({type: 'error', massage: 'all filds are required.'})

        const formData = new FormData;
        formData.append('username', username);
        formData.append('password', password);

        await dispatch(loginUser(formData));

        if(isAuthenticated) {
            return navigation.navigate('tab-navigation');
        } else {
            return setAlert({type: 'error', massage: 'invalid information'})
        }
    }


    
    return (
        <ScrollView style={{ width: '100%', height: '100%', paddingInline: 20 }} contentContainerStyle={{ alignItems: 'center' }} >
            <View style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40 }} >
                <LogoImage size={100} borderRadius={50} />
                <TextTheme style={{ fontWeight: 900, fontSize: 24 }} >Vyapar Drishti</TextTheme>

                <TextTheme style={{ fontSize: 16, fontWeight: 900, marginTop: 24 }} >
                    Log in to your User Account
                </TextTheme>
            </View>

            <View style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20 }}>
                <LabelTextInput
                    // value={username}
                    label="Username"
                    placeholder="john_wick24"
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <View>
                    <PasswordInput
                        // value={password}
                        massage="Password length is too short"
                        onChangeText={setPassword}
                        onSubmitEditing={handleLogin}

                    />

                    <TextTheme style={{ paddingLeft: 4, paddingTop: 8 }}>
                        Forgot Password
                    </TextTheme>
                </View>

                <View style={{ display: 'flex' }} >
                    <NormalButton 
                        isLoading={loading}
                        onLoadingText="Wait..."
                        text="Login" 
                        textStyle={{ fontWeight: 900, fontSize: 16 }} 
                        onPress={handleLogin} 
                    />

                    <Pressable onPress={() => { navigation.replace('signup-screen'); console.log(navigation) }} >
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
    )
}
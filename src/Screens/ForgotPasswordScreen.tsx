/* eslint-disable react-native/no-inline-styles */
import { Keyboard, ScrollView, View } from 'react-native';
import LogoImage from '../Components/Image/LogoImage';
import TextTheme from '../Components/Ui/Text/TextTheme';
import LabelTextInput from '../Components/Ui/TextInput/LabelTextInput';
import NormalButton from '../Components/Ui/Button/NormalButton';
import { useRef, useState } from 'react';
import AnimateButton from '../Components/Ui/Button/AnimateButton';
import { useTheme } from '../Contexts/ThemeProvider';
import ShowWhen from '../Components/Other/ShowWhen';
import PhoneNoTextInput from '../Components/Ui/Option/PhoneNoTextInput';
import { isValidEmail, isValidMobileNumber } from '../Utils/functionTools';
import { PhoneNumber } from '../Utils/types';
import navigator from '../Navigation/NavigationService';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import { useAppDispatch } from '../Store/ReduxStore';
import { forgetPassword } from '../Services/user';
import { useAlert } from '../Components/Ui/Alert/AlertProvider';

export default function ForgotPasswordScreen(): React.JSX.Element {

    const { primaryColor, primaryBackgroundColor } = useTheme();
    const dispatch = useAppDispatch();
    const { setAlert } = useAlert();
    const [isLinkSend, setIsLinkSend] = useState<boolean>(false);
    const [method, setMethod] = useState<'Mail' | 'Phone No'>('Mail');
    const [isLoading, setLoading] = useState<boolean>(false);

    const mail = useRef<string>('');
    const phone = useRef<PhoneNumber>({ code: '', number: '' });



    function forgotPasswordByMail() {
        if (!isValidEmail(mail.current)) { return; }
        dispatch(forgetPassword({ email: mail.current }))
            .unwrap()
            .then(() => {
                setLoading(false);
                setIsLinkSend(true);
            }).catch((error) => {
                setLoading(false);
                setAlert({
                    type: 'error',
                    duration: 2000,
                    message: error || 'Failed to send reset link. Please try again later.',
                });
                console.error('Error sending reset link:', error);
            });
    }

    function forgotPasswordByPhoneNo() {
        if (!phone.current.code || !isValidMobileNumber(phone.current.number)) { return; }

        console.log(phone);

        setLoading(false);
        setIsLinkSend(true);
    }

    return (
        <ShowWhen when={!isLinkSend}
            otherwise={
                <View style={{ alignItems: 'center', width: '100%', height: '100%', paddingInline: 20, justifyContent: 'center' }} >
                    <FeatherIcon name="check-circle" color="rgb(50,200,150)" size={60} style={{ marginBottom: 20 }} />

                    <TextTheme fontSize={28} fontWeight={800} >Check Your {method}</TextTheme>

                    <TextTheme>
                        {method === 'Mail' ? ` ${mail.current}` : ` ${phone.current.code} ${phone.current.number}`}
                    </TextTheme>

                    <TextTheme isPrimary={false} style={{ textAlign: 'center', marginBlock: 12 }} >
                        We've sent a password reset link to
                        {method === 'Mail' ? ` ${mail.current}` : ` ${phone.current.code} ${phone.current.number}`}
                        . Please check your inbox and spam folder and follow the instructions to reset your password.
                    </TextTheme>


                    <NormalButton
                        onPress={() => { navigator.replace('login-screen'); }}
                        icon={<FeatherIcon name="arrow-left" size={16} useInversTheme={true} />}
                        text="Back to Login"
                    />
                </View>
            }
        >
            <ScrollView
                style={{ width: '100%', height: '100%', paddingInline: 20 }} contentContainerStyle={{ alignItems: 'center', gap: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20 }}>

                    <View style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40 }} >
                        <LogoImage size={100} borderRadius={50} />
                        <TextTheme fontWeight={900} fontSize={24} >Vyapar Drishti</TextTheme>

                        <TextTheme fontWeight={900} fontSize={16} style={{ marginTop: 24 }} >
                            {isLinkSend ? '' : 'Forgot your password by mail or phone no'}
                        </TextTheme>

                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>

                        {
                            ['Mail', 'Phone No'].map(type => (
                                <AnimateButton key={type}
                                    onPress={() => { setMethod(type as 'Mail' | 'Phone No'); }}

                                    bubbleColor={type === method ? primaryBackgroundColor : primaryColor}

                                    style={{
                                        alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                                        backgroundColor: type === method ? primaryColor : primaryBackgroundColor,
                                    }}
                                >
                                    <TextTheme
                                        isPrimary={type === method}
                                        useInvertTheme={type === method}
                                        fontSize={12}
                                        fontWeight={900}
                                    >{type}</TextTheme>
                                </AnimateButton>
                            ))
                        }
                    </View>

                    <ShowWhen when={method === 'Mail'}
                        otherwise={
                            <PhoneNoTextInput
                                onChangePhoneNumber={(val) => { phone.current = val; }}
                                message="Invalid phone number!!!"
                                checkNumberIsValid={(val) => isValidMobileNumber(val) && val.length === 10}
                            />
                        }
                    >
                        <LabelTextInput
                            label="Email"
                            placeholder="Enter your email"
                            onChangeText={(val) => { mail.current = val; }}
                            autoCapitalize="none"
                            checkInputText={(mail) => isValidEmail(mail)}
                            message="Please enter a valid mail"
                            useTrim={true}
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                    </ShowWhen>



                    <View style={{ display: 'flex' }} >
                        <NormalButton
                            // isLoading={loading}
                            onLoadingText="Wait..."
                            text="Send Link"
                            onPress={() => {
                                Keyboard.dismiss();

                                if (method === 'Mail') {
                                    forgotPasswordByMail();
                                } else {
                                    forgotPasswordByPhoneNo();
                                }
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </ShowWhen>
    );
}

import { Keyboard, Pressable, ScrollView, View } from "react-native";
import LogoImage from "../Components/Image/LogoImage";
import TextTheme from "../Components/Ui/Text/TextTheme";
import LabelTextInput from "../Components/Ui/TextInput/LabelTextInput";
import NormalButton from "../Components/Ui/Button/NormalButton";
import { useRef, useState } from "react";
import AnimateButton from "../Components/Ui/Button/AnimateButton";
import { useTheme } from "../Contexts/ThemeProvider";
import ShowWhen from "../Components/Other/ShowWhen";
import PhoneNoTextInput from "../Components/Ui/Option/PhoneNoTextInput";
import { isValidEmail, isValidMobileNumber } from "../Utils/functionTools";
import { PhoneNumber } from "../Utils/types";
import navigator from "../Navigation/NavigationService";

export default function ForgotPasswordScreen(): React.JSX.Element {

    const {primaryColor, primaryBackgroundColor} = useTheme()

    const [isLinkSend, setIsLinkSend] = useState<boolean>(false);
    const [method, setMethod] = useState<'Mail' | 'Phone No'>('Mail');
    const [isLoading, setLoading] = useState<boolean>(false);

    const mail = useRef<string>('');
    const phone = useRef<PhoneNumber>({code: "", number: ''});
    


    function forgotPasswordByMail() {
        if(!isValidEmail(mail.current)) return;

        console.log(mail)
        
        setLoading(false)
        setIsLinkSend(true)
    }

    function forgotPasswordByPhoneNo() {
        if(!phone.current.code || !isValidMobileNumber(phone.current.number)) return;
        
        console.log(phone)

        setLoading(false)
        setIsLinkSend(true)
    }
    return (
        <ScrollView
            style={{ width: '100%', height: '100%', paddingInline: 20 }} contentContainerStyle={{ alignItems: 'center', gap: 20 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16, marginTop: 40 }} >
                <LogoImage size={100} borderRadius={50} />
                <TextTheme style={{ fontWeight: 900, fontSize: 24 }} >Vyapar Drishti</TextTheme>

                
                <TextTheme style={{ fontSize: 16, fontWeight: 900, marginTop: 24 }} >
                    {isLinkSend ? 'Link send' : 'Forgot your password by mail or phone no'}
                </TextTheme>
                
            </View>

            <View style={{ display: 'flex', gap: 20, width: '100%', maxWidth: 450, marginBottom: 20 }}>
                <ShowWhen when={!isLinkSend} 
                    otherwise={
                        <View style={{alignItems: 'center'}} >
                            <TextTheme>Forgot password link will send on</TextTheme>
                            <TextTheme>
                                {method === 'Mail' ? ` ${mail.current}` : ` ${phone.current.code} ${phone.current.number}`}
                            </TextTheme>

                            <Pressable onPress={() => navigator.goBack()} >
                                <TextTheme color="rgb(50,150,250)" style={{marginTop: 20}} >
                                    Go back to login
                                </TextTheme>
                            </Pressable>
                        </View>
                    }
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    
                        {
                            ['Mail', 'Phone No'].map(type => (
                                <AnimateButton key={type}
                                    onPress={() => { setMethod(type as 'Mail' | 'Phone No') }}
        
                                    bubbleColor={type === method ? primaryBackgroundColor : primaryColor}
        
                                    style={{
                                        alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: primaryColor, paddingInline: 14, borderRadius: 40, height: 28,
                                        backgroundColor: type === method ? primaryColor : primaryBackgroundColor,
                                    }}
                                >
                                    <TextTheme
                                        isPrimary={type === method}
                                        useInvertTheme={type === method}
                                        style={{ fontSize: 12, fontWeight: 900 }}
                                    >{type}</TextTheme>
                                </AnimateButton>
                            ))
                        }
                    </View>
                    
                    <ShowWhen when={method === 'Mail'} 
                        otherwise={
                            <PhoneNoTextInput 
                                onChangePhoneNumber={(val) => {phone.current = val}} 
                                message="Invalid phone number!!!"
                                checkNumberIsValid={(val) => isValidMobileNumber(val) && val.length === 10}
                            />
                        }
                    >
                        <LabelTextInput
                            label="Email"
                            placeholder="john_wick24@mail.com"
                            onChangeText={(val) => {mail.current = val}}
                            autoCapitalize="none"
                            checkInputText={(mail) => isValidEmail(mail)}
                            message="Please enter a valid mail"
                            useTrim={true}
                        />
                    </ShowWhen>

                    

                    <View style={{ display: 'flex' }} >
                        <NormalButton
                            // isLoading={loading}
                            onLoadingText="Wait..."
                            text="Send Link"
                            textStyle={{ fontWeight: 900, fontSize: 16 }}
                            onPress={() => {
                                Keyboard.dismiss()
                                
                                if(method === 'Mail') {
                                    forgotPasswordByMail()
                                } else {
                                    forgotPasswordByPhoneNo()
                                }
                            }}
                        />
                    </View>
                </ShowWhen>
            </View>
        </ScrollView>
    )
}
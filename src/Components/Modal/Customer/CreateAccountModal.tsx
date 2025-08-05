import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import BottomModal from "../BottomModal"
import TextTheme from "../../Ui/Text/TextTheme"
import { ScrollView, View } from "react-native"
import LabelTextInput from "../../Ui/TextInput/LabelTextInput"
import FeatherIcon from "../../Icon/FeatherIcon"

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export default function CreateAccountModal({visible, setVisible}: Props): React.JSX.Element {

    const data = useRef<{accountNumber: string, holderName: string, bankName: string, ifscCode: string, branchName: string}>({accountNumber: '', holderName: '', branchName: '', ifscCode: '', bankName: ''});


    function handleCreate() {
        const info = data.current;
        console.log(info);
    }

    useEffect(() => {
        if(visible)
            data.current = {accountNumber: '', holderName: '', branchName: '', ifscCode: '', bankName: ''};
    }, [visible])

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            actionButtons={[{title: "Create", onPress: handleCreate}]}
        >
            <ScrollView 
                style={{width: '100%'}} 
                keyboardShouldPersistTaps='always' 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{paddingInline: 20, alignItems: 'center', gap: 32}}
            > 
                <View style={{gap: 2}} >
                    <TextTheme fontSize={16} fontWeight={600} style={{textAlign: 'center'}} >Add a new account</TextTheme>
                    <TextTheme style={{textAlign: 'center'}} >Fill details to add a new account</TextTheme>
                </View>

                <View style={{width: '100%', gap: 24}} >
                    <LabelTextInput
                        useTrim={true}
                        label="Account Number"
                        placeholder="Enter account name"
                        icon={<FeatherIcon name="hash" size={16} />}
                        onChangeText={val => {data.current.accountNumber = val}}
                    />

                    <LabelTextInput
                        useTrim={true}
                        label="Holder Name"
                        placeholder="Enter account holder name"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={val => {data.current.holderName = val}}
                        />

                    <View style={{width: '100%', alignItems: 'center', flexDirection: 'row', gap: 12}} >
                        <LabelTextInput
                            useTrim={true}
                            label="Bank Name"
                            placeholder="Enter bank name"
                            containerStyle={{flex: 1}}
                            icon={<FeatherIcon name="credit-card" size={16} />}
                            onChangeText={val => {data.current.bankName = val}}
                            />

                        <LabelTextInput
                            useTrim={true}
                            label="IFSC Code"
                            placeholder="Enter IFSC code"
                            containerStyle={{flex: 1}}
                            icon={<FeatherIcon name="key" size={16} />}
                            onChangeText={val => {data.current.ifscCode = val}}
                            />
                    </View>

                    <LabelTextInput
                        useTrim={true}
                        label="Branch Name"
                        placeholder="Enter Back branch name"
                        icon={<FeatherIcon name="map-pin" size={16} />}
                        onChangeText={val => {data.current.branchName = val}}
                    />
                </View>

                <View style={{minHeight: 30}} />
            </ScrollView>
        </BottomModal>
    )
}
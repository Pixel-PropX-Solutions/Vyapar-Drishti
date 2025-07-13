import { Dispatch, SetStateAction, useRef } from "react";
import BottomModal from "../../../../Components/Modal/BottomModal";
import TextTheme from "../../../../Components/Text/TextTheme";
import { View } from "react-native";
import LabelTextInput from "../../../../Components/TextInput/LabelTextInput";
import ShowWhen from "../../../../Components/Other/ShowWhen";
import LoadingModal from "../../../../Components/Modal/LoadingModal";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import { PhoneNumber } from "../../../../Utils/types";
import PhoneNoTextInput from "../../../../Components/TextInput/PhoneNoTextInput";

type Props = {
    visible: boolean, 
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function CustomerInfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const name = useRef<string>('');
    const email = useRef<string>('');
    const phoneNo = useRef<PhoneNumber>({code: '', number: ''});

    function handleUpdate() {
        console.log({name, email, phoneNo})
    }

    return (
        <BottomModal 
            visible={visible} setVisible={setVisible}
            style={{paddingHorizontal: 20}} 
            actionButtons={[{
                title: 'Update', onPress: handleUpdate,
                icon: <FeatherIcon name="save" size={20} />
            }]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                Update Customer Information
            </TextTheme>

            <View style={{gap: 24}} >
                <LabelTextInput 
                    label="Name" 
                    placeholder="Enter your company name" 
                    icon={<FeatherIcon name="user" size={16} />}
                    onChangeText={(val) => {name.current = val}}
                    useTrim={true}
                    isRequired={true}
                    infoMassage="Legal name of customer *( Required )"
                />

                <LabelTextInput 
                    label="Email" 
                    placeholder="jhon@gmail.com" 
                    icon={<FeatherIcon name="mail" size={16} />}
                    autoCapitalize="none"
                    useTrim={true}         
                    onChangeText={(val) => {email.current = val}}
                    infoMassage="Enter Primary contact email"
                />

                <PhoneNoTextInput
                    phoneNumber={{code: '', number: ''}}
                    onChangePhoneNumber={(val) => phoneNo.current = val}
                />
            </View>

            <View style={{minHeight: 40}} />

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}



export function AddressInfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const mailingName = useRef<string>('');
    const mailingAddress = useRef<string>('');
    const state = useRef<string>('');
    const country = useRef<string>('');
    const postCode = useRef<string>('');

    function handleUpdate() {
        console.log({
            mailingName, mailingAddress, state, country, postCode
        })
    }

    return (
        <BottomModal 
            visible={visible} setVisible={setVisible}
            style={{paddingHorizontal: 20}} 
            actionButtons={[{
                title: 'Update', onPress: handleUpdate,
                icon: <FeatherIcon name="save" size={20} />
            }]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                Update Customer Information
            </TextTheme>

            <View style={{gap: 24}} >
                <LabelTextInput 
                    label="Mailing Name" 
                    placeholder="Enter your mailing name" 
                    icon={<FeatherIcon name="user" size={16} />}
                    onChangeText={(val) => {mailingName.current = val}}
                    useTrim={true}
                    isRequired={true}
                />

                <LabelTextInput 
                    label="Mailing Address" 
                    placeholder="123 Main St, Apt 2B" 
                    icon={<FeatherIcon name="map-pin" size={16} />}
                    onChangeText={(val) => {mailingAddress.current = val}}
                    useTrim={true}         
                    infoMassage="Street address for correspondence"
                />
                
                <LabelTextInput 
                    label="Country" 
                    placeholder="Enter mailing country" 
                    icon={<FeatherIcon name="globe" size={16} />}
                    onChangeText={(val) => {country.current = val}}
                    useTrim={true}  
                    isRequired={true}
                    infoMassage="Country of mailing address *( Required )"       
                />

                <View style={{flexDirection: 'row', gap: 12, width: '100%', alignItems: 'center'}} >
                    <LabelTextInput 
                        label="State" 
                        placeholder="e.g. N" 
                        icon={<FeatherIcon name="map" size={16} />}
                        containerStyle={{flex: 1}}
                        useTrim={true}
                        onChangeText={(val) => {state.current = val}}

                        isRequired={true}
                        infoMassageWidth={200}
                        infoMassage="State of mailing address *( Required )"
                    />

                    <LabelTextInput 
                        label="Post Code" 
                        placeholder="XXX-XXX" 
                        icon={<FeatherIcon name="hash" size={16} />}
                        containerStyle={{width: 120}} 
                        keyboardType="number-pad"
                        useTrim={true}
                        onChangeText={(val) => {postCode.current = val}} 
                    />
                </View>
            </View>

            <View style={{minHeight: 40}} />

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}


export function BankInfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const holderName = useRef<string>('');
    const accountNo = useRef<string>('');
    const bankName = useRef<string>('');
    const iffcCode = useRef<string>('');
    const branchName = useRef<string>('');

    function handleUpdate() {
        console.log({holderName, accountNo, bankName, iffcCode, branchName})
    }

    return (
        <BottomModal 
            visible={visible} setVisible={setVisible}
            style={{paddingHorizontal: 20}} 
            actionButtons={[{
                title: 'Update', onPress: handleUpdate,
                icon: <FeatherIcon name="save" size={20} />
            }]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                Update Customer Information
            </TextTheme>

            <View style={{gap: 24}} >
                <LabelTextInput 
                    label="A/c Holder Name" 
                    placeholder="Enter your mailing name" 
                    icon={<FeatherIcon name="user" size={16} />}
                    onChangeText={(val) => {holderName.current = val}}
                    useTrim={true}
                    isRequired={true}
                />

                <LabelTextInput 
                    label="A/c Number" 
                    placeholder="123 Main St, Apt 2B" 
                    icon={<FeatherIcon name="hash" size={16} />}
                    onChangeText={(val) => {accountNo.current = val}}
                    useTrim={true}  
                    isRequired={true}       
                    infoMassage="Street address for correspondence"
                />
                
                <LabelTextInput 
                    label="Bank Name" 
                    placeholder="Enter mailing country" 
                    icon={<FeatherIcon name="credit-card" size={16} />}
                    onChangeText={(val) => {bankName.current = val}}
                    useTrim={true}  
                    isRequired={true}
                    infoMassage="Country of mailing address *( Required )"       
                />
                
                <LabelTextInput 
                    label="IFFC Code" 
                    placeholder="e.g. SBIN0001234" 
                    icon={<FeatherIcon name="key" size={16} />}
                    onChangeText={(val) => {iffcCode.current = val}}
                    useTrim={true}  
                    isRequired={true}     
                    infoMassage="Country of mailing address *( Required )"  
                />
                
                <LabelTextInput 
                    label="Branch Name" 
                    placeholder="Main branch, Downtown" 
                    icon={<FeatherIcon name="map-pin" size={16} />}
                    onChangeText={(val) => {branchName.current = val}}
                    useTrim={true}  
                    isRequired={true}
                    infoMassage="Country of mailing address *( Required )"       
                />
            </View>

            <View style={{minHeight: 40}} />

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}



export function TaxInfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const gstinNo = useRef<string>('');
    const panNo = useRef<string>('');

    function handleUpdate() {
        console.log({gstinNo, panNo})
    }

    return (
        <BottomModal 
            visible={visible} setVisible={setVisible}
            style={{paddingHorizontal: 20}} 
            actionButtons={[{
                title: 'Update', onPress: handleUpdate,
                icon: <FeatherIcon name="save" size={20} />
            }]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                Update Customer Information
            </TextTheme>

            <View style={{gap: 24}} >
                <LabelTextInput 
                    label="GSTIN Number" 
                    placeholder="24XXXXXXXXXX" 
                    icon={<FeatherIcon name="user" size={16} />}
                    onChangeText={(val) => {gstinNo.current = val}}
                    useTrim={true}
                    isRequired={true}
                    infoMassage="15 digit GSTIN number"
                />

                <LabelTextInput 
                    label="Pan Number" 
                    placeholder="AbC4242D" 
                    icon={<FeatherIcon name="map-pin" size={16} />}
                    onChangeText={(val) => {panNo.current = val}}
                    useTrim={true}         
                    isRequired={true}
                    infoMassage="10 digit PAN number"
                />
            </View>

            <View style={{minHeight: 40}} />

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}
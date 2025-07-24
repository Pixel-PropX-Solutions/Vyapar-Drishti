import { ScrollView, View } from "react-native";
import BottomModal from "../../Components/Modal/BottomModal";
import TextTheme from "../../Components/Ui/Text/TextTheme";
import LabelTextInput from "../../Components/Ui/TextInput/LabelTextInput";
import { useAppDispatch, useCompanyStore } from "../../Store/ReduxStore";
import { useRef, useState } from "react";
import { getCompany, updateCompany } from "../../Services/company";
import { useAlert } from "../../Components/Ui/Alert/AlertProvider";
import arrayToFormData from "../../Utils/arrayToFormData";
import { isValidEmail } from "../../Functions/StringOpations/pattenMaching";
import LoadingModal from "../../Components/Modal/LoadingModal";
import ShowWhen from "../../Components/Other/ShowWhen";
import PhoneNoTextInput from "../../Components/Ui/Option/PhoneNoTextInput";
import { PhoneNumber } from "../../Utils/types";
import FeatherIcon from "../../Components/Icon/FeatherIcon";

type Props = {
    visible: boolean;
    setVisible: (vis: boolean) => void;
}


export function CompanyInfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const {setAlert} = useAlert();
    const {company, loading} = useCompanyStore();
    const dispatch = useAppDispatch();

    const [name, setName] = useState<string>(company?.name ?? '');
    const [website, setWebsite] = useState<string>(company?.website ?? '');

    async function handleUpdate(){
        
        if(!name) return setAlert({
            type: 'error', message: 'company never be empty', id: 'update-modal'
        });

        const id = company?._id;
        if(!id) return console.error('company id was not found');
        const {code, number} = company.phone ?? {}

        const data = arrayToFormData( Object.entries({
                ...company, 
                phone: '', name, website, code, number, pan_number: company?.pan
        }));
        
        await dispatch(updateCompany({data, id: company?._id}));  
        await dispatch(getCompany());

        setVisible(false);
    }

    return (
        <BottomModal 
            alertId="update-modal"
            visible={visible} 
            setVisible={setVisible} 
            style={{paddingHorizontal: 20}} 
            actionButtons={[{title: 'Update', onPress: handleUpdate}]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                Update Company Info
            </TextTheme>

            <View style={{gap: 24}} >
                <LabelTextInput 
                    label="Name" 
                    placeholder="Enter your company name" 
                    value={name} onChangeText={setName}
                    useTrim={true}
                />

                <LabelTextInput 
                    label="Website URL" 
                    placeholder="https://www.conmpanyname.com" 
                    value={website} onChangeText={setWebsite}
                    autoCapitalize="none"
                    useTrim={true}         
                />
            </View>

            <View style={{minHeight: 40}} />
            <ShowWhen when={visible} >
                <LoadingModal visible={loading} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}



export function CompanyContactUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const {company, loading} = useCompanyStore();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState<string>(company?.email ?? '');
    const [mailingName, setMailingName] = useState<string>(company?.mailing_name ?? '');

    const phoneNumber = useRef<PhoneNumber>(company?.phone)

    async function handleUpdate(){
        const id = company?._id;

        if(!isValidEmail(email)) return;
        
        if(!id) return console.error('company id was not found');

        const data = arrayToFormData( Object.entries({
                ...company, 
                phone: '', email, ...phoneNumber.current, pan_number: company?.pan, mailing_name: mailingName
        }));
        
        await dispatch(updateCompany({data, id: company?._id}));  
        await dispatch(getCompany());

        setVisible(false);
    }

    return (
        <BottomModal 
            visible={visible} 
            setVisible={setVisible} 
            style={{paddingHorizontal: 20}} 
            actionButtons={[{title: 'Update', onPress: handleUpdate}]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                Update Contact
            </TextTheme>

            <View style={{gap: 24, width: '100%'}} >
                <LabelTextInput 
                    label="Mailing Name" 
                    placeholder="e.g. Technology, Menufacturing" 
                    value={mailingName} onChangeText={setMailingName}
                    useTrim={true}
                />
               
                <LabelTextInput 
                    label="Email" 
                    checkInputText={isValidEmail}
                    placeholder="contact@companyname.ocm" 
                    value={email} onChangeText={setEmail}
                    autoCapitalize="none"
                    useTrim={true}
                />

                <PhoneNoTextInput
                    phoneNumber={company?.phone}
                    onChangePhoneNumber={(val) => {phoneNumber.current = val; console.log(val)}}
                />
            </View>

            <View style={{minHeight: 40}} />
            <ShowWhen when={visible} >
                <LoadingModal visible={loading} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}



export function CompanyAddressUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const {company, loading} = useCompanyStore();
    const dispatch = useAppDispatch();

    const [country, setCountry] = useState<string>(company?.country ?? '');
    const [state, setState] = useState<string>(company?.state ?? '');
    const [address, setAddress] = useState<string>(company?.address_1 ?? '');
    const [pinCode, setPinCode] = useState<string>(company?.pinCode ?? '');

    async function handleUpdate(){
        const id = company?._id;
        if(!id) return console.error('company id was not found');
        const {code, number} = company.phone ?? {}

        const data = arrayToFormData(Object.entries({
                ...company, 
                phone: '', number, code, pan_number: company?.pan,
                country, state, address_1: address, pinCode
        }));
        
        await dispatch(updateCompany({data, id: company?._id}));  
        await dispatch(getCompany());

        setVisible(false);
    }

    return (
        <BottomModal 
            visible={visible} 
            setVisible={setVisible} 
            style={{paddingHorizontal: 20}}
            actionButtons={[{title: 'Udpate', onPress: handleUpdate}]}
        >
            <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                Update Address
            </TextTheme>

            <View style={{gap: 24}} >
                <LabelTextInput 
                    label="Countery" 
                    placeholder="e.g. United State, India" 
                    value={country} onChangeText={setCountry}
                />
                
                <LabelTextInput 
                    label="State" 
                    placeholder="e.g. Califonio, Rajasthan" 
                    value={state} onChangeText={setState}
                />
                
                <LabelTextInput 
                    label="Street Address" 
                    placeholder="123 Main St, Suite 456" 
                    value={address} onChangeText={setAddress}
                />
                
                <LabelTextInput 
                    label="Postal Code" 
                    placeholder="e.g. 1234, A1B" 
                    value={pinCode} onChangeText={setPinCode}
                />
            </View>

            <View style={{minHeight: 40}} />
            <ShowWhen when={visible} >
                <LoadingModal visible={loading} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}



export function BankInfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    type Data = {holderName: string, accountNo: string, bankName: string, branchName: string}
    const data = useRef<Data>({holderName: '', accountNo: '', bankName: '', branchName: ''})

    function setData<Keys extends keyof Data>(key: Keys, val: Data[Keys]){
        data.current = {...data.current, [key]: val}
    }

    function handleUpdate() {
        console.log(data)
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
            <ScrollView showsVerticalScrollIndicator={false} >
                <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                    Update Bank Details
                </TextTheme>

                <View style={{gap: 24}} >
                    <LabelTextInput 
                        label="A/c Holder Name" 
                        placeholder="Enter your mailing name" 
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => {setData('accountNo', val)}}
                        useTrim={true}
                        isRequired={true}
                    />

                    <LabelTextInput 
                        label="A/c Number" 
                        placeholder="123 Main St, Apt 2B" 
                        icon={<FeatherIcon name="hash" size={16} />}
                        onChangeText={(val) => {setData('accountNo', val)}}
                        useTrim={true}  
                        isRequired={true}       
                        infoMassage="Street address for correspondence"
                    />
                    
                    <LabelTextInput 
                        label="Bank Name" 
                        placeholder="Enter mailing country" 
                        icon={<FeatherIcon name="credit-card" size={16} />}
                        onChangeText={(val) => {setData('bankName', val)}}
                        useTrim={true}  
                        isRequired={true}
                        infoMassage="Country of mailing address *( Required )"       
                    />
                    
                    <LabelTextInput 
                        label="IFFC Code" 
                        placeholder="e.g. SBIN0001234" 
                        icon={<FeatherIcon name="key" size={16} />}
                        // onChangeText={(val) => {setData('')}}
                        useTrim={true}  
                        isRequired={true}     
                        infoMassage="Country of mailing address *( Required )"  
                    />
                    
                    <LabelTextInput 
                        label="Branch Name" 
                        placeholder="Main branch, Downtown" 
                        icon={<FeatherIcon name="map-pin" size={16} />}
                        // onChangeText={(val) => {branchName.current = val}}
                        useTrim={true}  
                        isRequired={true}
                        infoMassage="Country of mailing address *( Required )"       
                    />
                </View>

                <View style={{minHeight: 40}} />
            </ScrollView>

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
            <ScrollView showsVerticalScrollIndicator={false} >
                <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 32}}>
                    Update Tax Information
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
            </ScrollView>

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    )
}
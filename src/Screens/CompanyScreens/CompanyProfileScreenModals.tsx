import { View } from "react-native";
import BottomModal from "../../Components/Modal/BottomModal";
import TextTheme from "../../Components/Text/TextTheme";
import LabelTextInput from "../../Components/TextInput/LabelTextInput";
import { useAppDispatch, useCompanyStore } from "../../Store/ReduxStore";
import { useState } from "react";
import { getCompany, updateCompany } from "../../Services/company";
import { useAlert } from "../../Components/Alert/AlertProvider";
import arrayToFormData from "../../Utils/arrayToFormData";
import { isValidEmail } from "../../Functions/StringOpations/pattenMaching";
import LoadingModal from "../../Components/Modal/LoadingModal";
import ShowWhen from "../../Components/Other/ShowWhen";

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
            type: 'error', massage: 'company never be empty', id: 'update-modal'
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
                />

                <LabelTextInput 
                    label="Website URL" 
                    placeholder="https://www.conmpanyname.com" 
                    value={website} onChangeText={setWebsite}
                    autoCapitalize="none"
                    
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
    const [number, setNumber] = useState<string>(company?.phone?.number ?? '');
    const [code, setCode] = useState<string>(company?.phone?.code ?? '');
    const [mailingName, setMailingName] = useState<string>(company?.mailing_name ?? '');

    async function handleUpdate(){
        const id = company?._id;

        if(!isValidEmail(email)) return;
        
        if(!id) return console.error('company id was not found');
        const {code, number} = company.phone ?? {}

        const data = arrayToFormData( Object.entries({
                ...company, 
                phone: '', email, number, code, pan_number: company?.pan, mailing_name: mailingName
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
                />
               
                <LabelTextInput 
                    label="Email" 
                    checkInputText={isValidEmail}
                    placeholder="contact@companyname.ocm" 
                    value={email} onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <View style={{flexDirection: 'row', gap: 12, width: '100%', alignItems: 'center'}} >
                    <LabelTextInput 
                        label="Code" 
                        placeholder="e.g. +1, +91" 
                        containerStyle={{width: 120}} 
                        value={code} onChangeText={setCode}
                        keyboardType="number-pad"
                    />

                    <LabelTextInput 
                        label="Phone Number" 
                        placeholder="1234567890" 
                        containerStyle={{flex: 1}} 
                        value={number} onChangeText={setNumber}
                        keyboardType="number-pad"
                    />
                </View>
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

        const data = arrayToFormData( Object.entries({
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
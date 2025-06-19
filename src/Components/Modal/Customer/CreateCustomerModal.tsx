import { View } from "react-native";
import BottomModal from "../BottomModal";
import { Dispatch, SetStateAction, useState } from "react";
import TextTheme from "../../Text/TextTheme";
import FeatherIcon from "../../Icon/FeatherIcon";
import NoralTextInput from "../../TextInput/NoralTextInput";
import { useTheme } from "../../../Contexts/ThemeProvider";
import { SectionRow } from "../../View/SectionView";
import AnimateButton from "../../Button/AnimateButton";
import ShowWhen from "../../Other/ShowWhen";
import { useAlert } from "../../Alert/AlertProvider";
import LoadingModal from "../LoadingModal";
import { useAppDispatch, useCompanyStore, useCustomerStore } from "../../../Store/ReduxStore";
import { createCustomer, viewAllCustomers } from "../../../Services/customer";

type Data = {name: string, phoneNo: string, groupName: string}

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

const GroupNames: string[] = ["Assets", "Liabilities", "Equity", "Revenue", "Income", "Expenses"]

export default function CreateCustomerModal({visible, setVisible}: Props): React.JSX.Element {

    const {primaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme();
    const {setAlert} = useAlert();

    const {company} = useCompanyStore();
    const {loading} = useCustomerStore();
    const dispatch = useAppDispatch();

    const [isGroupModalVisible, setGroupModalVisible] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [groupName, setGroupName] = useState<string>('');
    
    async function handleOnPressCreate() {
        if(!(name && phoneNo && groupName)) return setAlert({
            type: 'error', massage: 'to add new customer all field are required.', id: 'create-customer-modal'
        });

        const formData = new FormData;
        [
            ['name', name], ['parent', groupName], ['number', phoneNo], ['company_id', company?._id ?? '']
        ].forEach(([key, value]) => formData.append(key, value));
        
        await dispatch(createCustomer(formData));
        await dispatch(viewAllCustomers(company?._id ?? ''));
        
        setVisible(false);
    }


    return (
        <BottomModal 
            alertId="create-customer-modal"
            setVisible={setVisible} 
            visible={visible} 
            actionButtons={[
                {title: 'Create', backgroundColor: 'rgb(50,150,250)', onPress: handleOnPressCreate}
            ]}
            style={{paddingInline: 20}}
        >
            <TextTheme style={{fontWeight: 900, fontSize: 16, marginBottom: 12}} >Customer Details</TextTheme>
    
            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="user" size={28} />
                <NoralTextInput
                    placeholder="Name"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                    onChangeText={setName}
                />
            </View>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, marginBottom: 24}} >
                <FeatherIcon name="phone" size={28} />
                <NoralTextInput
                    placeholder="Phone No"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                    onChangeText={setPhoneNo}
                    keyboardType="phone-pad"
                />
            </View>
            
            <SectionRow 
                label={`${groupName == '' ? 'Select ' : ''}Customer Type`} 
                onPress={() => setGroupModalVisible(true)}
            >
                <TextTheme style={{fontSize: 20, fontWeight: 900, flex: 1}} >{ groupName || 'Customer Type'}</TextTheme>
                <ShowWhen when={groupName === ''} >
                    <FeatherIcon name="arrow-right" size={20} />
                </ShowWhen>
            </SectionRow>

            <BottomModal 
                visible={isGroupModalVisible} 
                setVisible={setGroupModalVisible} 
                style={{paddingHorizontal: 20, gap: 24}}
            >
                <TextTheme style={{fontWeight: 900, fontSize: 16}} >Customer Types</TextTheme>  

                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12}} >
                    {
                        GroupNames.map(name => (
                            <AnimateButton 
                                key={name} 
                                style={{
                                    borderWidth: 2, borderRadius: 100, paddingInline: 16, borderColor: secondaryBackgroundColor, paddingBlock: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
                                    backgroundColor: name === groupName ? secondaryBackgroundColor : primaryBackgroundColor
                                }}
                                onPress={() => {
                                    setGroupName(name)
                                    setGroupModalVisible(false);
                                }}
                            >
                                <TextTheme style={{fontWeight: 900, fontSize: 14}} >{name}</TextTheme>
                                <FeatherIcon name="arrow-right" size={14} />
                            </AnimateButton>
                        ))
                    }
                
                </View>              
            </BottomModal>

            <LoadingModal visible={loading} />
            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
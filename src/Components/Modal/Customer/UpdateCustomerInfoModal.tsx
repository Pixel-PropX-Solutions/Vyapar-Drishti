import { View } from "react-native";
import BottomModal from "../BottomModal";
import { Dispatch, SetStateAction, useState } from "react";
import TextTheme from "../../Text/TextTheme";
import FeatherIcon from "../../Icon/FeatherIcon";
import NoralTextInput from "../../TextInput/NoralTextInput";
import { useTheme } from "../../../Contexts/ThemeProvider";
import { useAlert } from "../../Alert/AlertProvider";
import { SectionRow } from "../../View/SectionView";
import ShowWhen from "../../Other/ShowWhen";
import AnimateButton from "../../Button/AnimateButton";


type Data = {
    name: string,
    phoneNo: string,
    groupName: string
}

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    name: string,
    phoneNo: string,
    groupName: string
    handleUpdate: (data: Data) => void
}

const GroupNames: string[] = ["Assets", "Liabilities", "Equity", "Revenue", "Income", "Expenses"]

export default function UpdateCustomerInfoModal({visible, setVisible, name: oldName, phoneNo: oldPhoneNo, groupName: oldGroupName,handleUpdate}: Props): React.JSX.Element {

    const {primaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme();
    const {setAlert} = useAlert();

    const [isGroupModalVisible, setGroupModalVisible] = useState<boolean>(false);

    const [name, setName] = useState<string>(oldName);
    const [phoneNo, setPhoneNo] = useState<string>(oldPhoneNo);
    const [groupName, setGroupName] = useState<string>(oldGroupName);

    function handleOnPressUpdate() {
        if(!(name && phoneNo)) {
            return setAlert({
                type: 'error', 
                id: 'create-product-modal',
                message: 'Please enter product Name, price and product No for create a new product.'
            });
        }

        handleUpdate({name, phoneNo, groupName});
    }

    return (
        <BottomModal 
            setVisible={setVisible} 
            visible={visible} 
            style={{paddingInline: 20}}
            actionButtons={[
                {title: 'Create', backgroundColor: 'rgb(50,150,250)', onPress: handleOnPressUpdate}
            ]}
        >
            <TextTheme style={{fontWeight: 900, fontSize: 16}} >Customer Details</TextTheme>
    
            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="user" size={28} />
                <NoralTextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                />
            </View>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="phone" size={28} />
                <NoralTextInput
                    value={phoneNo}
                    onChangeText={setPhoneNo}
                    placeholder="Phone No"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
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

            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
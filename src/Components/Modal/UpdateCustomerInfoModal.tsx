import { View } from "react-native";
import BottomModal from "./BottomModal";
import { Dispatch, SetStateAction, useState } from "react";
import TextTheme from "../Text/TextTheme";
import FeatherIcon from "../Icon/FeatherIcon";
import NoralTextInput from "../TextInput/NoralTextInput";
import { useTheme } from "../../Contexts/ThemeProvider";

type Props = {
    id: string,
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    name: string,
    phoneNo: string
}

export default function UpdateCustomerInfoModal({visible, setVisible, id, name: oldName, phoneNo: oldPhoneNo}: Props): React.JSX.Element {

    const {primaryColor} = useTheme();

    const [name, setName] = useState<string>(oldName);
    const [phoneNo, setPhoneNo] = useState<string>(oldPhoneNo);

    return (
        <BottomModal 
            setVisible={setVisible} 
            visible={visible} 
            actionButtons={[
                {title: 'Create', backgroundColor: 'rgb(50,150,250)', onPress: ()=>{}}
            ]}
            style={{paddingInline: 20}}
        >
            <TextTheme style={{fontWeight: 900, fontSize: 16}} >Customer Details</TextTheme>
    
            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="user" size={28} />
                <NoralTextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    style={{fontSize: 24, fontWeight: 900}}
                />
            </View>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="phone" size={28} />
                <NoralTextInput
                    value={phoneNo}
                    onChangeText={setPhoneNo}
                    placeholder="Phone No"
                    style={{fontSize: 24, fontWeight: 900}}
                />
            </View>

            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
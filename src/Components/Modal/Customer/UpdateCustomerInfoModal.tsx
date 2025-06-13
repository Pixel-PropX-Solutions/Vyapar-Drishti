import { View } from "react-native";
import BottomModal from "../BottomModal";
import { Dispatch, SetStateAction, useState } from "react";
import TextTheme from "../../Text/TextTheme";
import FeatherIcon from "../../Icon/FeatherIcon";
import NoralTextInput from "../../TextInput/NoralTextInput";
import { useTheme } from "../../../Contexts/ThemeProvider";
import { useAlert } from "../../Alert/AlertProvider";


type Data = {
    name: string,
    phoneNo: string
}

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    name: string,
    phoneNo: string,
    handleUpdate: (data: Data) => void
}

export default function UpdateCustomerInfoModal({visible, setVisible, name: oldName, phoneNo: oldPhoneNo, handleUpdate}: Props): React.JSX.Element {

    const {primaryColor} = useTheme();
    const {setAlert} = useAlert();

    const [name, setName] = useState<string>(oldName);
    const [phoneNo, setPhoneNo] = useState<string>(oldPhoneNo);

    function handleOnPressUpdate() {
        if(!(name && phoneNo)) {
            return setAlert({
                type: 'error', 
                id: 'create-product-modal',
                massage: 'Please enter product Name, price and product No for create a new product.'
            });
        }

        handleUpdate({name, phoneNo});
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

            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
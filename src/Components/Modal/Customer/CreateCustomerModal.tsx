import { View } from "react-native";
import BottomModal from "../BottomModal";
import { Dispatch, SetStateAction } from "react";
import TextTheme from "../../Text/TextTheme";
import FeatherIcon from "../../Icon/FeatherIcon";
import NoralTextInput from "../../TextInput/NoralTextInput";
import { useTheme } from "../../../Contexts/ThemeProvider";

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export default function CreateCustomerModal({visible, setVisible}: Props): React.JSX.Element {

    const {primaryColor} = useTheme();

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
                    placeholder="Name"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                />
            </View>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="phone" size={28} />
                <NoralTextInput
                    placeholder="Phone No"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                />
            </View>

            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
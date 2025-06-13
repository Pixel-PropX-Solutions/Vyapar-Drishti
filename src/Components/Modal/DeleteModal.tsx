import { Dispatch, SetStateAction, useState } from "react";
import BottomModal from "./BottomModal";
import { Text, View } from "react-native";
import NoralTextInput from "../TextInput/NoralTextInput";
import MaterialIcon from "../Icon/MaterialIcon";
import { useAlert } from "../Alert/AlertProvider";


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    massage: string,
    passkey: string,
    handleDelete: () => void
}

export default function DeleteModal({visible, setVisible, massage, passkey, handleDelete}: Props): React.JSX.Element {

    const [text, setText] = useState<string>('');
    const {setAlert} = useAlert();

    function handleOnDelete(){
        if(text !== passkey) return setAlert({
            id: 'delete-modal', massage: 'to delete enter valid keyword !!!', type: 'error'
        });

        handleDelete();
    } 

    return (
        <BottomModal 
            alertId="delete-modal"
            visible={visible} 
            setVisible={setVisible} 
            style={{padding: 20, gap: 8}} 
            actionButtons={[{
                title: 'Delete', onPress: handleOnDelete, backgroundColor: 'rgb(200,50,50)', 
                icon: <MaterialIcon name="delete" size={20} color="white" />
            }]}    
        >
            <Text style={{color: 'rgb(250,50,50)', fontSize: 20, fontWeight: 900}} >Delete Warning</Text>
            <Text style={{fontWeight: 700, fontSize: 14, color: 'rgb(200,50,50)'}} >{massage}</Text>
            
            <NoralTextInput
                onChangeText={setText}
                placeholder={`Type "${passkey}" for delete`}
                style={{borderWidth: 0, borderBottomWidth: 2, borderColor: 'rgb(200, 50, 50)', fontWeight: 900}}
                color="rgb(200,50,50)"
            />

            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
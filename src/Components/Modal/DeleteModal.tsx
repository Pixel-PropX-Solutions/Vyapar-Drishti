import { Dispatch, SetStateAction, useState } from "react";
import BottomModal from "./BottomModal";
import { Text } from "react-native";
import NoralTextInput from "../TextInput/NoralTextInput";
import MaterialIcon from "../Icon/MaterialIcon";


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    massage: string,
    passkey: string,
    onDelete: () => void
}

export default function DeleteModal({visible, setVisible, massage, passkey, onDelete=()=>{}}: Props): React.JSX.Element {

    const [text, setText] = useState<string>('');

    function handleDelete(){
        if(text !== passkey) return;
        onDelete();
    } 

    return (
        <BottomModal 
            visible={visible} 
            setVisible={setVisible} 
            style={{padding: 20, gap: 8}} 
            actionButtons={[{
                title: 'Delete', onPress: handleDelete, backgroundColor: 'rgb(200,50,50)', 
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
        </BottomModal>
    )
}
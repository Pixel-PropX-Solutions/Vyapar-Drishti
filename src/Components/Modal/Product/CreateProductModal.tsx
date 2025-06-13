import { Dispatch, SetStateAction, useState } from "react";
import BottomModal from "../BottomModal";
import TextTheme from "../../Text/TextTheme";
import { View } from "react-native";
import FeatherIcon from "../../Icon/FeatherIcon";
import NoralTextInput from "../../TextInput/NoralTextInput";
import { useTheme } from "../../../Contexts/ThemeProvider";
import MaterialIcon from "../../Icon/MaterialIcon";
import { useAlert } from "../../Alert/AlertProvider";

type FromData = {
    name: string, productNo: string, price: string, unit: string
}

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    onCreate: (data: FromData) => void
}

export default function CreateProductModal({visible, setVisible, onCreate}: Props): React.JSX.Element {

    const {primaryColor} = useTheme();
    const {setAlert} = useAlert();

    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [productNo, setProductNo] = useState<string>('');

    function handleCreate() {
        if(!(name && price && productNo)) {
            return setAlert({
                type: 'error', 
                id: 'create-product-modal',
                massage: 'Please enter product Name, price and product No for create a new product.'
            });
        }

        onCreate({name, price, unit, productNo});
    }

    return (
        <BottomModal 
            alertId="create-product-modal"
            visible={visible} 
            setVisible={setVisible} 
            style={{paddingInline: 20}}
            actionButtons={[
                {title: 'Create', backgroundColor: 'rgb(50,150,250)', onPress: handleCreate}
            ]}
        >
            <TextTheme style={{fontWeight: 900, fontSize: 16}} >Customer Details</TextTheme>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="package" size={28} />
                <NoralTextInput
                    placeholder="Name"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                />
            </View>

            <View style={{flexDirection: 'row', gap: 16, justifyContent: 'center'}} >
                <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, flex: 1, maxWidth: 200}} >
                    <MaterialIcon name="attach-money" size={28} />
                    <NoralTextInput
                        placeholder="Price"
                        style={{fontSize: 24, fontWeight: 900, flex: 1}}
                    />
                </View>

                <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, width: 150}} >
                    <MaterialIcon name="attach-money" size={28} />
                    <NoralTextInput
                        placeholder="Unit"
                        style={{fontSize: 24, fontWeight: 900, flex: 1}}
                    />
                </View>
            </View>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="tag" size={28} />
                <NoralTextInput
                    placeholder="Product No"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                />
            </View>

            <View style={{minHeight: 40}} />
        </BottomModal>
    )
}
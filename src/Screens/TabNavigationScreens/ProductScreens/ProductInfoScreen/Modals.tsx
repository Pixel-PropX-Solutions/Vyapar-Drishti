import { Dispatch, SetStateAction, useRef } from "react";
import BottomModal from "../../../../Components/Modal/BottomModal";
import FeatherIcon from "../../../../Components/Icon/FeatherIcon";
import { ScrollView, View } from "react-native";
import TextTheme from "../../../../Components/Ui/Text/TextTheme";
import LabelTextInput from "../../../../Components/Ui/TextInput/LabelTextInput";
import ShowWhen from "../../../../Components/Other/ShowWhen";
import LoadingModal from "../../../../Components/Modal/LoadingModal";

type Props = {
    visible: boolean, 
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function InfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const info = useRef({
        name: "",
        hsnCode: "",
        lowStockAlert: "",
        unit: "",
        description: ""
    });

    const setInfo = (key: string, value: any) => {
        info.current = {...info.current, [key]: value};
    }

    function handleUpdate() {
        console.log("Update Product Info", info.current);
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
                    Update Customer Information
                </TextTheme>

                <View style={{gap: 24}} >
                    <LabelTextInput
                        label="Name" 
                        placeholder="Enter your product name" 
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => {setInfo('name', val)}}
                        useTrim={true}
                        isRequired={true}
                    />

                    <LabelTextInput 
                        label="HSN Code" 
                        placeholder="Enter HSN Code" 
                        icon={<FeatherIcon name="hash" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}         
                        onChangeText={(val) => {setInfo('hsnCode', val)}}
                        infoMassage="HSN Code is used for tax calculation. It is mandatory for GST registered businesses."
                    />
                    
                    <LabelTextInput 
                        label="Low Stock Alert" 
                        placeholder="Enter Low Stock Alert" 
                        icon={<FeatherIcon name="bell" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}         
                        onChangeText={(val) => {setInfo('lowStockAlert', val)}}
                        infoMassage="Set a low stock alert to get notified when the stock falls below this level."
                    />
                    
                    <LabelTextInput 
                        label="Unit" 
                        placeholder="Enter Mesurement Unit" 
                        icon={<FeatherIcon name="package" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}         
                        onChangeText={(val) => {setInfo('unit', val)}}
                    />
                    
                    <LabelTextInput 
                        label="Description" 
                        placeholder="Enter Product Description" 
                        icon={<FeatherIcon name="file-text" size={16} />} 
                        autoCapitalize="none"
                        useTrim={true}   
                        multiline={true}  
                        numberOfLines={4}   
                        onChangeText={(val) => {setInfo('description', val)}}
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

export function ClassInfoUpdateModal({visible, setVisible}: Props): React.JSX.Element {

    const info = useRef({
        category: "",
        group: "",
    });

    const setInfo = (key: string, value: any) => {
        info.current = {...info.current, [key]: value};
    }

    function handleUpdate() {
        console.log("Update Product Info", info.current);
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
                    Update Customer Information
                </TextTheme>

                <View style={{gap: 24}} >
                    <LabelTextInput
                        label="Category" 
                        placeholder="Enter product category" 
                        icon={<FeatherIcon name="tag" size={16} style={{top: 2}} />}
                        onChangeText={(val) => {setInfo('category', val)}}
                        useTrim={true}
                    />

                    <LabelTextInput 
                        label="Group" 
                        placeholder="Enter Product Group" 
                        icon={<FeatherIcon name="hash" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}         
                        onChangeText={(val) => {setInfo('group', val)}}
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


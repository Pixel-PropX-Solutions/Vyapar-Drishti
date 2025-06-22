import { Dispatch, SetStateAction, useState } from "react";
import BottomModal from "../BottomModal";
import TextTheme from "../../Text/TextTheme";
import { View } from "react-native";
import FeatherIcon from "../../Icon/FeatherIcon";
import NoralTextInput from "../../TextInput/NoralTextInput";
import { useTheme } from "../../../Contexts/ThemeProvider";
import MaterialIcon from "../../Icon/MaterialIcon";
import { useAlert } from "../../Alert/AlertProvider";
import AnimateButton from "../../Button/AnimateButton";
import { useAppDispatch, useCompanyStore, useProductStore } from "../../../Store/ReduxStore";
import { createProduct, viewAllProducts } from "../../../Services/product";
import LoadingModal from "../LoadingModal";

type FromData = {
    name: string, productNo: string, price: string, unit: string
}

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

const unitsOfMeasurement: string[] = [
  "Unit",
  "Pcs",      // Pieces
  "Kg",       // Kilograms
  "Mtr",      // Meters
  "Sq. Mtr",  // Square Meters
  "Box",
  "Pack",
  "Doz",      // Dozen
  "Pair",
  "ML"        // Milliliters
];

export default function CreateProductModal({visible, setVisible}: Props): React.JSX.Element {

    const {primaryColor, primaryBackgroundColor, secondaryBackgroundColor} = useTheme();
    const {setAlert} = useAlert();

    const dispatch = useAppDispatch();
    const {company} = useCompanyStore();
    const {loading, pageMeta} = useProductStore();

    const [isUnitModalVisible, setUnitModalVisible] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [unit, setUnit] = useState<string>('Unit');
    const [productNo, setProductNo] = useState<string>('');
    const [lowStockAlert, setLowStockAlert] = useState<string>('');

    async function handleCreate() {
        if(!(name && price && productNo)) {
            return setAlert({
                type: 'error', 
                id: 'create-product-modal',
                massage: 'Please enter product Name, price and product No for create a new product.'
            });
        }


        let productData = new FormData;
        [
            ['stock_item_name', name], ['company_id', company?._id ?? ''], ['unit', unit], ['opening_rate', price], ['gst_hsn_code', productNo], ['low_stock_alert', lowStockAlert || '0']
        ].forEach((([Keyboard, value]) => productData.append(Keyboard, value)));

        let {payload: res} = await dispatch(createProduct({productData}))
        if(res && res?.status === 'success') {
            await dispatch(viewAllProducts({company_id: company?._id ?? '', pageNumber: pageMeta.page}));
            setVisible(false);
        } else {
            setAlert({
                type: 'error', 
                id: 'create-product-modal',
                massage: res?.message || 'Failed to create product.'
            });
        }
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
                    onChangeText={setName}
                />
            </View>

            <View style={{flexDirection: 'row', gap: 16, justifyContent: 'center'}} >
                <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, flex: 1, maxWidth: 320}} >
                    <FeatherIcon name="box" size={28} />
                    <NoralTextInput
                        placeholder="Low Stock Level"
                        style={{fontSize: 24, fontWeight: 900, flex: 1}}
                        onChangeText={setPrice}
                        keyboardType="number-pad"
                    />
                </View>

                <AnimateButton 
                    onPress={() => setUnitModalVisible(true)}
                    style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, width: 100, paddingInline: 8}} 
                >
                    <TextTheme style={{fontSize: 24, fontWeight: 900, flex: 1}}>{unit}</TextTheme>
                    <FeatherIcon name="arrow-right" size={24} />
                </AnimateButton>
            </View>

            <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12}} >
                <FeatherIcon name="tag" size={28} />
                <NoralTextInput
                    placeholder="Product No"
                    style={{fontSize: 24, fontWeight: 900, flex: 1}}
                    onChangeText={setProductNo}
                />
            </View>

            <View style={{minHeight: 40}} />

            <BottomModal 
                visible={isUnitModalVisible}
                setVisible={setUnitModalVisible}
                style={{paddingInline: 20, gap: 20}}
            >
                <TextTheme style={{fontWeight: 900, fontSize: 16}} >Customer Details</TextTheme>

                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12}} >
                    {
                        unitsOfMeasurement.map(name => (
                            <AnimateButton 
                                key={name} 
                                style={{
                                    borderWidth: 2, borderRadius: 100, paddingInline: 16, borderColor: secondaryBackgroundColor, paddingBlock: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
                                    backgroundColor: name === unit ? secondaryBackgroundColor : primaryBackgroundColor
                                }}
                                onPress={() => {
                                    setUnit(name)
                                    setUnitModalVisible(false);
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
        </BottomModal>
    )
}
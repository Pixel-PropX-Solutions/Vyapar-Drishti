/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import BottomModal from '../../../../Components/Modal/BottomModal';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { ScrollView, View } from 'react-native';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import LabelTextInput from '../../../../Components/Ui/TextInput/LabelTextInput';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { useAppDispatch, useProductStore } from '../../../../Store/ReduxStore';
import { units } from '../../../../Utils/units';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { SelectField } from '../../../../Components/Ui/TextInput/SelectField';
import { updateProductDetails } from '../../../../Services/product';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function InfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {
    const { loading, product } = useProductStore();
    const { primaryColor, secondaryBackgroundColor } = useTheme();
    const [isUnitModalVisible, setUnitModalVisible] = useState(false);
    const dispatch = useAppDispatch();

    const info = useRef({
        stock_item_name: '',
        // gst_hsn_code: '',
        low_stock_alert: '',
        unit: '',
        unit_id: '',
        description: '',
    });

    const setInfo = (key: string, value: any) => {
        info.current = { ...info.current, [key]: value };
    };

    function handleUpdate() {
        dispatch(updateProductDetails({ product_details: info.current, id: product?._id ?? '' })).unwrap().then(() => {
            setVisible(false);
        }).catch((error) => {
            console.error('Error updating product details:', error);
        });
    }

    useEffect(() => {
        if (product) {
            setInfo('stock_item_name', product.stock_item_name ?? '');
            // setInfo('gst_hsn_code', product.gst_hsn_code ?? '');
            setInfo('low_stock_alert', product.low_stock_alert !== undefined ? String(product.low_stock_alert) : '');
            setInfo('unit', product.unit ?? '');
            setInfo('unit_id', product.unit_id ?? '');
            setInfo('description', product.description ?? '');
        }
    }, [product]);

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingHorizontal: 20 }}
            actionButtons={[{
                title: 'Update', onPress: handleUpdate,
                icon: <FeatherIcon name="save" size={20} />,
            }]}
        >
            <ScrollView showsVerticalScrollIndicator={false} >
                <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
                    Update Customer Information
                </TextTheme>

                <View style={{ gap: 24 }} >
                    <LabelTextInput
                        label="Name"
                        placeholder="Enter your product name"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => { setInfo('stock_item_name', val); }}
                        useTrim={true}
                        value={info.current.stock_item_name}
                        isRequired={true}
                    />

                    {/* <LabelTextInput
                        label="HSN Code"
                        placeholder="Enter HSN Code"
                        icon={<FeatherIcon name="hash" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}
                        onChangeText={(val) => { setInfo('hsnCode', val); }}
                        infoMassage="HSN Code is used for tax calculation. It is mandatory for GST registered businesses."
                    /> */}

                    <LabelTextInput
                        label="Low Stock Alert"
                        placeholder="Enter Low Stock Alert"
                        icon={<FeatherIcon name="bell" size={16} />}
                        value={info.current.low_stock_alert}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        useTrim={true}
                        onChangeText={(val) => { setInfo('low_stock_alert', val); }}
                        infoMassage="Set a low stock alert to get notified when the stock falls below this level."
                    />

                    <SelectField
                        icon={<FeatherIcon name="layers" size={20} color={primaryColor} />}
                        placeholder="Enter Measurement Unit *"
                        value={info.current.unit ?? ''}
                        onPress={() => setUnitModalVisible(true)}
                    />

                    <LabelTextInput
                        label="Description"
                        placeholder="Enter Product Description"
                        icon={<FeatherIcon name="file-text" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}
                        value={info.current.description ?? ''}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(val) => { setInfo('description', val); }}
                    />
                </View>

                <View style={{ minHeight: 20 }} />
            </ScrollView>

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
            {/* Unit Selection Modal */}
            <BottomModal
                visible={isUnitModalVisible}
                setVisible={setUnitModalVisible}
                style={{ paddingHorizontal: 20 }}
            >
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TextTheme style={{ fontWeight: '900', fontSize: 18 }}>Select Unit</TextTheme>
                    <TextTheme style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
                        Choose measurement unit for your product
                    </TextTheme>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 8,
                        paddingBottom: 20,
                    }}
                    style={{ maxHeight: 400 }}
                >
                    {units.map((unit) => (
                        <AnimateButton
                            key={unit.id}
                            style={{
                                borderWidth: 2,
                                borderRadius: 25,
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                borderColor: unit.value === info.current.unit ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: unit.value === info.current.unit ? secondaryBackgroundColor : 'transparent',
                                marginBottom: 8,
                                minWidth: 100,
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                setInfo('unit', unit.value);
                                setInfo('unit_id', unit.id);
                                setUnitModalVisible(false);
                            }}
                        >
                            <TextTheme style={{
                                fontSize: 14,
                                color: unit.value === info.current.unit ? '#fff' : undefined,
                            }}>
                                {unit.label}
                            </TextTheme>
                        </AnimateButton>
                    ))}
                </ScrollView>
            </BottomModal>
        </BottomModal>
    );
}

export function ClassInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {

    const info = useRef({
        category: '',
        group: '',
    });

    const setInfo = (key: string, value: any) => {
        info.current = { ...info.current, [key]: value };
    };

    function handleUpdate() {
        console.log('Update Product Info', info.current);
    }

    return (
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingHorizontal: 20 }}
            actionButtons={[{
                title: 'Update', onPress: handleUpdate,
                icon: <FeatherIcon name="save" size={20} />,
            }]}
        >
            <ScrollView showsVerticalScrollIndicator={false} >
                <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
                    Update Customer Information
                </TextTheme>

                <View style={{ gap: 24 }} >
                    <LabelTextInput
                        label="Category"
                        placeholder="Enter product category"
                        icon={<FeatherIcon name="tag" size={16} style={{ top: 2 }} />}
                        onChangeText={(val) => { setInfo('category', val); }}
                        useTrim={true}
                    />

                    <LabelTextInput
                        label="Group"
                        placeholder="Enter Product Group"
                        icon={<FeatherIcon name="hash" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}
                        onChangeText={(val) => { setInfo('group', val); }}
                    />
                </View>

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    );
}


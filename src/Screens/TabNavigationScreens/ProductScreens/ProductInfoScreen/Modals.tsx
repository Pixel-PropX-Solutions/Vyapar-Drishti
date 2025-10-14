/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import BottomModal from '../../../../Components/Modal/BottomModal';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { ScrollView, View } from 'react-native';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import LabelTextInput from '../../../../Components/Ui/TextInput/LabelTextInput';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { useAppDispatch, useProductStore, useUserStore } from '../../../../Store/ReduxStore';
import { units } from '../../../../Utils/units';
import AnimateButton from '../../../../Components/Ui/Button/AnimateButton';
import { useTheme } from '../../../../Contexts/ThemeProvider';
import { SelectField } from '../../../../Components/Ui/TextInput/SelectField';
import { getProduct, updateProductDetails } from '../../../../Services/product';
import CollapsabeMenu from '../../../../Components/Other/CollapsabeMenu';
import { SectionRow } from '../../../../Components/Layouts/View/SectionView';
import { MeasurmentUnitsData } from '../../../../Assets/objects-data/measurment-units-data';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}
const taxabilityOptions = [
    { label: 'Taxable', value: 'taxable' },
    { label: 'Exempt', value: 'exempt' },
    { label: 'Nil Rated', value: 'nil_rated' },
    { label: 'Non-TAX', value: 'non_tax' },
];

const goodsNatureOptions = [
    { label: 'Goods', value: 'goods' },
    { label: 'Services', value: 'services' },
];

export function InfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {
    const { loading, product } = useProductStore();
    const { primaryColor, secondaryBackgroundColor } = useTheme();
    const [isUnitModalVisible, setUnitModalVisible] = useState(false);

    const dispatch = useAppDispatch();
    const { user, current_company_id } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;
    const [basicInfoExpanded, setBasicInfoExpanded] = useState<boolean>(true);
    const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState<boolean>(false);
    const [taxInfoExpanded, setTaxInfoExpanded] = useState<boolean>(tax_enable ? true : false);
    // const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isTaxabilityModalVisible, setTaxabilityModalVisible] = useState<boolean>(false);
    const [isGoodsNatureModalVisible, setGoodsNatureModalVisible] = useState<boolean>(false);
    const [isOpeningStockVisible, setOpeningStockVisible] = useState<boolean>(false);
    const [_, forceRender] = useState(0);


    const info = useRef({
        stock_item_name: '',
        company_id: '',
        unit: '',
        unit_id: '',
        is_deleted: false,
        alias_name: '',
        category: '',
        category_id: '',
        group: '',
        group_id: '',
        image: '',
        description: '',
        opening_balance: 0,
        opening_rate: 0,
        opening_value: 0,
        nature_of_goods: '',
        hsn_code: '',
        taxability: '',
        tax_rate: '',
        low_stock_alert: 0,
    });

    const setInfo = (key: string, value: any) => {
        if (key === 'opening_balance' || key === 'opening_rate') {
            info.current = {
                ...info.current,
                [key]: value,
                opening_value: info.current.opening_balance * info.current.opening_rate,
            };
        } else {
            info.current = { ...info.current, [key]: value };
        }
        forceRender(x => x + 1); // trigger re-render
    };

    function handleUpdate() {
        const dataToSend = {
            stock_item_name: info.current.stock_item_name,
            hsn_code: info.current.hsn_code,
            low_stock_alert: info.current.low_stock_alert ? Number(info.current.low_stock_alert) : 10,
            unit: info.current.unit,
            unit_id: info.current.unit_id,
            description: info.current.description,
            nature_of_goods: info.current.nature_of_goods,
            taxability: info.current.taxability,
            tax_rate: info.current.tax_rate ? Number(info.current.tax_rate) : 0,
            opening_balance: info.current.opening_balance ? Number(info.current.opening_balance) : 0,
            opening_rate: info.current.opening_rate ? Number(info.current.opening_rate) : 0,
            opening_value: info.current.opening_value ? Number(info.current.opening_value) : 0,
            category: info.current.category,
            category_id: info.current.category_id,
            group: info.current.group,
            group_id: info.current.group_id,
            alias_name: info.current.alias_name,
            image: info.current.image,
            is_deleted: info.current.is_deleted,
            company_id: product?.company_id || current_company_id || '',
        };
        console.log('Update Product Info', dataToSend);

        dispatch(updateProductDetails({ product_details: dataToSend, id: product?._id ?? '' })).unwrap().then(() => {
            dispatch(getProduct({ company_id: current_company_id ?? '', product_id: product?._id ?? '' }));
            setVisible(false);
        }).catch((error) => {
            console.error('Error updating product details:', error);
        });
    }

    useEffect(() => {
        if (product) {
            setInfo('stock_item_name', product.stock_item_name ?? '');
            setInfo('hsn_code', product.hsn_code ?? '');
            setInfo('low_stock_alert', product.low_stock_alert !== undefined ? String(product.low_stock_alert) : '');
            setInfo('unit', product.unit ?? '');
            setInfo('unit_id', product.unit_id ?? '');
            setInfo('description', product.description ?? '');
            setInfo('nature_of_goods', product.nature_of_goods ?? '');
            setInfo('taxability', product.taxability ?? '');
            setInfo('tax_rate', product.tax_rate !== undefined ? String(product.tax_rate) : '');
            setInfo('opening_balance', product.opening_balance !== undefined ? String(product.opening_balance) : '0');
            setInfo('opening_rate', product.opening_rate !== undefined ? String(product.opening_rate) : '0');
            setInfo('opening_value', product.opening_value !== undefined ? product.opening_value : 0);
            setInfo('category', product.category ?? '');
            setInfo('category_id', product.category_id ?? '');
            setInfo('group', product.group ?? '');
            setInfo('group_id', product.group_id ?? '');
            setInfo('alias_name', product.alias_name ?? '');
            setInfo('image', product.image ?? '');
            setInfo('is_deleted', product.is_deleted ?? false);
            setInfo('company_id', product.company_id ?? '');
        } else {
            info.current = {
                stock_item_name: '',
                company_id: '',
                unit: '',
                unit_id: '',
                is_deleted: false,
                alias_name: '',
                category: '',
                category_id: '',
                group: '',
                group_id: '',
                image: '',
                description: '',
                opening_balance: 0,
                opening_rate: 0,
                opening_value: 0,
                nature_of_goods: '',
                hsn_code: '',
                taxability: '',
                tax_rate: '',
                low_stock_alert: 0,
            };
        }
    }, [product]);

    console.log('Product Info Modal Rendered', info.current.opening_balance, info.current.opening_rate, info.current.opening_value);

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
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: secondaryBackgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 12,
                    }}>
                        <FeatherIcon name="package" size={30} color={primaryColor} />
                    </View>
                    <TextTheme fontWeight={900} fontSize={20} style={{ textAlign: 'center' }}>
                        Edit Product
                    </TextTheme>
                    <TextTheme fontSize={14} style={{ opacity: 0.7, textAlign: 'center', marginTop: 4 }}>
                        Update product details in your inventory
                    </TextTheme>
                </View>

                <CollapsabeMenu
                    expanded={basicInfoExpanded}
                    setExpanded={setBasicInfoExpanded}
                    header="Basic Information"
                >
                    <LabelTextInput
                        label="Product Name"
                        placeholder="Enter your product name"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => { setInfo('stock_item_name', val); }}
                        useTrim={true}
                        value={info.current.stock_item_name}
                        isRequired={true}
                        capitalize="words"
                        containerStyle={{ marginBottom: 12 }}
                    />

                    <SelectField
                        icon={<FeatherIcon name="layers" size={20} color={primaryColor} />}
                        placeholder="Enter Measurement Unit *"
                        value={info.current.unit ?? ''}
                        onPress={() => setUnitModalVisible(true)}
                        containerStyle={{ marginBottom: 12 }}
                    />
                </CollapsabeMenu>


                {/* TAX Information */}
                {tax_enable && (<View style={{
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12,
                }}>
                    <CollapsabeMenu
                        expanded={taxInfoExpanded}
                        setExpanded={setTaxInfoExpanded}
                        header="TAX Information"
                    >
                        <View>
                            <LabelTextInput
                                label="HSN/SAC Code"
                                placeholder="Enter HSN/SAC Code"
                                icon={<FeatherIcon name="hash" size={16} />}
                                onChangeText={(val) => { setInfo('hsn_code', val); }}
                                useTrim={true}
                                value={info.current.hsn_code}
                                isRequired={true}
                                capitalize="characters"
                                containerStyle={{ marginBottom: 12 }}
                            />

                            {info.current.hsn_code && <>
                                <SelectField
                                    icon={<FeatherIcon name="shield" size={20} color={primaryColor} />}
                                    placeholder="Nature of Goods/Services"
                                    value={goodsNatureOptions.find(option => option.label === info.current.nature_of_goods)?.label || ''}
                                    onPress={() => setGoodsNatureModalVisible(true)}
                                />

                                <SelectField
                                    icon={<FeatherIcon name="percent" size={20} color={primaryColor} />}
                                    placeholder="Taxability"
                                    value={taxabilityOptions.find(option => option.label === info.current.taxability)?.label || ''}
                                    onPress={() => setTaxabilityModalVisible(true)}
                                />

                                {info.current.taxability === 'Taxable' && (<LabelTextInput
                                    placeholder="Enter TAX Percentage"
                                    keyboardType="numeric"
                                    label="TAX Percentage"
                                    icon={<FeatherIcon name="percent" size={16} />}
                                    onChangeText={(val) => { setInfo('tax_rate', Number(val)); }}
                                    useTrim={true}
                                    value={info.current.tax_rate.toString()}
                                    isRequired={true}
                                    capitalize="characters"
                                />)}
                            </>
                            }
                        </View>
                    </CollapsabeMenu>
                </View>)}

                {/* Additional Information */}
                <CollapsabeMenu
                    expanded={additionalInfoExpanded}
                    setExpanded={setAdditionalInfoExpanded}
                    header="Additional Information"
                >
                    <LabelTextInput
                        label="Description"
                        placeholder="Enter Product Description"
                        icon={<FeatherIcon name="file-text" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}
                        value={info.current.description ?? ''}
                        multiline={true}
                        numberOfLines={4}
                        containerStyle={{ marginBottom: 12 }}
                        onChangeText={(val) => { setInfo('description', val); }}
                    />

                    {/*  <SelectField
                            icon={<FeatherIcon name="folder" size={20} color={primaryColor} />}
                            placeholder="Category"
                            value={categories.find(option => option.value === info.current.category) || ''}
                            onPress={() => setCategoryModalVisible(true)}
                        />
                        <SelectField
                            icon={<FeatherIcon name="grid" size={20} color={primaryColor} />}
                            placeholder="Group"
                            value={groups.find(option => option.value === info.current.group) || ''}
                            onPress={() => setGroupModalVisible(true)}
                        />
                    */}
                    <LabelTextInput
                        label="Low Stock Alert"
                        placeholder="Enter Low Stock Alert"
                        icon={<FeatherIcon name="bell" size={16} />}
                        value={info.current.low_stock_alert.toString()}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        useTrim={true}
                        containerStyle={{ marginBottom: 12 }}
                        onChangeText={(val) => { setInfo('low_stock_alert', Number(val)); }}
                        infoMessage="Set a low stock alert to get notified when the stock falls below this level."
                    />

                </CollapsabeMenu>

                <CollapsabeMenu
                    expanded={isOpeningStockVisible}
                    setExpanded={setOpeningStockVisible}
                    header="Opening Stock Information"
                >
                    <LabelTextInput
                        label="Opening Quantity"
                        placeholder="Enter Opening Quantity"
                        icon={<FeatherIcon name="package" size={16} />}
                        value={info.current.opening_balance.toString()}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        useTrim={true}
                        containerStyle={{ marginBottom: 12 }}
                        onChangeText={(val) => { setInfo('opening_balance', Number(val)); }}
                        infoMessage="Set the opening quantity for the product."
                    />
                    <LabelTextInput
                        label="Opening Rate"
                        placeholder="Enter Opening Rate"
                        icon={<FeatherIcon name="tag" size={16} />}
                        value={info.current.opening_rate.toString()}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        useTrim={true}
                        containerStyle={{ marginBottom: 12 }}
                        onChangeText={(val) => { setInfo('opening_rate', Number(val)); }}
                        infoMessage="Set the opening rate for the product."
                    />

                    <SectionRow>
                        <TextTheme fontSize={14} fontWeight={600} >
                            Opening Value: {(info.current.opening_balance * info.current.opening_rate).toFixed(2)}
                        </TextTheme>
                    </SectionRow>
                </CollapsabeMenu>


                <View style={{ minHeight: 20 }} />
            </ScrollView>

            {/* Unit Selection Modal */}
            <BottomModal
                visible={isUnitModalVisible}
                setVisible={setUnitModalVisible}
                style={{ paddingHorizontal: 20 }}
            >
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TextTheme fontWeight={900} fontSize={18}>Select Unit</TextTheme>
                    <TextTheme fontSize={14} style={{ opacity: 0.7, marginTop: 4 }}>
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
                    {MeasurmentUnitsData.map((unit) => (
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
                            <TextTheme fontSize={14} style={{ color: unit.value === info.current.unit ? '#fff' : undefined }}>
                                {unit.unit_name}
                            </TextTheme>
                        </AnimateButton>
                    ))}
                </ScrollView>
            </BottomModal>

            {/* Taxability Selection Modal */}
            <BottomModal
                visible={isTaxabilityModalVisible}
                setVisible={setTaxabilityModalVisible}
                style={{ paddingHorizontal: 20 }}
            >
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TextTheme fontWeight={900} fontSize={18}>Taxability</TextTheme>
                    <TextTheme fontSize={14} style={{ opacity: 0.7, marginTop: 4 }}>
                        Select taxability type
                    </TextTheme>
                </View>

                <View style={{ gap: 12 }}>
                    {taxabilityOptions.map((option) => (
                        <AnimateButton
                            key={option.value}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderWidth: 2,
                                borderRadius: 12,
                                borderColor: option.label === info.current.taxability ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: option.label === info.current.taxability ? primaryColor : 'transparent',
                            }}
                            onPress={() => {
                                setInfo('taxability', option.label);
                                setTaxabilityModalVisible(false);
                            }}
                        >
                            <TextTheme fontWeight={600} fontSize={16} color={option.label === info.current.taxability ? '#fff' : undefined}>
                                {option.label}
                            </TextTheme>
                        </AnimateButton>
                    ))}
                </View>
            </BottomModal>

            {/* Goods Nature Selection Modal */}
            <BottomModal
                visible={isGoodsNatureModalVisible}
                setVisible={setGoodsNatureModalVisible}
                style={{ paddingHorizontal: 20 }}
            >
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TextTheme fontWeight={900} fontSize={18}>Nature of Goods</TextTheme>
                    <TextTheme fontSize={14} style={{ opacity: 0.7, marginTop: 4 }}>
                        Select whether this is goods or services
                    </TextTheme>
                </View>

                <View style={{ gap: 12 }}>
                    {goodsNatureOptions.map((option) => (
                        <AnimateButton
                            key={option.value}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                borderWidth: 2,
                                borderRadius: 12,
                                borderColor: option.label === info.current.nature_of_goods ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: option.label === info.current.nature_of_goods ? primaryColor : 'transparent',
                            }}
                            onPress={() => {
                                setInfo('nature_of_goods', option.label);
                                setGoodsNatureModalVisible(false);
                            }}
                        >
                            <TextTheme fontWeight={600} fontSize={16} color={option.label === info.current.nature_of_goods ? '#fff' : undefined}>
                                {option.label}
                            </TextTheme>
                        </AnimateButton>
                    ))}
                </View>
            </BottomModal>
            <LoadingModal visible={loading} text="Updating Product..." />
        </BottomModal>
    );
}

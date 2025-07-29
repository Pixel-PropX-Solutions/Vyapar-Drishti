/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import BottomModal from '../BottomModal';
import TextTheme from '../../Ui/Text/TextTheme';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import FeatherIcon from '../../Icon/FeatherIcon';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { useAlert } from '../../Ui/Alert/AlertProvider';
import AnimateButton from '../../Ui/Button/AnimateButton';
import { useAppDispatch, useCompanyStore, useProductStore, useUserStore } from '../../../Store/ReduxStore';
import { createProduct, viewAllProducts } from '../../../Services/product';
import LoadingModal from '../LoadingModal';
import { units } from '../../../Utils/units';
import CollapsabeMenu from '../../Other/CollapsabeMenu';
import { InputField } from '../../Ui/TextInput/InputField';
import { SelectField } from '../../Ui/TextInput/SelectField';
import MeasurementUnitsOpation from '../../Ui/Option/MeasurmentUnits';
// import Popover from '../../Other/Popover';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}


export default function CreateProductModal({ visible, setVisible }: Props): React.JSX.Element {

    const { primaryColor, secondaryBackgroundColor, primaryBackgroundColor } = useTheme();
    const { setAlert } = useAlert();

    const dispatch = useAppDispatch();
    const { company } = useCompanyStore();
    const { user } = useUserStore();
    const { loading, pageMeta } = useProductStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const [basicInfoExpanded, setBasicInfoExpanded] = useState<boolean>(true);
    const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState<boolean>(false);
    const [gstInfoExpanded, setGstInfoExpanded] = useState<boolean>(gst_enable ? true : false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isUnitModalVisible, setUnitModalVisible] = useState<boolean>(false);
    const [isTaxabilityModalVisible, setTaxabilityModalVisible] = useState<boolean>(false);
    const [isGoodsNatureModalVisible, setGoodsNatureModalVisible] = useState<boolean>(false);

    const [data, setData] = useState({
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
        gst_nature_of_goods: '',
        gst_hsn_code: '',
        gst_taxability: '',
        gst_percentage: '',
        low_stock_alert: 0,
    });

    const taxabilityOptions = [
        { label: 'Taxable', value: 'taxable' },
        { label: 'Exempt', value: 'exempt' },
        { label: 'Nil Rated', value: 'nil_rated' },
        { label: 'Non-GST', value: 'non_gst' },
    ];

    const goodsNatureOptions = [
        { label: 'Goods', value: 'goods' },
        { label: 'Services', value: 'services' },
    ];

    const handleChange = useCallback((field: string, value: string | boolean | number) => {
        setData((prevState) => ({
            ...prevState,
            [field]: value,
        }));

        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [validationErrors]);

    const validateForm = useCallback(() => {
        const errors: Record<string, string> = {};

        if (!data.stock_item_name.trim()) {
            errors.stock_item_name = 'Product name is required';
        }

        if (!data.unit) {
            errors.unit = 'Unit is required';
        }

        if (gst_enable && !data.gst_hsn_code.trim()) {
            errors.gst_hsn_code = 'HSN/SAC code is required';
        }

        if (data.opening_balance < 0) {
            errors.opening_balance = 'Opening balance cannot be negative';
        }

        if (data.opening_rate < 0) {
            errors.opening_rate = 'Opening rate cannot be negative';
        }

        if (data.low_stock_alert < 0) {
            errors.low_stock_alert = 'Low stock alert cannot be negative';
        }

        if (data.gst_percentage && (parseFloat(data.gst_percentage) < 0 || parseFloat(data.gst_percentage) > 100)) {
            errors.gst_percentage = 'GST percentage must be between 0 and 100';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data, gst_enable]);

    async function handleCreate() {
        if (!validateForm()) {
            const firstError = Object.keys(validationErrors)[0];
            return setAlert({
                type: 'error',
                id: 'create-product-modal',
                message: validationErrors[firstError] || 'Please fix the validation errors before creating the product.',
            });
        }

        let productData = new FormData();
        Object.entries(data).forEach(([key, value]) => productData.append(key, value.toString()));

        let { payload: res } = await dispatch(createProduct({ productData }));
        console.log('after feaching: ', res);

        if (res && res?.success) {
            await dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: pageMeta.page }));
            setVisible(false);
            // Reset form
            setData({
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
                gst_nature_of_goods: '',
                gst_hsn_code: '',
                gst_taxability: '',
                gst_percentage: '',
                low_stock_alert: 0,
            });
        } else {
            setAlert({
                type: 'error',
                id: 'create-product-modal',
                message: res?.message || 'Failed to create product.',
            });
        }
    }

    return (
        <BottomModal
            alertId="create-product-modal"
            visible={visible}
            setVisible={() => {
                setVisible(false);
                setData({
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
                    gst_nature_of_goods: '',
                    gst_hsn_code: '',
                    gst_taxability: '',
                    gst_percentage: '',
                    low_stock_alert: 0,
                });
                setValidationErrors({});
            }}
            style={{ paddingHorizontal: 20, maxHeight: '100%', minHeight: additionalInfoExpanded ? '80%' : '60%' }}
            actionButtons={[
                {
                    key: 'create-product',
                    title: 'Create Product',
                    backgroundColor: 'rgb(50,200,150)',
                    onPress: handleCreate,
                },
            ]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
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
                    <TextTheme style={{ fontWeight: '900', fontSize: 20, textAlign: 'center' }}>
                        Create New Product
                    </TextTheme>
                    <TextTheme style={{ fontSize: 14, opacity: 0.7, textAlign: 'center', marginTop: 4 }}>
                        Add product details to your inventory
                    </TextTheme>
                </View>

                {/* Basic Information */}
                <CollapsabeMenu
                    expanded={basicInfoExpanded}
                    setExpanded={setBasicInfoExpanded}
                    header="Basic Information"
                >
                    <InputField
                        icon={<FeatherIcon name="package" size={20} color={primaryColor} />}
                        placeholder="Product Name *"
                        value={data.stock_item_name}
                        field="stock_item_name"
                        handleChange={handleChange}
                        error={validationErrors.stock_item_name}
                    />

                    <MeasurementUnitsOpation label="Select Unit *" error={validationErrors.unit} onSelect={unit => {
                        if (!unit?.id) { return; }

                        handleChange('unit', unit?.symbol);
                        handleChange('unit_id', unit?.id);
                    }} />

                </CollapsabeMenu>

                {/* Additional Information */}
                <CollapsabeMenu
                    expanded={additionalInfoExpanded}
                    setExpanded={setAdditionalInfoExpanded}
                    header="Additional Information"
                >
                    <InputField
                        icon={<FeatherIcon name="file-text" size={20} color={primaryColor} />}
                        placeholder="Description"
                        value={data.description}
                        field="description"
                        multiline={true}
                        handleChange={handleChange}
                    />

                    {/* <InputField
                        icon={<FeatherIcon name="folder" size={20} color={primaryColor} />}
                        placeholder="Category"
                        value={data.category}
                        field="category"
                        handleChange={handleChange}
                    />

                    <InputField
                        icon={<FeatherIcon name="grid" size={20} color={primaryColor} />}
                        placeholder="Group"
                        value={data.group}
                        field="group"
                        handleChange={handleChange}
                    />
                    */}
                    <InputField
                        icon={<FeatherIcon name="alert-triangle" size={20} color={primaryColor} />}
                        placeholder="Low Stock Alert Level"
                        value={data.low_stock_alert}
                        field="low_stock_alert"
                        keyboardType="number-pad"
                        handleChange={handleChange}
                        info="Set a threshold for low stock alert. Default is 10."

                    />


                </CollapsabeMenu>
                {/* GST Information */}
                {gst_enable && (<View style={{
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12,
                    marginLeft: 8,
                }}>
                    <CollapsabeMenu
                        expanded={gstInfoExpanded}
                        setExpanded={setGstInfoExpanded}
                        header="GST Information"
                    >
                        <View style={{ marginTop: 10 }}>
                            <InputField
                                icon={<FeatherIcon name="hash" size={20} color={primaryColor} />}
                                placeholder="HSN/SAC Code"
                                value={data.gst_hsn_code}
                                field="gst_hsn_code"
                                handleChange={handleChange}
                            />

                            {data.gst_hsn_code && <>
                                <SelectField
                                    icon={<FeatherIcon name="shield" size={20} color={primaryColor} />}
                                    placeholder="Nature of Goods/Services"
                                    value={goodsNatureOptions.find(option => option.value === data.gst_nature_of_goods)?.label || ''}
                                    onPress={() => setGoodsNatureModalVisible(true)}
                                />

                                <SelectField
                                    icon={<FeatherIcon name="percent" size={20} color={primaryColor} />}
                                    placeholder="GST Taxability"
                                    value={taxabilityOptions.find(option => option.value === data.gst_taxability)?.label || ''}
                                    onPress={() => setTaxabilityModalVisible(true)}
                                />

                                {data.gst_taxability === 'taxable' && (<InputField
                                    icon={<FeatherIcon name="percent" size={20} color={primaryColor} />}
                                    placeholder="GST Percentage"
                                    value={data.gst_percentage}
                                    field="gst_percentage"
                                    keyboardType="numeric"
                                    handleChange={handleChange}
                                />)}
                            </>
                            }
                        </View>
                    </CollapsabeMenu>
                </View>)}
            </ScrollView>


            {/* Taxability Selection Modal */}
            <BottomModal
                visible={isTaxabilityModalVisible}
                setVisible={setTaxabilityModalVisible}
                style={{ paddingHorizontal: 20 }}
            >
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TextTheme style={{ fontWeight: '900', fontSize: 18 }}>GST Taxability</TextTheme>
                    <TextTheme style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
                        Select GST taxability type
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
                                borderColor: option.value === data.gst_taxability ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: option.value === data.gst_taxability ? primaryColor : 'transparent',
                            }}
                            onPress={() => {
                                handleChange('gst_taxability', option.value);
                                setTaxabilityModalVisible(false);
                            }}
                        >
                            <TextTheme style={{
                                fontWeight: '600',
                                fontSize: 16,
                                color: option.value === data.gst_taxability ? '#fff' : undefined,
                            }}>
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
                    <TextTheme style={{ fontWeight: '900', fontSize: 18 }}>Nature of Goods</TextTheme>
                    <TextTheme style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
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
                                borderColor: option.value === data.gst_nature_of_goods ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: option.value === data.gst_nature_of_goods ? primaryColor : 'transparent',
                            }}
                            onPress={() => {
                                handleChange('gst_nature_of_goods', option.value);
                                setGoodsNatureModalVisible(false);
                            }}
                        >
                            <TextTheme style={{
                                fontWeight: '600',
                                fontSize: 16,
                                color: option.value === data.gst_nature_of_goods ? '#fff' : undefined,
                            }}>
                                {option.label}
                            </TextTheme>
                        </AnimateButton>
                    ))}
                </View>
            </BottomModal>

            <LoadingModal visible={loading} />
        </BottomModal>
    );
}

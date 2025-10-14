/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import BottomModal from '../BottomModal';
import TextTheme from '../../Ui/Text/TextTheme';
import { View, ScrollView } from 'react-native';
import FeatherIcon from '../../Icon/FeatherIcon';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { useAlert } from '../../Ui/Alert/AlertProvider';
import AnimateButton from '../../Ui/Button/AnimateButton';
import { useAppDispatch, useProductStore, useUserStore } from '../../../Store/ReduxStore';
import { createProduct, viewAllProducts } from '../../../Services/product';
import LoadingModal from '../LoadingModal';
import CollapsabeMenu from '../../Other/CollapsabeMenu';
import { InputField } from '../../Ui/TextInput/InputField';
import { SelectField } from '../../Ui/TextInput/SelectField';
import MeasurementUnitsOpation from '../../Ui/Option/MeasurmentUnits';
import { SectionRow } from '../../Layouts/View/SectionView';
import { roundToDecimal } from '../../../Utils/functionTools';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}


export default function CreateProductModal({ visible, setVisible }: Props): React.JSX.Element {

    const { primaryColor, secondaryBackgroundColor } = useTheme();
    const { setAlert } = useAlert();

    const dispatch = useAppDispatch();
    const { user, current_company_id } = useUserStore();
    const { loading, pageMeta } = useProductStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;
    const [basicInfoExpanded, setBasicInfoExpanded] = useState<boolean>(true);
    const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState<boolean>(false);
    const [taxInfoExpanded, setTaxInfoExpanded] = useState<boolean>(tax_enable ? true : false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isTaxabilityModalVisible, setTaxabilityModalVisible] = useState<boolean>(false);
    const [isGoodsNatureModalVisible, setGoodsNatureModalVisible] = useState<boolean>(false);
    const [isOpeningStockVisible, setOpeningStockVisible] = useState<boolean>(false);


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
        nature_of_goods: '',
        hsn_code: '',
        taxability: '',
        tax_rate: '',
        low_stock_alert: 0,
    });

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

    const handleChange = useCallback((field: string, value: string | boolean | number) => {
        setData((prevState) => {
            let newState = { ...prevState, [field]: value };
            // Automatically update opening_value if opening_rate or opening_balance changes
            if (field === 'opening_rate' || field === 'opening_balance') {
                const opening_rate = field === 'opening_rate' ? Number(value) : Number(newState.opening_rate);
                const opening_balance = field === 'opening_balance' ? Number(value) : Number(newState.opening_balance);
                newState.opening_value = opening_rate * opening_balance;
            }
            return newState;
        });

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

        if (tax_enable && !data.hsn_code.trim()) {
            errors.hsn_code = 'HSN/SAC code is required';
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

        if (tax_enable && data.taxability === 'taxable' && (data.tax_rate === '' || isNaN(Number(data.tax_rate)))) {
            errors.tax_rate = 'TAX percentage is required for taxable products';
        }

        if (tax_enable && data.tax_rate && (parseFloat(data.tax_rate) < 0 || parseFloat(data.tax_rate) > 100)) {
            errors.tax_rate = 'TAX percentage must be between 0 and 100';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data, tax_enable]);


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
        productData.append('opening_value', roundToDecimal(data.opening_rate * data.opening_balance, 2));

        let { payload: res } = await dispatch(createProduct({ productData }));
        console.log('after feaching: ', res);

        if (res && res?.success) {
            await dispatch(viewAllProducts({ company_id: current_company_id ?? '', pageNumber: pageMeta.page }));
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
                nature_of_goods: '',
                hsn_code: '',
                taxability: '',
                tax_rate: '',
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
                    nature_of_goods: '',
                    hsn_code: '',
                    taxability: '',
                    tax_rate: '',
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
                keyboardShouldPersistTaps="always"
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
                    <TextTheme fontWeight={900} fontSize={20} style={{ textAlign: 'center' }}>
                        Create New Product
                    </TextTheme>
                    <TextTheme fontSize={14} style={{ opacity: 0.7, textAlign: 'center', marginTop: 4 }}>
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
                        field="stock_item_name"
                        handleChange={handleChange}
                        error={validationErrors.stock_item_name}
                    />

                    <MeasurementUnitsOpation
                        label="Select Unit *"
                        error={validationErrors.unit}
                        onSelect={unit => {
                            if (!unit?.id) { return; }

                            handleChange('unit', unit?.symbol);
                            handleChange('unit_id', unit?.id);
                        }} />

                </CollapsabeMenu>

                {/* TAX Information */}
                {tax_enable && (<View style={{
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12,
                    marginTop: 10,
                }}>
                    <CollapsabeMenu
                        expanded={taxInfoExpanded}
                        setExpanded={setTaxInfoExpanded}
                        header="TAX Information"
                    >
                        <View>
                            <InputField
                                icon={<FeatherIcon name="hash" size={20} color={primaryColor} />}
                                placeholder="HSN/SAC Code"
                                field="hsn_code"
                                capitalize="characters"
                                handleChange={handleChange}
                            />

                            {data.hsn_code && <>
                                <SelectField
                                    icon={<FeatherIcon name="shield" size={20} color={primaryColor} />}
                                    placeholder="Nature of Goods/Services"
                                    value={goodsNatureOptions.find(option => option.value === data.nature_of_goods)?.label || ''}
                                    onPress={() => setGoodsNatureModalVisible(true)}
                                />

                                <SelectField
                                    icon={<FeatherIcon name="percent" size={20} color={primaryColor} />}
                                    placeholder="Taxability"
                                    value={taxabilityOptions.find(option => option.value === data.taxability)?.label || ''}
                                    onPress={() => setTaxabilityModalVisible(true)}
                                />

                                {data.taxability === 'taxable' && (<InputField
                                    icon={<FeatherIcon name="percent" size={20} color={primaryColor} />}
                                    placeholder="TAX Percentage"
                                    field="tax_rate"
                                    keyboardType="numeric"
                                    handleChange={handleChange}
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
                    <InputField
                        icon={<FeatherIcon name="file-text" size={20} color={primaryColor} />}
                        placeholder="Description"
                        field="description"
                        multiline={true}
                        handleChange={handleChange}
                    />

                    {/* <InputField
                        icon={<FeatherIcon name="folder" size={20} color={primaryColor} />}
                        placeholder="Category"
                        field="category"
                        handleChange={handleChange}
                    />

                    <InputField
                        icon={<FeatherIcon name="grid" size={20} color={primaryColor} />}
                        placeholder="Group"
                        field="group"
                        handleChange={handleChange}
                    />
                    */}
                    <InputField
                        icon={<FeatherIcon name="alert-triangle" size={20} color={primaryColor} />}
                        placeholder="Low Stock Alert Level"
                        field="low_stock_alert"
                        keyboardType="number-pad"
                        handleChange={handleChange}
                        info="Set a threshold for low stock alert. Default is 0."
                    />

                </CollapsabeMenu>
                <CollapsabeMenu
                    expanded={isOpeningStockVisible}
                    setExpanded={setOpeningStockVisible}
                    header="Opening Stock Information"
                >
                    <InputField
                        icon={<FeatherIcon name="package" size={20} color={primaryColor} />}
                        placeholder="Opening Quantity"
                        field="opening_balance"
                        keyboardType="number-pad"
                        handleChange={handleChange}
                        info="Set the initial stock quantity. Default is 0."
                    />
                    <InputField
                        icon={<FeatherIcon name="tag" size={20} color={primaryColor} />}
                        placeholder="Opening Rate"
                        field="opening_rate"
                        keyboardType="number-pad"
                        handleChange={handleChange}
                        info="Set the initial rate per unit. Default is 0."
                    />
                    <SectionRow>
                        <TextTheme fontSize={14} fontWeight={600} >
                            Opening Value: {data.opening_value.toFixed(2)}
                        </TextTheme>
                    </SectionRow>
                </CollapsabeMenu>

            </ScrollView>


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
                                borderColor: option.value === data.taxability ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: option.value === data.taxability ? primaryColor : 'transparent',
                            }}
                            onPress={() => {
                                handleChange('taxability', option.value);
                                setTaxabilityModalVisible(false);
                            }}
                        >
                            <TextTheme fontWeight={600} fontSize={16} color={option.value === data.taxability ? '#fff' : undefined}>
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
                                borderColor: option.value === data.nature_of_goods ? primaryColor : secondaryBackgroundColor,
                                backgroundColor: option.value === data.nature_of_goods ? primaryColor : 'transparent',
                            }}
                            onPress={() => {
                                handleChange('nature_of_goods', option.value);
                                setGoodsNatureModalVisible(false);
                            }}
                        >
                            <TextTheme fontWeight={600} fontSize={16} color={option.value === data.nature_of_goods ? '#fff' : undefined}>
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

/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView, Text } from 'react-native';
import BottomModal from '../BottomModal';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import TextTheme from '../../Text/TextTheme';
import { useTheme } from '../../../Contexts/ThemeProvider';
import ShowWhen from '../../Other/ShowWhen';
import { useAlert } from '../../Alert/AlertProvider';
import LoadingModal from '../LoadingModal';
import { useAppDispatch, useCompanyStore, useCustomerStore, useUserStore } from '../../../Store/ReduxStore';
import { createCustomer, viewAllCustomers } from '../../../Services/customer';
import { accountGroups } from '../../../Utils/accountGroups';
import { InputField } from '../../TextInput/InputField';
import { setCustomerType } from '../../../Store/Reducers/customerReducer';
import FeatherIcon from '../../Icon/FeatherIcon';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
    setPrimaryVisible: Dispatch<SetStateAction<boolean>>
}

interface ValidationErrors {
    [key: string]: string;
}

export default function CreateCustomerModal({ visible, setVisible, setPrimaryVisible }: Props): React.JSX.Element {
    const { primaryColor } = useTheme();
    const { setAlert } = useAlert();

    const { company } = useCompanyStore();
    const { loading, customerType } = useCustomerStore();
    const { user } = useUserStore();
    const dispatch = useAppDispatch();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [currentStep, setCurrentStep] = useState<number>(0);

    const [data, setData] = useState({
        name: '',
        email: '',
        code: '+91',
        number: '',
        image: '',
        mailing_name: '',
        mailing_address: '',
        mailing_country: 'India',
        mailing_state: '',
        mailing_pincode: '',
        company_id: user?.user_settings?.current_company_id || '',
        parent: customerType?.accounting_group_name || '',
        parent_id: customerType?._id || '',
        bank_name: '',
        account_number: '',
        bank_ifsc: '',
        bank_branch: '',
        account_holder: '',
        gstin: '',
        it_pan: '',
    });

    const getVisibleFields = useCallback(() => {
        const type = (accountGroups.find((group) => group._id === customerType?._id)?.user_id === '' || accountGroups.find((group) => group._id === customerType?._id)?.user_id === null)
            ? customerType?.accounting_group_name.toLowerCase()
            : accountGroups.find((group) => group._id === customerType?._id)?.parent?.toLowerCase() || '';

        if (type === 'debtors' || type === 'creditors') {
            return {
                showAll: true,
                showBasicDetails: true,
                showProfileImage: true,
                showMailingDetails: true,
                showBankDetails: true,
                isBankOptional: true,
                isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? false : true,
                isMailingAddressOptional: false,
                showPAN: true,
                showGSTIN: true,
                requiredFields: [
                    'name',
                    'mailing_state',
                    'parent',
                    'mailing_country',
                    ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'it_pan'] : []),
                ],
            };
        }
        if (type === 'bank accounts') {
            return {
                showAll: false,
                showBasicDetails: true,
                showProfileImage: false,
                showMailingDetails: true,
                showBankDetails: true,
                isBankOptional: false,
                isGSTINOptional: false,
                isMailingAddressOptional: true,
                showPAN: false,
                showGSTIN: false,
                requiredFields: ['name', 'parent', 'bank_name', 'account_number', 'bank_ifsc'],
            };
        }
        if (type === 'capital account') {
            return {
                showAll: false,
                showBasicDetails: true,
                showProfileImage: false,
                showMailingDetails: true,
                showBankDetails: true,
                isBankOptional: true,
                isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? false : true,
                isMailingAddressOptional: true,
                showPAN: true,
                showGSTIN: true,
                requiredFields: ['name', 'parent', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'it_pan'] : [])],
            };
        }
        if (
            type === 'purchase account' ||
            type === 'sales account' ||
            type === 'stock-in-hand' ||
            type === 'suspense account'
        ) {
            return {
                showAll: false,
                showBasicDetails: true,
                showProfileImage: false,
                showMailingDetails: false,
                showBankDetails: false,
                isBankOptional: false,
                isGSTINOptional: false,
                isMailingAddressOptional: false,
                showPAN: false,
                showGSTIN: false,
                requiredFields: ['name', 'parent'],
            };
        }
        if (
            type === 'direct expense' ||
            type === 'direct income' ||
            type === 'indirect expenses' ||
            type === 'indirect incomes' ||
            type === 'duties & taxes' ||
            type === 'misc. expenses'
        ) {
            return {
                showAll: false,
                showBasicDetails: true,
                showProfileImage: false,
                showMailingDetails: false,
                showBankDetails: false,
                isBankOptional: true,
                isGSTINOptional: false,
                isMailingAddressOptional: true,
                showPAN: false,
                showGSTIN: false,
                requiredFields: ['name', 'parent'],
            };
        }
        if (
            type === 'current assets' ||
            type === 'current liabilities' ||
            type === 'fixed assets' ||
            type === 'loans (liability)' ||
            type === 'investments' ||
            type === 'loans & advances' ||
            type === 'secured loans' ||
            type === 'unsecured loans' ||
            type === 'deposits assets'
        ) {
            return {
                showAll: false,
                showBasicDetails: true,
                showProfileImage: false,
                showMailingDetails: true,
                showBankDetails: true,
                showPAN: true,
                showGSTIN: true,
                isBankOptional: true,
                isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? false : true,
                isMailingAddressOptional: true,
                requiredFields: ['name', 'parent', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'it_pan'] : [])],
            };
        }
        if (type === 'cash-in-hand') {
            return {
                showAll: false,
                showBasicDetails: true,
                showProfileImage: false,
                showMailingDetails: false,
                showBankDetails: false,
                isBankOptional: true,
                isGSTINOptional: false,
                isMailingAddressOptional: true,
                showPAN: false,
                showGSTIN: false,
                requiredFields: ['name', 'parent'],
            };
        }
        return {
            showAll: true,
            showBasicDetails: true,
            showProfileImage: true,
            showMailingDetails: true,
            showBankDetails: true,
            isBankOptional: true,
            isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? false : true,
            isMailingAddressOptional: true,
            showPAN: true,
            showGSTIN: true,
            requiredFields: ['name', 'mailing_state', 'parent', 'mailing_country', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'it_pan'] : [])],
        };
    }, [currentCompanyDetails?.company_settings?.features?.enable_gst, customerType?._id, customerType?.accounting_group_name]);

    const { showBankDetails, showGSTIN, showMailingDetails, showPAN, isBankOptional, isGSTINOptional, isMailingAddressOptional } = getVisibleFields();

    useEffect(() => {
        // Reset form when modal visibility changes
        setData({
            name: '',
            email: '',
            code: '+91',
            number: '',
            image: '',
            mailing_name: '',
            mailing_address: '',
            mailing_country: 'India',
            mailing_state: '',
            mailing_pincode: '',
            company_id: user?.user_settings?.current_company_id || '',
            parent: customerType?.accounting_group_name || '',
            parent_id: customerType?._id || '',
            bank_name: '',
            account_number: '',
            bank_ifsc: '',
            bank_branch: '',
            account_holder: '',
            gstin: '',
            it_pan: '',
        });

    }, [customerType?._id, customerType?.accounting_group_name, user?.user_settings?.current_company_id, visible]);

    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};
        switch (currentStep) {
            case 0:
                if (!data.name.trim()) {
                    errors.name = 'Customer Name is required';
                }

                if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    errors.email = 'Please enter a valid email address';
                }
                if (data.number && !/^\d{10}$/.test(data.number)) {
                    errors.number = 'Phone number must be 10 digits';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 1:
                if (showMailingDetails && !isMailingAddressOptional && !(data.mailing_state || '').trim()) {
                    errors.mailing_state = 'Mailing State is required';
                }
                if (showMailingDetails && !isMailingAddressOptional && !(data.mailing_country || '').trim()) {
                    errors.mailing_country = 'Mailing country is required';
                }
                if (showMailingDetails && !isMailingAddressOptional && data.mailing_pincode && !/^\d{6}$/.test(data.mailing_pincode)) {
                    errors.mailing_pincode = 'PIN code must be 6 digits';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 2:
                if (showBankDetails && !isBankOptional && !data.account_number.trim()) {
                    errors.account_number = 'Account number is required';
                }

                if (showBankDetails && !isBankOptional && !data.account_holder.trim()) {
                    errors.account_holder = 'Account holder name is required';
                }

                if (showBankDetails && !isBankOptional && !data.bank_name.trim()) {
                    errors.bank_name = 'Bank name is required';
                }

                if (showBankDetails && !isBankOptional && !data.bank_branch.trim()) {
                    errors.bank_branch = 'Bank branch name is required';
                }

                if (showBankDetails && !isBankOptional && !data.bank_ifsc.trim()) {
                    errors.bank_ifsc = 'IFSC code is required';
                }

                if (showBankDetails && data.account_number && !isBankOptional && !/^\d{9,18}$/.test(data.account_number)) {
                    errors.account_number = 'Please enter a valid bank account number';
                }

                if (data.bank_ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.bank_ifsc)) {
                    errors.bank_ifsc = 'Please enter a valid IFSC code';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 3:
                if (showGSTIN && !isGSTINOptional && !data.gstin.trim()) {
                    errors.gstin = 'GSTIN is required';
                }
                if (showPAN && !isGSTINOptional && !data.it_pan.trim()) {
                    errors.it_pan = 'PAN number is required';
                }
                if (showGSTIN && data.gstin && !isGSTINOptional && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9][Z][0-9A-Z]$/.test(data.gstin)) {
                    errors.gstin = 'Please enter a valid GSTIN';
                }
                if (showPAN && data.it_pan && !isGSTINOptional && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.it_pan)) {
                    errors.it_pan = 'Please enter a valid PAN number';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            default:
                return false;
        }
    }, [currentStep, data.account_holder, data.account_number, data.bank_branch, data.bank_ifsc, data.bank_name, data.email, data.gstin, data.it_pan, data.mailing_country, data.mailing_pincode, data.mailing_state, data.name, data.number, isBankOptional, isGSTINOptional, isMailingAddressOptional, showBankDetails, showGSTIN, showMailingDetails, showPAN]);

    const handleInputChange = useCallback((field: string, value: string | number | boolean) => {
        setData(prev => ({ ...prev, [field]: value }));

        // Only clear the error for the field being edited
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
        }
    }, [validationErrors]);

    // const handleImagePicker = () => {
    //     // Image picker logic here
    //     setAlert({
    //         type: 'info',
    //         id: 'image-picker',
    //         message: 'Image picker functionality to be implemented',
    //     });
    // };

    async function handleOnPressCreate() {
        if (!validateForm()) {
            // If validation fails, show an alert with the first error message
            setAlert({
                type: 'error',
                id: 'create-customer-modal',
                message: Object.values(validationErrors)[0] || 'Please fill all required fields correctly.',
            });
            return;
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value) { formData.append(key, value); }
        });

        await dispatch(createCustomer(formData)).then((response: any) => {
            if (response) {
                dispatch(viewAllCustomers(company?._id ?? ''));
                setVisible(false);
                setPrimaryVisible(false);
                resetForm();
            }
            setVisible(false);
            resetForm();
        });
    }

    const resetForm = async () => {
        setData({
            name: '',
            email: '',
            code: '+91',
            number: '',
            image: '',
            mailing_name: '',
            mailing_address: '',
            mailing_country: 'India',
            mailing_state: '',
            mailing_pincode: '',
            company_id: company?._id || '',
            parent: '',
            parent_id: '',
            bank_name: '',
            account_number: '',
            bank_ifsc: '',
            bank_branch: '',
            account_holder: '',
            gstin: '',
            it_pan: '',
        });
        await dispatch(setCustomerType(null));
        setValidationErrors({});
        setCurrentStep(0);
    };

    const steps = [
        { title: 'Basic', icon: 'user' },
        ...(showMailingDetails ? [{ title: 'Address', icon: 'map-pin' }] : []),
        ...(showBankDetails ? [{ title: 'Bank', icon: 'credit-card' }] : []),
        ...(showGSTIN || showPAN ? [{ title: 'Tax', icon: 'file-text' }] : []),
    ];

    const getCurrentStepFields = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View>
                        {/* Customer Type Selection */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TextTheme style={{ fontSize: 20, fontWeight: '900', marginBottom: 10, textAlign: 'center' }}>
                                {customerType?.accounting_group_name}
                            </TextTheme>

                        </View>

                        {/* Profile Image */}
                        {/* <ShowWhen when={showProfileImage}>
                            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                <TouchableOpacity
                                    onPress={handleImagePicker}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50,
                                        backgroundColor: secondaryBackgroundColor,
                                        borderWidth: 2,
                                        borderColor: primaryColor,
                                        borderStyle: 'dashed',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}
                                >
                                    {data.image ? (
                                        <Image source={{ uri: data.image }} style={{ width: 96, height: 96, borderRadius: 48 }} />
                                    ) : (
                                        <View style={{ alignItems: 'center' }}>
                                            <FeatherIcon name="camera" size={24} color={primaryColor} />
                                            <TextTheme style={{ fontSize: 12, color: primaryColor, marginTop: 4 }}>Add Photo</TextTheme>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ShowWhen> */}

                        {/* Name */}
                        <InputField
                            icon={<FeatherIcon name="user" size={20} color={primaryColor} />}
                            field="name"
                            placeholder="Customer Name"
                            value={data.name}
                            handleChange={handleInputChange}
                            error={validationErrors.name}
                            capitalize="words"
                        // required={requiredFields.includes('name')}
                        />

                        {/* Email */}
                        <InputField
                            icon={<FeatherIcon name="mail" size={20} color={primaryColor} />}
                            field="email"
                            placeholder="Email Address (Optional)"
                            value={data.email}
                            handleChange={handleInputChange}
                            error={validationErrors.email}
                        // keyboardType="email-address"
                        />

                        {/* Phone Number */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 0.3 }}>
                                <InputField
                                    icon={<FeatherIcon name="phone" size={20} color={primaryColor} />}
                                    field="code"
                                    placeholder="Code"
                                    value={data.code}
                                    handleChange={handleInputChange}
                                    error={validationErrors.code}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={{ flex: 0.7 }}>
                                <InputField
                                    icon={<FeatherIcon name="phone" size={20} color={primaryColor} />}
                                    field="number"
                                    placeholder="Phone Number"
                                    value={data.number}
                                    handleChange={handleInputChange}
                                    error={validationErrors.number}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                    </View>
                );

            case 1:
                if (!showMailingDetails) { return getCurrentStepFields(); }
                return (
                    <View>
                        <TextTheme style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                            Mailing Address
                        </TextTheme>

                        <InputField
                            icon={<FeatherIcon name="user" size={20} color={primaryColor} />}
                            field="mailing_name"
                            placeholder="Mailing Name"
                            value={data.mailing_name}
                            handleChange={handleInputChange}
                            capitalize="words"
                            error={validationErrors.mailing_name}
                        />

                        <InputField
                            icon={<FeatherIcon name="map-pin" size={20} color={primaryColor} />}
                            field="mailing_address"
                            placeholder={`Mailing Address ${isMailingAddressOptional ? '(Optional)' : ''}`}
                            value={data.mailing_address}
                            handleChange={handleInputChange}
                            error={validationErrors.mailing_address}
                            capitalize="words"
                            multiline
                        />
                        <InputField
                            icon={<FeatherIcon name="map" size={20} color={primaryColor} />}
                            field="mailing_state"
                            placeholder="State"
                            capitalize="words"
                            value={data.mailing_state}
                            handleChange={handleInputChange}
                            error={validationErrors.mailing_state}
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                                <InputField
                                    icon={<FeatherIcon name="globe" size={20} color={primaryColor} />}
                                    field="mailing_country"
                                    placeholder="Country"
                                    capitalize="words"
                                    value={data.mailing_country}
                                    handleChange={handleInputChange}
                                    error={validationErrors.mailing_country}
                                />
                            </View>
                            <View style={{ width: '40%' }}>
                                <InputField
                                    icon={<FeatherIcon name="hash" size={20} color={primaryColor} />}
                                    field="mailing_pincode"
                                    placeholder="Pincode"
                                    value={data.mailing_pincode}
                                    handleChange={handleInputChange}
                                    error={validationErrors.mailing_pincode}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>


                    </View>
                );

            case 2:
                if (!showBankDetails) { return getCurrentStepFields(); }
                return (
                    <View>
                        <TextTheme style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                            Bank Details {isBankOptional && <TextTheme style={{ fontSize: 14, color: 'gray' }}>(Optional)</TextTheme>}
                        </TextTheme>

                        <InputField
                            icon={<FeatherIcon name="hash" size={20} color={primaryColor} />}
                            field="account_number"
                            placeholder="Account Number"
                            value={data.account_number}
                            handleChange={handleInputChange}
                            error={validationErrors.account_number}
                            keyboardType="numeric"
                        // required={requiredFields.includes('account_number')}
                        />
                        <InputField
                            icon={<FeatherIcon name="user" size={20} color={primaryColor} />}
                            field="account_holder"
                            placeholder="Account Holder Name"
                            capitalize="characters"
                            value={data.account_holder}
                            handleChange={handleInputChange}
                            error={validationErrors.account_holder}
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ width: '50%' }}>
                                <InputField
                                    icon={<FeatherIcon name="credit-card" size={20} color={primaryColor} />}
                                    field="bank_name"
                                    placeholder="Bank Name"
                                    capitalize="characters"
                                    value={data.bank_name}
                                    handleChange={handleInputChange}
                                    error={validationErrors.bank_name}
                                // required={requiredFields.includes('bank_name')}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <InputField
                                    icon={<FeatherIcon name="key" size={20} color={primaryColor} />}
                                    field="bank_ifsc"
                                    placeholder="IFSC Code"
                                    capitalize="characters"
                                    value={data.bank_ifsc}
                                    handleChange={handleInputChange}
                                    error={validationErrors.bank_ifsc}
                                // autoCapitalize="characters"
                                // required={requiredFields.includes('bank_ifsc')}
                                />
                            </View>
                        </View>

                        <InputField
                            icon={<FeatherIcon name="map-pin" size={20} color={primaryColor} />}
                            field="bank_branch"
                            placeholder="Branch Name"
                            capitalize="words"
                            value={data.bank_branch}
                            handleChange={handleInputChange}
                            error={validationErrors.bank_branch}
                        />


                    </View>
                );

            case 3:
                if (!showGSTIN && !showPAN) { return getCurrentStepFields(); }
                return (
                    <View >
                        <TextTheme style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                            Tax Details
                        </TextTheme>

                        <ShowWhen when={showGSTIN}>
                            <InputField
                                icon={<FeatherIcon name="file-text" size={20} color={primaryColor} />}
                                field="gstin"
                                placeholder={`GSTIN ${isGSTINOptional ? '(Optional)' : '*'}`}
                                value={data.gstin}
                                capitalize="characters"
                                handleChange={handleInputChange}
                                error={validationErrors.gstin}
                            // autoCapitalize="characters"
                            // required={requiredFields.includes('gstin')}
                            />
                        </ShowWhen>

                        <ShowWhen when={showPAN}>
                            <InputField
                                icon={<FeatherIcon name="credit-card" size={20} color={primaryColor} />}
                                field="it_pan"
                                placeholder={`PAN Number ${isGSTINOptional ? '(Optional)' : '*'}`}
                                value={data.it_pan}
                                capitalize="characters"
                                handleChange={handleInputChange}
                                error={validationErrors.it_pan}
                            // autoCapitalize="characters"
                            // required={requiredFields.includes('it_pan')}
                            />
                        </ShowWhen>
                    </View>
                );

            default:
                return null;
        }
    };

    const handleNext = () => {
        const isValid = validateForm();
        if (!isValid) {
            return;
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <BottomModal
            alertId="create-customer-modal"
            setVisible={setVisible}
            visible={visible}
            actionButtons={[
                ...(currentStep > 0 ? [{ title: 'Previous', backgroundColor: 'gray', onPress: handlePrevious }] : []),
                ...(currentStep < steps.length - 1 ? [{ title: 'Next', backgroundColor: 'rgb(85, 85, 85)', color: 'white', onPress: handleNext }] : []),
                ...(currentStep === steps.length - 1 ? [{ title: 'Create Customer', backgroundColor: 'rgb(50,200,150)', color: 'white', onPress: handleOnPressCreate }] : []),
            ]}
            style={{
                paddingHorizontal: 20,
                maxHeight: '90%',
            }}
            onClose={resetForm}
        >
            {/* Header */}
            <View style={{ marginBottom: 14, flexDirection: 'column', alignItems: 'center' }}>
                <TextTheme style={{ fontWeight: '900', fontSize: 18, marginBottom: 8 }}>
                    Create {customerType?.accounting_group_name || 'Customer'}
                </TextTheme>
                <TextTheme style={{ fontSize: 14 }}>
                    Fill in the details to add a {customerType?.accounting_group_name || 'Customer'} to your system.
                </TextTheme>
            </View>

            {/* Progress Steps */}
            <ScrollView horizontal
                showsHorizontalScrollIndicator={false}
            >
                <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    minHeight: 50,
                }}>
                    {steps.map((step, index) => (
                        <View style={{
                            minWidth: 80,
                        }}
                            // onTouchEnd={() => setCurrentStep(index)}
                            key={index}>
                            <View style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 8,
                                borderWidth: 1,
                                alignItems: 'center',
                                minWidth: 80,
                                backgroundColor: currentStep >= index ? 'rgb(2, 2, 2)' : 'rgb(85, 85, 85)',
                                borderColor: currentStep >= index ? primaryColor : '#e0e0e0',
                            }}>
                                <Text style={{
                                    fontSize: 12,
                                    color: index <= currentStep ? 'white' : 'rgb(196, 196, 196)',
                                    fontWeight: index === currentStep ? '600' : 'normal',
                                    textAlign: 'center',
                                }}>
                                    {step.title}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Form Content */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {getCurrentStepFields()}
            </ScrollView>
            <View style={{ height: 10 }} />
            <LoadingModal visible={loading} />
        </BottomModal>
    );
}

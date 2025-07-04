/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView } from 'react-native';
import BottomModal from '../BottomModal';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import TextTheme from '../../Text/TextTheme';
import FeatherIcon from '../../Icon/FeatherIcon';
import { useTheme } from '../../../Contexts/ThemeProvider';
import AnimateButton from '../../Button/AnimateButton';
import ShowWhen from '../../Other/ShowWhen';
import { useAlert } from '../../Alert/AlertProvider';
import LoadingModal from '../LoadingModal';
import { useAppDispatch, useCompanyStore, useCustomerStore, useUserStore } from '../../../Store/ReduxStore';
import { createCustomer, viewAllCustomers } from '../../../Services/customer';
import { accountGroups } from '../../../Utils/accountGroups';
import { SelectField } from '../../TextInput/SelectField';
import { InputField } from '../../TextInput/InputField';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

interface ValidationErrors {
    [key: string]: string;
}

export default function CreateCustomerModal({ visible, setVisible }: Props): React.JSX.Element {
    const { primaryColor, primaryBackgroundColor, secondaryBackgroundColor } = useTheme();
    const { setAlert } = useAlert();

    const { company } = useCompanyStore();
    const { loading } = useCustomerStore();
    const { user } = useUserStore();
    const dispatch = useAppDispatch();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user.user_settings.current_company_id);

    const [isGroupModalVisible, setGroupModalVisible] = useState<boolean>(false);
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
        company_id: user.user_settings.current_company_id || '',
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

    const getVisibleFields = useCallback(() => {
        const type = (accountGroups.find((group) => group._id === data.parent_id)?.user_id === '' || accountGroups.find((group) => group._id === data.parent_id)?.user_id === null)
            ? data.parent.toLowerCase()
            : accountGroups.find((group) => group._id === data.parent_id)?.parent?.toLowerCase() || '';

        if (type === 'sundry debtors' || type === 'sundry creditors') {
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
                requiredFields: ['name', 'parent', 'mailing_state', 'mailing_country', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'it_pan'] : [])],
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
                isMailingAddressOptional: false,
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
    }, [currentCompanyDetails?.company_settings?.features?.enable_gst, data.parent, data.parent_id]);

    const { showBankDetails, showGSTIN, showMailingDetails, showPAN, isBankOptional, isGSTINOptional, isMailingAddressOptional, requiredFields } = getVisibleFields();

    const validateField = (field: string, value: string): string => {
        if (!value && requiredFields.includes(field)) {
            return `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
        }
        if (isMailingAddressOptional && field === 'mailing_address' && !value.trim()) { return ''; }
        if (field === 'mailing_pincode' && value && !/^\d{1,6}$/.test(value)) { return 'Invalid pincode format'; }
        if (field === 'code' && value && !/^\+\d{1,4}$/.test(value)) { return 'Invalid phone code format'; }
        if (field === 'number' && value && !/^\d{10}$/.test(value)) { return 'Invalid phone number format'; }
        if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { return 'Invalid email format'; }
        if (field === 'name' && value.trim().length < 2) { return 'Name must be at least 2 characters'; }
        if (field === 'gstin' && value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9][Z][0-9A-Z]$/.test(value)) { return 'Invalid GSTIN format'; }
        if (field === 'it_pan' && value && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) { return 'Invalid PAN format'; }
        if (field === 'account_number' && value && !/^\d{9,18}$/.test(value)) { return 'Invalid bank account number format'; }
        if (field === 'bank_ifsc' && value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) { return 'Invalid IFSC code format'; }
        return '';
    };

    const validateForm = useCallback((): boolean => {
        const errors: ValidationErrors = {};
        Object.keys(data).forEach(key => {
            const field = key as keyof typeof data;
            const error = validateField(field, String(data[field] || ''));
            if (error) { errors[field] = error; }
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data, requiredFields]);

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setData(prev => ({ ...prev, [field]: value }));

        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }

        const error = validateField(field, String(value));
        if (error) {
            setValidationErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    // const handleImagePicker = () => {
    //     // Image picker logic here
    //     setAlert({
    //         type: 'info',
    //         id: 'image-picker',
    //         massage: 'Image picker functionality to be implemented',
    //     });
    // };

    async function handleOnPressCreate() {
        if (!validateForm()) {
            setAlert({
                type: 'error',
                id: 'create-customer-modal',
                massage: 'Please fix the validation errors before proceeding.',
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
                resetForm();
            }
            setVisible(false);
            resetForm();
        });
    }

    const resetForm = () => {
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
        setValidationErrors({});
        setCurrentStep(0);
    };

    const steps = [
        { title: 'Basic Details', icon: 'user' },
        ...(showMailingDetails ? [{ title: 'Address', icon: 'map-pin' }] : []),
        ...(showBankDetails ? [{ title: 'Bank Details', icon: 'credit-card' }] : []),
        ...(showGSTIN || showPAN ? [{ title: 'Tax Details', icon: 'file-text' }] : []),
    ];

    const getCurrentStepFields = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View>
                        {/* Customer Type Selection */}
                        <View style={{ marginBottom: 0 }}>
                            <TextTheme style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                                Customer Type {requiredFields.includes('parent') && <TextTheme style={{ color: 'red' }}>*</TextTheme>}
                            </TextTheme>
                            <SelectField
                                icon="users"
                                placeholder="Select Customer Type"
                                value={data.parent}
                                onPress={() => setGroupModalVisible(true)}
                                error={validationErrors.parent}
                            />
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
                            icon="user"
                            field="name"
                            placeholder="Customer Name"
                            value={data.name}
                            handleChange={handleInputChange}
                            error={validationErrors.name}
                        // required={requiredFields.includes('name')}
                        />

                        {/* Email */}
                        <InputField
                            icon="mail"
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
                                    icon="phone"
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
                                    icon="phone"
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
                            icon="user"
                            field="mailing_name"
                            placeholder="Mailing Name"
                            value={data.mailing_name}
                            handleChange={handleInputChange}
                            error={validationErrors.mailing_name}
                        />

                        <InputField
                            icon="map-pin"
                            field="mailing_address"
                            placeholder={`Mailing Address ${isMailingAddressOptional ? '(Optional)' : ''}`}
                            value={data.mailing_address}
                            handleChange={handleInputChange}
                            error={validationErrors.mailing_address}
                            multiline
                        // numberOfLines={3}
                        // required={requiredFields.includes('mailing_address')}
                        />

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ width: '45%' }}>
                                <InputField
                                    icon="globe"
                                    field="mailing_country"
                                    placeholder="Country"
                                    value={data.mailing_country}
                                    handleChange={handleInputChange}
                                    error={validationErrors.mailing_country}
                                // required={requiredFields.includes('mailing_country')}
                                />
                            </View>
                            <View style={{ width: '45%' }}>
                                <InputField
                                    icon="map"
                                    field="mailing_state"
                                    placeholder="State"
                                    value={data.mailing_state}
                                    handleChange={handleInputChange}
                                    error={validationErrors.mailing_state}
                                // required={requiredFields.includes('mailing_state')}
                                />
                            </View>
                        </View>

                        <InputField
                            icon="hash"
                            field="mailing_pincode"
                            placeholder="Pincode"
                            value={data.mailing_pincode}
                            handleChange={handleInputChange}
                            error={validationErrors.mailing_pincode}
                            keyboardType="numeric"
                        // required={requiredFields.includes('mailing_pincode')}
                        />
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
                            icon="hash"
                            field="account_number"
                            placeholder="Account Number"
                            value={data.account_number}
                            handleChange={handleInputChange}
                            error={validationErrors.account_number}
                            keyboardType="numeric"
                        // required={requiredFields.includes('account_number')}
                        />
                        <InputField
                            icon="user"
                            field="account_holder"
                            placeholder="Account Holder Name"
                            value={data.account_holder}
                            handleChange={handleInputChange}
                            error={validationErrors.account_holder}
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ width: '50%' }}>
                                <InputField
                                    icon="credit-card"
                                    field="bank_name"
                                    placeholder="Bank Name"
                                    value={data.bank_name}
                                    handleChange={handleInputChange}
                                    error={validationErrors.bank_name}
                                // required={requiredFields.includes('bank_name')}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <InputField
                                    icon="key"
                                    field="bank_ifsc"
                                    placeholder="IFSC Code"
                                    value={data.bank_ifsc}
                                    handleChange={handleInputChange}
                                    error={validationErrors.bank_ifsc}
                                // autoCapitalize="characters"
                                // required={requiredFields.includes('bank_ifsc')}
                                />
                            </View>
                        </View>

                        <InputField
                            icon="map-pin"
                            field="bank_branch"
                            placeholder="Branch Name"
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
                                icon="file-text"
                                field="gstin"
                                placeholder={`GSTIN ${isGSTINOptional ? '(Optional)' : ''}`}
                                value={data.gstin}
                                handleChange={handleInputChange}
                                error={validationErrors.gstin}
                            // autoCapitalize="characters"
                            // required={requiredFields.includes('gstin')}
                            />
                        </ShowWhen>

                        <ShowWhen when={showPAN}>
                            <InputField
                                icon="credit-card"
                                field="it_pan"
                                placeholder="PAN Number"
                                value={data.it_pan}
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
                ...(currentStep < steps.length - 1 ? [{ title: 'Next', backgroundColor: primaryColor, onPress: handleNext }] : []),
                ...(currentStep === steps.length - 1 ? [{ title: 'Create Customer', backgroundColor: 'rgb(50,150,250)', onPress: handleOnPressCreate }] : []),
            ]}
            style={{
                paddingHorizontal: 20,
                maxHeight: '90%',
            }}
            onClose={resetForm}
        >
            <View>
                {/* Header */}
                <View style={{ marginBottom: 14, flexDirection: 'column', alignItems: 'center' }}>
                    <TextTheme style={{ fontWeight: '900', fontSize: 18, marginBottom: 8 }}>
                        Create New Customer
                    </TextTheme>
                    <TextTheme style={{ fontSize: 14, color: 'gray' }}>
                        Fill in the details to add a new customer to your system.
                    </TextTheme>
                </View>

                {/* Progress Steps */}
                <View style={{ flexDirection: 'row', marginBottom: 14, justifyContent: 'space-between' }}>
                    {steps.map((step, index) => (
                        <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{
                                width: 30,
                                height: 30,
                                borderRadius: 20,
                                backgroundColor: index <= currentStep ? primaryColor : secondaryBackgroundColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 8,
                            }}>
                                <FeatherIcon
                                    name={step.icon}
                                    size={15}
                                    color={index <= currentStep ? 'white' : 'gray'}
                                />
                            </View>
                            <TextTheme style={{
                                fontSize: 12,
                                color: index <= currentStep ? 'black' : 'gray',
                                fontWeight: index === currentStep ? '600' : 'normal',
                                textAlign: 'center',
                            }}>
                                {step.title}
                            </TextTheme>
                            {index < steps.length - 1 && (
                                <View style={{
                                    position: 'absolute',
                                    top: 15,
                                    left: '65%',
                                    right: '-40%',
                                    height: 2,
                                    backgroundColor: index < currentStep ? primaryColor : 'lightgray',
                                }} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Form Content */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {getCurrentStepFields()}
                </ScrollView>
            </View>
            <View style={{ height: 10 }} />
            <LoadingModal visible={loading} />

            {/* Customer Type Selection Modal */}
            <BottomModal
                visible={isGroupModalVisible}
                setVisible={setGroupModalVisible}
                style={{ paddingHorizontal: 20, gap: 24 }}
            >
                <TextTheme style={{ fontWeight: '900', fontSize: 16 }}>
                    Select Customer Type
                </TextTheme>

                <ScrollView style={{ maxHeight: 400 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        {accountGroups.map(group => (
                            <AnimateButton
                                key={group._id}
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 25,
                                    paddingInline: 16,
                                    paddingBlock: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                    borderColor: group.accounting_group_name === data.parent ? primaryColor : secondaryBackgroundColor,
                                    backgroundColor: group.accounting_group_name === data.parent ? `${primaryColor}20` : primaryBackgroundColor,
                                }}
                                onPress={() => {
                                    handleInputChange('parent', group.accounting_group_name);
                                    handleInputChange('parent_id', group._id);
                                    setGroupModalVisible(false);
                                }}
                            >
                                <TextTheme style={{
                                    fontWeight: '600',
                                    fontSize: 14,
                                    color: group.accounting_group_name === data.parent ? primaryColor : 'black',
                                }}>
                                    {group.accounting_group_name}
                                </TextTheme>
                                <FeatherIcon
                                    name="arrow-right"
                                    size={14}
                                    color={group.accounting_group_name === data.parent ? primaryColor : 'gray'}
                                />
                            </AnimateButton>
                        ))}
                    </View>
                </ScrollView>
            </BottomModal>
        </BottomModal>
    );
}

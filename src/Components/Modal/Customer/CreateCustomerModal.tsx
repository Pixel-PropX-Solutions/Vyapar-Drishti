/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView, Text } from 'react-native';
import BottomModal from '../BottomModal';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import TextTheme from '../../Ui/Text/TextTheme';
import { useTheme } from '../../../Contexts/ThemeProvider';
import ShowWhen from '../../Other/ShowWhen';
import { useAlert } from '../../Ui/Alert/AlertProvider';
import LoadingModal from '../LoadingModal';
import { useAppDispatch, useCustomerStore, useUserStore } from '../../../Store/ReduxStore';
import { createCustomer, viewAllCustomers } from '../../../Services/customer';
import { accountGroups } from '../../../Utils/accountGroups';
import { InputField } from '../../Ui/TextInput/InputField';
import { setCustomerType } from '../../../Store/Reducers/customerReducer';
import FeatherIcon from '../../Icon/FeatherIcon';
import CollapsabeMenu from '../../Other/CollapsabeMenu';
import { PhoneNumber } from '../../../Utils/types';
import PhoneNoInputField from '../../Ui/Option/PhoneNoInputField';
import { SelectField } from '../../Ui/TextInput/SelectField';
import { CountrySelectorModal } from '../CountrySelectorModal';
import { StateSelectorModal } from '../StateSelectorModal';


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

    const { loading, customerType } = useCustomerStore();
    const { user, current_company_id } = useUserStore();
    const dispatch = useAppDispatch();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [bankExpanded, setBankExpanded] = useState<boolean>(false);
    const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
    const [isStateModalVisible, setStateModalVisible] = useState<boolean>(false);
    const phone = useRef<PhoneNumber>({ code: '', number: '' });

    // Change data from useState to useRef
    type DataType = {
        name: string;
        email: string;
        code: string;
        number: string;
        image: string;
        mailing_name: string;
        mailing_address: string;
        mailing_country: string;
        mailing_state: string;
        mailing_pincode: string;
        company_id: string;
        parent: string;
        parent_id: string;
        bank_name: string;
        account_number: string;
        bank_ifsc: string;
        bank_branch: string;
        account_holder: string;
        gstin: string;
    };
    const data = useRef<DataType>({
        name: '',
        email: '',
        code: '',
        number: '',
        image: '',
        mailing_name: '',
        mailing_address: '',
        mailing_country: '',
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
    });


    const getVisibleFields = useCallback(() => {
        const type = (accountGroups.find((group) => group._id === customerType?._id)?.user_id === '' || accountGroups.find((group) => group._id === customerType?._id)?.user_id === null)
            ? customerType?.accounting_group_name.toLowerCase()
            : accountGroups.find((group) => group._id === customerType?._id)?.parent?.toLowerCase() || '';

        if (type === 'debtors') {
            return {
                showAll: true,
                showBasicDetails: true,
                showProfileImage: true,
                showMailingDetails: true,
                showBankDetails: true,
                isBankOptional: true,
                isGSTINOptional: true,
                isMailingAddressOptional: false,
                showGSTIN: true,
                requiredFields: [
                    'name',
                    'mailing_state',
                    'parent',
                    'mailing_country',
                ],
            };
        } else {
            return {
                showAll: true,
                showBasicDetails: true,
                showProfileImage: true,
                showMailingDetails: true,
                showBankDetails: true,
                isBankOptional: true,
                isGSTINOptional: gst_enable ? false : true,
                isMailingAddressOptional: false,
                showGSTIN: true,
                requiredFields: [
                    'name',
                    'mailing_state',
                    'parent',
                    'mailing_country',
                    ...(gst_enable ? ['gstin'] : []),
                ],
            };
        }
    }, [gst_enable, customerType?._id, customerType?.accounting_group_name]);

    const { showBankDetails, showGSTIN, showMailingDetails, isBankOptional, isGSTINOptional, isMailingAddressOptional } = getVisibleFields();

    useEffect(() => {
        // Reset form when modal visibility changes
        data.current = {
            name: '',
            email: '',
            code: '',
            number: '',
            image: '',
            mailing_name: '',
            mailing_address: '',
            mailing_country: '',
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
        };

    }, [customerType?._id, customerType?.accounting_group_name, user?.user_settings?.current_company_id, visible]);

    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};
        switch (currentStep) {
            case 0:
                if (showGSTIN && !isGSTINOptional && !data.current.gstin.trim()) {
                    errors.gstin = 'GSTIN is required';
                }

                if (showGSTIN && data.current.gstin && !isGSTINOptional && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9][Z][0-9A-Z]$/.test(data.current.gstin)) {
                    errors.gstin = 'Please enter a valid GSTIN';
                }

                if (!data.current.name.trim()) {
                    errors.name = 'Customer Name is required';
                }

                if (data.current.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.current.email)) {
                    errors.email = 'Please enter a valid email address';
                }
                if (data.current.number && !/^\d{10}$/.test(data.current.number)) {
                    errors.number = 'Phone number must be 10 digits';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 1:
                if (showMailingDetails && !isMailingAddressOptional && !(data.current.mailing_state || '').trim()) {
                    errors.mailing_state = 'Mailing State is required';
                }
                if (showMailingDetails && !isMailingAddressOptional && !(data.current.mailing_country || '').trim()) {
                    errors.mailing_country = 'Mailing country is required';
                }
                if (showMailingDetails && !isMailingAddressOptional && data.current.mailing_pincode && !/^\d{6}$/.test(data.current.mailing_pincode)) {
                    errors.mailing_pincode = 'PIN code must be 6 digits';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 2:
                if (showBankDetails && !isBankOptional && !data.current.account_number.trim()) {
                    errors.account_number = 'Account number is required';
                }

                if (showBankDetails && !isBankOptional && !data.current.account_holder.trim()) {
                    errors.account_holder = 'Account holder name is required';
                }

                if (showBankDetails && !isBankOptional && !data.current.bank_name.trim()) {
                    errors.bank_name = 'Bank name is required';
                }

                if (showBankDetails && !isBankOptional && !data.current.bank_branch.trim()) {
                    errors.bank_branch = 'Bank branch name is required';
                }

                if (showBankDetails && !isBankOptional && !data.current.bank_ifsc.trim()) {
                    errors.bank_ifsc = 'IFSC code is required';
                }

                if (showBankDetails && data.current.account_number && !isBankOptional && !/^\d{9,18}$/.test(data.current.account_number)) {
                    errors.account_number = 'Please enter a valid bank account number';
                }

                if (data.current.bank_ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.current.bank_ifsc)) {
                    errors.bank_ifsc = 'Please enter a valid IFSC code';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            default:
                return false;
        }
    }, [currentStep, isBankOptional, isGSTINOptional, isMailingAddressOptional, showBankDetails, showGSTIN, showMailingDetails]);

    // Remove setData, update handleInputChange to use data.current
    const handleInputChange = useCallback((field: string, value: string | number | boolean) => {
        if (!(field in data.current)) return;
        (data.current as any)[field] = value;
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const rest = { ...prev };
                delete rest[field];
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
        Object.entries(data.current).forEach(([key, value]) => {
            if (value) { formData.append(key, value); }
        });

        await dispatch(createCustomer(formData)).then((response: any) => {
            if (response) {
                dispatch(viewAllCustomers(current_company_id ?? ''));
                setVisible(false);
                setPrimaryVisible(false);
                resetForm();
            }
            setVisible(false);
            resetForm();
        });
    }

    const resetForm = async () => {
        data.current = {
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
            company_id: current_company_id || '',
            parent: '',
            parent_id: '',
            bank_name: '',
            account_number: '',
            bank_ifsc: '',
            bank_branch: '',
            account_holder: '',
            gstin: '',
        };
        dispatch(setCustomerType(null));
        setValidationErrors({});
        setCurrentStep(0);
    };

    const steps = [
        { title: 'Basic', icon: 'user' },
        ...(showMailingDetails ? [{ title: 'Address', icon: 'map-pin' }] : []),
        ...(showBankDetails ? [{ title: 'Bank', icon: 'credit-card' }] : []),
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
                                            <TextTheme fontSize={12} color={primaryColor} style={{ marginTop: 4 }}>Add Photo</TextTheme>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ShowWhen> */}

                        {/* GSTIN */}
                        {gst_enable && <ShowWhen when={showGSTIN}>
                            <InputField
                                icon={<FeatherIcon name="file-text" size={20} color={primaryColor} />}
                                field="gstin"
                                placeholder={`GSTIN ${isGSTINOptional ? '(Optional)' : '*'}`}
                                capitalize="characters"
                                handleChange={handleInputChange}
                                error={validationErrors.gstin}
                                value={data.current.gstin}
                                secondaryButton={true}
                                secondaryButtonAction={() => { }}
                            />
                        </ShowWhen>}

                        {/* Name */}
                        <InputField
                            icon={<FeatherIcon name="user" size={20} color={primaryColor} />}
                            field="name"
                            autoFocus={true}
                            placeholder="Billing Name"
                            handleChange={handleInputChange}
                            value={data.current.name}
                            error={validationErrors.name}
                            capitalize="words"
                            info="This name will be used for billing and invoicing purposes."
                        />

                        {/* Email */}
                        <InputField
                            icon={<FeatherIcon name="mail" size={20} color={primaryColor} />}
                            field="email"
                            placeholder="Email Address (Optional)"
                            value={data.current.email}
                            handleChange={handleInputChange}
                            error={validationErrors.email}
                        />

                        {/* Phone Number */}
                        <PhoneNoInputField
                            onChangePhoneNumber={(phoneNo) => { phone.current = phoneNo; }}
                            placeholder="***** 98765"
                        />
                    </View>
                );

            case 1:
                if (!showMailingDetails) { return getCurrentStepFields(); }
                return (
                    <View>
                        <TextTheme style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                            Contact Address
                        </TextTheme>

                        <InputField
                            icon={<FeatherIcon name="user" size={20} color={primaryColor} />}
                            field="mailing_name"
                            autoFocus={true}
                            placeholder="Contact Person Name"
                            value={data.current.mailing_name}
                            handleChange={handleInputChange}
                            capitalize="words"
                            error={validationErrors.mailing_name}
                        />

                        <InputField
                            icon={<FeatherIcon name="map-pin" size={20} color={primaryColor} />}
                            field="mailing_address"
                            placeholder={`Billing Address ${isMailingAddressOptional ? '(Optional)' : ''}`}
                            handleChange={handleInputChange}
                            // value={data.current.mailing_address}
                            error={validationErrors.mailing_address}
                            capitalize="words"
                            multiline
                        />
                        <SelectField
                            icon={<FeatherIcon name="globe" size={20} color={primaryColor} />}
                            placeholder="Select Country *"
                            value={data.current.mailing_country}
                            onPress={() => setCountryModalVisible(true)}
                            error={validationErrors.mailing_country}
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                                <SelectField
                                    icon={<FeatherIcon name="globe" size={20} color={primaryColor} />}
                                    placeholder="Select State *"
                                    value={data.current.mailing_state}
                                    onPress={() => setStateModalVisible(true)}
                                    error={validationErrors.mailing_state}
                                />
                            </View>
                            <View style={{ width: '40%' }}>
                                <InputField
                                    icon={<FeatherIcon name="hash" size={20} color={primaryColor} />}
                                    field="mailing_pincode"
                                    value={data.current.mailing_pincode}
                                    placeholder="Pincode"
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
                        <CollapsabeMenu
                            expanded={bankExpanded}
                            setExpanded={setBankExpanded}
                            header="Bank Details (Optional)"
                        >
                            <InputField
                                icon={<FeatherIcon name="hash" size={20} color={primaryColor} />}
                                field="account_number"
                                placeholder="Account Number"
                                handleChange={handleInputChange}
                                value={data.current.account_number}
                                error={validationErrors.account_number}
                                keyboardType="numeric"
                            />
                            <InputField
                                icon={<FeatherIcon name="user" size={20} color={primaryColor} />}
                                field="account_holder"
                                placeholder="Account Holder Name"
                                capitalize="characters"
                                handleChange={handleInputChange}
                                value={data.current.account_holder}
                                error={validationErrors.account_holder}
                            />
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={{ width: '50%' }}>
                                    <InputField
                                        icon={<FeatherIcon name="credit-card" size={20} color={primaryColor} />}
                                        field="bank_name"
                                        placeholder="Bank Name"
                                        value={data.current.bank_name}
                                        capitalize="characters"
                                        handleChange={handleInputChange}
                                        error={validationErrors.bank_name}
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <InputField
                                        icon={<FeatherIcon name="key" size={20} color={primaryColor} />}
                                        field="bank_ifsc"
                                        placeholder="IFSC Code"
                                        capitalize="characters"
                                        value={data.current.bank_ifsc}
                                        handleChange={handleInputChange}
                                        error={validationErrors.bank_ifsc}
                                    />
                                </View>
                            </View>

                            <InputField
                                icon={<FeatherIcon name="map-pin" size={20} color={primaryColor} />}
                                field="bank_branch"
                                placeholder="Branch Name"
                                capitalize="words"
                                value={data.current.bank_branch}
                                handleChange={handleInputChange}
                                error={validationErrors.bank_branch}
                            />
                        </CollapsabeMenu>
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
                contentContainerStyle={{ paddingHorizontal: 10, gap: 12 }}
                keyboardShouldPersistTaps="always"
            >
                <View style={{
                    display: 'flex',
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
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" >
                {getCurrentStepFields()}
            </ScrollView>
            <View style={{ height: 10 }} />
            <CountrySelectorModal visible={isCountryModalVisible} country={data.current.mailing_country} setCountry={handleInputChange} setVisible={setCountryModalVisible} />
            <StateSelectorModal visible={isStateModalVisible} country={data.current.mailing_country} state={data.current.mailing_state} setState={handleInputChange} setVisible={setStateModalVisible} />
            <LoadingModal visible={loading} />
        </BottomModal>
    );
}

// function SetCountryModal({ visible, setVisible, country, setCountry }: {
//     visible: boolean,
//     setVisible: Dispatch<SetStateAction<boolean>>,
//     country: string,
//     setCountry: (field: string, value: string) => void
// }): React.JSX.Element {

//     const selected = (countryData.find(item => item.name === country) ?? null);

//     function updateCountry(countryInfo: CountryInfo) {
//         setCountry('mailing_country', countryInfo.name);
//     }

//     return (
//         <ItemSelectorModal<CountryInfo>
//             title="Select Country"
//             allItems={countryData}
//             isItemSelected={!!selected}
//             keyExtractor={(item) => item.name}
//             filter={(item, val) => (
//                 item.name.toLowerCase().startsWith(val) ||
//                 item.states.some(state => state.toLowerCase().startsWith(val))
//             )}
//             onSelect={updateCountry}
//             visible={visible}
//             setVisible={setVisible}
//             SelectedItemContent={
//                 <View>
//                     <TextTheme color="white" style={{ fontWeight: 400, fontSize: 14 }} >
//                         {selected?.name}
//                     </TextTheme>
//                 </View>
//             }

//             renderItemContent={(item) => (<>
//                 <TextTheme style={{ fontWeight: 900, fontSize: 16 }}>{item.name}</TextTheme>
//                 {/* <TextTheme style={{ fontWeight: 600, fontSize: 16 }}>{item.currency}</TextTheme> */}
//             </>)}
//         />
//     );
// }


// function SetStateModal({ visible, setVisible, country, state, setState }: {
//     visible: boolean,
//     setVisible: Dispatch<SetStateAction<boolean>>,
//     country: string,
//     state: string,
//     setState: (field: string, value: string) => void
// }): React.JSX.Element {

//     console.log('countryData in state selector countryData.find', countryData.find(item => item.name === country));

//     const stateData: Array<string> = countryData.find(item => item.name === country)?.states || [];

//     console.log('country in state selector stateData', stateData);

//     const selected = (countryData.find(item => item.name === country)?.states.find((item) => item === state) ?? null);

//     console.log('country in state selector selected', selected);

//     function updateState(stateInfo: string) {
//         setState('mailing_state', stateInfo);
//     }

//     return (
//         <ItemSelectorModal<string>
//             title="Select State"
//             allItems={stateData}
//             isItemSelected={!!selected}
//             keyExtractor={(item) => item}
//             filter={(item, val) => (
//                 item.toLowerCase().startsWith(val)
//             )}
//             onSelect={updateState}
//             visible={visible}
//             setVisible={setVisible}
//             SelectedItemContent={
//                 <View>
//                     <TextTheme color="white" style={{ fontWeight: 400, fontSize: 14 }} >
//                         {selected}
//                     </TextTheme>
//                 </View>
//             }

//             renderItemContent={(item) => (<>
//                 <TextTheme style={{ fontWeight: 900, fontSize: 16 }}>{item}</TextTheme>
//                 {/* <TextTheme style={{ fontWeight: 600, fontSize: 16 }}>{item.currency}</TextTheme> */}
//             </>)}
//         />
//     );
// }

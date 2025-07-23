/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import TextTheme from '../Text/TextTheme';
import BottomModal from '../Modal/BottomModal';
import { useCallback, useEffect, useState } from 'react';
import { createCompany, getAllCompanies } from '../../Services/company';
import { useTheme } from '../../Contexts/ThemeProvider';
import arrayToFormData from '../../Utils/arrayToFormData';
import { useAlert } from '../Alert/AlertProvider';
import { useAppDispatch, useCompanyStore } from '../../Store/ReduxStore';
import { InputField } from '../TextInput/InputField';
import { getDefaultAprilFirst } from '../../Utils/functionTools';
import AnimateButton from '../Button/AnimateButton';
import BackgroundThemeView from '../View/BackgroundThemeView';
import FeatherIcon from '../Icon/FeatherIcon';
import LoadingModal from '../Modal/LoadingModal';
import { getCurrentUser } from '../../Services/user';

type CompanyCreateModalType = {
    visible: boolean,
    setVisible: (vis: boolean) => void
    setSecondaryVisible?: (vis: boolean) => void
}

export function CompanyCreateModal({ visible, setVisible, setSecondaryVisible }: CompanyCreateModalType) {
    const { primaryColor } = useTheme();
    const { setAlert } = useAlert();
    const dispatch = useAppDispatch();
    const { companies, isCompaniesFetching, loading } = useCompanyStore();

    const [activeSection, setActiveSection] = useState<'basic' | 'address' | 'financial' | 'banking'>('basic');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState<number>(0);

    const [data, setData] = useState({
        user_id: '',
        name: '',
        mailing_name: '',
        address_1: '',
        address_2: '',
        pinCode: '',
        state: '',
        country: '',
        financial_year_start: getDefaultAprilFirst(),
        books_begin_from: getDefaultAprilFirst(),
        is_deleted: false,
        number: '',
        code: '',
        email: '',
        image: '',
        gstin: '',
        pan_number: '',
        website: '',
        account_number: '',
        account_holder: '',
        bank_ifsc: '',
        bank_name: '',
        bank_branch: '',
        qr_code_url: '',
    });

    const resetData = useCallback(() => {
        setData({
            user_id: '',
            name: '',
            mailing_name: '',
            address_1: '',
            address_2: '',
            pinCode: '',
            state: '',
            country: '',
            financial_year_start: getDefaultAprilFirst(),
            books_begin_from: getDefaultAprilFirst(),
            is_deleted: false,
            number: '',
            code: '',
            email: '',
            image: '',
            gstin: '',
            pan_number: '',
            website: '',
            account_number: '',
            account_holder: '',
            bank_ifsc: '',
            bank_name: '',
            bank_branch: '',
            qr_code_url: '',
        });
        setActiveSection('basic');
        setCurrentStep(0);
    }, []);

    useEffect(() => {
        if (visible) {
            resetData();
            // setValidationErrors({}); // Only reset errors when modal opens
            setActiveSection('basic');
        }
    }, [visible, resetData]);

    const handleChange = useCallback((field: string, value: string | boolean | number) => {
        setData((prevState) => ({
            ...prevState,
            [field]: value,
        }));

        // Only clear the error for the field being edited
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
        }
    }, [validationErrors]);

    const validateForm = useCallback(() => {
        const errors: Record<string, string> = {};
        switch (activeSection) {
            case 'basic':
                if (!data.name.trim()) {
                    errors.name = 'Company name is required';
                }

                if (!data.email.trim()) {
                    errors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    errors.email = 'Please enter a valid email address';
                }
                if (data.number && !/^\d{10}$/.test(data.number)) {
                    errors.number = 'Phone number must be 10 digits';
                }
                if (data.website && !/^https?:\/\//.test(data.website)) {
                    errors.website = 'Website URL must start with http:// or https://';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 'address':
                if (!data.state.trim()) {
                    errors.state = 'State is required';
                }

                if (!data.country.trim()) {
                    errors.country = 'Country is required';
                }
                if (data.pinCode && !/^\d{6}$/.test(data.pinCode)) {
                    errors.pinCode = 'PIN code must be 6 digits';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 'financial':
                if (data.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstin)) {
                    errors.gstin = 'Please enter a valid GSTIN';
                }

                if (data.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan_number)) {
                    errors.pan_number = 'Please enter a valid PAN number';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            case 'banking':
                if (data.bank_ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.bank_ifsc)) {
                    errors.bank_ifsc = 'Please enter a valid IFSC code';
                }
                setValidationErrors(errors);
                return Object.keys(errors).length === 0;
            default:
                return false;
        }
    }, [activeSection, data.bank_ifsc, data.country, data.email, data.gstin, data.name, data.number, data.pan_number, data.pinCode, data.state, data.website]);

    const getSectionProgress = useCallback(() => {
        const sections = {
            basic: ['name', 'email'],
            address: ['state', 'country'],
            financial: [],
            banking: [],
        };

        const progress: Record<string, number> = {};

        Object.entries(sections).forEach(([section, fields]) => {
            const filledFields = fields.filter(field => data[field as keyof typeof data]?.toString().trim());
            progress[section] = (filledFields.length / fields.length) * 100;
        });

        return progress;
    }, [data]);

    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            // You can show an alert here if needed, or handle error display elsewhere
        }
    }, [setAlert, validationErrors]);


    const handleClose = () => {
        setValidationErrors({});
        setActiveSection('basic');
        setCurrentStep(0);
        setVisible(false);
        resetData();
    };


    async function onPress() {
        const isValid = validateForm();
        if (!isValid) {
            const currentErrors = Object.keys(validationErrors);
            const firstErrorKey = currentErrors[0];
            setAlert({
                type: 'error',
                message: firstErrorKey ? validationErrors[firstErrorKey] : 'Company name and email are required',
                id: 'company-create-modal',
            });
            return;
        }

        const formData = arrayToFormData(
            Object.entries(data)
                .filter(([_, value]) => value)
                .map(([key, value]) => [
                    key,
                    value instanceof Date ? value.toISOString() : value,
                ]) as [string, string | boolean][]
        );

        await dispatch(createCompany(formData)).unwrap().then((res) => {
            console.log('Company created:', res);
            if (res) {
                dispatch(getCurrentUser());
                dispatch(getAllCompanies());
                handleClose();
                if(setSecondaryVisible) setSecondaryVisible(false);
            }
            handleClose();
        }).finally(() => {
            handleClose();
        });
        handleClose();
    }


    const renderSectionButton = (section: 'basic' | 'address' | 'financial' | 'banking', title: string) => {
        const progress = getSectionProgress()[section];
        const isActive = activeSection === section;

        return (
            <View style={[styles.sectionButton, {
                backgroundColor: isActive ? 'rgb(2, 2, 2)' : 'rgb(85, 85, 85)',
                borderColor: isActive ? primaryColor : '#e0e0e0',

            }]}>
                <Text style={[styles.sectionButtonText, {
                    color: isActive ? 'white' : 'rgb(196, 196, 196)',
                }]}>
                    {title}
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, {
                        width: `${progress}%`,
                        backgroundColor: isActive ? '#fff' : primaryColor,
                    }]} />
                </View>
            </View>
        );
    };

    const renderBasicSection = () => (
        <View style={styles.section}>
            <TextTheme style={styles.sectionTitle}>Basic Information</TextTheme>

            <InputField
                icon={<FeatherIcon name="user" size={20} />}
                placeholder="Company Name *"
                value={data.name}
                autoFocus={true}
                field="name"
                capitalize="words"
                handleChange={handleChange}
                error={validationErrors.name}
            />

            <InputField
                icon={<FeatherIcon name="at-sign" size={20} />}
                placeholder="Company Email *"
                value={data.email}
                field="email"
                handleChange={handleChange}
                error={validationErrors.email}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: '30%' }}>
                    <InputField
                        icon={<FeatherIcon name="phone" size={20} />}
                        placeholder="+91"
                        value={data.code}
                        field="code"
                        handleChange={handleChange}
                        error={validationErrors.code}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <InputField
                        icon={<FeatherIcon name="phone" size={20} />}
                        placeholder="Phone Number"
                        value={data.number}
                        field="number"
                        handleChange={handleChange}
                        error={validationErrors.number}
                        keyboardType="number-pad"
                    />
                </View>
            </View>


            <InputField
                icon={<FeatherIcon name="globe" size={20} />}
                placeholder="Website URL"
                value={data.website}
                field="website"
                handleChange={handleChange}
                error={validationErrors.website}
            />
        </View>
    );

    const renderAddressSection = () => (
        <View style={styles.section}>
            <TextTheme style={styles.sectionTitle}>Address Information</TextTheme>

            <InputField
                icon={<FeatherIcon name="type" size={20} />}
                placeholder="Mailing Name"
                value={data.mailing_name}
                field="mailing_name"
                capitalize="words"
                handleChange={handleChange}
                error={validationErrors.mailing_name}
            />
            <InputField
                icon={<FeatherIcon name="map-pin" size={20} />}
                placeholder="Address Line 1"
                value={data.address_1}
                field="address_1"
                capitalize="words"
                handleChange={handleChange}
                error={validationErrors.address_1}
            />

            <InputField
                icon={<FeatherIcon name="map-pin" size={20} />}
                placeholder="Address Line 2"
                value={data.address_2}
                field="address_2"
                capitalize="words"
                handleChange={handleChange}
                error={validationErrors.address_2}
            />

            <InputField
                icon={<FeatherIcon name="flag" size={20} />}
                placeholder="State"
                value={data.state}
                field="state"
                capitalize="words"
                handleChange={handleChange}
                error={validationErrors.state}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: '50%' }}>
                    <InputField
                        icon={<FeatherIcon name="globe" size={20} />}
                        placeholder="Country"
                        value={data.country}
                        field="country"
                        capitalize="words"
                        handleChange={handleChange}
                        error={validationErrors.country}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <InputField
                        icon={<FeatherIcon name="navigation" size={20} />}
                        placeholder="PIN Code"
                        value={data.pinCode}
                        field="pinCode"
                        handleChange={handleChange}
                        error={validationErrors.pinCode}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );

    const renderFinancialSection = () => (
        <View style={styles.section}>
            <TextTheme style={styles.sectionTitle}>Financial Information</TextTheme>

            <InputField
                icon={<FeatherIcon name="file-text" size={20} />}
                placeholder="GSTIN"
                value={data.gstin}
                field="gstin"
                capitalize="characters"
                handleChange={handleChange}
                error={validationErrors.gstin}
            />

            <InputField
                icon={<FeatherIcon name="credit-card" size={20} />}
                placeholder="PAN Number"
                value={data.pan_number}
                field="pan_number"
                capitalize="characters"
                handleChange={handleChange}
                error={validationErrors.pan_number}
            />

            <AnimateButton style={{
                padding: 8,
                flex: 1,
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 12,
                gap: 12,
                alignItems: 'center',
            }}>
                <BackgroundThemeView
                    style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                    }}
                >
                    <FeatherIcon name="calendar" size={16} />
                </BackgroundThemeView>

                <View style={{ flex: 1 }}>
                    <TextTheme style={{ fontSize: 14, fontWeight: '700', marginBottom: 2 }}>
                        Financial Year Start Date
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{ fontSize: 13, fontWeight: '500' }}>
                        {data.financial_year_start.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </TextTheme>
                </View>
            </AnimateButton>

            <AnimateButton style={{
                marginTop: 16,
                padding: 8,
                flex: 1,
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 12,
                gap: 12,
                alignItems: 'center',
            }}>
                <BackgroundThemeView
                    style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                    }}
                >
                    <FeatherIcon name="calendar" size={16} />
                </BackgroundThemeView>

                <View style={{ flex: 1 }}>
                    <TextTheme style={{ fontSize: 14, fontWeight: '700', marginBottom: 2 }}>
                        Books Begin From
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{ fontSize: 13, fontWeight: '500' }}>
                        {data.books_begin_from.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </TextTheme>
                </View>
            </AnimateButton>
        </View>
    );

    const renderBankingSection = () => (
        <View style={styles.section}>
            <TextTheme style={styles.sectionTitle}>Banking Information</TextTheme>

            <InputField
                icon={<FeatherIcon name="credit-card" size={20} />}
                placeholder="Account Number"
                value={data.account_number}
                field="account_number"
                handleChange={handleChange}
                error={validationErrors.account_number}
                keyboardType="numeric"
            />

            <InputField
                icon={<FeatherIcon name="user" size={20} />}
                placeholder="Account Holder Name"
                value={data.account_holder}
                field="account_holder"
                capitalize="characters"
                handleChange={handleChange}
                error={validationErrors.account_holder}
            />

            <InputField
                icon={<FeatherIcon name="home" size={20} />}
                placeholder="Bank Name"
                value={data.bank_name}
                capitalize="characters"
                field="bank_name"
                handleChange={handleChange}
                error={validationErrors.bank_name}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: '50%' }}>
                    <InputField
                        icon={<FeatherIcon name="git-branch" size={20} />}
                        placeholder="Bank Branch"
                        value={data.bank_branch}
                        capitalize="words"
                        field="bank_branch"
                        handleChange={handleChange}
                        error={validationErrors.bank_branch}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <InputField
                        icon={<FeatherIcon name="hash" size={20} />}
                        placeholder="IFSC Code"
                        value={data.bank_ifsc}
                        capitalize="characters"
                        field="bank_ifsc"
                        handleChange={handleChange}
                        error={validationErrors.bank_ifsc}
                    />
                </View>
            </View>

            {/* <InputField
                icon={<FeatherIcon name="image" size={20} />}
                placeholder="QR Code URL"
                value={data.qr_code_url}
                field="qr_code_url"
                handleChange={handleChange}
                error={validationErrors.qr_code_url}
            /> */}
        </View>
    );

    const renderCurrentSection = () => {
        switch (activeSection) {
            case 'basic':
                return renderBasicSection();
            case 'address':
                return renderAddressSection();
            case 'financial':
                return renderFinancialSection();
            case 'banking':
                return renderBankingSection();
            default:
                return renderBasicSection();
        }
    };

    const handleNext = () => {
        const isValid = validateForm();
        if (!isValid) {
            return;
        } else if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setActiveSection(steps[currentStep + 1].title as 'basic' | 'address' | 'financial' | 'banking');
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setActiveSection(steps[currentStep - 1].title as 'basic' | 'address' | 'financial' | 'banking');
        }
    };

    const steps = [
        { title: 'basic' },
        { title: 'address' },
        { title: 'financial' },
        { title: 'banking' },
    ];

    return (
        <BottomModal
            alertId="company-create-modal"
            visible={isCompaniesFetching ? visible : companies.length === 0 ? true : visible}
            setVisible={setVisible}
            closeOnBack={companies.length !== 0}
            onClose={() => resetData()}
            style={styles.modal}
            actionButtons={[
                ...(currentStep > 0 ? [{ title: 'Previous', backgroundColor: 'gray', onPress: handlePrevious }] : []),
                ...(currentStep < steps.length - 1 ? [{ title: 'Next', backgroundColor: 'rgb(85, 85, 85)', color: 'white', onPress: handleNext }] : []),
                ...(currentStep === steps.length - 1 ? [{ title: 'Create Company', backgroundColor: 'rgb(50,200,150)', onPress: onPress }] : []),
            ]}
        >
            <TextTheme style={styles.modalTitle}>Create Company</TextTheme>

            {/* Section Navigation */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sectionNavigation}
            >
                <View style={styles.sectionButtons}>
                    {[
                        { key: 'basic', title: 'Basic' },
                        { key: 'address', title: 'Address' },
                        { key: 'financial', title: 'Financial' },
                        { key: 'banking', title: 'Banking' },
                    ].map(({ key, title }) => (
                        <View
                            key={key}
                            style={styles.sectionButtonContainer}
                        // onTouchEnd={() => setActiveSection(key as any)}
                        >
                            {renderSectionButton(key as any, title)}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Form Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {renderCurrentSection()}
            </ScrollView>

            <View style={styles.bottomSpacing} />
            <LoadingModal visible={loading} />
        </BottomModal>
    );
}

const styles = StyleSheet.create({
    modal: {
        paddingHorizontal: 20,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionNavigation: {
        marginBottom: 20,
    },
    sectionButtons: {
        flexDirection: 'row',
        gap: 12,
        minHeight: 50,
    },
    sectionButtonContainer: {
        minWidth: 80,
    },
    sectionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        minWidth: 80,
    },
    sectionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    progressBar: {
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 1,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 1,
    },
    section: {
        paddingBottom: 0,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    bottomSpacing: {
        height: 10,
    },
});


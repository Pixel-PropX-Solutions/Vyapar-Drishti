/* eslint-disable react-native/no-inline-styles */
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import TextTheme from '../Text/TextTheme';
import BottomModal from '../Modal/BottomModal';
import { useCallback, useState } from 'react';
import { createCompany, getAllCompanies, getCompany, setCompany } from '../../Services/company';
import { useTheme } from '../../Contexts/ThemeProvider';
import arrayToFormData from '../../Utils/arrayToFormData';
import { useAlert } from '../Alert/AlertProvider';
import { useAppDispatch, useCompanyStore } from '../../Store/ReduxStore';
import { setIsCompanyFetching } from '../../Store/Redusers/companyReduser';
import { InputField } from '../TextInput/InputField';
import { getDefaultAprilFirst } from '../../Utils/functionTools';
import AnimateButton from '../Button/AnimateButton';
import BackgroundThemeView from '../View/BackgroundThemeView';
import FeatherIcon from '../Icon/FeatherIcon';

type CompanyCreateModalType = {
    visible: boolean,
    setVisible: (vis: boolean) => void
}

export function CompanyCreateModal({ visible, setVisible }: CompanyCreateModalType) {
    const { primaryColor } = useTheme();
    const { setAlert } = useAlert();
    const dispatch = useAppDispatch();
    const { companies, isCompaniesFetching } = useCompanyStore();

    const [activeSection, setActiveSection] = useState<'basic' | 'address' | 'financial' | 'banking'>('basic');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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

        // Basic Information Validation
        if (!data.name.trim()) {
            errors.name = 'Company name is required';
        }

        if (!data.state.trim()) {
            errors.state = 'State is required';
        }

        if (!data.country.trim()) {
            errors.country = 'Country is required';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (data.number && !/^\d{10}$/.test(data.number)) {
            errors.number = 'Phone number must be 10 digits';
        }

        if (data.pinCode && !/^\d{6}$/.test(data.pinCode)) {
            errors.pinCode = 'PIN code must be 6 digits';
        }

        if (data.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstin)) {
            errors.gstin = 'Please enter a valid GSTIN';
        }

        if (data.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan_number)) {
            errors.pan_number = 'Please enter a valid PAN number';
        }

        if (data.website && !/^https?:\/\//.test(data.website)) {
            errors.website = 'Website URL must start with http:// or https://';
        }

        if (data.bank_ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.bank_ifsc)) {
            errors.bank_ifsc = 'Please enter a valid IFSC code';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data]);

    const getSectionProgress = useCallback(() => {
        const sections = {
            basic: ['name', 'email'],
            address: ['address_1', 'state', 'country'],
            financial: ['gstin', 'pan_number'],
            banking: ['account_number', 'bank_name', 'bank_ifsc'],
        };

        const progress: Record<string, number> = {};

        Object.entries(sections).forEach(([section, fields]) => {
            const filledFields = fields.filter(field => data[field as keyof typeof data]?.toString().trim());
            progress[section] = (filledFields.length / fields.length) * 100;
        });

        return progress;
    }, [data]);

    async function onPress() {
        if (!validateForm()) {
            setAlert({
                type: 'error',
                massage: 'Please fix the validation errors before proceeding',
                id: 'company-create-modal',
            });
            return;
        }

        if (!data.name.trim() || !data.email.trim()) {
            setAlert({
                type: 'error',
                massage: 'Company name and email are required',
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

        await dispatch(createCompany(formData));
        const { payload: res } = await dispatch(getAllCompanies());

        if ((res?.companies ?? []).length === 1) {
            dispatch(setIsCompanyFetching(true));
            dispatch(setCompany(res.companies[0]._id)).then(_ => dispatch(getCompany()));
        }

        setVisible(false);
    }

    const renderSectionButton = (section: 'basic' | 'address' | 'financial' | 'banking', title: string) => {
        const progress = getSectionProgress()[section];
        const isActive = activeSection === section;

        return (
            <View style={[styles.sectionButton, {
                backgroundColor: isActive ? primaryColor : '#f5f5f5',
                borderColor: isActive ? primaryColor : '#e0e0e0',

            }]}>
                <Text style={[styles.sectionButtonText, {
                    color: isActive ? '#fff' : '#333',
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
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <InputField
                icon="user"
                placeholder="Company Name *"
                value={data.name}
                field="name"
                handleChange={handleChange}
                error={validationErrors.name}
            />

            <InputField
                icon="at-sign"
                placeholder="Company Email *"
                value={data.email}
                field="email"
                handleChange={handleChange}
                error={validationErrors.email}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: '30%' }}>
                    <InputField
                        icon="phone"
                        placeholder="+91"
                        value={data.code}
                        field="code"
                        handleChange={handleChange}
                        error={validationErrors.code}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <InputField
                        icon="phone"
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
                icon="globe"
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
                icon="type"
                placeholder="Mailing Name"
                value={data.mailing_name}
                field="mailing_name"
                handleChange={handleChange}
                error={validationErrors.mailing_name}
            />
            <InputField
                icon="map-pin"
                placeholder="Address Line 1"
                value={data.address_1}
                field="address_1"
                handleChange={handleChange}
                error={validationErrors.address_1}
            />

            <InputField
                icon="map-pin"
                placeholder="Address Line 2"
                value={data.address_2}
                field="address_2"
                handleChange={handleChange}
                error={validationErrors.address_2}
            />

            <InputField
                icon="flag"
                placeholder="State"
                value={data.state}
                field="state"
                handleChange={handleChange}
                error={validationErrors.state}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: '50%' }}>
                    <InputField
                        icon="globe"
                        placeholder="Country"
                        value={data.country}
                        field="country"
                        handleChange={handleChange}
                        error={validationErrors.country}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <InputField
                        icon="navigation"
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
                icon="file-text"
                placeholder="GSTIN"
                value={data.gstin}
                field="gstin"
                handleChange={handleChange}
                error={validationErrors.gstin}
            />

            <InputField
                icon="credit-card"
                placeholder="PAN Number"
                value={data.pan_number}
                field="pan_number"
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
                icon="credit-card"
                placeholder="Account Number"
                value={data.account_number}
                field="account_number"
                handleChange={handleChange}
                error={validationErrors.account_number}
                keyboardType="numeric"
            />

            <InputField
                icon="user"
                placeholder="Account Holder Name"
                value={data.account_holder}
                field="account_holder"
                handleChange={handleChange}
                error={validationErrors.account_holder}
            />

            <InputField
                icon="home"
                placeholder="Bank Name"
                value={data.bank_name}
                field="bank_name"
                handleChange={handleChange}
                error={validationErrors.bank_name}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: '50%' }}>
                    <InputField
                        icon="git-branch"
                        placeholder="Bank Branch"
                        value={data.bank_branch}
                        field="bank_branch"
                        handleChange={handleChange}
                        error={validationErrors.bank_branch}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <InputField
                        icon="hash"
                        placeholder="IFSC Code"
                        value={data.bank_ifsc}
                        field="bank_ifsc"
                        handleChange={handleChange}
                        error={validationErrors.bank_ifsc}
                    />
                </View>
            </View>

            {/* <InputField
                icon="image"
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

    return (
        <BottomModal
            alertId="company-create-modal"
            visible={isCompaniesFetching ? visible : companies.length === 0 ? true : visible}
            setVisible={setVisible}
            closeOnBack={companies.length !== 0}
            style={styles.modal}
            actionButtons={[
                {
                    title: 'Create Company',
                    onPress,
                    style: { backgroundColor: primaryColor },
                },
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
                            onTouchEnd={() => setActiveSection(key as any)}
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
        color: '#333',
    },
    bottomSpacing: {
        height: 10,
    },
});


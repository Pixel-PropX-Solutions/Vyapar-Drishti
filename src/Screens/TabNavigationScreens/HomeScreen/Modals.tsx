/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import BottomModal from '../../../Components/Modal/BottomModal';
import TextTheme from '../../../Components/Ui/Text/TextTheme';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SectionRowWithIcon } from '../../../Components/Layouts/View/SectionView';
import LogoImage from '../../../Components/Image/LogoImage';
import { useAppDispatch, useCompanyStore, useUserStore } from '../../../Store/ReduxStore';
import { setIsCompanyFetching } from '../../../Store/Reducers/companyReducer';
import { getCurrentUser, switchCompany } from '../../../Services/user';
import { createCompany, getAllCompanies, getCompany } from '../../../Services/company';
import { useAlert } from '../../../Components/Ui/Alert/AlertProvider';
import { arrayToFormData, getDefaultAprilFirst } from '../../../Utils/functionTools';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import AnimateButton from '../../../Components/Ui/Button/AnimateButton';
import BackgroundThemeView from '../../../Components/Layouts/View/BackgroundThemeView';
import LoadingModal from '../../../Components/Modal/LoadingModal';
import { PhoneNumber } from '../../../Utils/types';
import PhoneNoInputField from '../../../Components/Ui/Option/PhoneNoInputField';
import { SelectField } from '../../../Components/Ui/TextInput/SelectField';
import { CountrySelectorModal } from '../../../Components/Modal/CountrySelectorModal';
import { StateSelectorModal } from '../../../Components/Modal/StateSelectorModal';
import CollapsabeMenu from '../../../Components/Other/CollapsabeMenu';
import AuthStore from '../../../Store/AuthStore';
import { setCurrentCompanyId } from '../../../Store/Reducers/userReducer';
import LabelTextInput from '../../../Components/Ui/TextInput/LabelTextInput';


type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function CompanySwitchModal({ visible, setVisible }: Props) {

    const dispatch = useAppDispatch();
    const { companies, isCompanyFetching } = useCompanyStore();
    const { current_company_id, user } = useUserStore();
    const currentCompanyId = current_company_id || AuthStore.getString('current_company_id') || user?.user_settings?.current_company_id || '';

    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isSwitching, setSwitching] = useState(false);

    return (<>
        <BottomModal
            visible={visible} setVisible={setVisible}
            style={{ paddingInline: 20, gap: 20 }}
            actionButtons={[{
                title: '+ Add New',
                color: 'white',
                backgroundColor: 'rgb(50,200,150)',
                onPress: () => {
                    setCreateModalVisible(true);
                },
            }]}
        >
            <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Select Company</TextTheme>

            <ScrollView contentContainerStyle={{ gap: 16 }} >

                {
                    companies.map(({ _id, name, financial_year_start, image }) => {
                        const fy = financial_year_start;
                        const financialYear = fy
                            ? `FY: ${fy.slice(0, 4)} - ${parseInt(fy.slice(0, 4), 10) + 1}`
                            : '';
                        return (
                            <SectionRowWithIcon
                                key={_id}
                                label={name}
                                text={financialYear}
                                icon={<LogoImage size={44} imageSrc={image ?? ''} />}
                                backgroundColor={_id === currentCompanyId ? 'rgb(50,150,250)' : ''}
                                color={_id === currentCompanyId ? 'white' : ''}
                                onPress={() => {
                                    if (_id === currentCompanyId) { return setVisible(false); }
                                    setSwitching(true);

                                    dispatch(setIsCompanyFetching(true));

                                    dispatch(switchCompany(_id))
                                        .unwrap().then((response) => {
                                            if (response) {
                                                dispatch(setCurrentCompanyId(_id));
                                                dispatch(getCurrentUser());
                                                dispatch(getCompany());
                                                setVisible(false);
                                                setSwitching(false);
                                            }
                                            setSwitching(false);
                                            setVisible(false);
                                        });
                                }}
                            />
                        );
                    })
                }

            </ScrollView>
        </BottomModal>

        <CompanyCreateModal
            visible={isCreateModalVisible}
            setVisible={setCreateModalVisible}
            setSecondaryVisible={setVisible}
        />
        <LoadingModal visible={isSwitching || isCompanyFetching} />
    </>);
}



export function CompanyCreateModal({ visible, setVisible, setSecondaryVisible }: Props & { setSecondaryVisible?: (vis: boolean) => void }) {

    const dispatch = useAppDispatch();

    const { setAlert } = useAlert();
    const { companies, isCompaniesFetching, loading } = useCompanyStore();

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const phone = useRef<PhoneNumber>({ code: '', number: '' });
    const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
    const [expandedSection, setExpandedSection] = useState<string | 'basic' | 'address' | 'financial' | 'banking'>('basic');
    const [isStateModalVisible, setStateModalVisible] = useState<boolean>(false);

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
        number: phone.current.number,
        code: phone.current.code,
        email: '',
        image: '',
        tin: '',
        website: '',
        account_number: '',
        account_holder: '',
        bank_ifsc: '',
        bank_name: '',
        bank_branch: '',
        qr_code_url: '',
    });

    const resetData = () => {
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
            tin: '',
            website: '',
            account_number: '',
            account_holder: '',
            bank_ifsc: '',
            bank_name: '',
            bank_branch: '',
            qr_code_url: '',
        });
    };


    useEffect(() => {
        if (visible) {
            resetData();
            setExpandedSection('basic');
            setValidationErrors({});
        }
    }, [visible]);

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
        if (data.tin && !isValidTin(data.tin)) {
            errors.tin = 'Please enter a valid TIN';
        }

        if (!data.name.trim()) {
            errors.name = 'Company name is required';
        }

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (data.number && !/^\d{10}$/.test(data.number)) {
            errors.number = 'Phone number must be 10 digits';
        }
        if (data.website && !/^https?:\/\//.test(data.website)) {
            errors.website = 'Website URL must start with http:// or https://';
        }
        if (!data.state.trim()) {
            errors.state = 'State is required';
        }

        if (!data.country.trim()) {
            errors.country = 'Country is required';
        }
        if (data.pinCode && !/^\d{6}$/.test(data.pinCode)) {
            errors.pinCode = 'PIN code must be 6 digits';
        }
        if (data.bank_ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.bank_ifsc)) {
            errors.bank_ifsc = 'Please enter a valid IFSC code';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data.bank_ifsc, data.country, data.email, data.name, data.number, data.pinCode, data.state, data.tin, data.website]);

    const isValidTin = (tin: string) => {
        if (!tin) { return true; } // Allow empty TIN
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(tin);
    };

    const isCreateCompany: boolean = data.name.trim() !== '' && data.state.trim() !== '' && data.country.trim() !== '';

    const handleClose = () => {
        setValidationErrors({});
        setVisible(false);
        setExpandedSection('basic');
        resetData();
    };


    async function onPress() {
        if (!isCreateCompany) {
            setAlert({
                type: 'error',
                message: 'Please fill in all required fields in the Basic Information section',
                id: 'company-create-modal',
            });
            return;
        }
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
                dispatch(switchCompany(res))
                    .unwrap().then((response) => {
                        if (response) {
                            dispatch(getCurrentUser());
                            dispatch(getCompany());
                            dispatch(getAllCompanies());
                            handleClose();
                        }
                    });
                dispatch(getAllCompanies());
                dispatch(getCurrentUser());
                handleClose();
                if (setSecondaryVisible) { setSecondaryVisible(false); }
            }
            handleClose();
        }).finally(() => {
            handleClose();
        });
        handleClose();
    }


    const renderBasicSection = () => (
        <CollapsabeMenu
            header="Basic Information"
            expanded={expandedSection === 'basic'}
            setExpanded={() => setExpandedSection(expandedSection === 'basic' ? '' : 'basic')}
        >
            <View style={styles.section}>
                <LabelTextInput
                    label="TIN"
                    placeholder="Enter TIN / GSTIN"
                    keyboardType="default"
                    value={data.tin}
                    checkInputText={isValidTin}
                    message="Enter a valid TIN / GSTIN"
                    onChangeText={text => {
                        handleChange('tin', text);
                    }}
                    useTrim={false}
                    autoFocus={true}
                    isRequired={false}
                    capitalize="characters"
                    borderWidth={1}
                />

                <LabelTextInput
                    label="Business Name"
                    placeholder="Enter Business Name"
                    keyboardType="default"
                    value={data.name}
                    message="Enter a valid Business Name"
                    onChangeText={val => { handleChange('name', val); }}
                    useTrim={true}
                    isRequired={true}
                    capitalize="words"
                    borderWidth={1}
                />
                <SelectField
                    icon={<FeatherIcon name="globe" size={20} />}
                    placeholder="Select Country *"
                    value={data.country}
                    onPress={() => setCountryModalVisible(true)}
                    containerStyle={{ flex: 1 }}
                    error={validationErrors.country}
                />

                <SelectField
                    icon={<FeatherIcon name="flag" size={20} />}
                    placeholder="Select State *"
                    value={data.state}
                    onPress={() => setStateModalVisible(true)}
                    // containerStyle={{ flex: 1 }}
                    error={validationErrors.state}
                />

            </View>
            <CountrySelectorModal
                visible={isCountryModalVisible}
                country={data.country}
                field="country"
                setCountry={handleChange}
                setVisible={setCountryModalVisible}
            />
            <StateSelectorModal
                visible={isStateModalVisible}
                country={data.country}
                field="state"
                state={data.state}
                setState={handleChange}
                setVisible={setStateModalVisible}
            />
        </CollapsabeMenu>
    );

    const renderAddressSection = () => (
        <CollapsabeMenu
            header="Additional Information"
            expanded={expandedSection === 'address'}
            setExpanded={() => setExpandedSection(expandedSection === 'address' ? '' : 'address')}
        >
            <View style={styles.section}>
                <LabelTextInput
                    label="Contact Person Name"
                    placeholder="Enter Contact Person Name"
                    keyboardType="default"
                    value={data.mailing_name}
                    message="Enter a valid Contact Person Name"
                    onChangeText={val => { handleChange('mailing_name', val); }}
                    useTrim={true}
                    autoFocus={true}
                    isRequired={false}
                    capitalize="words"
                    borderWidth={1}
                />

                <LabelTextInput
                    label="Business Address Line 1 "
                    placeholder="Enter Business Address Line 1"
                    keyboardType="default"
                    value={data.address_1}
                    message="Enter a valid Business Address Line 1"
                    onChangeText={val => { handleChange('address_1', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="words"
                    borderWidth={1}
                />

                <LabelTextInput
                    label="Business Address Line 2 "
                    placeholder="Enter Business Address Line 2"
                    keyboardType="default"
                    value={data.address_2}
                    message="Enter a valid Business Address Line 2"
                    onChangeText={val => { handleChange('address_2', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="words"
                    borderWidth={1}
                />

                <LabelTextInput
                    label="Pin Code"
                    placeholder="Enter Pin Code"
                    keyboardType="default"
                    value={data.pinCode}
                    message="Enter a valid Pin Code"
                    onChangeText={val => { handleChange('pinCode', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="words"
                    borderWidth={1}
                />

                <LabelTextInput
                    label="Business Email "
                    placeholder="Enter Business Email"
                    keyboardType="email-address"
                    value={data.email}
                    message="Enter a valid Business Email"
                    onChangeText={val => { handleChange('email', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="none"
                    borderWidth={1}
                />


                <View style={{ flex: 1 }}>
                    <PhoneNoInputField
                        phoneNumber={{ code: data.code, number: data.number }}
                        placeholder="Phone Number"
                        onChangePhoneNumber={(phoneNo) => {
                            phone.current = phoneNo;
                            setData((prev) => ({
                                ...prev,
                                code: phoneNo.code,
                                number: phoneNo.number,
                            }));
                        }} />
                </View>

                <LabelTextInput
                    label="Website URL"
                    placeholder="Enter Website URL"
                    keyboardType="url"
                    value={data.website}
                    message="Enter a valid Website URL"
                    onChangeText={val => { handleChange('website', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="none"
                    borderWidth={1}
                />
            </View>
        </CollapsabeMenu>
    );

    const renderFinancialSection = () => (
        <CollapsabeMenu
            header="Financial Information"
            expanded={expandedSection === 'financial'}
            setExpanded={() => setExpandedSection(expandedSection === 'financial' ? '' : 'financial')}
        >
            <View style={styles.section}>

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
        </CollapsabeMenu>
    );

    const renderBankingSection = () => (
        <CollapsabeMenu
            header="Banking Information"
            expanded={expandedSection === 'banking'}
            setExpanded={() => setExpandedSection(expandedSection === 'banking' ? '' : 'banking')}
        >
            <View style={styles.section}>
                <LabelTextInput
                    label="Account Number"
                    placeholder="Enter Account Number"
                    keyboardType="default"
                    value={data.account_number}
                    message="Enter a valid Account Number"
                    onChangeText={val => { handleChange('account_number', val); }}
                    useTrim={true}
                    autoFocus={true}
                    isRequired={false}
                    capitalize="characters"
                    borderWidth={1}
                />

                <LabelTextInput
                    label="Bank Name"
                    placeholder="Enter Bank Name"
                    keyboardType="default"
                    value={data.bank_name}
                    message="Enter a valid Bank Name"
                    onChangeText={val => { handleChange('bank_name', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="characters"
                    borderWidth={1}
                />

                <LabelTextInput
                    label="Bank Branch"
                    placeholder="Enter Bank Branch"
                    keyboardType="default"
                    value={data.bank_branch}
                    message="Enter a valid Bank Branch"
                    onChangeText={val => { handleChange('bank_branch', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="words"
                    borderWidth={1}
                />


                <LabelTextInput
                    label="IFSC Code"
                    placeholder="Enter IFSC Code"
                    keyboardType="default"
                    value={data.bank_ifsc}
                    message="Enter a valid IFSC Code"
                    onChangeText={val => { handleChange('bank_ifsc', val); }}
                    useTrim={true}
                    isRequired={false}
                    capitalize="characters"
                    borderWidth={1}
                />

            </View>
        </CollapsabeMenu>
    );


    return (
        <BottomModal
            alertId="company-create-modal"
            visible={isCompaniesFetching ? visible : companies.length === 0 ? true : visible}
            setVisible={setVisible}
            closeOnBack={companies.length !== 0}
            onClose={() => resetData()}
            style={styles.modal}
            actionButtons={[
                { title: 'Create Company', backgroundColor: isCreateCompany ? 'rgb(50,200,150)' : 'rgb(200,200,200)', onPress: onPress },
            ]}
        >
            <TextTheme style={styles.modalTitle}>Create Company</TextTheme>

            {/* Form Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
            >
                {renderBasicSection()}
                {renderAddressSection()}
                {renderFinancialSection()}
                {renderBankingSection()}
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
        gap: 12,
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


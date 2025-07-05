/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import BottomModal from '../BottomModal';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import TextTheme from '../../Text/TextTheme';
import FeatherIcon from '../../Icon/FeatherIcon';
import NoralTextInput from '../../TextInput/NoralTextInput';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { SectionRow } from '../../View/SectionView';
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
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const [isGroupModalVisible, setGroupModalVisible] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [data, setData] = useState({
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
        company_id: '',
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
                isGSTINOptional: currentCompanyDetails?.company_settings?.features?.enable_gst ? true : false,
                isMailingAddressOptional: false,
                showPAN: true,
                showGSTIN: true,
                requiredFields: [
                    'name',
                    'mailing_state',
                    'parent',
                    'mailing_country',
                    ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'pan'] : []),
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
                requiredFields: ['name', 'parent'],
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
                requiredFields: ['name', 'parent', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'pan'] : [])],
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
                showBankDetails: true,
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
                requiredFields: ['name', 'parent', 'mailing_state', 'mailing_country', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'pan'] : [])],
            };
        } if (
            type === 'cash-in-hand'
        ) {
            return {
                showAll: false,
                showBasicDetails: true,
                showProfileImage: false,
                showMailingDetails: false,
                showBankDetails: true,
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
            requiredFields: ['name', 'mailing_state', 'parent', ...(currentCompanyDetails?.company_settings?.features?.enable_gst ? ['gstin', 'pan'] : [])],
        };
    }, [currentCompanyDetails?.company_settings?.features?.enable_gst, data.parent, data.parent_id]);

    const { showAll, showBankDetails, showBasicDetails, showGSTIN, showMailingDetails, showPAN, showProfileImage, isBankOptional, isGSTINOptional, isMailingAddressOptional, requiredFields } = getVisibleFields();

    const validateField = (field: string, value: string): string => {
        if (!showAll && !['name', 'parent'].includes(field)) { return ''; }
        if (!value && requiredFields.includes(field)) { return `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`; }
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
    }, [data]);

    const handleInputChange = (
        field: string,
        value: string | number | boolean,
    ) => {
        setData(prev => ({
            ...prev,
            [field]: value,
        }));

        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }

        const error = validateField(field, String(value));
        if (error) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: error,
            }));
        }
    };

    async function handleOnPressCreate() {
        if (!(name && groupName)) {
            return setAlert({
                type: 'error',
                id: 'create-customer-modal',
                message: 'to add new customer name and customer type must be required.',
            });
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));

        await dispatch(createCustomer(formData));
        await dispatch(viewAllCustomers(company?._id ?? ''));

        setVisible(false);
    }


    return (
        <BottomModal
            alertId="create-customer-modal"
            setVisible={setVisible}
            visible={visible}
            actionButtons={[
                { title: 'Create', backgroundColor: 'rgb(50,150,250)', onPress: handleOnPressCreate },
            ]}
            style={{ paddingInline: 20 }}
        >
            <TextTheme style={{ fontWeight: 900, fontSize: 16, marginBottom: 32 }} >Customer Details</TextTheme>



            <SelectField
                icon="users"
                placeholder="Select Customer Type"
                value={data.parent}
                onPress={() => setGroupModalVisible(true)}
                error={validationErrors.parent}
            />

            <InputField
                icon="user"
                field="name"
                placeholder="Customer Name"
                value={data.name}
                handleChange={handleInputChange}
                error={validationErrors.name}
            />


            <View style={{ minHeight: 40 }} />

            <LoadingModal visible={loading} />

            <BottomModal
                visible={isGroupModalVisible}
                setVisible={setGroupModalVisible}
                style={{ paddingHorizontal: 20, gap: 24 }}
            >
                <TextTheme style={{ fontWeight: 900, fontSize: 16 }} >Customer Types</TextTheme>

                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 }} >
                    {
                        accountGroups.map(group => (
                            <AnimateButton
                                key={group._id}
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 100,
                                    paddingInline: 16,
                                    borderColor: secondaryBackgroundColor, paddingBlock: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                    backgroundColor: group.accounting_group_name === data.parent ? secondaryBackgroundColor : primaryBackgroundColor,
                                }}
                                onPress={() => {
                                    handleInputChange('parent', group.accounting_group_name);
                                    handleInputChange('parent_it', group._id);
                                    setGroupModalVisible(false);
                                }}
                            >
                                <TextTheme style={{ fontWeight: 900, fontSize: 14 }} >{group.accounting_group_name}</TextTheme>
                                <FeatherIcon name="arrow-right" size={14} />
                            </AnimateButton>
                        ))
                    }
                </View>
            </BottomModal>
        </BottomModal>
    );
}

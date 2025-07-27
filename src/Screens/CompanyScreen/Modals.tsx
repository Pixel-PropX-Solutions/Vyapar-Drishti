/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import BottomModal from '../../Components/Modal/BottomModal';
import TextTheme from '../../Components/Ui/Text/TextTheme';
import LabelTextInput from '../../Components/Ui/TextInput/LabelTextInput';
import { useAppDispatch, useCompanyStore } from '../../Store/ReduxStore';
import { useEffect, useRef, useState } from 'react';
import { getCompany, updateCompany } from '../../Services/company';
import { useAlert } from '../../Components/Ui/Alert/AlertProvider';
import arrayToFormData from '../../Utils/arrayToFormData';
import { isValidEmail } from '../../Functions/StringOpations/pattenMaching';
import LoadingModal from '../../Components/Modal/LoadingModal';
import ShowWhen from '../../Components/Other/ShowWhen';
import PhoneNoTextInput from '../../Components/Ui/Option/PhoneNoTextInput';
import { PhoneNumber } from '../../Utils/types';
import FeatherIcon from '../../Components/Icon/FeatherIcon';
import { SelectField } from '../../Components/Ui/TextInput/SelectField';
import { CountrySelectorModal } from '../../Components/Modal/CountrySelectorModal';
import { StateSelectorModal } from '../../Components/Modal/StateSelectorModal';

type Props = {
    visible: boolean;
    setVisible: (vis: boolean) => void;
}


export function CompanyInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {

    const { setAlert } = useAlert();
    const { company, loading } = useCompanyStore();
    const dispatch = useAppDispatch();

    const [name, setName] = useState<string>(company?.name ?? '');
    const [website, setWebsite] = useState<string>(company?.website ?? '');

    async function handleUpdate() {

        if (!name) {
            return setAlert({
                type: 'error', message: 'company never be empty', id: 'update-modal',
            });
        }

        const id = company?._id;
        if (!id) { return console.error('company id was not found'); }
        const { code, number } = company.phone ?? {};

        const data = arrayToFormData(Object.entries({
            ...company,
            phone: '', name, website, code, number, pan_number: company?.pan,
        }));

        await dispatch(updateCompany({ data, id: company?._id }));
        await dispatch(getCompany());

        setVisible(false);
    }

    return (
        <BottomModal
            alertId="update-modal"
            visible={visible}
            setVisible={setVisible}
            style={{ paddingHorizontal: 20 }}
            actionButtons={[{ title: 'Update', onPress: handleUpdate }]}
        >
            <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
                Update Company Info
            </TextTheme>

            <View style={{ gap: 24 }} >
                <LabelTextInput
                    label="Name"
                    placeholder="Enter your company name"
                    value={name} onChangeText={setName}
                    useTrim={true}
                />

                <LabelTextInput
                    label="Website URL"
                    placeholder="https://www.conmpanyname.com"
                    value={website} onChangeText={setWebsite}
                    autoCapitalize="none"
                    useTrim={true}
                />
            </View>

            <View style={{ minHeight: 40 }} />
            <ShowWhen when={visible} >
                <LoadingModal visible={loading} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    );
}



export function CompanyContactUpdateModal({ visible, setVisible }: Props): React.JSX.Element {

    const { company, loading } = useCompanyStore();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState<string>(company?.email ?? '');
    const [mailingName, setMailingName] = useState<string>(company?.mailing_name ?? '');

    const phoneNumber = useRef<PhoneNumber>(company?.phone);

    async function handleUpdate() {
        const id = company?._id;

        if (!isValidEmail(email)) { return; }

        if (!id) { return console.error('company id was not found'); }

        const data = arrayToFormData(Object.entries({
            ...company,
            phone: '', email, ...phoneNumber.current, pan_number: company?.pan, mailing_name: mailingName,
        }));

        await dispatch(updateCompany({ data, id: company?._id }));
        await dispatch(getCompany());

        setVisible(false);
    }

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
            style={{ paddingHorizontal: 20 }}
            actionButtons={[{ title: 'Update', onPress: handleUpdate }]}
        >
            <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
                Update Contact
            </TextTheme>

            <View style={{ gap: 24, width: '100%' }} >
                <LabelTextInput
                    label="Contact Person"
                    placeholder="e.g. John Doe"
                    value={mailingName} onChangeText={setMailingName}
                    useTrim={true}
                />

                <LabelTextInput
                    label="Email"
                    checkInputText={isValidEmail}
                    placeholder="contact@companyname.com"
                    value={email} onChangeText={setEmail}
                    autoCapitalize="none"
                    useTrim={true}
                />

                <PhoneNoTextInput
                    phoneNumber={company?.phone}
                    onChangePhoneNumber={(val) => { phoneNumber.current = val; console.log(val); }}
                />
            </View>

            <View style={{ minHeight: 40 }} />
            <ShowWhen when={visible} >
                <LoadingModal visible={loading} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    );
}



export function CompanyAddressUpdateModal({ visible, setVisible }: Props): React.JSX.Element {

    const { company, loading } = useCompanyStore();
    const dispatch = useAppDispatch();
    const address_details = useRef({
        address_1: '',
        address_2: '',
        state: '',
        country: '',
        pinCode: '',
    });

    const setAddressDetails = (key: string, value: any) => {
        address_details.current = {
            ...address_details.current,
            [key]: value,
        };
    };

    const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
    const [isStateModalVisible, setStateModalVisible] = useState<boolean>(false);

    async function handleUpdate() {
        const id = company?._id;
        if (!id) { return console.error('company id was not found'); }
        const { code, number } = company.phone ?? {};

        const data = arrayToFormData(Object.entries({
            ...company,
            phone: '', number, code, pan_number: company?.pan,
            country: address_details.current.country,
            state: address_details.current.state,
            address_1: address_details.current.address_1,
            address_2: address_details.current.address_2,
            pinCode: address_details.current.pinCode,
        }));

        await dispatch(updateCompany({ data, id: company?._id }));
        await dispatch(getCompany());

        setVisible(false);
    }

    useEffect(() => {
        if (company) {
            setAddressDetails('address_1', company.address_1 ?? '');
            setAddressDetails('address_2', company.address_2 ?? '');
            setAddressDetails('state', company.state ?? '');
            setAddressDetails('country', company.country ?? '');
            setAddressDetails('pinCode', company.pinCode ?? '');
        }
    }, [company]);

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
            style={{ paddingHorizontal: 20 }}
            actionButtons={[{ title: 'Udpate', onPress: handleUpdate }]}
        >
            <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
                Update Address
            </TextTheme>

            <View style={{ gap: 24 }} >
                <SelectField
                    // icon={<FeatherIcon name="globe" size={16} />}
                    placeholder="Select Country *"
                    value={address_details.current.country}
                    onPress={() => setCountryModalVisible(true)}
                    containerStyle={{ marginBottom: 0 }}
                />

                <SelectField
                    // icon={<FeatherIcon name="globe" size={16} />}
                    placeholder="Select State *"
                    value={address_details.current.state}
                    onPress={() => setStateModalVisible(true)}
                    containerStyle={{ marginBottom: 0 }}
                />

                <LabelTextInput
                    label="Street Address"
                    placeholder="123 Main St, Suite 456"
                    value={address_details.current.address_1} onChangeText={(val) => setAddressDetails('address_1', val)}
                />

                <LabelTextInput
                    label="Postal Code"
                    placeholder="e.g. 1234, A1B"
                    value={address_details.current.pinCode} onChangeText={(val) => setAddressDetails('pinCode', val)}
                />
            </View>

            <View style={{ minHeight: 40 }} />
            <ShowWhen when={visible} >
                <LoadingModal visible={loading} text="Updating Wait..." />
            </ShowWhen>
            <CountrySelectorModal visible={isCountryModalVisible} field="country" country={address_details.current.country} setCountry={setAddressDetails} setVisible={setCountryModalVisible} />
            <StateSelectorModal visible={isStateModalVisible} field="state" country={address_details.current.country} state={address_details.current.state} setState={setAddressDetails} setVisible={setStateModalVisible} />
        </BottomModal>
    );
}



export function BankInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {

    const { company, loading } = useCompanyStore();
    const dispatch = useAppDispatch();
    const bank_details = useRef({
        account_holder: '',
        account_number: '',
        bank_name: '',
        bank_branch: '',
        bank_ifsc: '',
    });

    const setBankDetails = (key: string, value: any) => {
        bank_details.current = {
            ...bank_details.current,
            [key]: value,
        };
    };

    async function handleUpdate() {
        const id = company?._id;
        if (!id) { return console.error('company id was not found'); }
        const { code, number } = company.phone ?? {};

        const data = arrayToFormData(Object.entries({
            ...company,
            phone: '', number, code,
            account_holder: bank_details.current.account_holder,
            account_number: bank_details.current.account_number,
            bank_name: bank_details.current.bank_name,
            bank_branch: bank_details.current.bank_branch,
            bank_ifsc: bank_details.current.bank_ifsc,
        }));

        await dispatch(updateCompany({ data, id: company?._id }));
        await dispatch(getCompany());

        setVisible(false);
    }

    useEffect(() => {
        if (company) {
            setBankDetails('account_holder', company.account_holder ?? '');
            setBankDetails('account_number', company.account_number ?? '');
            setBankDetails('bank_name', company.bank_name ?? '');
            setBankDetails('bank_branch', company.bank_branch ?? '');
            setBankDetails('bank_ifsc', company.bank_ifsc ?? '');
        }
    }, [company]);

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
                <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
                    Update Bank Details
                </TextTheme>

                <View style={{ gap: 24 }} >
                    <LabelTextInput
                        label="A/c Holder Name"
                        placeholder="e.g. John Doe"
                        value={bank_details.current.account_holder}
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => { setBankDetails('account_holder', val); }}
                        useTrim={true}
                        capitalize="characters"
                        isRequired={true}
                    />

                    <LabelTextInput
                        label="A/c Number"
                        placeholder="e.g. 123456789012"
                        icon={<FeatherIcon name="hash" size={16} />}
                        value={bank_details.current.account_number}
                        onChangeText={(val) => { setBankDetails('account_number', val); }}
                        useTrim={true}
                        capitalize="characters"
                        isRequired={true}
                    />

                    <LabelTextInput
                        label="Bank Name"
                        placeholder="e.g. State Bank of India"
                        value={bank_details.current.bank_name}
                        icon={<FeatherIcon name="credit-card" size={16} />}
                        onChangeText={(val) => { setBankDetails('bank_name', val); }}
                        useTrim={true}
                        capitalize="characters"
                        isRequired={true}
                    />

                    <LabelTextInput
                        label="IFSC Code"
                        placeholder="e.g. SBIN0001234"
                        icon={<FeatherIcon name="key" size={16} />}
                        value={bank_details.current.bank_ifsc}
                        onChangeText={(val) => { setBankDetails('bank_ifsc', val); }}
                        useTrim={true}
                        capitalize="characters"
                        isRequired={true}
                        infoMessage="Country of mailing address *( Required )"
                    />

                    <LabelTextInput
                        label="Branch Name"
                        placeholder="Main branch, Downtown"
                        value={bank_details.current.bank_branch}
                        icon={<FeatherIcon name="map-pin" size={16} />}
                        onChangeText={(val) => { setBankDetails('bank_branch', val); }}
                        useTrim={true}
                        capitalize="characters"
                        isRequired={true}
                    />
                </View>

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    );
}



export function TaxInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {

    const gstinNo = useRef<string>('');
    // const panNo = useRef<string>('');

    function handleUpdate() {
        console.log({ gstinNo });
    }

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
                <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
                    Update Tax Information
                </TextTheme>

                <View style={{ gap: 24 }} >
                    <LabelTextInput
                        label="GSTIN Number"
                        placeholder="24XXXXXXXXXX"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => { gstinNo.current = val; }}
                        useTrim={true}
                        isRequired={true}
                        infoMessage="15 digit GSTIN number"
                    />

                    {/* <LabelTextInput
                        label="Pan Number"
                        placeholder="AbC4242D"
                        icon={<FeatherIcon name="map-pin" size={16} />}
                        onChangeText={(val) => { panNo.current = val; }}
                        useTrim={true}
                        isRequired={true}
                        infoMessage="10 digit PAN number"
                    /> */}
                </View>

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <ShowWhen when={visible} >
                <LoadingModal visible={false} text="Updating Wait..." />
            </ShowWhen>
        </BottomModal>
    );
}

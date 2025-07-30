/* eslint-disable react-native/no-inline-styles */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import BottomModal from '../../../../Components/Modal/BottomModal';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { ScrollView, View } from 'react-native';
import LabelTextInput from '../../../../Components/Ui/TextInput/LabelTextInput';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import PhoneNoTextInput from '../../../../Components/Ui/Option/PhoneNoTextInput';
import { useAppDispatch, useCustomerStore, useUserStore } from '../../../../Store/ReduxStore';
import MaterialIcon from '../../../../Components/Icon/MaterialIcon';
import { getCustomer, updateCustomerDetails } from '../../../../Services/customer';
import navigator from '../../../../Navigation/NavigationService';
import { SelectField } from '../../../../Components/Ui/TextInput/SelectField';
import { CountrySelectorModal } from '../../../../Components/Modal/CountrySelectorModal';
import { StateSelectorModal } from '../../../../Components/Modal/StateSelectorModal';

type Props = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
}

export function CustomerInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {
    const { id } = navigator.getParams('customer-info-screen') ?? {};

    const { user } = useUserStore();
    const dispatch = useAppDispatch();
    const { customer } = useCustomerStore();
    const currentCompanyDetails = user?.company?.find((company: any) => company._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const [loading, setLoading] = useState<boolean>(false);

    const ledger_details = useRef({
        ledger_name: '',
        gstin: '',
        email: '',
        phone: { code: '', number: '' },
    });

    const setLedgerDetails = (key: string, value: any) => {
        ledger_details.current = {
            ...ledger_details.current,
            [key]: value,
        };
    };

    function handleUpdate() {
        setLoading(true);
        console.log({ ledger_details });
        dispatch(updateCustomerDetails({ ledger_details: ledger_details.current, id: id ?? '' })).then(() => {
            dispatch(getCustomer(id ?? ''));
            setLoading(false);
            setVisible(false);
        }).catch((error) => {
            dispatch(getCustomer(id ?? ''));
            console.log('Error while updating the customer details', error);
            setLoading(false);
        }).finally(() => {
            dispatch(getCustomer(id ?? ''));
            setVisible(false);
            setLoading(false);
        });
    }

    useEffect(() => {
        if (customer) {
            setLedgerDetails('ledger_name', customer.ledger_name ?? '');
            setLedgerDetails('gstin', customer.gstin ?? '');
            setLedgerDetails('email', customer.email ?? '');
            setLedgerDetails('phone', customer.phone ?? '');
        }
    }, [customer]);

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
                <TextTheme fontSize={16} fontWeight={800} style={{ marginBottom: 32 }}>
                    Update Customer Information
                </TextTheme>

                <View style={{ gap: 24 }} >
                    {gst_enable && <LabelTextInput
                        label="GSTIN Number"
                        placeholder="24XXXXXXXXXX"
                        icon={<MaterialIcon name="account-balance" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('gstin', val); }}
                        value={ledger_details.current.gstin}
                        useTrim={true}
                        isRequired={true}
                        infoMessage="15 digit GSTIN number"
                        capitalize="characters"
                    />}
                    <LabelTextInput
                        label="Billing Name"
                        placeholder="Enter billing name"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('ledger_name', val); }}
                        value={ledger_details.current.ledger_name}
                        useTrim={true}
                        isRequired={true}
                        infoMessage="Legal name of customer *( used for billing and invoicing )"
                        capitalize="words"
                    />

                    <LabelTextInput
                        label="Email"
                        placeholder="jhon@gmail.com"
                        icon={<FeatherIcon name="mail" size={16} />}
                        autoCapitalize="none"
                        useTrim={true}
                        keyboardType='email-address'
                        value={ledger_details.current.email}
                        onChangeText={(val) => { setLedgerDetails('email', val); }}
                        infoMessage="Email address for correspondence"
                    />

                    <PhoneNoTextInput
                        phoneNumber={ledger_details.current.phone}
                        onChangePhoneNumber={(val) => { setLedgerDetails('phone', val); }}
                    />
                </View>

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <LoadingModal visible={loading} />
        </BottomModal>
    );
}



export function AddressInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {
    const { id } = navigator.getParams('customer-info-screen') ?? {};
    const { customer } = useCustomerStore();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [isCountryModalVisible, setCountryModalVisible] = useState<boolean>(false);
    const [isStateModalVisible, setStateModalVisible] = useState<boolean>(false);

    const ledger_details = useRef({
        mailing_name: '',
        mailing_address: '',
        mailing_state: '',
        mailing_country: '',
        mailing_pincode: '',
    });

    const setLedgerDetails = (key: string, value: any) => {
        ledger_details.current = {
            ...ledger_details.current,
            [key]: value,
        };
    };

    function handleUpdate() {
        setLoading(true);
        console.log({ ledger_details });
        dispatch(updateCustomerDetails({ ledger_details: ledger_details.current, id: id ?? '' })).then(() => {
            dispatch(getCustomer(id ?? ''));
            setLoading(false);
            setVisible(false);
        }).catch((error) => {
            dispatch(getCustomer(id ?? ''));
            console.log('Error while updating the customer details', error);
            setLoading(false);
        }).finally(() => {
            dispatch(getCustomer(id ?? ''));
            setVisible(false);
            setLoading(false);
        });
    }

    useEffect(() => {
        if (customer) {
            setLedgerDetails('mailing_name', customer.mailing_name ?? '');
            setLedgerDetails('mailing_address', customer.mailing_address ?? '');
            setLedgerDetails('mailing_state', customer.mailing_state ?? '');
            setLedgerDetails('mailing_country', customer.mailing_country ?? '');
            setLedgerDetails('mailing_pincode', customer.mailing_pincode ?? '');
        }
    }, [customer]);

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
                <TextTheme fontSize={16} fontWeight={800} style={{ marginBottom: 32 }}>
                    Update Address Information
                </TextTheme>

                <View style={{ gap: 24 }} >
                    <LabelTextInput
                        label="Contact Person Name"
                        placeholder="Enter contact person name"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('mailing_name', val); }}
                        value={ledger_details.current.mailing_name}
                        useTrim={true}
                        isRequired={true}
                        capitalize="words"
                    />

                    <LabelTextInput
                        label="Contact Address"
                        placeholder="123 Main St, Apt 2B"
                        icon={<FeatherIcon name="map-pin" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('mailing_address', val); }}
                        value={ledger_details.current.mailing_address}
                        useTrim={true}
                        infoMessage="Street address for correspondence"
                        capitalize="words"
                    />

                    <SelectField
                        icon={<FeatherIcon name="globe" size={16} />}
                        placeholder="Select Country *"
                        value={ledger_details.current.mailing_country}
                        onPress={() => setCountryModalVisible(true)}
                        containerStyle={{ flex: 1 }}
                    />

                    <View style={{ flexDirection: 'row', gap: 12, width: '100%', alignItems: 'center' }} >
                        <SelectField
                            icon={<FeatherIcon name="globe" size={16} />}
                            placeholder="Select State *"
                            value={ledger_details.current.mailing_state}
                            onPress={() => setStateModalVisible(true)}
                            containerStyle={{ flex: 1 }}
                        />

                        <LabelTextInput
                            label="Postal Code"
                            placeholder="XXX-XXX"
                            icon={<FeatherIcon name="hash" size={16} />}
                            containerStyle={{ width: 150 }}
                            keyboardType="number-pad"
                            useTrim={true}
                            onChangeText={(val) => { setLedgerDetails('mailing_pincode', val); }}
                            value={ledger_details.current.mailing_pincode}
                        />
                    </View>
                </View>

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <LoadingModal visible={loading} />
            <CountrySelectorModal visible={isCountryModalVisible} country={ledger_details.current.mailing_country} setCountry={setLedgerDetails} setVisible={setCountryModalVisible} />
            <StateSelectorModal visible={isStateModalVisible} country={ledger_details.current.mailing_country} state={ledger_details.current.mailing_country} setState={setLedgerDetails} setVisible={setStateModalVisible} />
        </BottomModal>
    );
}


export function BankInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {
    const { id } = navigator.getParams('customer-info-screen') ?? {};
    const { customer } = useCustomerStore();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const ledger_details = useRef({
        account_holder: '',
        account_number: '',
        bank_name: '',
        bank_branch: '',
        bank_ifsc: '',
    });

    const setLedgerDetails = (key: string, value: any) => {
        ledger_details.current = {
            ...ledger_details.current,
            [key]: value,
        };
    };

    function handleUpdate() {
        setLoading(true);
        console.log({ ledger_details });
        dispatch(updateCustomerDetails({ ledger_details: ledger_details.current, id: id ?? '' })).then(() => {
            dispatch(getCustomer(id ?? ''));
            setLoading(false);
            setVisible(false);
        }).catch((error) => {
            dispatch(getCustomer(id ?? ''));
            console.log('Error while updating the customer details', error);
            setLoading(false);
        }).finally(() => {
            dispatch(getCustomer(id ?? ''));
            setVisible(false);
            setLoading(false);
        });
    }

    useEffect(() => {
        if (customer) {
            setLedgerDetails('account_holder', customer.account_holder ?? '');
            setLedgerDetails('account_number', customer.account_number ?? '');
            setLedgerDetails('bank_name', customer.bank_name ?? '');
            setLedgerDetails('bank_branch', customer.bank_branch ?? '');
            setLedgerDetails('bank_ifsc', customer.bank_ifsc ?? '');
        }
    }, [customer]);

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
                <TextTheme fontSize={16} fontWeight={800} style={{ marginBottom: 32 }}>
                    Update Bank Details
                </TextTheme>

                <View style={{ gap: 24 }} >
                    <LabelTextInput
                        label="A/c Holder Name"
                        placeholder="Enter account holder name"
                        icon={<FeatherIcon name="user" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('account_holder', val); }}
                        value={ledger_details.current.account_holder}
                        useTrim={true}
                        capitalize="characters"
                    />

                    <LabelTextInput
                        label="A/c Number"
                        placeholder="Enter account number"
                        icon={<FeatherIcon name="hash" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('account_number', val); }}
                        value={ledger_details.current.account_number}
                        useTrim={true}
                        capitalize="characters"
                    />

                    <LabelTextInput
                        label="Bank Name"
                        placeholder="Enter bank name"
                        icon={<FeatherIcon name="credit-card" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('bank_name', val); }}
                        value={ledger_details.current.bank_name}
                        useTrim={true}
                        capitalize="characters"
                    />

                    <LabelTextInput
                        label="IFSC Code"
                        placeholder="e.g. SBIN0001234"
                        icon={<FeatherIcon name="key" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('bank_ifsc', val); }}
                        value={ledger_details.current.bank_ifsc}
                        useTrim={true}
                        capitalize="characters"
                        infoMessage="11 character IFSC code of bank branch"
                    />

                    <LabelTextInput
                        label="Branch Name"
                        placeholder="Main branch, Downtown"
                        icon={<FeatherIcon name="map-pin" size={16} />}
                        onChangeText={(val) => { setLedgerDetails('bank_branch', val); }}
                        value={ledger_details.current.bank_branch}
                        useTrim={true}
                        capitalize="words"
                    />
                </View>

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <LoadingModal visible={loading} />
        </BottomModal>
    );
}



// export function TaxInfoUpdateModal({ visible, setVisible }: Props): React.JSX.Element {

//     const gstinNo = useRef<string>('');
//     const panNo = useRef<string>('');

//     function handleUpdate() {
//         console.log({ gstinNo, panNo });
//     }

//     return (
//         <BottomModal
//             visible={visible} setVisible={setVisible}
//             style={{ paddingHorizontal: 20 }}
//             actionButtons={[{
//                 title: 'Update', onPress: handleUpdate,
//                 icon: <FeatherIcon name="save" size={20} />,
//             }]}
//         >
//             <ScrollView showsVerticalScrollIndicator={false} >
//                 <TextTheme style={{ fontSize: 16, fontWeight: 800, marginBottom: 32 }}>
//                     Update Tax Information
//                 </TextTheme>

//                 <View style={{ gap: 24 }} >
//                     <LabelTextInput
//                         label="GSTIN Number"
//                         placeholder="24XXXXXXXXXX"
//                         icon={<FeatherIcon name="user" size={16} />}
//                         onChangeText={(val) => { gstinNo.current = val; }}
//                         useTrim={true}
//                         isRequired={true}
//                         infoMessage="15 digit GSTIN number"
//                     />

//                     <LabelTextInput
//                         label="Pan Number"
//                         placeholder="AbC4242D"
//                         icon={<FeatherIcon name="map-pin" size={16} />}
//                         onChangeText={(val) => { panNo.current = val; }}
//                         useTrim={true}
//                         isRequired={true}
//                         infoMessage="10 digit PAN number"
//                     />
//                 </View>

//                 <View style={{ minHeight: 40 }} />
//             </ScrollView>

//             <ShowWhen when={visible} >
//                 <LoadingModal visible={false} text="Updating Wait..." />
//             </ShowWhen>
//         </BottomModal>
//     );
// }

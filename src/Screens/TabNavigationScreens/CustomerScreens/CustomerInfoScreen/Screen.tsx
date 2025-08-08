/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import navigator from '../../../../Navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import SectionView, { SectionRow, SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import EditButton from '../../../../Components/Ui/Button/EditButton';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { useCallback, useState } from 'react';
import StackNavigationHeader from '../../../../Components/Layouts/Header/StackNavigationHeader';
import DeleteModal from '../../../../Components/Modal/DeleteModal';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import LoadingView from '../../../../Components/Layouts/View/LoadingView';
import { AddressInfoUpdateModal, BankInfoUpdateModal, CustomerInfoUpdateModal } from './Modals';
import { useAppDispatch, useCustomerStore } from '../../../../Store/ReduxStore';
import { getCustomer } from '../../../../Services/customer';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { useFocusEffect } from '@react-navigation/native';

export default function CustomerInfoScreen(): React.JSX.Element {

    const { id } = navigator.getParams('customer-info-screen') ?? {};

    const dispatch = useAppDispatch();
    const { customer, loading } = useCustomerStore();


    const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [isInfoUpdateModalVisible, setInfoUpdateModalVisible] = useState<boolean>(false);
    const [isAddressInfoUpdateModalVisible, setAddressInfoUpdateModalVisible] = useState<boolean>(false);
    const [isBankInfoUpdateModalVisible, setBankInfoUpdateModalVisible] = useState<boolean>(false);
    // const [isTaxInfoUpdateModalVisible, setTaxInfoUpdateModalVisible] = useState<boolean>(false);

    async function handleDelete() {
        setDeleteModalVisible(false);
        navigator.goBack();
    }


    useFocusEffect(
        useCallback(() => {
            if(id)
                dispatch(getCustomer(id ?? ''));
        }, [id])
    );

    if(!id) return <></>

    return (
        <View style={{ width: '100%', height: '100%' }} >
            <StackNavigationHeader title="Customer Information" />

            <ScrollView
                style={{ paddingInline: 20, width: '100%', paddingTop: 16 }}
                contentContainerStyle={{ gap: 32, paddingBottom: 80 }}
            >

                <View style={{ gap: 16 }} >
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                        <FeatherIcon name="user" size={32} />
                        <View>
                            <ShowWhen when={true}
                                otherwise={<>
                                    <LoadingView width={100} height={12} style={{ marginBottom: 4 }} />
                                    <LoadingView width={80} height={8} />
                                </>}
                            >
                                <TextTheme fontWeight={900} fontSize={16}>
                                    {customer?.ledger_name}
                                </TextTheme>
                                <TextTheme isPrimary={false} fontWeight={500} fontSize={12}>
                                    {customer?.parent}
                                </TextTheme>
                            </ShowWhen>
                        </View>
                    </View>
                </View>

                <SectionView
                    style={{ gap: 8 }} label="Customer Information"
                    labelContainerChildren={
                        <EditButton onPress={() => { setInfoUpdateModalVisible(true); }} />
                    }
                >
                    <InfoRow label="GSTIN Number" value={customer?.gstin || 'Not Set'} />
                    <InfoRow label="Billing Name" value={customer?.ledger_name || 'Not Set'} />
                    <InfoRow label="Email" value={customer?.email || 'Not Set'} />
                    <InfoRow label="Contact" value={(customer?.phone?.code && customer?.phone?.number) ? `${customer?.phone?.code} ${customer?.phone?.number}` : 'Not Set'} />
                </SectionView>

                <SectionView
                    label="Address Information"
                    style={{ gap: 8 }}
                    labelContainerChildren={
                        <EditButton onPress={() => { setAddressInfoUpdateModalVisible(true); }} />
                    }
                >
                    <InfoRow label="Contact Person Name" value={customer?.mailing_name || 'Not Set'} />
                    <InfoRow label="Contact Address" value={customer?.mailing_address || 'Not Set'} />
                    <InfoRow label="State" value={customer?.mailing_state || 'Not Set'} />
                    <InfoRow label="Country" value={customer?.mailing_country || 'Not Set'} />
                    <InfoRow label="Postal Code" value={customer?.mailing_pincode || 'Not Set'} />
                </SectionView>

                <SectionView
                    label="Bank Details"
                    style={{ gap: 8 }}
                    labelContainerChildren={
                        <EditButton onPress={() => { setBankInfoUpdateModalVisible(true); }} />
                    }
                >
                    <InfoRow label="Account Holder Name" value={customer?.account_holder || 'Not Set'} />
                    <InfoRow label="Account Number" value={customer?.account_number || 'Not Set'} />
                    <InfoRow label="Bank Name" value={customer?.bank_name || 'Not Set'} />
                    <InfoRow label="IFSC Code" value={customer?.bank_ifsc || 'Not Set'} />
                    <InfoRow label="Branch Name" value={customer?.bank_branch || 'Not Set'} />
                </SectionView>


                <SectionView label="Danger Zone" style={{ gap: 12 }} labelColor="red" >
                    <SectionRowWithIcon
                        color="white"
                        backgroundColor="rgb(255,80,100)"
                        label="Delete Product"
                        icon={<FeatherIcon name={'alert-triangle'} size={20} color="red" />}
                        text={'Once delete then on way to go back'}
                        onPress={() => setDeleteModalVisible(true)}
                    />
                </SectionView>
            </ScrollView>

            <DeleteModal
                visible={isDeleteModalVisible}
                setVisible={setDeleteModalVisible}
                handleDelete={handleDelete}
                passkey={'Customer Name'}
                message="Once you delete the customer then no way to go back."
            />

            <CustomerInfoUpdateModal
                visible={isInfoUpdateModalVisible} setVisible={setInfoUpdateModalVisible}
            />

            <AddressInfoUpdateModal
                visible={isAddressInfoUpdateModalVisible} setVisible={setAddressInfoUpdateModalVisible}
            />

            <BankInfoUpdateModal
                visible={isBankInfoUpdateModalVisible} setVisible={setBankInfoUpdateModalVisible}
            />

            {/* <TaxInfoUpdateModal
                visible={isTaxInfoUpdateModalVisible} setVisible={setTaxInfoUpdateModalVisible}
            /> */}

            <LoadingModal visible={loading && isDeleteModalVisible} />
        </View>
    );
}


const InfoRow: React.FC<{ label: string, value: string | number }> = ({ label, value }) => {

    const alignInRow = (typeof value === 'number' ? value.toString() : value).length < 25;

    return (
        <SectionRow style={alignInRow ? {justifyContent: 'space-between'} : {flexDirection: 'column', alignItems: 'flex-start'}} >
            <TextTheme fontSize={16} fontWeight={900} >{label}</TextTheme>
            <TextTheme isPrimary={false} fontSize={alignInRow ? 16 : 12} fontWeight={900} >
                {value}
            </TextTheme>
        </SectionRow>
    );
};

/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import navigator from '../../../../Navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import SectionView, { SectionRow, SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import EditButton from '../../../../Components/Ui/Button/EditButton';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import { useCallback, useEffect, useState } from 'react';
import StackNavigationHeader from '../../../../Components/Layouts/Header/StackNavigationHeader';
import DeleteModal from '../../../../Components/Modal/DeleteModal';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import LoadingView from '../../../../Components/Layouts/View/LoadingView';
import { AddressInfoUpdateModal, BankInfoUpdateModal, CustomerInfoUpdateModal } from './Modals';
import { useAppDispatch, useCustomerStore, useUserStore } from '../../../../Store/ReduxStore';
import { getCustomer } from '../../../../Services/customer';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { useFocusEffect } from '@react-navigation/native';

export default function CustomerInfoScreen(): React.JSX.Element {

    const { customerId } = navigator.getParams('customer-info-screen') ?? {};

    const dispatch = useAppDispatch();
    const { customer, loading } = useCustomerStore();
    // const { user } = useUserStore();
    // const currentCompanyDetails = user?.company?.find((company: any) => company._id === user?.user_settings?.current_company_id);
    // const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    

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
            if(customerId)
                dispatch(getCustomer(customerId ?? ''));
        }, [])
    );

    if(!customerId) return <></>

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
                                <TextTheme style={{ fontWeight: 900, fontSize: 16 }}>
                                    {customer?.ledger_name}
                                </TextTheme>
                                <TextTheme isPrimary={false} style={{ fontWeight: 500, fontSize: 12 }}>
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
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >GSTIN Number</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.gstin || 'Not Set'}
                        </TextTheme>
                    </SectionRow>
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Billing Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.ledger_name}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Email</TextTheme>

                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.email || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >contact</TextTheme>

                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {(customer?.phone?.code && customer?.phone?.number) ? `${customer?.phone?.code} ${customer?.phone?.number}` : 'Not Set'}
                        </TextTheme>
                    </SectionRow>
                </SectionView>

                <SectionView
                    label="Address Information"
                    style={{ gap: 8 }}
                    labelContainerChildren={
                        <EditButton onPress={() => { setAddressInfoUpdateModalVisible(true); }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Contact Person Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.mailing_name || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Contact Address</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.mailing_address || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >State</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.mailing_state || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Country</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.mailing_country || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Postal Code</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.mailing_pincode || 'Not Set'}
                        </TextTheme>
                    </SectionRow>
                </SectionView>

                <SectionView
                    label="Bank Details"
                    style={{ gap: 8 }}
                    labelContainerChildren={
                        <EditButton onPress={() => { setBankInfoUpdateModalVisible(true); }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Account Holder Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.account_holder || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Account Number</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.account_number || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Bank Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.bank_name || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >IFSC Code</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.bank_ifsc || 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Branch Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.bank_branch || 'Not Set'}
                        </TextTheme>
                    </SectionRow>
                </SectionView>

                {/* {!gst_enable && <SectionView
                    style={{ gap: 8 }} label="Tax Information"
                    labelContainerChildren={
                        <EditButton onPress={() => { setTaxInfoUpdateModalVisible(true); }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >GSTIN Number</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {customer?.gstin || 'Not Set'}
                        </TextTheme>
                    </SectionRow>
                </SectionView>} */}

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
                message="Once you delete the product then no way to go back."
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

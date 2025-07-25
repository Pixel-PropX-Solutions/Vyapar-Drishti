/* eslint-disable react-native/no-inline-styles */
import { ScrollView } from 'react-native-gesture-handler';
import TextTheme from '../../Components/Ui/Text/TextTheme';
import StackNavigationHeader from '../../Components/Layouts/Header/StackNavigationHeader';
import { Text, View } from 'react-native';
import SectionView, { SectionRow } from '../../Components/Layouts/View/SectionView';
import FeatherIcon from '../../Components/Icon/FeatherIcon';
import LogoImage from '../../Components/Image/LogoImage';
import NormalButton from '../../Components/Ui/Button/NormalButton';
import { useCompanyStore, useUserStore } from '../../Store/ReduxStore';
import DeleteModal from '../../Components/Modal/DeleteModal';
import { useState } from 'react';
import { BankInfoUpdateModal, CompanyAddressUpdateModal, CompanyContactUpdateModal, CompanyInfoUpdateModal, TaxInfoUpdateModal } from './Modals';
import sliceString from '../../Utils/sliceString';
import EditButton from '../../Components/Ui/Button/EditButton';

export default function CompanyScreen(): React.JSX.Element {

    const { company } = useCompanyStore();
    const { user } = useUserStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;

    const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [isInfoUpdateModalVisible, setInfoUdpateModalVisible] = useState<boolean>(false);
    const [isContactUpdateModalVisible, setContactUdpateModalVisible] = useState<boolean>(false);
    const [isAddressUpdateModalVisible, setAddressUdpateModalVisible] = useState<boolean>(false);
    const [isBackInfoModalVisible, setBankInfoModalVisible] = useState<boolean>(false);
    const [isTaxInfoModalVisible, setTaxInfoModalVisible] = useState<boolean>(false);

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StackNavigationHeader title="Profile" />

            <ScrollView style={{ paddingHorizontal: 20, width: '100%', height: '100%' }} contentContainerStyle={{ gap: 28 }} scrollEnabled={true}>

                <View style={{ alignItems: 'center', padding: 16, width: '100%' }}>
                    <LogoImage size={100} borderRadius={100} imageSrc={company?.image} />
                    <TextTheme style={{ fontSize: 22, fontWeight: 'bold' }} >{company?.name}</TextTheme>
                    <TextTheme isPrimary={false} style={{ fontSize: 16 }} >{company?.email}</TextTheme>
                    {gst_enable && <TextTheme isPrimary={false} style={{ fontSize: 12 }} >GST {company?.gstin}</TextTheme>}
                </View>

                <SectionView
                    style={{ gap: 8 }} label="Company Info"
                    labelContainerChildren={
                        <EditButton onPress={() => { setInfoUdpateModalVisible(true); }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Name</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                                {company?.name}
                            </TextTheme>
                        </View>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Website</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                                {sliceString(company?.website, 35) ?? 'Not Set'}
                            </TextTheme>
                        </View>
                    </SectionRow>
                </SectionView>

                <SectionView
                    label="Contact" style={{ gap: 8 }}
                    labelContainerChildren={
                        <EditButton onPress={() => { setContactUdpateModalVisible(true); }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Email</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                                {sliceString(company?.email, 25) ?? 'Not Set'}
                            </TextTheme>
                            <FeatherIcon isPrimary={false} name="mail" size={16} />
                        </View>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Phone</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                                {company?.phone?.code} {company?.phone?.number ?? 'Not Set'}
                            </TextTheme>
                            <FeatherIcon isPrimary={false} name="phone" size={16} />
                        </View>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Mailing Name</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                                {sliceString(company?.mailing_name, 25) ?? 'Not Set'}
                            </TextTheme>
                        </View>
                    </SectionRow>
                </SectionView>

                <SectionView
                    label="Address" style={{ gap: 8 }}
                    labelContainerChildren={
                        <EditButton onPress={() => { setAddressUdpateModalVisible(true); }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Country</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >{company?.country ?? 'Not Set'}</TextTheme>
                            <FeatherIcon isPrimary={false} name="map" size={16} />
                        </View>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >State</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >{company?.state ?? 'Not Set'}</TextTheme>
                        </View>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Street, City</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                                {sliceString(company?.address_1, 24) ?? 'Not Set'}
                            </TextTheme>
                            <FeatherIcon isPrimary={false} name="home" size={16} />
                        </View>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Pin Code</TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} >
                            <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                                {company?.pinCode ?? 'Not Set'}
                            </TextTheme>
                            <FeatherIcon isPrimary={false} name="map-pin" size={16} />
                        </View>
                    </SectionRow>
                </SectionView>

                <SectionView
                    style={{ gap: 8 }} label="Tax Information"
                    labelContainerChildren={
                        <EditButton onPress={() => { setTaxInfoModalVisible(true); }} />
                    }
                >
                    {gst_enable && <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >GSTIN Number</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {company?.gstin}
                        </TextTheme>
                    </SectionRow>}
                </SectionView>

                <SectionView
                    label="Bank Details"
                    style={{ gap: 8 }}
                    labelContainerChildren={
                        <EditButton onPress={() => { setBankInfoModalVisible(true); }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Account Holder Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Account Number</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Bank Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >IFSC Code</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Branch Name</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {'Not Set'}
                        </TextTheme>
                    </SectionRow>
                </SectionView>

                <SectionView label="Danger Zone" labelColor="rgb(250,0,0)" >
                    <NormalButton
                        icon={<FeatherIcon name="alert-circle" size={16} color="white" />}
                        backgroundColor="rgb(250,50,80)"
                        color="white"
                        text="Remove Company"
                        textStyle={{ fontWeight: 900 }}
                        onPress={() => setDeleteModalVisible(true)}
                    />
                </SectionView>

                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <DeleteModal
                visible={isDeleteModalVisible}
                setVisible={setDeleteModalVisible}
                passkey={company?.name ?? 'delete'}
                message="Once you press delete there no way to go back"
                handleDelete={() => { }}
            />

            <CompanyInfoUpdateModal
                visible={isInfoUpdateModalVisible} setVisible={setInfoUdpateModalVisible}
            />

            <CompanyContactUpdateModal
                visible={isContactUpdateModalVisible} setVisible={setContactUdpateModalVisible}
            />

            <CompanyAddressUpdateModal
                visible={isAddressUpdateModalVisible} setVisible={setAddressUdpateModalVisible}
            />

            <BankInfoUpdateModal
                visible={isBackInfoModalVisible} setVisible={setBankInfoModalVisible}
            />

            <TaxInfoUpdateModal
                visible={isTaxInfoModalVisible} setVisible={setTaxInfoModalVisible}
            />
        </View>
    );
}

/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import FeatherIcon from '../../../../Components/Icon/FeatherIcon';
import ShowWhen from '../../../../Components/Other/ShowWhen';
import LoadingView from '../../../../Components/Layouts/View/LoadingView';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import { useAppStorage } from '../../../../Contexts/AppStorageProvider';
import { formatNumberForUI } from '../../../../Utils/functionTools';
import { useProductStore } from '../../../../Store/ReduxStore';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import NormalButton from '../../../../Components/Ui/Button/NormalButton';
import SectionView, { SectionRow, SectionRowWithIcon } from '../../../../Components/Layouts/View/SectionView';
import EditButton from '../../../../Components/Ui/Button/EditButton';
import DeleteModal from '../../../../Components/Modal/DeleteModal';
import { useState } from 'react';
import navigator from '../../../../Navigation/NavigationService';
import { ClassInfoUpdateModal, InfoUpdateModal } from './Modals';

export function HeroSection(): React.JSX.Element {

    const { currency } = useAppStorage();
    const { item, product, loading } = useProductStore();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ gap: 16 }} >
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} >
                    <FeatherIcon name="package" size={32} />
                    <View>
                        <ShowWhen when={!loading}
                            otherwise={<>
                                <LoadingView width={100} height={16} style={{ marginBottom: 4 }} />
                                <LoadingView width={80} height={8} />
                            </>}
                        >
                            <TextTheme style={{ fontWeight: 900, fontSize: 16 }}>
                                {product?.stock_item_name}
                            </TextTheme>
                            <TextTheme isPrimary={false} style={{ fontWeight: 500, fontSize: 12 }}>
                                {product?.gst_hsn_code}
                            </TextTheme>
                        </ShowWhen>
                    </View>
                </View>

                <View >
                    <ShowWhen when={!loading}
                        otherwise={<>
                            <LoadingView width={100} height={20} style={{ marginBottom: 4 }} />
                            <LoadingView width={80} height={12} />
                        </>}
                    >
                        <TextTheme style={{ fontWeight: 900, fontSize: 20 }}>
                            {currency} {formatNumberForUI(((item?.purchase_value ?? 0) - (item?.sales_value ?? 0)), 10)}
                        </TextTheme>
                        <TextTheme isPrimary={false} style={{ fontWeight: 900, fontSize: 12 }}>In Stock Value</TextTheme>
                    </ShowWhen>
                </View>
            </View>

            <View style={{ gap: 12 }} >
                <View style={{ alignItems: 'flex-end' }} >
                    <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >
                        {loading ? '0.00' : formatNumberForUI((item?.sales_value ?? 0) / (item?.sales_qty || 1))}
                        {' ' + currency}
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{ fontSize: 10, fontWeight: 900 }} >Avg. Sale Price</TextTheme>
                </View>

                <View style={{ alignItems: 'flex-end' }} >
                    <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >
                        {loading ? '0.00' : formatNumberForUI((item?.purchase_value ?? 0) / (item?.purchase_qty || 1))}
                        {' ' + currency}
                    </TextTheme>
                    <TextTheme isPrimary={false} style={{ fontSize: 10, fontWeight: 900 }} >Avg. Purchase Price</TextTheme>
                </View>
            </View>
        </View>
    );
}



export function SalePurchaseCards() {

    const { currency } = useAppStorage();
    const { item, loading } = useProductStore();

    return (
        <View style={{ flexDirection: 'row', gap: 24 }} >
            <BackgroundThemeView isPrimary={false} style={{ flex: 1, padding: 12, borderRadius: 12, gap: 4, paddingTop: 20 }} >
                <View style={{ paddingHorizontal: 6 }} >
                    <TextTheme style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }} >PURCHASES</TextTheme>

                    <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }} >
                        {currency} {loading ? '0.00' : formatNumberForUI(item?.purchase_value ?? 0, 8)}
                    </TextTheme>

                    <View style={{ marginTop: 12 }} >
                        <View style={{ flexDirection: 'row', gap: 4 }} >
                            <FeatherIcon name="trending-up" size={16} />
                            <TextTheme style={{ fontSize: 16, fontWeight: 800 }}>
                                {formatNumberForUI(item?.purchase_qty ?? 0, 8, 0)}
                            </TextTheme>
                        </View>
                        <TextTheme isPrimary={false} style={{ fontSize: 12 }} >Purchase Invoice</TextTheme>
                    </View>
                </View>

                <NormalButton text="Add Purchase" />
            </BackgroundThemeView>

            <BackgroundThemeView isPrimary={false} style={{ flex: 1, padding: 12, borderRadius: 12, gap: 4, paddingTop: 20 }} >
                <View style={{ paddingHorizontal: 6 }} >
                    <TextTheme style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }} >SELLS</TextTheme>

                    <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }} >
                        {currency} {loading ? '0.00' : formatNumberForUI(item?.sales_value ?? 0, 8)}
                    </TextTheme>

                    <View style={{ marginTop: 12 }} >
                        <View style={{ flexDirection: 'row', gap: 4 }} >
                            <FeatherIcon name="trending-up" size={16} />
                            <TextTheme style={{ fontSize: 16, fontWeight: 800 }}>
                                {formatNumberForUI(item?.sales_qty ?? 0, 8, 0)}
                            </TextTheme>
                        </View>
                        <TextTheme isPrimary={false} style={{ fontSize: 12 }} >Sell Invoice</TextTheme>
                    </View>
                </View>

                <NormalButton text="Add Sell" />
            </BackgroundThemeView>
        </View>
    );
}



export function InfoSection() {

    const { loading, product } = useProductStore();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <SectionView
            style={{ gap: 8 }} label="Product Information"
            labelContainerChildren={
                <EditButton onPress={() => { setModalVisible(true); }} />
            }
        >
            <SectionRow style={{ justifyContent: 'space-between' }} >
                <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Name</TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                    {loading ? 'fetching...' : product?.stock_item_name}
                </TextTheme>
            </SectionRow>

            {/* <SectionRow style={{ justifyContent: 'space-between' }} >
                <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >HSN Code</TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                    {loading ? 'fetching..' : product?.gst_hsn_code ?? 'Not Set'}
                </TextTheme>
            </SectionRow> */}

            <SectionRow style={{ justifyContent: 'space-between' }} >
                <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Low Stock Alert</TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                    {loading ? 'fetching...' : product?.low_stock_alert ?? 0} {product?.unit ?? 'Unit'}
                </TextTheme>
            </SectionRow>

            <SectionRow style={{ justifyContent: 'space-between' }} >
                <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Unit of Mesurement</TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                    {loading ? 'fetching..' : product?.unit ?? 'Not Set'}
                </TextTheme>
            </SectionRow>

            <SectionRow label="Discription" isLabelPrimary={true} gap={4} style={{ justifyContent: 'space-between' }} >
                <TextTheme isPrimary={false} style={{ fontSize: 12, fontWeight: 900 }} >
                    {loading ? 'fetching..' : product?.description ?? 'Not Set'}
                </TextTheme>
            </SectionRow>

            <InfoUpdateModal visible={isModalVisible} setVisible={setModalVisible} />
        </SectionView>
    );
}



export function ClassificationSection() {

    // const { loading, product } = useProductStore();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    return (
        <SectionView
            label="Organization & Classification"
            style={{ gap: 8 }}
        // labelContainerChildren={
        //     <EditButton onPress={() => { setModalVisible(true); }} />
        // }
        >
            <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Organization & Classification feature to included in future updates</TextTheme>
            {/* <SectionRow style={{ justifyContent: 'space-between' }} >
                <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Product Category</TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                    {loading ? 'fetching..' : product?.category ?? 'Not Set'}
                </TextTheme>
            </SectionRow>

            <SectionRow style={{ justifyContent: 'space-between' }} >
                <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Product Group</TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                    {loading ? 'fetching..' : product?.group ?? 'Not Set'}
                </TextTheme>
            </SectionRow> */}

            <ClassInfoUpdateModal visible={isModalVisible} setVisible={setModalVisible} />
        </SectionView>
    );
}



export function DangerSection() {

    const { product } = useProductStore();

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    async function handleDelete() {

        // write logic to delete product

        setModalVisible(false);
        navigator.goBack();
    }

    return (
        <SectionView label="Danger Zone" style={{ gap: 12 }} labelColor="red" >
            <SectionRowWithIcon
                color="white"
                backgroundColor="rgb(255,80,100)"
                label="Delete Product"
                icon={<FeatherIcon name={'alert-triangle'} size={20} color="red" />}
                text={'Once delete then on way to go back'}
                onPress={() => { setModalVisible(true); }}
            />

            <DeleteModal
                visible={isModalVisible} setVisible={setModalVisible}
                handleDelete={handleDelete}
                passkey={product?.gst_hsn_code ?? 'delete'}
                message="Once you delete the product then no way to go back."
            />
        </SectionView>
    );
}

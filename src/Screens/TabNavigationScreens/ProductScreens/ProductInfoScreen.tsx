/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import navigator from '../../../Navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import SectionView, { SectionRow, SectionRowWithIcon } from '../../../Components/View/SectionView';
import TextTheme from '../../../Components/Text/TextTheme';
import EditButton from '../../../Components/Button/EditButton';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import BackgroundThemeView from '../../../Components/View/BackgroundThemeView';
import NormalButton from '../../../Components/Button/NormalButton';
import { useAppDispatch, useCompanyStore, useProductStore } from '../../../Store/ReduxStore';
import { useEffect, useState } from 'react';
import { deleteProduct, getProduct, viewAllProducts, viewProduct } from '../../../Services/product';
import StackNavigationHeader from '../../../Components/Header/StackNavigationHeader';
import DeleteModal from '../../../Components/Modal/DeleteModal';
import ShowWhen from '../../../Components/Other/ShowWhen';
import LoadingView from '../../../Components/View/LoadingView';
import LoadingModal from '../../../Components/Modal/LoadingModal';
import { useAppStorage } from '../../../Contexts/AppStorageProvider';

export default function ProductInfoScreen(): React.JSX.Element {

    const {productId} = navigator.getParams('product-info-screen') ?? {};
    if(!productId) {return <></>;}

    const {currency} = useAppStorage();
    const {company} = useCompanyStore();
    const {item, product, loading} = useProductStore();
    const dispatch = useAppDispatch();

    const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getProduct({company_id: company?._id ?? '', product_id: productId}));
        dispatch(viewProduct({company_id: company?._id ?? '', product_id: productId}));
    }, [productId]);

    async function handleDelete(){
        // await dispatch(deleteProduct({company_id: company?._id ?? '', id: productId ?? ''}));
        // dispatch(viewAllProducts({company_id: company?._id ?? '', pageNumber: 1}));
        setDeleteModalVisible(false);
        navigator.goBack();
    }

    return (
        <View style={{width: '100%', height: '100%'}} >
            <StackNavigationHeader title="Product Details" />

            <ScrollView
                style={{paddingInline: 20, width: '100%', paddingTop: 16}}
                contentContainerStyle={{gap: 32, paddingBottom: 80}}
            >

                <View style={{gap: 16}} >
                    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                        <FeatherIcon name="package" size={32} />
                        <View>
                            <ShowWhen when={!loading}
                                otherwise={<>
                                    <LoadingView width={100} height={12} style={{marginBottom: 4}} />
                                    <LoadingView width={80} height={8} />
                                </>}
                            >
                                <TextTheme style={{fontWeight: 900, fontSize: 16}}>
                                    {product?.stock_item_name}
                                </TextTheme>
                                <TextTheme isPrimary={false} style={{fontWeight: 500, fontSize: 12}}>
                                    {product?.gst_hsn_code}
                                </TextTheme>
                            </ShowWhen>
                        </View>
                    </View>

                    <View >
                        <TextTheme style={{fontWeight: 900, fontSize: 20}}>
                            {currency} {((item?.purchase_value ?? 0) - (item?.sales_value ?? 0)) || '0.00'}
                        </TextTheme>
                        <TextTheme isPrimary={false} style={{fontWeight: 900, fontSize: 12}}>In Stock Value</TextTheme>
                    </View>
                </View>

                <View style={{flexDirection: 'row', gap: 24}} >
                    <BackgroundThemeView isPrimary={false} style={{flex: 1, padding: 12, borderRadius: 12, gap: 4, paddingTop: 20}} >
                        <View style={{paddingHorizontal: 6}} >
                            <TextTheme style={{fontSize: 14, fontWeight: 800, marginBottom: 4}} >PURCHASES</TextTheme>
                            <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 800, marginBottom: 12}} >
                                {currency} {item?.purchase_value || '0.00'}
                            </TextTheme>

                            <View style={{marginTop: 12}} >
                                <View style={{flexDirection: 'row', gap: 4}} >
                                    <FeatherIcon name="trending-up" size={16} />
                                    <TextTheme style={{fontSize: 16, fontWeight: 800}}>0</TextTheme>
                                </View>
                                <TextTheme isPrimary={false} style={{fontSize: 12}} >Purchase Invoice</TextTheme>
                            </View>
                        </View>

                        <NormalButton text="Add Purchase"  />
                    </BackgroundThemeView>

                    <BackgroundThemeView isPrimary={false} style={{flex: 1, padding: 12, borderRadius: 12, gap: 4, paddingTop: 20}} >
                        <View style={{paddingHorizontal: 6}} >
                            <TextTheme style={{fontSize: 14, fontWeight: 800, marginBottom: 4}} >SELLS</TextTheme>
                            <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 800, marginBottom: 12}} >
                                {currency} {item?.sales_value || '0.00'}
                            </TextTheme>

                            <View style={{marginTop: 12}} >
                                <View style={{flexDirection: 'row', gap: 4}} >
                                    <FeatherIcon name="trending-up" size={16} />
                                    <TextTheme style={{fontSize: 16, fontWeight: 800}}>0</TextTheme>
                                </View>
                                <TextTheme isPrimary={false} style={{fontSize: 12}} >Sell Invoice</TextTheme>
                            </View>
                        </View>

                        <NormalButton text="Add Sell"  />
                    </BackgroundThemeView>
                </View>

                <SectionView
                    style={{ gap: 8 }} label="Product Information"
                    labelContainerChildren={
                        <EditButton onPress={() => {  }} />
                    }
                >
                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Name</TextTheme>

                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {product?.stock_item_name}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Product No</TextTheme>

                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {product?.gst_hsn_code}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Low Stock Alert</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {product?.low_stock_alert ?? 0} {product?.unit ?? 'Unit'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{ justifyContent: 'space-between' }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Unit of Mesurement</TextTheme>

                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {product?.unit ?? 'Unit'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow label="Discription" isLabelPrimary={true} gap={4} style={{ justifyContent: 'space-between' }} >
                        <TextTheme isPrimary={false} style={{ fontSize: 12, fontWeight: 900 }} >
                            {product?.description ?? 'No Description'}
                        </TextTheme>
                    </SectionRow>
                </SectionView>

                <SectionView
                    label="Organization & Classification"
                    style={{gap: 8}}
                    labelContainerChildren={
                        <EditButton onPress={() => {  }} />
                    }
                >
                    <SectionRow style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Product Category</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {product?.category ?? 'Not Set'}
                        </TextTheme>
                    </SectionRow>

                    <SectionRow style={{justifyContent: 'space-between'}} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 900 }} >Product Group</TextTheme>
                        <TextTheme isPrimary={false} style={{ fontSize: 16, fontWeight: 900 }} >
                            {product?.group ?? 'Not Set'}
                        </TextTheme>
                    </SectionRow>
                </SectionView>

               <SectionView label="Danger Zone" style={{gap: 12}} labelColor="red" >
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
                passkey={product?.gst_hsn_code ?? 'delete'}
                message="Once you delete the product then no way to go back."
            />

            <LoadingModal visible={loading && isDeleteModalVisible} />
        </View>
    );
}

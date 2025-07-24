/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import navigator from '../../../../Navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppDispatch, useCompanyStore } from '../../../../Store/ReduxStore';
import { useEffect } from 'react';
import { getProduct, viewProduct } from '../../../../Services/product';
import StackNavigationHeader from '../../../../Components/Layouts/Header/StackNavigationHeader';
import { ClassificationSection, DangerSection, HeroSection, InfoSection, SalePurchaseCards } from './Components';

export default function ProductInfoScreen(): React.JSX.Element {

    const {productId} = navigator.getParams('product-info-screen') ?? {};
    if(!productId) {return <></>;}

    const {company} = useCompanyStore();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getProduct({company_id: company?._id ?? '', product_id: productId}));
        dispatch(viewProduct({company_id: company?._id ?? '', product_id: productId}));
    }, [productId]);


    return (
        <View style={{width: '100%', height: '100%'}} >
            <StackNavigationHeader title="Product Details" />

            <ScrollView
                style={{paddingInline: 20, width: '100%', paddingTop: 16}}
                contentContainerStyle={{gap: 32, paddingBottom: 80}}
            >
                <HeroSection/>
                <SalePurchaseCards/>
                <InfoSection/>
                <ClassificationSection/>
               <DangerSection/>
            </ScrollView>
        </View>
    );
}

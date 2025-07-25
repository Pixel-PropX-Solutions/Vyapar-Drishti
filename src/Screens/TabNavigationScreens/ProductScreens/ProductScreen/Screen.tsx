/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { useEffect } from 'react';
import { useAppDispatch, useCompanyStore } from '../../../../Store/ReduxStore';
import { viewAllProducts } from '../../../../Services/product';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamsList } from '../../../../Navigation/BottomTabNavigation';
import { CreateProductButton, Header, ProductListing, SummaryCard } from './Components';

export default function ProductScreen() {

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamsList, 'product-screen'>>();

    const dispatch = useAppDispatch();
    const {company} = useCompanyStore();

    useEffect(() => {
        const event = navigation.addListener('focus', () => {
            dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: 1 }));
        });

        return event
    }, [])

    return (
        <View style={{ width: '100%', height: '100%', paddingHorizontal: 20, gap: 20 }}>
            <Header/>
            <SummaryCard/>
            <ProductListing/>
            <CreateProductButton/>         
        </View>
    )
}
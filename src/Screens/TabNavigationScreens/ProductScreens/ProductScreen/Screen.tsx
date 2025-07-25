/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { useAppDispatch, useCompanyStore } from '../../../../Store/ReduxStore';
import { viewAllProducts } from '../../../../Services/product';
import { useFocusEffect } from '@react-navigation/native';
import { CreateProductButton, Header, ProductListing, SummaryCard } from './Components';
import { useCallback } from 'react';

export default function ProductScreen() {

    const dispatch = useAppDispatch();
    const { company } = useCompanyStore();

    useFocusEffect(
        useCallback(() => {
            dispatch(viewAllProducts({ company_id: company?._id ?? '', pageNumber: 1 }));
        }, [])
    );

    return (
        <View style={{ width: '100%', height: '100%', paddingHorizontal: 20, gap: 20 }}>
            <Header />
            <SummaryCard />
            <ProductListing />
            <CreateProductButton />
        </View>
    );
}

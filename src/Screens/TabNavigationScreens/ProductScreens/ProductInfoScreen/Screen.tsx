/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import navigator from '../../../../Navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppDispatch, useUserStore } from '../../../../Store/ReduxStore';
import { getProduct } from '../../../../Services/product';
import DetailsScreen, { DangerSection, Header } from './Components';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import SafeAreaFromTop from '../../../../Components/Other/SafeAreaView/SafeAreaFromTop';

export default function ProductInfoScreen(): React.JSX.Element {

    const { productId } = navigator.getParams('product-info-screen') ?? {};

    const { current_company_id } = useUserStore();
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(() => {
            if (!productId) { return; }
            dispatch(getProduct({ company_id: current_company_id ?? '', product_id: productId }));
        }, [])
    );

    if (!productId) { return <></>; }

    return (
        <View style={{ width: '100%', height: '100%' }} >
            <SafeAreaFromTop />
            <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 36, marginBottom: 8 }} >
                <Header />
            </View>

            <ScrollView
                style={{ paddingInline: 20, width: '100%', paddingTop: 8 }}
                contentContainerStyle={{ gap: 8, paddingBottom: 80 }}
                keyboardShouldPersistTaps="always"
            >
                <DetailsScreen />
                <DangerSection />
            </ScrollView>
        </View>
    );
}

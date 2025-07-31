/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { CreateProductButton, Header, ItemStatusFilter, ProductListing, SortFilterSection, SummarySection } from './Components';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import ProductContextProvider from './Context';

export default function ProductScreen() {
    return (
        <ProductContextProvider>
            <View style={{ width: '100%', height: '100%' }}>
                <View style={{paddingInline: 20}} >
                    <Header />
                    <SummarySection />
                    <View style={{marginTop: 20}} >
                        <ItemStatusFilter/>
                    </View>
                </View>

                <BackgroundThemeView isPrimary={false} style={{width: '100%', flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingInline: 20, paddingBottom: 0, marginTop: 10}} >
                    <SortFilterSection/>
                    <ProductListing />
                    <CreateProductButton />
                </BackgroundThemeView> 
            </View>
        </ProductContextProvider>
    );
}

/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { CreateProductButton, Header, ProductListing, SummaryCard } from './Components';

export default function ProductScreen() {
    return (
        <View style={{ width: '100%', height: '100%', paddingHorizontal: 20, gap: 20 }}>
            <Header />
            <SummaryCard />
            <ProductListing />
            <CreateProductButton />
        </View>
    );
}

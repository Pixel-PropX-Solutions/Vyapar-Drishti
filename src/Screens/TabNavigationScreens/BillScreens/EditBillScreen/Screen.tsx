/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import BillContextProvider from './Context';
import { AdditionalDetailSelector, AmountBox, BillNoSelector, CustomerSelector, DateSelector, Header, ProductListing, ProductSelector, ProgressBar } from './Components';
import { useRef } from 'react';
import type { ScrollView as RNScrollView } from 'react-native';

export default function BillEditScreen() {
    const scrollViewRef = useRef<RNScrollView>(null);

    return (
        <BillContextProvider>
            <View style={{ justifyContent: 'space-between', width: '100%', height: '100%' }} >
                <Header />

                <ScrollView
                    ref={scrollViewRef}
                    style={{ paddingInline: 20, paddingBlock: 10 }}
                    contentContainerStyle={{ gap: 16 }}
                    keyboardShouldPersistTaps="always"
                    onContentSizeChange={() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }}
                >
                    <View style={{ gap: 16 }} >
                        <ProgressBar />

                        <TextTheme fontSize={18} fontWeight={700}>
                            Bill Information
                        </TextTheme>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }} >
                            <BillNoSelector />
                            <DateSelector />
                        </View>

                        <CustomerSelector />

                        <ProductSelector />
                        <AdditionalDetailSelector />
                    </View>

                    <ProductListing />
                    <View style={{ minHeight: 20 }} />
                </ScrollView>

                <AmountBox />
            </View>
        </BillContextProvider>
    );
}

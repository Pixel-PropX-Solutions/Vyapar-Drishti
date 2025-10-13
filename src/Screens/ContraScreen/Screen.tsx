/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingModal from '../../Components/Modal/LoadingModal';
import { DateSelector, Header, ContraNoSelector, SaveContra, DescriptionSection, Account1Selector, Account2Selector, AmountSection } from './Components';
import ContraContextProvider from './Context';
import { useRef, useState } from 'react';
import type { ScrollView as RNScrollView } from 'react-native';
import { useInvoiceStore } from '../../Store/ReduxStore';


function ContraInfo() {
    const scrollViewRef = useRef<RNScrollView>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const { loading } = useInvoiceStore();
    return (
        <View style={{ justifyContent: 'space-between', width: '100%', height: '100%' }} >
            <Header />
            <ScrollView
                ref={scrollViewRef}
                style={{ padding: 20 }}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ gap: 16 }}
                onContentSizeChange={() => {
                    if (isFirstRender) {
                        setIsFirstRender(false);
                    } else {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }} >
                    <ContraNoSelector />
                    <DateSelector />
                </View>
                <Account1Selector />
                <Account2Selector />
                <AmountSection />
                <DescriptionSection />
                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <SaveContra />
            <LoadingModal visible={loading} />
        </View>
    );
}


export default function ContraCreateScreen() {
    return (
        <ContraContextProvider>
            <ContraInfo />
        </ContraContextProvider>
    );
}

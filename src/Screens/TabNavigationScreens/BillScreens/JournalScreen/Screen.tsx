/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingModal from '../../../../Components/Modal/LoadingModal';
import { DateSelector, DescriptionSection, EntriesSection, Header, JournalNoSelector, PaymentMode, SaveJournal } from './Components';
import JournalContextProvider from './Context';
import { useRef, useState } from 'react';
import type { ScrollView as RNScrollView } from 'react-native';
import { useInvoiceStore } from '../../../../Store/ReduxStore';


function JournalInfo() {
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
                    <JournalNoSelector />
                    <DateSelector />
                </View>
                <PaymentMode />
                <DescriptionSection />
                <EntriesSection />
                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <SaveJournal />
            <LoadingModal visible={loading} />
        </View>
    );
}


export default function JournalCreateScreen() {
    return (
        <JournalContextProvider>
            <JournalInfo />
        </JournalContextProvider>
    );
}

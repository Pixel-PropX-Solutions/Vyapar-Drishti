/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import TransactionContextProvider from './Context';
import { AccountSelector, AmountBox, AmountSection, CustomerSelector, DateSelector, DescriptionSection, Header, ProgressBarSection, TransactionNoSelector } from './Components';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';

export default function TransactionCreateScreen() {
    return (
        <TransactionContextProvider>
            <TransactionInfo />
        </TransactionContextProvider>
    );
}

function TransactionInfo() {
    return (
        <View style={{ width: '100%', height: '100%' }} >
            <Header />
            <ScrollView
                style={{ paddingHorizontal: 20, paddingBlock: 10, flex: 1 }}
                contentContainerStyle={{ gap: 16 }}
                keyboardShouldPersistTaps="always"
            >
                <ProgressBarSection />

                <TextTheme style={{ fontSize: 18, fontWeight: '700' }}>
                    Transaction Information
                </TextTheme>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }} >
                    <TransactionNoSelector />
                    <DateSelector />
                </View>

                <CustomerSelector />
                <AccountSelector />
                <AmountSection />
                <DescriptionSection />
            </ScrollView>

            <AmountBox />
        </View>
    );
}

/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TextTheme from '../../../../Components/Ui/Text/TextTheme';
import BillContextProvider from './Context';
import { AdditionalDetailSelector, AmountBox, BillNoSelector, CustomerSelector, DateSelector, Header, ProductListing, ProductSelector, ProgressBar } from './Components';


export default function BillCreateScreen() {

    return (
        <BillContextProvider>
            <View style={{ justifyContent: 'space-between', width: '100%', height: '100%' }} >
                <Header />

                <ScrollView
                    style={{ paddingInline: 20, paddingBlock: 10 }}
                    contentContainerStyle={{ gap: 24 }}
                    keyboardShouldPersistTaps="always"
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
                        <AdditionalDetailSelector/>
                    </View>

                    <ProductListing />
                    <View style={{ minHeight: 40 }} />
                </ScrollView>

                <AmountBox />
            </View>
        </BillContextProvider>
    );
}

/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import BillContextProvider from './Context';
import { BillCreateButton, BillListing, BillTypeFilter, DateSelector, Header } from './Components';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';

export default function BillScreen(): React.JSX.Element {
    return (
        <BillContextProvider>
            <View style={{ width: '100%', height: '100%' }} >
                <Header />
                <BillTypeFilter />

                <BackgroundThemeView isPrimary={false} style={{ paddingInline: 20, paddingTop: 20, borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1, marginTop: 20, gap: 20 }} >
                    {/* <DateSelector /> */}
                    <BillListing />
                </BackgroundThemeView>

                <BillCreateButton />
            </View>
        </BillContextProvider>
    );
}

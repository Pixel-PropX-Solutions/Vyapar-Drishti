/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import TimelineContextProvider from './Context';
import { DateSelector, Header, TimelineTabel } from './Components';
import BackgroundThemeView from '../../Components/Layouts/View/BackgroundThemeView';
import SafeAreaFromTop from '../../Components/Other/SafeAreaView/SafeAreaFromTop';

export default function TimelineScreen(): React.JSX.Element {
    return (
        <TimelineContextProvider>
            <BackgroundThemeView isPrimary={false} style={{ width: '100%', height: '100%' }}>
                <SafeAreaFromTop />

                <View style={{ paddingInline: 20 }}>
                    <Header />
                </View>

                <BackgroundThemeView style={{ paddingInline: 10, paddingBottom: 20, borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1, marginTop: 10, gap: 32 }} >
                    <View style={{ paddingInline: 10, paddingTop: 20 }} >
                        {/* <DateSelector/> */}
                    </View>
                    <TimelineTabel />
                </BackgroundThemeView>
            </BackgroundThemeView>
        </TimelineContextProvider>
    );
}
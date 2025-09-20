/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { FilterRow, InvoiceListing, ProfileSection } from './Components';
import BackgroundThemeView from '../../../../Components/Layouts/View/BackgroundThemeView';
import SafeAreaFromTop from '../../../../Components/Other/SafeAreaView/SafeAreaFromTop';
import MonthSelector from '../../../../Components/Ui/Option/MonthSelector';
import CustomerContextProvider, { useCustomerContext } from './Context';


type Date = { month: number, year: number }
function CustomerViewScreenContent() {
    const { filters, handleFilter } = useCustomerContext();
    const date: Date = { month: new Date(filters.startDate ?? '').getMonth(), year: new Date(filters.startDate ?? '').getFullYear() };
    return (
        <View style={{ width: '100%', height: '100%' }} >
            <SafeAreaFromTop />

            <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 36, marginBottom: 8 }} >
                <ProfileSection />
                {/* <FilterRow /> */}
            </View>

            <BackgroundThemeView isPrimary={false} style={{ width: '100%', borderTopRightRadius: 40, borderTopLeftRadius: 40, padding: 20, flex: 1, gap: 20, paddingBottom: 0 }} >
                <MonthSelector
                    value={date}
                    onSelect={newDate => {
                        console.log('Selected Month:', newDate);
                        handleFilter('startDate', new Date(newDate.year, newDate.month, 1).toISOString());
                        handleFilter('endDate', new Date(newDate.year, newDate.month + 1, 0).toISOString());
                    }}
                />
                <InvoiceListing />

                <View style={{ minHeight: 10 }} />
            </BackgroundThemeView>
        </View>
    );
}


export default function CustomerViewScreen() {
    return (
        <CustomerContextProvider>
            <CustomerViewScreenContent />
        </CustomerContextProvider>
    );
}

/* eslint-disable react-native/no-inline-styles */
import MeasurementUnitsOpation from '../../../Components/Ui/Option/MeasurmentUnits';
import { Header, MonthlyInfoSection, QuickAccessSection } from './Conponents';
import { ScrollView, View } from 'react-native';

export default function HomeScreen(): React.JSX.Element {
    return (
        <View style={{ width: '100%', height: '100%' }} >
            <Header/>

            <ScrollView 
                style={{ marginTop: 12, width: '100%', height: '100%', paddingHorizontal: 20 }} 
                contentContainerStyle={{ gap: 32 }}
                keyboardShouldPersistTaps='always'
            >
                <MonthlyInfoSection/>
                <QuickAccessSection/>
            </ScrollView>
        </View>
    );
}
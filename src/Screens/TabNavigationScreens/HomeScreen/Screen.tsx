/* eslint-disable react-native/no-inline-styles */
import HorizontalSlider from '../../../Components/Layouts/Sliders/HorizontalSlider';
import { Header, MonthlyInfoSection, QuickAccessSection } from './Conponents';
import { ScrollView, View } from 'react-native';

export default function HomeScreen(): React.JSX.Element {
    return (
        <View style={{ width: '100%', height: '100%' }} >
            <Header />

            <ScrollView
                style={{ marginTop: 12, width: '100%', height: '100%', paddingHorizontal: 20 }}
                contentContainerStyle={{ gap: 32 }}
                keyboardShouldPersistTaps="always"
            >
                <HorizontalSlider
                    slides={[
                        'https://dynamic.brandcrowd.com/template/preview/design/b34fdace-36a5-4f5a-afb4-f3e82e5fe973?v=4&designTemplateVersion=1&size=design-preview-standalone-1x',
                        'https://img.freepik.com/premium-vector/business-growth-with-up-arrows-smartphone-screen-financial-company-statistic-stock-market_618588-1463.jpg',
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh_PTMmYik5DqmisNXaoulQPwizliKLIdJEkT0WDOKGyHy_kMlgBs50rm4GVkB3-TwIDU&usqp=CAU',
                        // 'https://img.lovepik.com/background/20211022/medium/lovepik-small-fresh-pink-banner-taobao-poster-background-image_605643104.jpg',
                    ]}
                />

                {/* <MonthlyInfoSection /> */}
                <QuickAccessSection />
            </ScrollView>
        </View>
    );
}

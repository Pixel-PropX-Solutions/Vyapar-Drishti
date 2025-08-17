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
                        'https://cdn.pixabay.com/photo/2015/12/15/09/04/banner-1093909_640.jpg',
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh_PTMmYik5DqmisNXaoulQPwizliKLIdJEkT0WDOKGyHy_kMlgBs50rm4GVkB3-TwIDU&usqp=CAU',
                        'https://img.lovepik.com/background/20211022/medium/lovepik-small-fresh-pink-banner-taobao-poster-background-image_605643104.jpg',
                        'https://i.pinimg.com/1200x/b8/42/e5/b842e53dbdb03a5365d0402abd1e6d00.jpg'
                    ]} 
                />

                {/* <MonthlyInfoSection /> */}
                <QuickAccessSection />
            </ScrollView>
        </View>
    );
}

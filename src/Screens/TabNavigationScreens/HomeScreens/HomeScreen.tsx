/* eslint-disable react-native/no-inline-styles */
import { ScrollView } from 'react-native-gesture-handler';
import TextTheme from '../../../Components/Text/TextTheme';
import { Share, View } from 'react-native';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import AnimateButton from '../../../Components/Button/AnimateButton';
import { useTheme } from '../../../Contexts/ThemeProvider';
import FontAwesome6Icon from '../../../Components/Icon/FontAwesome6Icon';
import HomeScreenHeader from '../../../Components/Header/HomeScreenHeader';
import { BASE_WEB_URL, BASE_APP_URL } from '../../../../env';
import navigator from '../../../Navigation/NavigationService';
import { useAppStorage } from '../../../Contexts/AppStorageProvider';

export default function HomeScreen(): React.JSX.Element {

    const { currency } = useAppStorage();

    return (
        <View style={{ width: '100%', height: '100%' }} >
            <HomeScreenHeader />

            <ScrollView style={{ marginTop: 12, width: '100%', height: '100%', paddingHorizontal: 20 }} contentContainerStyle={{ gap: 20 }}>
                <View style={{gap: 32 }} >
                    <View style={{ gap: 12 }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 800 }} >This Month</TextTheme>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ padding: 12, borderRadius: 12, flex: 1, backgroundColor: 'rgb(50,200,150)' }}>
                                <TextTheme color="white" isPrimary={false} style={{ fontWeight: 900 }} >Pay Amount</TextTheme>
                                <TextTheme color="white">0.00 {currency}</TextTheme>
                            </View>

                            <View style={{ padding: 12, borderRadius: 12, flex: 1, backgroundColor: 'rgb(50,150,250)' }}>
                                <TextTheme color="white" isPrimary={false} style={{ fontWeight: 900 }} >Pending Amount</TextTheme>
                                <TextTheme color="white">0.00 {currency}</TextTheme>
                            </View>
                        </View>
                    </View>

                    <View style={{ gap: 12 }} >
                        <TextTheme style={{ fontSize: 16, fontWeight: 800 }} >Quick Access</TextTheme>
                        <View style={{ gap: 12 }} >
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <QuickAccessBox
                                    label="Sells"
                                    text="Add new sells"
                                    icon={<FeatherIcon name="trending-up" size={16} />}
                                    onPress={() => { navigator.navigate('create-bill-screen', { type: 'Sells', id: '34e81b1d-5735-437a-a475-e27265eba005' }); }}
                                />

                                <QuickAccessBox
                                    label="Purchase"
                                    text="Add purchase"
                                    icon={<FontAwesome6Icon name="coins" size={16} />}
                                    onPress={() => { navigator.navigate('create-bill-screen', { type: 'Purchase', id: 'fe9221db-5990-41a0-976a-3cb4f78aef0f' }); }}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <QuickAccessBox
                                    label="Customer"
                                    text="Add Customer"
                                    icon={<FeatherIcon name="users" size={16} />}
                                    onPress={() => {}}
                                />

                                <QuickAccessBox
                                    label="Share"
                                    text="Share app with friends"
                                    icon={<FeatherIcon name="share" size={16} />}
                                    onPress={() => {
                                        Share.share({
                                            message: `'Check out Vyapar Drishti - A free GST billing app for small businesses. Download now from ${BASE_WEB_URL} or ${BASE_APP_URL}'`,
                                            title: 'Vyapar Drishti',
                                            url: BASE_APP_URL,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </View>
    );
}


type QuickAccessBoxProps = {
    icon: React.ReactNode, text: string, label: string, onPress: () => void
}

function QuickAccessBox({ icon, text, label, onPress }: QuickAccessBoxProps): React.JSX.Element {

    const { secondaryBackgroundColor, primaryBackgroundColor } = useTheme();

    return (
        <AnimateButton
            onPress={onPress}
            style={{ height: 60, borderRadius: 8, alignItems: 'center', flex: 1, flexDirection: 'row', backgroundColor: secondaryBackgroundColor, padding: 12, gap: 8 }}
        >
            <View style={{ backgroundColor: primaryBackgroundColor, borderRadius: 8, overflow: 'hidden', width: 40, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }} >
                {icon}
            </View>
            <View style={{ flex: 1 }} >
                <TextTheme style={{ fontSize: 14 }} >{label}</TextTheme>
                <TextTheme isPrimary={false} style={{ fontSize: 11 }} numberOfLines={2} >{text}</TextTheme>
            </View>
        </AnimateButton>
    );
}

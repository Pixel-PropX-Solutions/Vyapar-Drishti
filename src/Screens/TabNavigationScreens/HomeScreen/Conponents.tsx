/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react';
import { useAppDispatch, useCompanyStore, useInvoiceStore, useUserStore } from '../../../Store/ReduxStore';
import { getAllCompanies } from '../../../Services/company';
import { getCurrentUser } from '../../../Services/user';
import { Linking, Share, View } from 'react-native';
import AnimateButton from '../../../Components/Ui/Button/AnimateButton';
import ShowWhen from '../../../Components/Other/ShowWhen';
import LoadingView from '../../../Components/Layouts/View/LoadingView';
import BackgroundThemeView from '../../../Components/Layouts/View/BackgroundThemeView';
import LogoImage from '../../../Components/Image/LogoImage';
import TextTheme from '../../../Components/Ui/Text/TextTheme';
import navigator from '../../../Navigation/NavigationService';
import FeatherIcon from '../../../Components/Icon/FeatherIcon';
import AnimatePingBall from '../../../Components/Layouts/View/AnimatePingBall';
import { CompanySwitchModal } from './Modals';
import { useTheme } from '../../../Contexts/ThemeProvider';
import { BASE_APP_URL, BASE_WEB_URL } from '../../../../env';
import { useAppStorage } from '../../../Contexts/AppStorageProvider';
import MaterialDesignIcon from '../../../Components/Icon/MaterialDesignIcon';
import { getAllInvoiceGroups } from '../../../Services/invoice';

export function Header(): React.JSX.Element {

    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const {company} = useCompanyStore();
    const { current_company_id, user } = useUserStore();
    const { isCompanyFetching } = useCompanyStore();
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);

    console.log(currentCompanyDetails, current_company_id)
    useEffect(() => {
        dispatch(getCurrentUser());
        dispatch(getAllCompanies());
    }, []);

    return (
        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, justifyContent: 'space-between' }} >
            <AnimateButton
                onPress={() => setModalVisible(true)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 10, paddingRight: 20, borderRadius: 10 }}
            >
                <ShowWhen
                    when={!isCompanyFetching}
                    otherwise={<LoadingView width={44} height={44} />}
                >
                    <BackgroundThemeView isPrimary={false} style={{ width: 40, borderRadius: 12, aspectRatio: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }} >
                        <LogoImage size={44} imageSrc={currentCompanyDetails?.image} />
                    </BackgroundThemeView>
                </ShowWhen>

                <View>
                    <ShowWhen
                        when={!isCompanyFetching}
                        otherwise={<>
                            <LoadingView height={12} width={50} style={{ marginBottom: 4 }} />
                            <LoadingView height={12} width={80} />
                        </>}
                    >
                        <TextTheme numberOfLines={1} fontSize={16} fontWeight={600} >
                            {/* {currentCompanyDetails?.company_name} */}
                            {company?.name}
                        </TextTheme>
                        <TextTheme numberOfLines={1} isPrimary={false}>
                            {/* {currentCompanyDetails?.email} */}
                            {company?.email}
                        </TextTheme>
                    </ShowWhen>
                </View>
            </AnimateButton>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <AnimateButton
                    onPress={() => navigator.navigate('notification-screen')}
                    style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                >
                    <FeatherIcon name="bell" size={20} />
                    <BackgroundThemeView style={{
                        position: 'absolute',
                        transform: [{ translateX: 5 }, { translateY: -5 }],
                        borderRadius: '50%',
                        padding: 2,
                    }} >
                        <AnimatePingBall size={7} scale={2} duration={500} backgroundColor={'rgb(250,50,50)'} />
                    </BackgroundThemeView>
                </AnimateButton>

                <AnimateButton
                    onPress={() => navigator.navigate('setting-screen')}
                    style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                >
                    <FeatherIcon name="settings" size={20} />
                </AnimateButton>
            </View>

            <CompanySwitchModal visible={isModalVisible} setVisible={setModalVisible} />
        </View>
    );
}


export function MonthlyInfoSection(): React.JSX.Element {

    const { currency } = useAppStorage();

    return (
        <View style={{ gap: 12 }} >
            <TextTheme fontSize={16} >This Month</TextTheme>
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ padding: 12, borderRadius: 12, flex: 1, backgroundColor: 'rgb(50,200,150)' }}>
                    <TextTheme color="white" isPrimary={false}  >Pay Amount</TextTheme>
                    <TextTheme color="white">0.00 {currency}</TextTheme>
                </View>

                <View style={{ padding: 12, borderRadius: 12, flex: 1, backgroundColor: 'rgb(50,150,250)' }}>
                    <TextTheme color="white" isPrimary={false} >Pending Amount</TextTheme>
                    <TextTheme color="white">0.00 {currency}</TextTheme>
                </View>
            </View>
        </View>
    );
}


export function QuickAccessSection(): React.JSX.Element {

    const { secondaryBackgroundColor, primaryBackgroundColor } = useTheme();
    const { invoiceGroups } = useInvoiceStore();
    const dispatch = useAppDispatch();
    const { user, current_company_id } = useUserStore();

    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    useEffect(() => {
        dispatch(getAllInvoiceGroups(currentCompanyDetails?._id || ''));
    }, [currentCompanyDetails?._id, dispatch]);

    const getInvoiceGroup = (name: string) => {
        const invoiceGroup = invoiceGroups.find((inv) => inv.name === name);
        return { type: invoiceGroup?.name, id: invoiceGroup?._id || '' } as { type: string, id: string };
    };

    type QuickAccessBoxProps = { icon: React.ReactNode, text: string, label: string, onPress: () => void }
    // eslint-disable-next-line react/no-unstable-nested-components
    const QuickAccessBox = ({ icon, text, label, onPress }: QuickAccessBoxProps): React.JSX.Element => (
        <AnimateButton
            onPress={onPress}
            style={{ height: 60, borderRadius: 8, alignItems: 'center', flex: 1, flexDirection: 'row', backgroundColor: secondaryBackgroundColor, padding: 12, gap: 8 }}
        >
            <View style={{ backgroundColor: primaryBackgroundColor, borderRadius: 8, overflow: 'hidden', width: 40, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }} >
                {icon}
            </View>
            <View style={{ flex: 1 }} >
                <TextTheme fontSize={14} >{label}</TextTheme>
                <TextTheme isPrimary={false} fontSize={11} numberOfLines={2} >{text}</TextTheme>
            </View>
        </AnimateButton>
    );

    return (
        <View style={{ gap: 12 }} >
            <TextTheme fontSize={16} fontWeight={600} >Quick Access</TextTheme>
            <View style={{ gap: 12 }} >
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <QuickAccessBox
                        label="Sales"
                        text="Add new sales bill"
                        icon={<FeatherIcon name="trending-up" size={16} />}
                        onPress={() => { navigator.navigate('create-bill-screen', getInvoiceGroup('Sales')); }}
                    />

                    <QuickAccessBox
                        label="Purchase"
                        text="Add purchase"
                        icon={<FeatherIcon name="shopping-cart" size={16} />}
                        onPress={() => { navigator.navigate('create-bill-screen', getInvoiceGroup('Purchase')); }}
                    />
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <QuickAccessBox
                        label="Receipt"
                        text="Receive payment"
                        icon={<MaterialDesignIcon name="cash-plus" size={24} />}
                        onPress={() => { navigator.navigate('create-transaction-screen', getInvoiceGroup('Receipt')); }}
                    />

                    <QuickAccessBox
                        label="Payment"
                        text="Make payment"
                        icon={<MaterialDesignIcon name="cash-minus" size={24} />}
                        onPress={() => { navigator.navigate('create-transaction-screen', getInvoiceGroup('Payment')); }}
                    />
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <QuickAccessBox
                        label="Rate us"
                        text="Rate us on play store"
                        icon={<FeatherIcon name="star" size={16} />}
                        onPress={() => { Linking.openURL(BASE_APP_URL); }}
                    />

                    <QuickAccessBox
                        label="Share"
                        text="Share app with friends"
                        icon={<FeatherIcon name="share-2" size={16} />}
                        onPress={() => {
                            Share.share({
                                message: `Check out Vyapar Drishti - A free GST billing app for small businesses. Download now from ${BASE_WEB_URL} or ${BASE_APP_URL}`,
                                title: 'Vyapar Drishti',
                                url: BASE_APP_URL,
                            });
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

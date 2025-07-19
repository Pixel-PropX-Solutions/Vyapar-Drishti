/* eslint-disable react-native/no-inline-styles */
import { ScrollView } from 'react-native-gesture-handler';
import StackNavigationHeader from '../Components/Header/StackNavigationHeader';
import { Linking, View } from 'react-native';
import { useTheme } from '../Contexts/ThemeProvider';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import SectionView, { SectionRowWithIcon } from '../Components/View/SectionView';
import TextTheme from '../Components/Text/TextTheme';
import navigator from '../Navigation/NavigationService';
import AuthStore from '../Store/AuthStore';
import BottomModal from '../Components/Modal/BottomModal';
import NoralTextInput from '../Components/TextInput/NoralTextInput';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useAppStorage } from '../Contexts/AppStorageProvider';
import MaterialIcon from '../Components/Icon/MaterialIcon';
import { useAppDispatch } from '../Store/ReduxStore';
import { logout } from '../Services/user';
import { ItemSelectorModal } from '../Components/Modal/ItemSelectorModal';

export default function SettingScreen(): React.JSX.Element {

    const { setTheme, theme } = useTheme();
    const { currency, billPrefix } = useAppStorage();
    const dispatch = useAppDispatch();
    const [isCurrencyModalVisible, setCurrencyModalVisible] = useState<boolean>(false);
    const [isBillPrefixModalVisible, setBillPrefixModalVisible] = useState<boolean>(false);

    return (
        <View style={{ width: '100%', height: '100%' }} >
            <StackNavigationHeader title="Settings" />

            <ScrollView style={{ width: '100%', paddingInline: 20 }} contentContainerStyle={{ gap: 24 }} >

                <SectionView label="App Prefernces" style={{ gap: 12 }} >
                    <SectionRowWithIcon
                        label="Theme"
                        icon={<FeatherIcon name={theme === 'dark' ? 'moon' : 'sun'} size={20} />}
                        text={`Click for turn on ${theme === 'dark' ? 'light' : 'dark'} mode.`}
                        onPress={() => setTheme((pre) => pre === 'light' ? 'dark' : 'light')}
                    />

                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Notification"
                        text={'Comming Soon...'}
                        icon={<FeatherIcon name="bell" size={20} />}
                        onPress={() => { }}
                    />

                    <SectionRowWithIcon
                        label="Currency"
                        icon={<MaterialIcon name={'currency-rupee'} size={20} />}
                        text={'Comming Soon...'}
                        onPress={() => { setCurrencyModalVisible(true) }}
                    >
                        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                            <TextTheme style={{ fontWeight: 900, fontSize: 16 }} >{currency}</TextTheme>
                            <FeatherIcon name="chevron-right" size={20} />
                        </View>
                    </SectionRowWithIcon>
                </SectionView>



                <SectionView label="Bill Setting" style={{ gap: 12 }} >
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Bill Templates"
                        icon={<FeatherIcon name={'file-text'} size={20} />}
                        text={'Comming Soon...'}
                        onPress={() => { }}
                    />

                    <SectionRowWithIcon
                        label="Bill Prefix"
                        icon={<FeatherIcon name={'hash'} size={20} />}
                        text={'Comming Soon...'}
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                            <TextTheme style={{ fontWeight: 900, fontSize: 16 }} >{billPrefix}</TextTheme>
                            <FeatherIcon name="chevron-right" size={20} />
                        </View>
                    </SectionRowWithIcon>
                </SectionView>

                <SectionView label="Bussiness Details" style={{ gap: 12 }} >
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Business Profile"
                        icon={<FeatherIcon name={'user'} size={20} />}
                        text={'Update your business profile information'}
                        onPress={() => navigator.navigate('company-profile-screen')}
                    />

                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Group & Types"
                        icon={<FeatherIcon name={'inbox'} size={20} />}
                        text={'Comming Soon...'}
                        onPress={() => { }}
                    />
                </SectionView>

                <SectionView label="Help & Other" style={{ gap: 12 }} >
                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Help Center"
                        icon={<FeatherIcon name={'help-circle'} size={20} />}
                        text={'Access help documentation'}
                        onPress={() => { }}
                    />

                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Privacy Policy"
                        icon={<FeatherIcon name={'file-minus'} size={20} />}
                        text={'View privacy policy'}
                        onPress={() => {
                            Linking.openURL('https://vyapar-drishti.vercel.app/privacy');
                        }}
                    />

                    {/* <SectionRowWithIcon
                        hasArrow={true}
                        label="Github"
                        icon={<FeatherIcon name={'github'} size={20} />}
                        text={'https://github.com/Mustak24/Vyapar-Drishti'}
                        onPress={() => { }}
                    /> */}

                    <SectionRowWithIcon
                        hasArrow={true}
                        label="Logout"
                        icon={<FeatherIcon name={'log-out'} size={20} color="white" />}
                        text={'to log out from your account'}
                        backgroundColor="rgb(50,150,250)"
                        iconContainerColor="rgb(120,200,250)"
                        color="white"
                        onPress={() => {
                            dispatch(logout());
                            AuthStore.clearAll();
                            navigator.reset('landing-screen');
                        }}
                    />
                </SectionView>

                <SectionView label="Danger Zone" style={{ gap: 12 }} labelColor="red" >
                    <SectionRowWithIcon
                        color="white"
                        backgroundColor="rgb(255,80,100)"
                        label="Delete Data"
                        icon={<FeatherIcon name={'alert-triangle'} size={20} color="red" />}
                        text={'Comming Soon...'}
                        onPress={() => { }}
                    />

                    <SectionRowWithIcon
                        color="white"
                        backgroundColor="rgb(255,50,80)"
                        label="Delete Account"
                        icon={<FeatherIcon name={'alert-circle'} size={20} color="red" />}
                        text={'Comming Soon...'}
                        onPress={() => { }}
                    />
                </SectionView>


                <View style={{ minHeight: 40 }} />
            </ScrollView>

            <SetCurrencyModal visible={isCurrencyModalVisible} setVisible={setCurrencyModalVisible} />
            
            <SetBillPrefixModal visible={isBillPrefixModalVisible} setVisible={setBillPrefixModalVisible} />
        </View>
    );
}

function SetCurrencyModal({ visible, setVisible }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>> }): React.JSX.Element {
    type currencyInfo = {currency: string, country: string, currency_name: string}

    const currencyData: currencyInfo[] = require('../Assets/Jsons/currency-data.json');
    const { currency, setCurrency } = useAppStorage();
    const selected = (currencyData.find(item => item.currency === currency) ?? null);
    
    function udpateCurrency(currencyInfo: currencyInfo){
        setCurrency(currencyInfo.currency);
    }

    return (
        <ItemSelectorModal<currencyInfo>
            title='Select Currency'
            allItems={currencyData}
            selected={selected}
            keyExtractor={(item) => item.country + item.currency}
            filter={(item, val) => (
                item.country.toLowerCase().startsWith(val) || 
                item.currency.toLowerCase().startsWith(val)
            )}
            onSelect={udpateCurrency}
            visible={visible}
            setVisible={setVisible}
            SelectedItemContent={
                <View>
                    <TextTheme color="white" style={{fontWeight: 400, fontSize: 14}} >
                        {selected?.currency_name}
                    </TextTheme>
                    <TextTheme color="white" style={{fontWeight: 400, fontSize: 16}} >
                        {selected?.currency}
                    </TextTheme>
                </View>
            }

            renderItemContent={(item) => (<>
                    <TextTheme style={{fontWeight: 900, fontSize: 16}}>{item.country}</TextTheme>
                    <TextTheme style={{fontWeight: 600, fontSize: 16}}>{item.currency}</TextTheme>
            </>)}
        />
    );
}

function SetBillPrefixModal({ visible, setVisible }: { visible: boolean, setVisible: (vis: boolean) => void }): React.JSX.Element {
    const { primaryColor } = useTheme();
    const { billPrefix, setBillPrefix } = useAppStorage();

    const [text, setText] = useState<string>(billPrefix);

    return (
        <BottomModal
            visible={visible}
            setVisible={setVisible}
            style={{ paddingHorizontal: 20 }}
            actionButtons={[{
                title: 'Set', onPress: () => {
                    if (!text) { return; }

                    setBillPrefix(text);
                    setVisible(false);
                },
            }]}
        >
            <TextTheme style={{ fontSize: 16, fontWeight: 800 }} >Set New Bill Prefix</TextTheme>

            <View style={{ marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, width: '100%', maxWidth: 400 }} >
                <TextTheme style={{ fontSize: 24, fontWeight: 900 }} >PREFIX:</TextTheme>
                <NoralTextInput
                    value={text}
                    maxLength={4}
                    placeholder="Enter Bill Prefix"
                    keyboardType="ascii-capable"
                    style={{ fontSize: 24, fontWeight: 900, flex: 1 }}
                    onChangeText={(val) => setText(() => val.toString().toUpperCase().trim())}
                    autoFocus
                />
            </View>
        </BottomModal>
    );
}

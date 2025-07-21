/* eslint-disable react-native/no-inline-styles */
import { Text, View } from 'react-native';
import TextTheme from '../Text/TextTheme';
import AnimateButton from '../Button/AnimateButton';
import { useTheme } from '../../Contexts/ThemeProvider';
import AnimatePingBall from '../View/AnimatePingBall';
import BackgroundThemeView from '../View/BackgroundThemeView';
import ShowWhen from '../Other/ShowWhen';
import sliceString from '../../Utils/sliceString';
import LoadingView from '../View/LoadingView';
import { useAppStorage } from '../../Contexts/AppStorageProvider';
import { GetProduct } from '../../Utils/types';
import MaterialIcon from '../Icon/MaterialIcon';

export type ProductCardProps = {
    item: GetProduct;
    isPrimary?: boolean,
    onPress: () => void
}

export default function ProductCard({ item, isPrimary = true, onPress }: ProductCardProps): React.JSX.Element {

    const { secondaryBackgroundColor, primaryBackgroundColor } = useTheme();
    const { currency } = useAppStorage();

    const profit = (item.sales_value / item.sales_qty - (item.purchase_value / item.purchase_qty));
    const profitMargin = item.sales_value ? ((profit / (item.sales_value / item.sales_qty)) * 100).toFixed(2) : 0;

    return (
        <AnimateButton
            style={{ padding: 16, borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 16, backgroundColor: isPrimary ? primaryBackgroundColor : secondaryBackgroundColor }}
            onPress={onPress}
        >
            <View style={{ width: '100%' }} >
                <TextTheme style={{ paddingLeft: 2, fontWeight: 600, fontSize: 16 }} >{sliceString(item.stock_item_name, 30)}</TextTheme>

                {item.gst_hsn_code && <TextTheme isPrimary={false} style={{ paddingLeft: 2, fontWeight: 600, fontSize: 12 }} >{item.gst_hsn_code}</TextTheme>}
            </View>


            <View style={{ display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-between', width: '100%', alignItems: 'center' }} >
                <View style={{ flexDirection: 'row', gap: 32 }}>
                    <View>
                        <TextTheme isPrimary={false} style={{ fontSize: 12 }} >Quantity</TextTheme>
                        <TextTheme style={{ fontSize: 12 }} >{item.current_stock} {item.unit || 'Unit'}</TextTheme>
                    </View>

                    <View>
                        <TextTheme isPrimary={false} style={{ fontSize: 12 }} >
                            {'Purchase'}

                        </TextTheme>
                        <TextTheme style={{ fontSize: 12 }} >
                            <MaterialIcon name="currency-rupee" size={12} />
                            {item.purchase_value}
                        </TextTheme>
                    </View>
                    <View>
                        <TextTheme isPrimary={false} style={{ fontSize: 12 }} >
                            {'Sell'}

                        </TextTheme>
                        <TextTheme style={{ fontSize: 12 }} >
                            <MaterialIcon name="currency-rupee" size={12} />
                            {item.sales_value}
                        </TextTheme>
                    </View>

                    <View>
                        <TextTheme isPrimary={false} style={{ fontSize: 12 }} >Profit Margin</TextTheme>
                        <TextTheme style={{ fontSize: 12 }} >{profitMargin ? `${profitMargin} %` : 'No Sale Yet'}</TextTheme>
                    </View>

                </View>
            </View>

            <ShowWhen when={item.current_stock <= (item?.low_stock_alert || 10)} >
                <View style={{ paddingHorizontal: 12, position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderColor: 'white', boxSizing: 'border-box', height: 32, backgroundColor: !(item.current_stock > 0 && item.current_stock <= (item?.low_stock_alert || 10)) ? 'rgb(250,50,50)' : 'rgb(250,150,50)' }} >

                    <Text style={{ fontSize: 12, color: 'white' }} >
                        {(item.current_stock > 0 && item.current_stock <= (item?.low_stock_alert || 10)) ? 'Low Stock' : 'Out of Stock'}
                    </Text>

                    <BackgroundThemeView style={{ position: 'absolute', borderRadius: '50%', aspectRatio: 1, padding: 2, top: 5, right: 3, transform: 'translate(50%, -50%)' }} >
                        <AnimatePingBall size={12} backgroundColor={!(item.current_stock > 0 && item.current_stock <= (item?.low_stock_alert || 10)) ? 'rgb(250,50,50)' : 'rgb(250,150,50)'} />
                    </BackgroundThemeView>
                </View>
            </ShowWhen>

            <ShowWhen when={!(item.current_stock <= (item?.low_stock_alert || 10))} >
                <View style={{ paddingHorizontal: 12, position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderColor: 'white', boxSizing: 'border-box', height: 32, backgroundColor: 'green' }} >
                    <Text style={{ fontSize: 16, color: 'white' }} >
                        {item.current_stock} {item.unit || 'Unit'}
                    </Text>
                </View>
            </ShowWhen>
        </AnimateButton>
    );
}



export function ProductLoadingCard({ isPrimary = false }: { isPrimary?: boolean }): React.JSX.Element {
    return (
        <BackgroundThemeView isPrimary={isPrimary} style={{ width: '100%', borderRadius: 12, padding: 12, gap: 12 }}>
            <View style={{ gap: 4 }} >
                <LoadingView isPrimary={!isPrimary} width={120} height={12} />
                <LoadingView isPrimary={!isPrimary} width={80} height={10} />
            </View>

            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 20 }} >
                <View style={{ gap: 4 }} >
                    <LoadingView isPrimary={!isPrimary} width={60} height={12} />
                    <LoadingView isPrimary={!isPrimary} width={40} height={10} />
                </View>

                <View style={{ gap: 4 }} >
                    <LoadingView isPrimary={!isPrimary} width={60} height={12} />
                    <LoadingView isPrimary={!isPrimary} width={40} height={10} />
                </View>

                <View style={{ gap: 4 }} >
                    <LoadingView isPrimary={!isPrimary} width={60} height={12} />
                    <LoadingView isPrimary={!isPrimary} width={40} height={10} />
                </View>
            </View>
            <View style={{
                position: 'absolute',
                top: 10,
                right: 10,
            }} >
                <LoadingView isPrimary={!isPrimary} width={80} height={24} />
                <BackgroundThemeView style={{
                    position: 'absolute',
                    borderRadius: '50%',
                    aspectRatio: 1,
                    padding: 2,
                    top: 5,
                    right: 3,
                    transform: 'translate(50%, -50%)',
                }} >
                    <AnimatePingBall size={12} backgroundColor={'grey'} />
                </BackgroundThemeView>
            </View>
        </BackgroundThemeView>
    );
}

/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import TextTheme from '../Text/TextTheme';
import BackgroundThemeView from '../../Layouts/View/BackgroundThemeView';
import sliceString from '../../../Utils/sliceString';
import LoadingView from '../../Layouts/View/LoadingView';
import { useAppStorage } from '../../../Contexts/AppStorageProvider';
import { GetProduct } from '../../../Utils/types';
import { formatNumberForUI } from '../../../Utils/functionTools';
import ScaleAnimationView from '../Animation/ScaleAnimationView';
import FeatherIcon from '../../Icon/FeatherIcon';
import ShowWhen from '../../Other/ShowWhen';
import AnimateButton from '../Button/AnimateButton';

export type ProductCardProps = {
    item: GetProduct;
    isPrimary?: boolean,
    onPress: () => void
}

export default function ProductCard({ item, isPrimary = true, onPress }: ProductCardProps): React.JSX.Element {

    const { currency } = useAppStorage();

    const mp = item.sales_value ? 100 * ((item.sales_value - item.purchase_value) || 0) / (item.sales_value || 1) : 0;
    const rgb = mp < 0 ? 'rgb(200,50,50)' : mp == 0 ? '' : 'rgb(50,200,150)'

    return (
        <ScaleAnimationView useRandomDelay={true} >
            <AnimateButton onPress={onPress} >
                <BackgroundThemeView isPrimary={isPrimary} style={{borderRadius: 12, padding: 12, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}} >
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}} >
                        <BackgroundThemeView isPrimary={false} style={{alignItems: 'center', justifyContent: 'center', width: 40, aspectRatio: 1, borderRadius: 8}} >
                            <TextTheme fontSize={14} >{item?.stock_item_name.split(' ').map(e => e[0]).join('').slice(0,2) ?? 'PN'}</TextTheme>
                        </BackgroundThemeView>

                        <View>
                            <TextTheme fontSize={14} >{sliceString(item.stock_item_name, 25)}</TextTheme>
                            <View style={{flexDirection: 'row', gap: 14}} >
                                <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                                    <TextTheme color={rgb} fontSize={10} >Profit</TextTheme>
                                    <TextTheme color={rgb} fontSize={10} >{formatNumberForUI(mp, 10, 2)}%</TextTheme>
                                    
                                    <ShowWhen when={mp !== 0} >
                                        <FeatherIcon color={rgb} name={`trending-${mp < 0 ? 'down' : 'up'}`} size={10} />
                                    </ShowWhen>
                                </View>
                            </View>
                        </View>
                    </View>

                    <BackgroundThemeView isPrimary={false} style={{position: 'absolute', top: -2, right: 10, paddingInline: 8, borderRadius: 8, paddingBottom: 2}} >
                        <TextTheme fontSize={12}>{item.purchase_qty - item.sales_qty} {item.unit}</TextTheme>
                    </BackgroundThemeView>

                    <View style={{alignItems: 'flex-end'}} >
                        <TextTheme fontSize={14}>{item.sales_value} {currency}</TextTheme>
                    </View>
                </BackgroundThemeView>
            </AnimateButton>
        </ScaleAnimationView>
    );
}



export function ProductLoadingCard({ isPrimary = false }: { isPrimary?: boolean }): React.JSX.Element {
    return (
        <ScaleAnimationView useRandomDelay={true} >
            <BackgroundThemeView isPrimary={isPrimary} style={{padding: 12, borderRadius: 16, alignItems: 'center', flexDirection: 'row', gap: 12, position: 'relative'}} >
                    <LoadingView isPrimary={!isPrimary} width={40} height={40} borderRadius={4} />

                    <View style={{gap: 4}} >
                        <LoadingView isPrimary={!isPrimary} width={100} height={14} borderRadius={4} />
                        <LoadingView isPrimary={!isPrimary} width={60} height={10} borderRadius={4} />
                    </View>

                    <LoadingView isPrimary={!isPrimary} borderRadius={8} style={{position: 'absolute', top: -2, right: 10}} height={20} width={60} />
            </BackgroundThemeView>
        </ScaleAnimationView>
    );
}

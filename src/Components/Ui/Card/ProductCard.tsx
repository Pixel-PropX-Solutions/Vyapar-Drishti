/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import TextTheme from '../Text/TextTheme';
import BackgroundThemeView from '../../Layouts/View/BackgroundThemeView';
import sliceString from '../../../Utils/sliceString';
import LoadingView from '../../Layouts/View/LoadingView';
import { useAppStorage } from '../../../Contexts/AppStorageProvider';
import { GetProduct } from '../../../Utils/types';
import { SectionRowWithIcon } from '../../Layouts/View/SectionView';
import { formatNumberForUI } from '../../../Utils/functionTools';
import ScaleAnimationView from '../Animation/ScaleAnimationView';

export type ProductCardProps = {
    item: GetProduct;
    isPrimary?: boolean,
    onPress: () => void
}

export default function ProductCard({ item, isPrimary = true, onPress }: ProductCardProps): React.JSX.Element {

    const { currency } = useAppStorage();

    return (
        <ScaleAnimationView useRandomDelay={true} >
            <SectionRowWithIcon
                isPrimary={isPrimary}
                label={sliceString(item.stock_item_name, 30) ?? ''}
                text={item.gst_hsn_code ?? 'hsn code not set'}
                onPress={onPress}
                icon={<TextTheme fontSize={16} fontWeight={900}>{item.stock_item_name[0].toUpperCase()}</TextTheme>}

            >
                <BackgroundThemeView style={{position: 'absolute', top: -2, right: 10, paddingInline: 8, borderRadius: 8, paddingBottom: 2}} >
                    <TextTheme isPrimary={false}>
                        {item.purchase_qty - item.sales_qty} {item.unit}
                    </TextTheme>
                </BackgroundThemeView>

                <View style={{alignItems: 'flex-end'}} >
                    <TextTheme fontSize={14}>
                        {formatNumberForUI(item.sales_value, 10)} {currency}
                    </TextTheme>
                </View>
            </SectionRowWithIcon>
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

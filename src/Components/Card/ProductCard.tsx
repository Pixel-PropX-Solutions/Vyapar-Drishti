import { View } from "react-native";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import FeatherIcon from "../Icon/FeatherIcon";
import { useTheme } from "../../Contexts/ThemeProvider";

export type ProductCardProps = {
    id: string,
    productName: string,
    productsNo: string,
    inStock: number | string,
    price: number | string,
    sell: number | string,
    unit?: string | 'Unit',
    isPrimary?: boolean
}

export default function ProductCard({id, productName, productsNo, inStock, price, sell, unit='Unit', isPrimary=true}: ProductCardProps): React.JSX.Element {

    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme()

    return (
        <AnimateButton 
            style={{padding: 16, borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 16, backgroundColor: isPrimary ? primaryBackgroundColor : secondaryBackgroundColor}} 
        >
            <View style={{justifyContent: 'space-between', alignItems: 'center', gap: 12, flexDirection: 'row', width: '100%'}} >
                <TextTheme style={{paddingLeft: 2, fontWeight: 600}} >{productName}</TextTheme>
                <TextTheme iSPrimary={false} style={{paddingLeft: 2, fontWeight: 600, fontSize: 12}} >#{productsNo}</TextTheme>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-between', width: '100%', alignItems: 'center'}} >
                <View style={{flexDirection: 'row', gap: 32}}>
                    <View>
                        <TextTheme iSPrimary={false} style={{fontSize: 12}} >In Stock</TextTheme>
                        <TextTheme style={{fontSize: 12}} >{inStock} {unit}</TextTheme>
                    </View>

                    <View>
                        <TextTheme iSPrimary={false} style={{fontSize: 12}} >Price</TextTheme>
                        <TextTheme style={{fontSize: 12}} >{price} INR</TextTheme>
                    </View>

                    <View>
                        <TextTheme iSPrimary={false} style={{fontSize: 12}} >
                            {'Sell '}
                            <FeatherIcon name="trending-up" size={12}/>
                        </TextTheme>
                        <TextTheme style={{fontSize: 12}} >{sell} {unit}</TextTheme>
                    </View>
                </View>
            </View>
        </AnimateButton>
    )
}
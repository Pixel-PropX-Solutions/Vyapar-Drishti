import { View } from "react-native";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import FeatherIcon from "../Icon/FeatherIcon";
import { useTheme } from "../../Contexts/ThemeProvider";
import numberToString from "../../Functions/Numbers/numberToString";

export type ProductCardProps = {
    id: string,
    productName: string,
    productsNo: string,
    inStock: number,
    price: number,
    sell: number,
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
                <TextTheme isPrimary={false} style={{paddingLeft: 2, fontWeight: 600, fontSize: 12}} >#{productsNo}</TextTheme>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-between', width: '100%', alignItems: 'center'}} >
                <View style={{flexDirection: 'row', gap: 32}}>
                    <View>
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >In Stock</TextTheme>
                        <TextTheme style={{fontSize: 12}} >{inStock} {unit}</TextTheme>
                    </View>

                    <View>
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >Price</TextTheme>
                        <TextTheme style={{fontSize: 12}} >{numberToString(price)} INR</TextTheme>
                    </View>

                    <View>
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >
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
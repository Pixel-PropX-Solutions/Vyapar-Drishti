import { Text, View } from "react-native";
import TextTheme from "../Text/TextTheme";
import AnimateButton from "../Button/AnimateButton";
import FeatherIcon from "../Icon/FeatherIcon";
import { useTheme } from "../../Contexts/ThemeProvider";
import numberToString from "../../Functions/Numbers/numberToString";
import AnimatePingBall from "../View/AnimatePingBall";
import BackgroundThemeView from "../View/BackgroundThemeView";
import ShowWhen from "../Other/ShowWhen";
import sliceString from "../../Utils/sliceString";
import LoadingView from "../View/LoadingView";
import { getCurrency } from "../../Store/AppSettingStore";

export type ProductCardProps = {
    productName: string,
    productsNo: string,
    unit: string | 'Unit',
    lowStockQuantity: number,
    isPrimary?: boolean,
    inStock: number,
    profitValue: number,
    sellQuantity: number,
    onPress: () => void
}

export default function ProductCard({productName, productsNo, unit='Unit', isPrimary=true, lowStockQuantity, inStock, profitValue, sellQuantity, onPress}: ProductCardProps): React.JSX.Element {

    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme()

    return (
        <AnimateButton 
            style={{padding: 16, borderRadius: 16, display: 'flex', alignItems: 'flex-start', gap: 16, backgroundColor: isPrimary ? primaryBackgroundColor : secondaryBackgroundColor}} 
            onPress={onPress}
        >
            <View style={{width: "100%"}} >
                <TextTheme style={{paddingLeft: 2, fontWeight: 600, fontSize: 16}} >{sliceString(productName, 30)}</TextTheme>
                <TextTheme isPrimary={false} style={{paddingLeft: 2, fontWeight: 600, fontSize: 12}} >#{productsNo}</TextTheme>
            </View>


            <View style={{display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'space-between', width: '100%', alignItems: 'center'}} >
                <View style={{flexDirection: 'row', gap: 32}}>
                    <View>
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >In Stock</TextTheme>
                        <TextTheme style={{fontSize: 12}} >{inStock} {unit}</TextTheme>
                    </View>

                    <View>
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >
                            {'Sell '}
                            <FeatherIcon name="trending-up" size={12}/>
                        </TextTheme>
                        <TextTheme style={{fontSize: 12}} >{sellQuantity} {unit}</TextTheme>
                    </View>

                    <View>
                        <TextTheme isPrimary={false} style={{fontSize: 12}} >Profit</TextTheme>
                        <TextTheme style={{fontSize: 12}} >{numberToString(profitValue)} {getCurrency()}</TextTheme>
                    </View>

                </View>
            </View>
            
            <ShowWhen when={inStock <= lowStockQuantity} >
                <View style={{paddingHorizontal: 12, position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderColor: 'white', boxSizing: 'border-box', height: 32, backgroundColor: inStock === 0 ? 'rgb(250,50,50)' : 'rgb(250,150,50)'}} >
                    <Text style={{fontSize: 12, color: 'white',}} >
                        {inStock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </Text>

                    <BackgroundThemeView style={{position: 'absolute', borderRadius: '50%', aspectRatio: 1, padding: 2, top: 5, right: 3, transform: 'translate(50%, -50%)'}} >
                        <AnimatePingBall size={12} backgroundColor={inStock === 0 ? 'rgb(250,50,50)' : 'rgb(250,150,50)'} />
                    </BackgroundThemeView>
                </View>
            </ShowWhen>
        </AnimateButton>
    )
}



export function ProductLoadingCard({isPrimary=false}: {isPrimary?: boolean}): React.JSX.Element {
    return (
        <BackgroundThemeView isPrimary={isPrimary} style={{width: '100%', borderRadius: 12, padding: 12, gap: 12}}>
            <View style={{gap: 4}} >
                <LoadingView isPrimary={!isPrimary} width={120} height={12} />
                <LoadingView isPrimary={!isPrimary} width={80} height={10} />
            </View>

            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', gap: 20}} >
                <View style={{gap: 4}} >
                    <LoadingView isPrimary={!isPrimary} width={60} height={12} />
                    <LoadingView isPrimary={!isPrimary} width={40} height={10} />
                </View>

                <View style={{gap: 4}} >
                    <LoadingView isPrimary={!isPrimary} width={60} height={12} />
                    <LoadingView isPrimary={!isPrimary} width={40} height={10} />
                </View>
                
                <View style={{gap: 4}} >
                    <LoadingView isPrimary={!isPrimary} width={60} height={12} />
                    <LoadingView isPrimary={!isPrimary} width={40} height={10} />
                </View>
            </View>
        </BackgroundThemeView>
    )
}
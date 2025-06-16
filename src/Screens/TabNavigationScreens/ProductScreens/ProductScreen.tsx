import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../../Components/Text/TextTheme";
import ProductCard, { ProductCardProps } from "../../../Components/Card/ProductCard";
import { Pressable, Text, View } from "react-native";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import AnimateButton from "../../../Components/Button/AnimateButton";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import { useTheme } from "../../../Contexts/ThemeProvider";
import NormalButton from "../../../Components/Button/NormalButton";
import RoundedPlusButton from "../../../Components/Button/RoundedPlusButton";
import { useState } from "react";
import CreateProductModal from "../../../Components/Modal/Product/CreateProductModal";
import TabNavigationScreenHeader from "../../../Components/Header/TabNavigationHeader";

const dummyProductData: ProductCardProps[] = [
    {
      id: "prod-001",
      productName: "Wireless Bluetooth Headphones",
      productsNo: "SKU78901",
      inStock: 150,
      price: 59.99,
      sell: 75,
      unit: "Pcs"
    },
    {
      id: "prod-002",
      productName: "Organic Green Tea",
      productsNo: "SKU12345",
      inStock: 300,
      price: 12.50,
      sell: 120,
      unit: "Bags"
    },
    {
      id: "prod-003",
      productName: "Ergonomic Office Chair",
      productsNo: "SKU54321",
      inStock: 25,
      price: 199.99,
      sell: 10,
      unit: "Units"
    },
    {
      id: "prod-004",
      productName: "Stainless Steel Water Bottle",
      productsNo: "SKU98765",
      inStock: 500,
      price: 15.00,
      sell: 300,
      unit: "Pcs"
    },
    {
      id: "prod-005",
      productName: "Smart LED TV 55 inch",
      productsNo: "SKU11223",
      inStock: 10,
      price: 799.99,
      sell: 5,
      unit: "Units"
    }
];

export default function ProductScreen(): React.JSX.Element {

    const {primaryColor: color} = useTheme();

    const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

    return (
        <View  style={{width: '100%', height: '100%'}}>
            <TabNavigationScreenHeader>
                <TextTheme>Products</TextTheme>
            </TabNavigationScreenHeader>
            
            <ScrollView style={{marginTop: 12, width: '100%', height: '100%'}}>

                <SummaryCard
                    shopeName="Gen-I Store"
                    highStock={10}
                    lowStock={2}
                    totalValue={20300}
                />

                <BackgroundThemeView  isPrimary={false} style={{width: '100%', height: '100%', padding: 20, borderTopLeftRadius: 36, borderTopRightRadius: 32, marginTop: 24, gap: 20}} >

                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBlock: 8}} >

                        <NormalButton 
                            text=" Filerts" 
                            textStyle={{fontWeight: 800}}
                            icon={<FeatherIcon name="filter" size={16} useInversTheme={true} />}
                        />

                        <View style={{alignItems: 'flex-end'}} >
                            <TextTheme style={{fontSize: 12}} isPrimary={false} >Total Results</TextTheme>
                            <TextTheme>
                                <FeatherIcon name="package" size={16} />
                                {' '}
                                12
                            </TextTheme>
                        </View>
                        
                    </View>

                    <View style={{gap: 16}} >
                        {
                            dummyProductData.map(pro => (
                                <ProductCard
                                    key={pro.id}
                                    id={pro.id}
                                    productName={pro.productName}
                                    productsNo={pro.productsNo}
                                    price={pro.price}
                                    inStock={pro.inStock}
                                    sell={pro.sell}
                                    unit={pro.unit}
                                />
                            ))
                        }
                    </View>

                    <View style={{minHeight: 80}} />
                </BackgroundThemeView>
            </ScrollView>

            <View style={{position: 'absolute', right: 20, bottom: 20}} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCreateModalOpen(true)} />
            </View>

            <CreateProductModal 
                visible={isCreateModalOpen} 
                setVisible={setCreateModalOpen} 
                onCreate={() => setCreateModalOpen(false)}
            />

        </View>
    )
}


type SummaryCardProps = {
    shopeName: string,
    highStock: number,
    lowStock: number,
    totalValue: number | string
}

function SummaryCard({shopeName, highStock, lowStock, totalValue}: SummaryCardProps): React.JSX.Element {

    return (
        <BackgroundThemeView isPrimary={false} style={{padding: 16, borderRadius: 16, marginBlock: 12, marginInline: 20}}>
            <TextTheme style={{fontSize: 14, fontWeight: 800}} >{shopeName}</TextTheme>
            
            <TextTheme style={{fontSize: 20, fontWeight: 900, marginBlock: 6}}>
                INR {totalValue}
            </TextTheme>
            
            <View style={{display: 'flex', alignItems: 'center', justifyContent: "center", flexDirection: 'row', gap: 8, marginTop: 12}}>
                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(50,200,150)'}}>
                    <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
                        <FeatherIcon name="package" size={20} color="white" />
                        {`  ${highStock}`}
                    </Text>
                    <Text style={{fontSize: 12, color: 'white'}}>High Stock</Text>
                </AnimateButton>

                <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(250,100,100)'}}>
                    <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
                        <FeatherIcon name="box" size={20} color="white" />
                        {`  ${lowStock}`}
                    </Text>
                    <Text style={{fontSize: 12, color: 'white'}}>Low Stock</Text>
                </AnimateButton>
            </View>
        </BackgroundThemeView>
    )
}

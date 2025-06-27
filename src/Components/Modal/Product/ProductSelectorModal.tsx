import { View } from "react-native";
import { useTheme } from "../../../Contexts/ThemeProvider";
import AnimateButton from "../../Button/AnimateButton";
import FeatherIcon from "../../Icon/FeatherIcon";
import TextTheme from "../../Text/TextTheme";
import NoralTextInput from "../../TextInput/NoralTextInput";
import BottomModal from "../BottomModal";
import ProductCard, { ProductLoadingCard } from "../../Card/ProductCard";
import { FlatList } from "react-native-gesture-handler";
import { useAppDispatch, useCompanyStore, useProductStore } from "../../../Store/ReduxStore";
import ShowWhen from "../../Other/ShowWhen";
import { useEffect, useState } from "react";
import { viewAllProducts } from "../../../Services/product";
import { useAlert } from "../../Alert/AlertProvider";
import { useCreateBillContext } from "../../../Contexts/CreateBillScreenProvider";
import { GetProduct } from "../../../Utils/types";
import { stringToNumber } from "../../../Utils/functionTools";

type Props = {
    visible: boolean;
    setVisible: (vis: boolean) => void
}

export default function ProductSelectorModal({visible, setVisible}: Props): React.JSX.Element {

    const {setAlert} = useAlert();

    const {primaryColor} = useTheme();
    const {company} = useCompanyStore();
    const {products, setProducts} = useCreateBillContext()
    const {productsData, isProductsFetching, pageMeta} = useProductStore();

    const dispatch = useAppDispatch();

    const [isUnitModalVisible, setUnitModalVisible] = useState<boolean>(false);

    const [filterProducts, setFilterProducts] = useState<GetProduct[]>([])
    
    const [quantity, setQuantity] = useState<string>('');
    const [unit, setUnit] = useState<string>('Unit');
    const [price, setPrice] = useState<string>('');
    const [productId, setProductId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [productNo, setProductNo] = useState<string>('');

     
    function handleProductFetching(){
        if(isProductsFetching) return;
        if(pageMeta.total <= pageMeta.page * pageMeta.limit) return;
        dispatch(viewAllProducts({company_id: company?._id ?? '', pageNumber: pageMeta.page + 1}));
    }

    function handleProduct() {
        if(!(price && quantity)) return setAlert({
            id: 'create-bill-product-selector-modal',
            type: 'error', massage: 'please enter all requried information !!!'
        })

        setProducts((pro) => [...pro, {
            id: productId, price: stringToNumber(price), quantity: stringToNumber(quantity), name, productNo, unit
        }]);

        setPrice(''); setQuantity('');

        setUnitModalVisible(false);
        setVisible(false);
    }
    
    useEffect(() => {
        dispatch(viewAllProducts({company_id: company?._id ?? '', pageNumber: 1}));
    }, []);

    useEffect(() => {
        setFilterProducts(() => (
            productsData?.filter(a => !products.some(b => b.id == a._id))
        ) ?? [])
    }, [productsData, products])

    return (
        <BottomModal visible={visible} setVisible={setVisible} style={{padding: 20, gap: 20}}>
            <TextTheme style={{fontWeight: 800, fontSize: 16}} >Select Product</TextTheme>

            <View
                style={{borderWidth: 2, borderColor: primaryColor, borderRadius: 100, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", paddingLeft: 10, paddingRight: 16}}
            >
                <FeatherIcon name="search" size={20} />

                <NoralTextInput  
                    placeholder="Search"
                    style={{flex: 1}}
                />
            </View>

            <FlatList
                contentContainerStyle={{gap: 20, paddingBottom: 80, paddingTop: 12}}
                data={filterProducts}
                keyExtractor={(item) => item._id}
                keyboardShouldPersistTaps="always"
               
                renderItem={({item}) => (
                    <ProductCard
                        unit={item.unit}
                        isPrimary={false}
                        sellQuantity={item.sales_qty}
                        productName={item.stock_item_name}
                        productsNo={item.gst_hsn_code ?? ''}
                        inStock={item.purchase_qty - item.sales_qty}
                        lowStockQuantity={item.low_stock_alert ?? 0}
                        profitValue={item.purchase_value - item.sales_value}
                        onPress={() => {
                            setUnitModalVisible(true); setUnit(item.unit); setProductId(item._id);
                            setName(item.stock_item_name); setProductNo(item.gst_hsn_code ?? '');
                        }}
                    />
                )}

                ListFooterComponentStyle={{gap: 20}}
                ListFooterComponent={<ShowWhen when={isProductsFetching}>
                    <ProductLoadingCard/>
                    <ProductLoadingCard/>
                </ShowWhen>}

                onScroll={({nativeEvent}) => {
                    let {contentOffset, layoutMeasurement, contentSize} = nativeEvent;
                    let contentOffsetY = contentOffset.y;
                    let totalHeight = contentSize.height;
                    let height = layoutMeasurement.height;

                    if(totalHeight - height < contentOffsetY + 400) {
                        handleProductFetching();
                    }
                }}
            />


            <BottomModal 
                alertId="create-bill-product-selector-modal"
                visible={isUnitModalVisible} setVisible={setUnitModalVisible} 
                style={{padding: 20, gap: 20}} 
                actionButtons={[{
                    title: "+ Add", onPress: handleProduct
                }]}  
                  
            >
                <TextTheme style={{fontWeight: 800, fontSize: 16}} >Select Quantity</TextTheme>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12}} >
                    <View style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, flex: 1}} >
                        <FeatherIcon name="package" size={28} />
                        <NoralTextInput
                            value={quantity}
                            placeholder="Quantity"
                            style={{fontSize: 24, fontWeight: 900, width: '100%'}}
                            keyboardType="number-pad"
                            onChangeText={setQuantity}
                        />
                    </View>

                    <AnimateButton 
                        style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, paddingLeft: 8, paddingRight: 20}}     
                    >
                        <TextTheme style={{fontSize: 24, fontWeight: 900}}>{unit ?? "Unit"}</TextTheme>
                    </AnimateButton>
                </View>

                {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12}} >
                    <AnimateButton 
                        onPress={() => setQuantity(pre => pre > 0 ? pre - 1 : 0)}
                        style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, padding: 8, flex: 1}} 
                        
                    >
                        <FeatherIcon name="chevrons-left" size={24} />
                        <TextTheme style={{fontSize: 24, fontWeight: 900}}>{unit ?? "Unit"} {'( - )'}</TextTheme>
                    </AnimateButton>

                    <AnimateButton 
                        onPressIn={() => setQuantity(pre => pre < inStock ? pre + 1 : pre)}
                        style={{marginBlock: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, gap: 12, padding: 8, flex: 1}} 
                    >
                        <TextTheme style={{fontSize: 24, fontWeight: 900}}>{'( + )'} {unit ?? "Unit"}</TextTheme>
                        <FeatherIcon name="chevrons-right" size={24} />
                    </AnimateButton>
                </View> */}

                <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderBottomWidth: 2, borderColor: primaryColor, width: '100%'}} >
                    <FeatherIcon name="dollar-sign" size={24} />
                    <NoralTextInput 
                        value={price}
                        placeholder="Enter Price" 
                        keyboardType="number-pad"
                        style={{fontSize: 24, fontWeight: 900, width: '100%'}}
                        onChangeText={setPrice}
                    />
                </View>

                <View style={{minHeight: 40}} />
            </BottomModal>
        </BottomModal>
    )
}

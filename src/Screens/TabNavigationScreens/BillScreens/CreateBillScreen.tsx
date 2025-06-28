import { FlatList, KeyboardAvoidingView, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AnimateButton from "../../../Components/Button/AnimateButton";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import { useTheme } from "../../../Contexts/ThemeProvider";
import TextTheme from "../../../Components/Text/TextTheme";
import { Dispatch, SetStateAction, useState } from "react";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../../Navigation/StackNavigation";
import NoralTextInput from "../../../Components/TextInput/NoralTextInput";
import ProductSelectorModal from "../../../Components/Modal/Product/ProductSelectorModal";
import CreateBillScreenProvider, { useCreateBillContext } from "../../../Contexts/CreateBillScreenProvider";
import CustomerSelectorModal from "../../../Components/Modal/Customer/CustomerSelectorModal";
import ShowWhen from "../../../Components/Other/ShowWhen";
import { SectionRow } from "../../../Components/View/SectionView";
import { sliceString } from "../../../Utils/functionTools";
import { useAppStorage } from "../../../Contexts/AppStorageProvider";
import EmptyListView from "../../../Components/View/EmptyListView";
import { CreateInvoiceData } from "../../../Utils/types";
import { useAppDispatch, useCompanyStore, useInvoiceStore } from "../../../Store/ReduxStore";
import { createInvoice } from "../../../Services/invoice";
import navigator from "../../../Navigation/NavigationService";
import LoadingModal from "../../../Components/Modal/LoadingModal";


export default function CraeteBillScreen(){
    return <CreateBillScreenProvider>
        <Screen/>
    </CreateBillScreenProvider>
}


function Screen(): React.JSX.Element {

    const dispatch = useAppDispatch();

    const {currency} = useAppStorage();
    const {company} = useCompanyStore();
    const {loading} = useInvoiceStore();
    const {secondaryBackgroundColor, primaryBackgroundColor} = useTheme();
    const {billNo, setBillNo, createOn, setCreateOn, customer, products, totalValue, resetAllStates, setProducts} = useCreateBillContext();

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'create-bill-screen'>>();
    const router = useRoute<RouteProp<StackParamsList, 'create-bill-screen'>>();

    const {billType} = router.params;


    const [isCustomerModalVisible, setCustomerModalVisible] = useState<boolean>(false);
    const [isProductModalVisible, setProductModalVisible] = useState<boolean>(false);


    async function handleInvoice() {
        let data: CreateInvoiceData = {
            company_id: company?._id ?? '', date: createOn, voucher_number: billNo, voucher_type: billType, 
            reference_date: '', narration: '', place_of_supply: '', reference_number: '', 
            items: products.map(pro => ({
                _item: pro.id, quantity: pro.quantity, rate: pro.price, vouchar_id: billNo, 
                item: pro.name, amount: pro.price * pro.quantity
            })),
            party_name: customer?.name ?? '',
            accounting: [
                {amount: totalValue, ledger: "", ledger_id: customer?.id ?? '', vouchar_id: billNo}, 
                {amount: totalValue, ledger: "", ledger_id: customer?.id ?? '', vouchar_id: billNo}
            ]

        }

        let {payload: res} = await dispatch(createInvoice(data));
       
        if(res.success){
            resetAllStates();
            return navigator.goBack();
        }

    }


    return (
        <View style={{justifyContent: 'space-between', width: '100%', height: '100%'}} >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingHorizontal: 20, paddingBlock: 10}} >  
                <AnimateButton 
                    onPress={() => navigation.goBack()}
                    style={{borderWidth: 2, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 44, aspectRatio: 1, borderColor: secondaryBackgroundColor}} 
                >
                    <FeatherIcon name="plus" size={20} style={{transform: 'rotate(45deg)'}} />
                </AnimateButton>
                
                <View style={{borderRadius: 40, borderWidth: 2, borderColor: secondaryBackgroundColor, height: 44, paddingInline: 20, alignItems: 'center', flexDirection: 'row', gap: 8}} >
                    <FeatherIcon name="file-text" size={14}/>
                    <TextTheme style={{fontSize: 14, fontWeight: 900}} >{billType}</TextTheme>
                </View>
            </View>

            <ScrollView style={{paddingInline: 20, paddingBlock: 10}} contentContainerStyle={{gap: 24}} >
                <View style={{gap: 16}} >
                    <BillNoAndDateSelector
                        billNo={billNo} setBillNo={setBillNo}
                        createOn={createOn} setCreateOn={setCreateOn}
                    />

                    <AnimateButton 
                        style={{padding: 8, borderRadius: 12, width: '100%', backgroundColor: secondaryBackgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                        onPress={() => setCustomerModalVisible(true)}
                    >
                        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                            <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                                <FeatherIcon name="user" size={16} />
                            </BackgroundThemeView>

                            <View>
                                <TextTheme style={{fontSize: 16, fontWeight: 800}} >
                                    {customer?.name ?? 'Select Customer'}
                                </TextTheme>
                                <ShowWhen when={!!customer?.group} >
                                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 800}} >
                                        {customer?.group}
                                    </TextTheme>
                                </ShowWhen>
                            </View>
                        </View>

                        <FeatherIcon name="arrow-right" size={20} style={{paddingRight: 10}} />
                    </AnimateButton>
                    
                    <AnimateButton 
                        onPress={() => setProductModalVisible(true)}
                        style={{padding: 8, borderRadius: 12, width: '100%', backgroundColor: secondaryBackgroundColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} 
                    >
                        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                            <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                                <FeatherIcon name="package" size={16} />
                            </BackgroundThemeView>

                            <View>
                                <TextTheme style={{fontSize: 16, fontWeight: 800}} >+ Add Products</TextTheme>
                            </View>
                        </View>

                        <FeatherIcon name="arrow-right" size={20} style={{paddingRight: 10}} />
                    </AnimateButton>
                </View>

                <BackgroundThemeView isPrimary={false} style={{padding: 12, borderRadius: 8}} >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                        <AnimateButton style={{padding: 12, borderRadius: 8, flex: 1, backgroundColor: primaryBackgroundColor}}>
                            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                                <FeatherIcon name="package" size={20} />
                                <TextTheme>{products.length}</TextTheme>
                            </View>
                            <TextTheme style={{fontSize: 10}} isPrimary={false} >Total Products</TextTheme>
                        </AnimateButton>

                        <AnimateButton style={{padding: 12, borderRadius: 8, flex: 1, backgroundColor: primaryBackgroundColor}}>
                            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}} >
                                <FeatherIcon name="download" size={20} />
                                <TextTheme>{totalValue.toFixed(2) || '0.00'} {currency}</TextTheme>
                            </View>
                            <TextTheme style={{fontSize: 10}} isPrimary={false} >Total Amount</TextTheme>
                        </AnimateButton>
                    </View>
                </BackgroundThemeView>
                

                <FlatList
                    scrollEnabled={false}
                    contentContainerStyle={{gap: 12}}
                    ListEmptyComponent={<EmptyListView title="No Product Added" />}

                    ListHeaderComponent={<ShowWhen when={products.length !== 0}>
                        <TextTheme style={{fontSize: 16, fontWeight: 800, marginBottom: 4}} >Products</TextTheme>
                    </ShowWhen>}

                    data={products}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <SectionRow style={{flexDirection: 'column', alignItems: 'flex-start', gap: 12, position: 'relative'}} >
                            <View>
                                <TextTheme style={{fontWeight: 800, fontSize: 16}}>{sliceString(item.name, 34)}</TextTheme>
                                <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 500}} >{item.productNo}</TextTheme>
                            </View>
                            
                            <View style={{alignItems: 'flex-end', flexDirection: 'row', gap: 28}} >
                                <View>
                                    <TextTheme style={{fontSize: 12, fontWeight: 500}} >Quantity</TextTheme>
                                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 500}} >
                                        {item.quantity} {item.unit}
                                    </TextTheme>
                                </View>
                                <View>
                                    <TextTheme style={{fontSize: 12, fontWeight: 500}} >Price</TextTheme>
                                    <TextTheme isPrimary={false} style={{fontWeight: 500, fontSize: 12}}>
                                        {item.price.toFixed(2) || '0.00'} {currency}
                                    </TextTheme>
                                </View>
                                <View>
                                    <TextTheme style={{fontSize: 12, fontWeight: 500}} >Total Amount</TextTheme>
                                    <TextTheme isPrimary={false} style={{fontWeight: 500, fontSize: 12}}>
                                        {(item.price * item.quantity).toFixed(2) || '0.00'} {currency}
                                    </TextTheme>
                                </View>
                            </View>

                            <View style={{position: 'absolute', top: -6, right: -6}} >
                                <AnimateButton 
                                    style={{backgroundColor: 'rgb(250,50,100)', borderRadius: 8, paddingInline: 12,flexDirection: 'row', gap: 12, alignItems: 'center', height: 32}} 
                                    onPress={() => setProducts(pro => {
                                        let temp = [...pro];
                                        let index = pro.findIndex(e => e.id == item.id);
                                        if(index >= 0) temp.splice(index, 1);
                                        return temp
                                    })}
                                >
                                    <FeatherIcon name="delete" size={12} color="white" />
                                    <TextTheme color="white" style={{fontSize: 12}} >Remove</TextTheme>
                                </AnimateButton>
                            </View>
                        </SectionRow>
                    )}
                />

                <View style={{minHeight: 40}} />
            </ScrollView>
            
            <KeyboardAvoidingView behavior="padding" >
                <AmountBox handleCreateInvoice={handleInvoice} />
            </KeyboardAvoidingView>

            <CustomerSelectorModal visible={isCustomerModalVisible} setVisible={setCustomerModalVisible} billType={billType} />
            <ProductSelectorModal visible={isProductModalVisible} setVisible={setProductModalVisible} billType={billType} />
            <LoadingModal visible={loading} />
        </View>
    )
}





type BillNoAndDateSelectorProps = {
    billNo: string,
    setBillNo: Dispatch<SetStateAction<string>>,
    createOn: string
    setCreateOn: Dispatch<SetStateAction<string>>
}

function BillNoAndDateSelector({billNo, setBillNo, createOn, setCreateOn}: BillNoAndDateSelectorProps): React.JSX.Element {

    const {secondaryBackgroundColor} = useTheme();

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16}} >
            <AnimateButton style={{padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: secondaryBackgroundColor}}>
                <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                    <FeatherIcon name="hash" size={16} />
                </BackgroundThemeView>

                <View>
                    <TextTheme style={{fontSize: 14, fontWeight: 800}} >Bill No</TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 800}} >{billNo}</TextTheme>
                </View>
            </AnimateButton>

            <AnimateButton style={{padding: 8, borderRadius: 16, flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: secondaryBackgroundColor}}>
                <BackgroundThemeView style={{width: 44, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8}} >
                    <FeatherIcon name="calendar" size={16} />
                </BackgroundThemeView>

                <View>
                    <TextTheme style={{fontSize: 14, fontWeight: 800}} >Create On</TextTheme>
                    <TextTheme isPrimary={false} style={{fontSize: 12, fontWeight: 800}} >
                        {createOn}
                    </TextTheme>
                </View>
            </AnimateButton>
        </View>
    )
}




function AmountBox({handleCreateInvoice}: {handleCreateInvoice: () => void}): React.JSX.Element {

    const {totalValue, products} = useCreateBillContext();
    const {currency} = useAppStorage();

    const [paddingBottom, setPaddingBottom] = useState<number>(20);

    const color = 'white';
    const secondaryColor = 'rgba(125,125,125,0.25)';
    const backgroundColor = 'rgb(50,200,150)';

    return (
        <View 
            style={{
                paddingTop: 20 ,borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 4, borderColor: secondaryColor, borderBottomWidth: 0, gap: 20, paddingBottom, backgroundColor
            }}
        >
            <View style={{gap: 16, paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12}} >
                    <View>
                        <TextTheme color={color}  style={{fontSize: 16, fontWeight: 900}} >TOTAL AMOUNT</TextTheme>
                        <TextTheme color={color} isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >
                            {totalValue.toFixed(2) || '0.00'} {currency}
                        </TextTheme>
                    </View>

                    <View style={{alignItems: 'flex-end'}} >
                        <TextTheme color={color} isPrimary={false} style={{fontSize: 16, fontWeight: 900}} >PRODUCTS</TextTheme>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                            <TextTheme color={color} style={{fontSize: 16, fontWeight: 900}} >{products.length}</TextTheme>
                            <FeatherIcon name="package" size={16} color={color} />
                        </View>
                    </View>
                </View>

                <View style={{alignItems: 'center'}} >
                    <TextTheme color={color} style={{fontSize: 16, fontWeight: 900}} >Enter Pay Amount</TextTheme>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}} >
                        <NoralTextInput 
                            value={totalValue.toFixed(2)}
                            color={color}
                            keyboardType="number-pad"
                            placeholder="0.00" 
                            style={{fontSize: 24, fontWeight: 900, padding: 0, margin: 0}}  
                            onFocus={() => setPaddingBottom(44)}
                            onBlur={() => setPaddingBottom(20)}
                        />
                        <TextTheme color={color} style={{fontSize: 24, fontWeight: 900}} >{currency}</TextTheme>
                    </View>
                </View>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end', position: 'relative', alignItems: 'center'}} >
                <View style={{position: 'absolute', width: '100%', flex: 1, borderWidth: 2, borderColor: secondaryColor, height: 0}} />
                
                <AnimateButton onPress={handleCreateInvoice} style={{paddingHorizontal: 20, height: 44, borderRadius: 44, justifyContent: 'center', borderColor: secondaryColor, marginRight: 20, borderWidth: 3, backgroundColor}} >
                    <TextTheme color={color} style={{fontWeight: 900}} >Create</TextTheme>
                </AnimateButton>
            </View>
        </View>
    )
}
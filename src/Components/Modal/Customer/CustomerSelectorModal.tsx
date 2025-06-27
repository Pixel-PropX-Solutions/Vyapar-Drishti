import { FlatList } from "react-native-gesture-handler";
import TextTheme from "../../Text/TextTheme";
import BottomModal from "../BottomModal";
import { useAppDispatch, useCompanyStore, useCustomerStore } from "../../../Store/ReduxStore";
import { useEffect, useState } from "react";
import { GetUserLedgers } from "../../../Utils/types";
import { viewAllCustomer } from "../../../Services/customer";
import CustomerCard, { CustomerLoadingView } from "../../Card/CustomerCard";
import { useCreateBillContext } from "../../../Contexts/CreateBillScreenProvider";
import ShowWhen from "../../Other/ShowWhen";
import { View } from "react-native";
import FeatherIcon from "../../Icon/FeatherIcon";
import NoralTextInput from "../../TextInput/NoralTextInput";
import { useTheme } from "../../../Contexts/ThemeProvider";

type Props = {
    visible: boolean,
    setVisible: (vis: boolean) => void,
    billType: string
}

export default function CustomerSelectorModal({visible, setVisible, billType}: Props){

    const {primaryColor} = useTheme();

    const {company} = useCompanyStore();
    const {setCustomer, customer} = useCreateBillContext();
    const {customers, isAllCustomerFetching, pageMeta} = useCustomerStore();

    const dispatch = useAppDispatch();
    
    const [filterCustomers, setFilterCustomers] = useState<GetUserLedgers[]>([]);


    function handleProductFetching(){
        if(isAllCustomerFetching) return;
        if(pageMeta.total <= pageMeta.page * pageMeta.limit) return;
        dispatch(viewAllCustomer({company_id: company?._id ?? '', pageNumber: pageMeta.page + 1}));
    }

    useEffect(() => {
        dispatch(viewAllCustomer({company_id: company?._id ?? '', pageNumber: 1}))
    }, [])

    useEffect(() => {
        setFilterCustomers(() => customers);
    }, [customers])


    return (
        <BottomModal visible={visible} setVisible={setVisible} style={{padding: 20, gap: 20}} >
            <TextTheme style={{fontSize: 16, fontWeight: 800}} >Select Customer</TextTheme>

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
                data={filterCustomers}
                keyExtractor={item => item._id}

                renderItem={({item}) => (
                    <CustomerCard
                        name={item.ledger_name}
                        groupName={item.parent}
                        createOn={item.created_at}
                        backgroundColor={customer && customer.id === item._id ? 'rgb(50,150,250)' : ''}
                        color={customer && customer.id === item._id ? 'white' : ''}
                        onPress={() => {
                            setVisible(false);

                            setCustomer(() => ({
                                id: item._id,
                                name: item.ledger_name,
                                group: item.parent
                            }))
                        }}
                    />
                )}

                ListFooterComponentStyle={{gap: 20}}
                ListFooterComponent={<ShowWhen when={isAllCustomerFetching}>
                    <CustomerLoadingView/>
                    <CustomerLoadingView/>
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

            <View style={{minHeight: 44}} />
        </BottomModal>
    )
}
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { useEffect, useState } from "react";
import RoundedPlusButton from "../../../Components/Button/RoundedPlusButton";
import CreateCustomerModal from "../../../Components/Modal/Customer/CreateCustomerModal";
import TabNavigationScreenHeader from "../../../Components/Header/TabNavigationHeader";
import TextTheme from "../../../Components/Text/TextTheme";
import { useAppDispatch, useCompanyStore, useCustomerStore } from "../../../Store/ReduxStore";
import { viewAllCustomer } from "../../../Services/customer";
import CustomerCard, { CustomerLoadingView } from "../../../Components/Card/CustomerCard";
import LoadingView from "../../../Components/View/LoadingView";
import ShowWhen from "../../../Components/Other/ShowWhen";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import EmptyListView from "../../../Components/View/EmptyListView";


export default function CustomerScreen(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const {customers, isAllCustomerFetching} = useCustomerStore();
    const {company} = useCompanyStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(viewAllCustomer({company_id: company?._id ?? '', pageNumber: 1}));
    }, [company?._id]);

    return (
        <View style={{width: '100%', height: '100%', paddingHorizontal: 20}} >
            <TabNavigationScreenHeader>
                <TextTheme style={{fontSize: 16, fontWeight: 800}} >Customers</TextTheme>
            </TabNavigationScreenHeader>
            
            <ShowWhen when={isAllCustomerFetching} >
                <CustomerLoadingView/>
                <CustomerLoadingView/>
            </ShowWhen>
        
            <FlatList
                ListEmptyComponent={<EmptyListView type="customer" />}
                contentContainerStyle={{marginTop: 12, width: '100%', height: '100%', gap: 20}}
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <CustomerCard  
                        name={item.ledger_name}
                        groupName={item.parent}
                        createOn={item.created_at}
                        // onPress={() => navigator.navigate('customer-info-screen', {id: item._id})}
                    />
                )}     
            />

            <View style={{position: 'absolute', right: 20, bottom: 20}} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCreateCustomerModalOpen(true)} />
            </View>

            <CreateCustomerModal visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} />
        </View>
    )
}

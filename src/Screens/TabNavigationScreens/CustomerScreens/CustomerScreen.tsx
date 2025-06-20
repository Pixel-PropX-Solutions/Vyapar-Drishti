import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { useEffect, useState } from "react";
import RoundedPlusButton from "../../../Components/Button/RoundedPlusButton";
import CreateCustomerModal from "../../../Components/Modal/Customer/CreateCustomerModal";
import TabNavigationScreenHeader from "../../../Components/Header/TabNavigationHeader";
import TextTheme from "../../../Components/Text/TextTheme";
import { useAppDispatch, useCompanyStore, useCustomerStore } from "../../../Store/ReduxStore";
import { viewAllCustomer } from "../../../Services/customer";
import CustomerCard from "../../../Components/Card/CustomerCard";
import LoadingView from "../../../Components/View/LoadingView";
import ShowWhen from "../../../Components/Other/ShowWhen";


export default function CustomerScreen(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const {customers, isAllCustomerFetching} = useCustomerStore();
    const {company} = useCompanyStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(viewAllCustomer({company_id: company?._id ?? ''}));
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
                contentContainerStyle={{marginTop: 12, width: '100%', height: '100%', gap: 20}}
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <CustomerCard  
                        id={item._id}
                        name={item.ledger_name}
                        groupName={item.parent}
                        createOn={item.created_at.split('T')[0]}
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


function CustomerLoadingView(): React.JSX.Element{
    return (
        <LoadingView style={{width: '100%', maxWidth: 460, justifyContent: 'space-between', padding: 12, borderRadius: 16, alignItems: 'flex-start', marginBlock: 10}} scale={1}  >
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}} >
                <LoadingView width={44} height={44} borderRadius={36} isPrimary={true} />
                <View>
                    <LoadingView width={120} height={20} borderRadius={12} isPrimary={true} />
                    <LoadingView width={80} height={16} borderRadius={8} isPrimary={true} style={{marginTop: 4}} />
                </View>
            </View>
        </LoadingView>
    )
}
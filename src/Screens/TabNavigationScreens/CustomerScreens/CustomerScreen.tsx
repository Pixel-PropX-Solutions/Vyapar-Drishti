import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import { useEffect, useState } from "react";
import RoundedPlusButton from "../../../Components/Button/RoundedPlusButton";
import CreateCustomerModal from "../../../Components/Modal/Customer/CreateCustomerModal";
import TabNavigationScreenHeader from "../../../Components/Header/TabNavigationHeader";
import TextTheme from "../../../Components/Text/TextTheme";
import { useAppDispatch, useCompanyStore, useCustomerStore } from "../../../Store/ReduxStore";
import { viewAllCustomer, viewAllCustomers } from "../../../Services/customer";


export default function CustomerScreen(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const {customers} = useCustomerStore();
    const {company} = useCompanyStore();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(viewAllCustomers(company?._id ?? '')).then(_ => {
            console.log('All customers fetched:', customers);
        });

        dispatch(viewAllCustomer({company_id: company?._id ?? ''})).then(_ => {
            console.log('All customers fetched:', customers);
        });
    }, [company?._id]);

    return (
        <View style={{width: '100%', height: '100%'}} >
            <TabNavigationScreenHeader>
                <TextTheme>Customers</TextTheme>
            </TabNavigationScreenHeader>
            
            <ScrollView style={{paddingInline: 20, marginTop: 12, width: '100%', height: '100%'}}>
                <View style={{gap: 20}} >
                    {
                        // [].map(customer => (
                        //     <CustomerCard   
                            
                        //     onPress={() => navigation.navigate('customer-info-screen')}
                        //     />
                        // ))
                    }
                </View>

                <View style={{minHeight: 100}} />
            </ScrollView>

            <View style={{position: 'absolute', right: 20, bottom: 20}} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCreateCustomerModalOpen(true)} />
            </View>

            <CreateCustomerModal visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} />
        </View>
    )
}

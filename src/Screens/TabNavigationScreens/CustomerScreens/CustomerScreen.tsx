import { ScrollView } from "react-native-gesture-handler";
import CustomerCard, { CustomerCardProps } from "../../../Components/Card/CustomerCard";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../../Navigation/StackNavigation";
import { useEffect, useState } from "react";
import RoundedPlusButton from "../../../Components/Button/RoundedPlusButton";
import CreateCustomerModal from "../../../Components/Modal/Customer/CreateCustomerModal";
import BottomModal from "../../../Components/Modal/BottomModal";

const dummyCustomerData: CustomerCardProps[] = [
    // {
    //     name: "Aarav Sharma",
    //     phoneNo: "+91 98765 43210",
    //     createOn: "2024-05-15",
    //     id: "1",
    //     totalAmount: 0,
    //     payAmount: 0,
    //     pandingAmount: 0
    // },
    // {
    //     name: "Priya Singh",
    //     phoneNo: "+91 87654 32109",
    //     createOn: "2023-11-20",
    //     id: "2",
    //     totalAmount: 0,
    //     payAmount: 0,
    //     pandingAmount: 0
    // },
    // {
    //     name: "Rahul Mehta",
    //     phoneNo: "+91 76543 21098",
    //     createOn: "2025-01-08",
    //     id: "3",
    //     totalAmount: 0,
    //     payAmount: 0,
    //     pandingAmount: 0
    // },
    // {
    //     name: "Sneha Devi",
    //     phoneNo: "+91 65432 10987",
    //     createOn: "2024-03-22",
    //     id: "4",
    //     totalAmount: 0,
    //     payAmount: 0,
    //     pandingAmount: 0
    // }
];

export default function CustomerScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'tab-navigation'>>();

    const [isCreateCustomerModalOpen, setCreateCustomerModalOpen] = useState<boolean>(false);

    return (
        <View style={{width: '100%', height: '100%'}} >
            <ScrollView style={{paddingInline: 20, marginTop: 12, width: '100%', height: '100%'}}>
                <View style={{gap: 20}} >
                    {
                        dummyCustomerData.map(customer => (
                            <CustomerCard   
                            {...customer} 
                            key={customer.id} 
                            onPress={() => navigation.navigate('customer-info-screen')}
                            />
                        ))
                    }
                </View>

                <View style={{minHeight: 100}} />
            </ScrollView>

            <View style={{position: 'absolute', right: 20, bottom: 20}} >
                <RoundedPlusButton size={60} iconSize={24} onPress={() => setCreateCustomerModalOpen(true)} />
            </View>

            <CreateCustomerModal handleCreate={() => {}} visible={isCreateCustomerModalOpen} setVisible={setCreateCustomerModalOpen} />
        </View>
    )
}

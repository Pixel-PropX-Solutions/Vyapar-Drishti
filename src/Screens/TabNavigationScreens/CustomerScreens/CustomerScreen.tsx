import { ScrollView } from "react-native-gesture-handler";
import CustomerCard, { CustomerCardProps } from "../../../Components/Card/CustomerCard";
import { View } from "react-native";

const dummyCustomerData: CustomerCardProps[] = [
    {
        name: "Aarav Sharma",
        wokeIn: "Sales Department",
        phoneNumber: "+91 98765 43210",
        mail: "aarav.sharma@example.com",
        address: "123, Gandhi Nagar, Udaipur, Rajasthan, 313001",
        createOn: "2024-05-15",
        id: "1"
    },
    {
        name: "Priya Singh",
        wokeIn: "Marketing Team",
        phoneNumber: "+91 87654 32109",
        mail: "priya.singh@example.com",
        address: "45, Lake Palace Road, Udaipur, Rajasthan, 313002",
        createOn: "2023-11-20",
        id: "2"
    },
    {
        name: "Rahul Mehta",
        wokeIn: "Customer Support",
        phoneNumber: "+91 76543 21098",
        mail: "rahul.mehta@example.com",
        address: "789, Hiran Magri, Sector 4, Udaipur, Rajasthan, 313002",
        createOn: "2025-01-08",
        id: "3"
    },
    {
        name: "Sneha Devi",
        wokeIn: "Operations Division",
        phoneNumber: "+91 65432 10987",
        mail: "sneha.devi@example.com",
        address: "10, Fateh Sagar Lake, Udaipur, Rajasthan, 313004",
        createOn: "2024-03-22",
        id: "4"
    }
];

export default function CustomerScreen(): React.JSX.Element {
    return (
        <ScrollView style={{paddingInline: 20, marginTop: 12, width: '100%', height: '100%'}}>
            <View style={{gap: 20}} >
                {
                    dummyCustomerData.map(customer => (
                        <CustomerCard {...customer} key={customer.id} />
                    ))
                }
            </View>
        </ScrollView>
    )
}

import { Text, View } from "react-native";
import BackgroundThemeView from "../../../Components/View/BackgroundThemeView";
import EntityInfoHeader from "../../../Components/Header/EntityInfoHeader";
import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../../Components/Text/TextTheme";
import FeatherIcon from "../../../Components/Icon/FeatherIcon";
import FontAwesome6Icon from "../../../Components/Icon/FontAwesome6Icon";
import AnimateButton from "../../../Components/Button/AnimateButton";
import BillCard, { BillCardProps } from "../../../Components/Card/BillCard";
import DateSelector from "../../../Components/Other/DateSelector";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../../../Navigation/StackNavigation";
import { useState } from "react";
import UpdateCustomerInfoModal from "../../../Components/Modal/Customer/UpdateCustomerInfoModal";
import DeleteModal from "../../../Components/Modal/DeleteModal";
import { useAppStorage } from "../../../Contexts/AppStorageProvider";


export default function CustomerInfoScreen(): React.JSX.Element {

    const navigation = useNavigation<StackNavigationProp<StackParamsList, 'customer-info-screen'>>();

    const [isInfoUpdateModalOpen, setInfoUpdateModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    return (
        <BackgroundThemeView style={{width: '100%', height: '100%'}} >
            <EntityInfoHeader
                onPressEdit={() => setInfoUpdateModalOpen(true)}
                onPressDelete={() => setDeleteModalOpen(true)}
            />

            <ScrollView style={{marginTop: 16}} >
                <InfoSection
                    name="Sneha Devi"
                    phoneNumber="+91 65432 10987"
                    createOn="2024-03-22"
                    totalAmount={10000}
                />

                <SummaryCard
                    totalBills={10}
                    payBills={7}
                />

                <BackgroundThemeView  isPrimary={false} style={{width: '100%', height: '100%', padding: 20, borderTopLeftRadius: 36, borderTopRightRadius: 32, marginTop: 36, gap: 20}} >
                    <DateSelector/>

                    <View style={{gap: 12}} >
                       
                    </View>

                <View style={{minHeight: 80}} />
            </BackgroundThemeView>

            </ScrollView>

            <UpdateCustomerInfoModal 
                visible={isInfoUpdateModalOpen} 
                setVisible={setInfoUpdateModalOpen} 
                name="Sneha Devi"
                phoneNo="900303032"
                groupName="Assets"
                handleUpdate={() => {setInfoUpdateModalOpen(false)}}
            />
        
            <DeleteModal 
                visible={isDeleteModalOpen} 
                setVisible={setDeleteModalOpen} 
                massage="Did you want to delete the customer"
                passkey="name"
                handleDelete={() => setDeleteModalOpen(false)}
            />

        </BackgroundThemeView>
    )
}


type InfoSectionProps = {
    name: string,
    phoneNumber: string,
    totalAmount: number,
    createOn: string,
}

function InfoSection({name, phoneNumber, totalAmount=0, createOn}: InfoSectionProps): React.ReactNode {
    const {currency} = useAppStorage();

    return (
        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 20}} >
            <View  >
                <TextTheme style={{fontSize: 20, fontWeight: 900}} >{name}</TextTheme>
                <TextTheme isPrimary={false} style={{fontSize: 16, fontWeight: 900}}>{currency} {totalAmount}</TextTheme>
            </View>

            <View style={{alignItems: 'flex-end'}} >
                <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}} >
                    <TextTheme style={{fontSize: 12}} >{phoneNumber}</TextTheme>
                    <FeatherIcon name="phone" size={12} />
                </View>
                
                <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
                    <TextTheme style={{fontSize: 12}} >{createOn}</TextTheme>
                    <FeatherIcon name="calendar" size={12} />
                </View>
            </View>
        </View>
    )
}


type SummaryCardProps = {
    totalBills: number,
    payBills: number
}

function SummaryCard({totalBills=0, payBills=0}: SummaryCardProps): React.ReactNode {
    return (
        <View style={{display: 'flex', alignItems: 'center', justifyContent: "center", flexDirection: 'row', gap: 8, marginTop: 12, paddingHorizontal: 20}}>
            <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(50,150,200)'}}>
                <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
                    <FeatherIcon name="file-text" size={20} color={'white'} />
                    {`  ${totalBills}`}
                </Text>
                <Text style={{fontSize: 10, color: 'white'}}>Total Bill</Text>
            </AnimateButton>

            <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(50,200,150)'}}>
                <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
                    <FeatherIcon name="file-minus" size={20} color={'white'} />
                    {`  ${payBills}`}
                </Text>
                <Text style={{fontSize: 10, color: 'white'}}>Pay Bills</Text>
            </AnimateButton>
            
            <AnimateButton style={{paddingInline: 16, borderRadius: 12, paddingBlock: 8, flex: 1, backgroundColor: 'rgb(200,150,100)'}}>
                <Text style={{fontSize: 18, fontWeight: 900, marginTop: 4, color: 'white'}}>
                    <FeatherIcon name="file" size={20} color={'white'} />
                    {`  ${totalBills - payBills}`}
                </Text>
                <Text style={{fontSize: 10, color: 'white'}}>Pending Bills</Text>
            </AnimateButton>
        </View>
    )
}
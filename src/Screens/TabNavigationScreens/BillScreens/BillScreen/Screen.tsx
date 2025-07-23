import { View } from "react-native";
import BillContextProvider from "./Context";
import { BillCreateButton, BillListing, BillTypeFilter, DateSelector, Header } from "./Components";
import BackgroundThemeView from "../../../../Components/View/BackgroundThemeView";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamsList } from "../../../../Navigation/BottomTabNavigation";
import { useAppDispatch, useCompanyStore } from "../../../../Store/ReduxStore";
import { viewAllInvoices } from "../../../../Services/invoice";
import PDFContextProvider from "./PDFContext";

export default function BillScreen(): React.JSX.Element {

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamsList, 'bill-screen'>>();

    const dispatch = useAppDispatch()
    const {company} = useCompanyStore()

    useEffect(() => {
        const event = navigation.addListener('focus', () => {
            dispatch(viewAllInvoices({ company_id: company?._id ?? '', pageNumber: 1 }));
        });

        return event
    }, [])

    return (
        <BillContextProvider>
            <View style={{width: '100%', height: '100%'}} >
                <Header/>
                <BillTypeFilter/>

                <BackgroundThemeView isPrimary={false} style={{paddingInline: 20, paddingTop: 20, borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1, marginTop: 20, gap: 20}} >
                    <DateSelector/>
                    
                    <PDFContextProvider>
                        <BillListing/>
                    </PDFContextProvider>
                </BackgroundThemeView>

                <BillCreateButton/>
            </View>
        </BillContextProvider>
    )
}
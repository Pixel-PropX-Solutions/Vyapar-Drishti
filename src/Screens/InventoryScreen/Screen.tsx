import { View } from "react-native";
import { Header, ItemsListingSection, ItemSortFilter, ItemStatusFilter, SummarySection } from "./Components";
import BackgroundThemeView from "../../Components/Layouts/View/BackgroundThemeView";

export default function InventoryScreen(){
    return (
        <View style={{width: '100%', height: '100%', gap: 20}} >
            <View style={{paddingInline: 20, gap: 8}} >
                <Header/>
                <ItemStatusFilter/>
            </View>

            <BackgroundThemeView isPrimary={false} style={{padding: 20, width: '100%', flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, gap: 20}} >
                <ItemSortFilter/>
                <ItemsListingSection/>
            </BackgroundThemeView>
        </View>
    )
}
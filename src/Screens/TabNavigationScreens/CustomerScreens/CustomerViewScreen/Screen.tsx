import { View } from "react-native";
import { FilterRow, InvoiceListing, ProfileSection } from "./Components";
import BackgroundThemeView from "../../../../Components/Layouts/View/BackgroundThemeView";
import SafeAreaFromTop from "../../../../Components/Other/SafeAreaView/SafeAreaFromTop";
import MonthSelector from "../../../../Components/Ui/Option/MonthSelector";
import LoadinScreen from "./LoadingScreen";
import ShowWhen from "../../../../Components/Other/ShowWhen";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function CustomerViewScreen() {

    const [laoding, setLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                setLoading(false);
            }, 2500)
        }, [])
    )

    return (
        <View style={{width: '100%', height: '100%'}} >
            <SafeAreaFromTop/>

            <ShowWhen when={!laoding} otherwise={<LoadinScreen/>} >
                <View style={{paddingHorizontal: 20, paddingTop: 8, gap: 36, marginBottom: 8}} >
                    <ProfileSection/>
                    <FilterRow/>
                </View>

                <BackgroundThemeView isPrimary={false} style={{width: '100%', borderTopRightRadius: 40, borderTopLeftRadius: 40, padding: 20, flex: 1, gap: 20, paddingBottom: 0}} >
                    <MonthSelector/>
                    <InvoiceListing/>                    

                    <View style={{minHeight: 40}} />
                </BackgroundThemeView>
            </ShowWhen>
        </View>
    )
}
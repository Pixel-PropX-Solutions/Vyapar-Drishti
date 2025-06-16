import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../../Components/Text/TextTheme";
import { View } from "react-native";
import TabNavigationScreenHeader from "../../../Components/Header/TabNavigationHeader";

export default function MenuScreen(): React.JSX.Element {
    return (
        <View style={{width: '100%', height: '100%'}} >
            <TabNavigationScreenHeader>
                <TextTheme>Menu</TextTheme>
            </TabNavigationScreenHeader>
            
            <ScrollView style={{paddingInline: 20, marginTop: 12, width: '100%', height: '100%'}}>
                <TextTheme>MEnu Screen</TextTheme>
            </ScrollView>
        </View>
    )
}
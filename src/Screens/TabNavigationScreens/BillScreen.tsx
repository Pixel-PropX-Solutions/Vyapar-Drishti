import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../../Components/Text/TextTheme";

export default function BillScreen(): React.JSX.Element {
    return (
        <ScrollView style={{paddingInline: 20, marginTop: 12, width: '100%', height: '100%'}}>
            <TextTheme>BillScreen</TextTheme>
        </ScrollView>
    )
}
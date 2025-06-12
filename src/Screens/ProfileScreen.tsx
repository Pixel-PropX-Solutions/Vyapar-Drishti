import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../Components/Text/TextTheme";
import StackNavigationHeader from "../Components/Header/StackNavigationHeader";

export default function ProfileScreen(): React.JSX.Element {
    return (
        <ScrollView>
            <StackNavigationHeader title="Profile" />
        </ScrollView>
    )
}
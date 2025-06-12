import { ScrollView } from "react-native-gesture-handler";
import TextTheme from "../Components/Text/TextTheme";
import StackNavigationHeader from "../Components/Header/StackNavigationHeader";
import { View, Text } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NotificationScreen(): React.JSX.Element {
    return (
        <View style={{width: '100%', height: '100%', display: 'flex'}}>
            <StackNavigationHeader title="Notifications" />
            
            <EmptyNotificationScreen/>

            <ScrollView style={{width: '100%', height: '100%'}} >

            </ScrollView>
        </View>
    )
}




function EmptyNotificationScreen(): React.JSX.Element {
  return (
    <View style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, zIndex: -1}} >
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name="notifications-off-outline" size={100} color="#bbb" />
            
            <TextTheme style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20}}>
                No Notifications
            </TextTheme>

            <TextTheme iSPrimary={false} style={{ fontSize: 16, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
                You're all caught up!{'\n'}Check back later for updates.
            </TextTheme>
        </View>
    </View>
  );
}

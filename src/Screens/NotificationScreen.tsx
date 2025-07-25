/* eslint-disable react-native/no-inline-styles */
import { ScrollView } from 'react-native-gesture-handler';
import TextTheme from '../Components/Ui/Text/TextTheme';
import StackNavigationHeader from '../Components/Layouts/Header/StackNavigationHeader';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SectionRowWithIcon } from '../Components/Layouts/View/SectionView';
import FeatherIcon from '../Components/Icon/FeatherIcon';
import ShowWhen from '../Components/Other/ShowWhen';


type NotificationDataType = { type: string, title: string, message: string }

const notificationData: NotificationDataType[] = [
  {
    'title': 'Feature Update',
    'message': 'This feature is coming soon! Stay tuned for more updates.',
    'type': 'info',
  },
  // {
  //   'title': 'Project Update',
  //   'message': 'Your project Dashboard Redesign has been approved',
  //   'type': 'success',
  // },
  // {
  //   'title': 'Task Reminder',
  //   'message': 'Complete the Q2 financial report by end of day.',
  //   'type': 'info',
  // },
  // {
  //   'title': 'System Alert',
  //   'message': 'Server maintenance scheduled for tomorrow at 2 AM IST.',
  //   'type': 'warning',
  // },
  // {
  //   'title': 'New Message',
  //   'message': 'You have 3 unread messages from Team Alpha.',
  //   'type': 'info',
  // },
  // {
  //   'title': 'Error Notification',
  //   'message': 'Failed to sync data with the cloud storage.',
  //   'type': 'error',
  // },
];


export default function NotificationScreen(): React.JSX.Element {

  return (
    <View style={{ width: '100%', height: '100%', display: 'flex' }}>
      <StackNavigationHeader title="Notifications" />

      <ShowWhen when={notificationData.length !== 0} otherwise={<EmptyNotificationScreen />}>
        <ScrollView style={{ width: '100%', height: '100%', paddingHorizontal: 20 }} contentContainerStyle={{ gap: 12 }} >
          {
            notificationData.map((info, index) => (
              <SectionRowWithIcon
                key={index}
                label={info.title}
                text={info.message}
                icon={<FeatherIcon name="info" size={20} />}
                onPress={() => { }}
              />
            ))
          }
        </ScrollView>
      </ShowWhen>
    </View>
  );
}




function EmptyNotificationScreen(): React.JSX.Element {
  return (
    <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, zIndex: -1 }} >
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="notifications-off-outline" size={100} color="#bbb" />

        <TextTheme style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20 }}>
          No Notifications
        </TextTheme>

        <TextTheme isPrimary={false} style={{ fontSize: 16, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
          You're all caught up!{'\n'}Check back later for updates.
        </TextTheme>
      </View>
    </View>
  );
}

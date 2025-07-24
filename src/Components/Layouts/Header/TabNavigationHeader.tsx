/* eslint-disable react-native/no-inline-styles */
import { View } from "react-native";
import FeatherIcon from "../../Icon/FeatherIcon";
import AnimateButton from "../../Ui/Button/AnimateButton";
import navigator from "../../../Navigation/NavigationService";


type Props = {
    children: React.ReactNode,
    onPress?: () => void
}

export default function TabNavigationScreenHeader({ children, onPress }: Props): React.JSX.Element {
    return (
        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', padding: 10, justifyContent: 'space-between' }} >
            <AnimateButton
                onPress={onPress}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingLeft: 10, paddingRight: 20, borderRadius: 40 }}
            >
                {children}
            </AnimateButton>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <AnimateButton
                    onPress={() => navigator.navigate('notification-screen')}
                    style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                >
                    <FeatherIcon name="bell" size={20} />

                    <View style={{ backgroundColor: 'rgb(250,50,50)', width: 8, aspectRatio: 1, borderRadius: 10, position: 'absolute', transform: [{ translateX: 5 }, { translateY: -5 }] }} />
                </AnimateButton>
            </View>
        </View>
    )
}
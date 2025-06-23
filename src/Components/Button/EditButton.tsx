import { View } from "react-native";
import AnimateButton from "./AnimateButton";
import FeatherIcon from "../Icon/FeatherIcon";
import TextTheme from "../Text/TextTheme";

export default function EditButton({ onPress }: { onPress: () => void }): React.JSX.Element {
    return (
        <View style={{ flex: 1, alignItems: 'flex-end' }} >
            <AnimateButton
                onPress={onPress}
                style={{ borderRadius: 100, height: 44, paddingInline: 20, gap: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
            >
                <FeatherIcon name="edit-3" size={20} />
                <TextTheme style={{ fontSize: 14, fontWeight: '900', color: 'white' }}>Edit</TextTheme>
            </AnimateButton>
        </View>
    )
}
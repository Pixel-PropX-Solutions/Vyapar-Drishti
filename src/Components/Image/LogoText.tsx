import { Image, View } from "react-native";

export default function LogoText({ size, borderRadius = 0 }: { size: number, borderRadius?: number }) {
    return (
        <View style={{ width: size, height: size, borderRadius, overflow: 'hidden' }}>
            <Image
                source={require('../../Assets/Images/Logo_Text.png')}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </View>
    )
}
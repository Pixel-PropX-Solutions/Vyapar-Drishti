import { Image, View } from 'react-native';

export default function LogoImage({ size, borderRadius = 0, imageSrc }: { size: number, borderRadius?: number, imageSrc?: string }): React.JSX.Element {
    return (
        <View style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius, overflow: 'hidden' }}>
            <Image
                source={imageSrc ? { uri: imageSrc } : require('../../Assets/Images/Logo_with_text.png')}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
        </View>
    );
}

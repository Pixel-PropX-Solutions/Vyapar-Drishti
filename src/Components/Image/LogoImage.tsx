import { Image, View } from "react-native";

export default function LogoImage({size, borderRadius=0}: {size: number, borderRadius?: number}){
    return (
        <View style={{width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius}}>
            <Image 
                source={require('../../Assets/Images/Logo.png')} 
                style={{width: '100%', height: '100%', objectFit: 'cover'}} 
            />
        </View>
    )
}
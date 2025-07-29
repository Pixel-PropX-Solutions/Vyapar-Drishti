import { ReactNode, useEffect } from "react";
import { Animated, useAnimatedValue, View, ViewStyle, Easing } from "react-native";


type Props = {
    children?: ReactNode,
    backgroundRgb?: string,
    style?: ViewStyle
}


export default function WaveCircle({children, backgroundRgb, style}: Props): React.JSX.Element {

    const circle1 = useAnimatedValue(0);
    const circle2 = useAnimatedValue(0);

    useEffect(() => {
        Animated.loop(
            Animated.parallel([
                Animated.timing(circle1, {toValue: 1, duration: 4000, useNativeDriver: true, easing: Easing.linear}),
                Animated.timing(circle2, {toValue: 1, duration: 5000, useNativeDriver: true, easing: Easing.linear})
            ])
        ).start()
    }, [])

    return (
        <View style={{...style, position: 'relative', padding: 12, aspectRatio: 1, alignItems: 'center', justifyContent: 'center'}} >
            <Animated.View  style={{position: 'absolute', width: '100%', height: '96%', backgroundColor: `rgba(${backgroundRgb},0.5)`, borderRadius: '50%', 
                transform: [{rotate: circle1.interpolate({
                    inputRange: [0, 1], outputRange: ['0deg', '360deg']
                })
            }]}} />
            <Animated.View  style={{position: 'absolute', width: '96%', height: '100%', backgroundColor: `rgba(${backgroundRgb},0.5)`, borderRadius: '50%', 
                transform: [{rotate: circle2.interpolate({
                    inputRange: [0, 1], outputRange: ['0deg', '360deg']
                })
            }]}} />

            {children}
        </View>
    )
}
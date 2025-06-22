import { useEffect } from "react";
import { Animated, View, useAnimatedValue } from "react-native";

type Props = {
    size: number,
    backgroundColor: string,
    duration?: number,
    scale?: number
}

export default function AnimatePingBall({size, backgroundColor, duration=500, scale=1.7}: Props): React.JSX.Element {

    const animate0to1 = useAnimatedValue(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animate0to1, {
                    toValue: 1, duration, useNativeDriver: true
                }),
                Animated.timing(animate0to1, {
                    toValue: 0, duration: 0, useNativeDriver: true
                }),
            ])
        ).start();
    }, []) 

    return (
        <View style={{position: 'relative', width: size, aspectRatio: 1, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor}} >
            <Animated.View 
                style={{
                    width: size, backgroundColor, aspectRatio: 1, borderRadius: '50%',
                    opacity: animate0to1.interpolate({
                        inputRange: [0,1], outputRange: [0.9, 0]
                    }),
                    transform: [{scale: animate0to1.interpolate({
                        inputRange: [0,1], outputRange: [0.9, scale]
                    })}]
                }} 
            />
        </View> 
    )
}
import { ReactNode, useEffect } from "react";
import { Animated, useAnimatedValue, ViewStyle } from "react-native";


type Props = {
    children: ReactNode,
    duration?: number,
    style?: ViewStyle,
    range?: number
}

export default function PingAnimation({children, duration=2000, style, range=10}: Props): React.JSX.Element {
    
    const animate0to1 = useAnimatedValue(0);
    
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animate0to1, {
                    toValue: 1, duration, useNativeDriver: true
                }),
                Animated.timing(animate0to1, {
                    toValue: 0, duration, useNativeDriver: true
                })
            ])
        ).start()
    }, [])
    
    return (
        <Animated.View style={{
            ...style,
            position: 'relative',
            transform: [{translateY: animate0to1.interpolate({
                inputRange: [0, 1], outputRange: [-range, range]
            })}]
        }} >
            {children}
        </Animated.View>
    )
}
import { ReactNode, useEffect } from "react";
import { Animated, useAnimatedValue, ViewStyle } from "react-native";


type Props = {
    children: ReactNode,
    duration?: number,
    delay?: number,
    useRandomDelay?: boolean,
    style?: ViewStyle
}

export default function ScaleAnimationView({children, duration=500, delay=0, useRandomDelay=false, style}: Props): React.JSX.Element {
    
    const animate0to1 = useAnimatedValue(0);
    
    useEffect(() => {
        Animated.timing(animate0to1, {
            toValue: 1, duration, useNativeDriver: true, 
            delay: useRandomDelay ? Math.floor(Math.random() * duration * 0.5) : delay
        }).start()
    }, [])
    
    return (
        <Animated.View style={{
            ...style,
            position: 'relative',
            opacity: animate0to1,
            transform: [{scale: animate0to1.interpolate({
                inputRange: [0, 1], outputRange: [0.5, 1]
            })}]
        }} >
            {children}
        </Animated.View>
    )
}
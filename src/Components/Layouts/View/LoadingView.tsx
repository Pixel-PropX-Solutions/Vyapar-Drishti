import { useEffect } from "react";
import { Animated, ViewProps, ViewStyle, useAnimatedValue } from "react-native";
import { useTheme } from "../../../Contexts/ThemeProvider";

type Props = ViewProps & {
    width?: number,
    height?: number,
    duration?: number,
    color?: string,
    isPrimary?: boolean,
    borderRadius?: number,
    style?: ViewStyle,
    scale?: number
}

export default function LoadingView({width, duration=1000, height, borderRadius=4, color, isPrimary=false, style, scale=0.98, ...props}: Props): React.JSX.Element {

    const {primaryBackgroundColor, secondaryBackgroundColor} = useTheme();

    if(!color) {color = isPrimary ? primaryBackgroundColor : secondaryBackgroundColor;}

    const animate0to1 = useAnimatedValue(0);

    function startAnimation(){
        Animated.loop(
            Animated.sequence([
                Animated.timing(animate0to1, {
                    toValue: 1, useNativeDriver: true, duration
                }),
                Animated.timing(animate0to1, {
                    toValue: 0, useNativeDriver: true, duration
                })
            ])
        ).start();
    }

    useEffect(() => {
        startAnimation();
    }, [])

    return (
        <Animated.View {...props} 
            style={[{
                opacity: animate0to1.interpolate({
                    inputRange: [0, 1], outputRange: [0.4, 1]
                }),
                transform: [{scale: animate0to1.interpolate({
                    inputRange: [0, 1], outputRange: [scale, 1]
                })}],
                width, height, backgroundColor: color, borderRadius
            }, style]} 
        />
    )
}